
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '../slugify';
import type { Command } from './types';

export const post: Command = async (args: string[]) => {
    const [subcommand, ...rest] = args;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user && !['show'].includes(subcommand)) {
        return "You must be logged in to manage posts.";
    }

    switch(subcommand) {
        case 'new': {
            if (!session?.user) return "You must be logged in to create posts.";
            const title = rest.join(" ");
            if (!title) { return "Usage: post new <post title>"; }
            
            const slug = slugify(title);
            const { data, error } = await supabase.from('posts').insert({
                title,
                slug,
                author_id: session.user.id
            }).select().single();

            if (error) {
                if (error.code === '42501') return "Error: You do not have permission to create posts. Make sure you are an admin.";
                if (error.code === '23505') return `Error: A post with the slug '${slug}' already exists. Please choose a different title.`;
                return `Error creating post: ${error.message}`;
            }

            return `Draft created: "${data.title}"\nSlug: ${data.slug}\nEdit with: post edit ${data.slug}`;
        }
        case 'publish': {
            if (!session?.user) return "You must be logged in to publish posts.";
            const [slug] = rest;
            if (!slug) { return "Usage: post publish <slug>"; }

            const { data, error } = await supabase.from('posts').update({ is_published: true, published_at: new Date().toISOString() }).eq('slug', slug).select().single();

            if (error) {
                if (error.code === '42501') return "Error: You do not have permission to publish posts. Are you an admin?";
                if (error.code === 'PGRST116') return `Error: Post with slug '${slug}' not found.`;
                return `Error publishing post: ${error.message}`;
            }

            return `Post "${data.title}" published successfully!`;
        }
        case 'list': {
            if (!session?.user) return "You must be logged in to list posts.";
            const { data: posts, error } = await supabase.from('posts').select('title, slug, is_published, post_tags(tags(name))').order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42501') return "Error: You do not have permission to view all posts. Are you an admin?";
                return `Error fetching posts: ${error.message}`;
            }
            if (!posts || posts.length === 0) return "No posts found. Create one with 'post new <title>'.";

            const postList = posts.map(p => {
                const tagsString = p.post_tags.length > 0 ? ` [${p.post_tags.map(pt => pt.tags?.name).filter(Boolean).join(', ')}]` : '';
                return `  - ${p.is_published ? '✅' : '📝'} ${p.title} (${p.slug})${tagsString}`;
            }).join('\n');
            return `Your Posts:\n${postList}`;
        }
        case 'show': {
            const [slug] = rest;
            if (!slug) { return "Usage: post show <slug>"; }

            const { data: post, error } = await supabase
                .from('posts')
                .select('title, content, is_published, slug, post_tags(tags(name))')
                .eq('slug', slug)
                .maybeSingle();

            if (error) return `Error fetching post: ${error.message}`;
            if (!post) return `Error: Post with slug '${slug}' not found.`;
            
            if (!post.is_published) {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (!currentSession?.user) {
                    return `Error: Post with slug '${slug}' not found.`;
                }
            }
            
            const tags = post.post_tags?.map(pt => pt.tags?.name).filter(Boolean);
            const tagsString = tags && tags.length > 0 ? `\nTags: ${tags.join(', ')}` : '';

            const output = `\n${post.title}\n====================================\n\n${post.content || 'This post has no content yet.'}${tagsString}\n\n---\nView on site: /blog/${post.slug}`;
            return output;
        }
        case 'edit': {
            if (!session?.user) return "You must be logged in to edit posts.";
            const [slug] = rest;
            if (!slug) { return "Usage: post edit <slug>"; }

            const { data, error } = await supabase
                .from('posts')
                .select()
                .eq('slug', slug)
                .single();
            
            if (error) {
                if (error.code === '42501') return "Error: You do not have permission to edit posts. Are you an admin?";
                if (error.code === 'PGRST116') return `Error: Post with slug '${slug}' not found.`;
                return `Error fetching post: ${error.message}`;
            }

            return { command: 'edit_post', payload: data };
        }
        case 'tag': {
            if (!session?.user) return "You must be logged in to tag posts.";
            const [slug, ...tagsToAdd] = rest;
            if (!slug || tagsToAdd.length === 0) {
                return "Usage: post tag <slug> <tag-name-1> [tag-name-2] ...";
            }

            const { data: post, error: postError } = await supabase.from('posts').select('id').eq('slug', slug).single();
            if (postError) {
                if (postError.code === 'PGRST116') return `Error: Post with slug '${slug}' not found.`;
                return `Error fetching post: ${postError.message}`;
            }
            
            const tagsToUpsert = tagsToAdd.map(name => ({ name, slug: slugify(name) }));
            const { error: upsertError } = await supabase
                .from('tags')
                .upsert(tagsToUpsert, { onConflict: 'slug' });

            if (upsertError) return `Error creating tags: ${upsertError.message}`;

            const { data: allTags, error: allTagsError } = await supabase.from('tags').select('id, name').in('name', tagsToAdd);
            if (allTagsError) return `Error fetching tag IDs: ${allTagsError.message}`;
            if (!allTags) return 'Could not find created tags.';

            const associations = allTags.map(tag => ({ post_id: post.id, tag_id: tag.id }));
            const { error: assocError } = await supabase.from('post_tags').upsert(associations);

            if (assocError) return `Error adding tags to post: ${assocError.message}`;

            return `Tags [${tagsToAdd.join(', ')}] added to post '${slug}'.`;
        }
        case 'untag': {
            if (!session?.user) return "You must be logged in to untag posts.";
            const [slug, ...tagsToRemove] = rest;
            if (!slug || tagsToRemove.length === 0) {
                return "Usage: post untag <slug> <tag-name-1> [tag-name-2] ...";
            }

            const { data: post, error: postError } = await supabase.from('posts').select('id').eq('slug', slug).single();
            if (postError) {
                if (postError.code === 'PGRST116') return `Error: Post with slug '${slug}' not found.`;
                return `Error fetching post: ${postError.message}`;
            }

            const { data: tags, error: tagsError } = await supabase.from('tags').select('id').in('name', tagsToRemove);
            if (tagsError) return `Error fetching tags: ${tagsError.message}`;
            if (!tags || tags.length === 0) return 'No matching tags found to remove.';

            const tagIdsToRemove = tags.map(t => t.id);

            const { error: deleteError } = await supabase.from('post_tags').delete().eq('post_id', post.id).in('tag_id', tagIdsToRemove);
            
            if (deleteError) return `Error removing tags: ${deleteError.message}`;

            return `Tags removed successfully from post '${slug}'.`;
        }
        default:
            return `Unknown 'post' subcommand. Available: new, publish, list, show, edit, tag, untag.`;
    }
};
