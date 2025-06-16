
import { supabase } from '@/integrations/supabase/client';
import type { Command } from './types';

export const blog: Command = async () => {
    const { data: posts, error } = await supabase.from('posts').select('title, slug, published_at, post_tags(tags(name))').eq('is_published', true).order('published_at', { ascending: false });

    if (error) {
        return `Error fetching blog posts: ${error.message}`;
    }
    if (!posts || posts.length === 0) {
        return "No blog posts have been published yet. Check back soon!";
    }

    const postList = posts.map(p => {
        const date = p.published_at ? new Date(p.published_at).toLocaleDateString() : 'N/A';
        const tagsString = p.post_tags.length > 0 ? ` [${p.post_tags.map(pt => pt.tags?.name).filter(Boolean).join(', ')}]` : '';
        return `  - ${date}: ${p.title} (view with 'post show ${p.slug}')${tagsString}`;
    }).join('\n');

    return `Latest Blog Posts:\n${postList}\n\nOr view all posts on the website: /blog`;
};
