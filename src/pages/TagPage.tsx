
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables } from '@/integrations/supabase/types';

const fetchTag = async (slug: string) => {
  const { data, error } = await supabase.from('tags').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
};

const fetchPostsByTag = async (tagId: string) => {
  const { data, error } = await supabase.rpc('get_posts_by_tag', { p_tag_id: tagId });
  if (error) throw error;
  return data ?? [];
};

const TagPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: tag, isLoading: isLoadingTag, isError: isTagError, error: tagError } = useQuery({
    queryKey: ['tag', slug],
    queryFn: () => fetchTag(slug!),
    enabled: !!slug,
  });

  const { data: posts, isLoading: isLoadingPosts, isError: isPostsError, error: postsError } = useQuery({
    queryKey: ['posts_by_tag', tag?.id],
    queryFn: () => fetchPostsByTag(tag!.id),
    enabled: !!tag,
  });

  if (isLoadingTag) {
    return (
      <div>
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="grid gap-8 md:grid-cols-1">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isTagError) {
    return <div className="text-destructive">Error fetching tag: {(tagError as Error).message}</div>;
  }
    
  if (!tag) {
    return <div>Tag not found.</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Posts tagged with "{tag.name}"
      </h1>
      <p className="text-muted-foreground mb-8">
        <Link to="/blog" className="hover:underline">Back to all posts</Link>
      </p>

      {isLoadingPosts ? (
        <div className="grid gap-8 md:grid-cols-1">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isPostsError ? (
        <div className="text-destructive">Error fetching posts: {(postsError as Error).message}</div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-1">
          {posts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="block">
              <Card className="hover:border-primary transition-colors h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Published on {new Date(post.published_at!).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.content ? `${post.content.substring(0, 200)}...` : 'No preview available.'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-16">
          No posts found for this tag yet.
        </p>
      )}
    </div>
  );
};

export default TagPage;
