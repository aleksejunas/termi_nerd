
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_tags(tags(name, slug))')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const BlogIndexPage: React.FC = () => {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['published_posts'],
    queryFn: fetchPosts,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return posts.filter(post => {
      const tagsString = post.post_tags?.map(pt => pt.tags?.name || '').join(' ').toLowerCase();
      return post.title.toLowerCase().includes(lowercasedTerm) ||
        (post.content && post.content.toLowerCase().includes(lowercasedTerm)) ||
        tagsString.includes(lowercasedTerm)
    });
  }, [posts, searchTerm]);

  if (isError) {
    return <div className="text-destructive">Error fetching posts: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-1">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col md:flex-row overflow-hidden h-full">
              <Skeleton className="w-full md:w-56 lg:w-72 h-48 md:h-auto flex-shrink-0" />
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-1">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="block">
              <Card className="hover:border-primary transition-colors h-full flex flex-col md:flex-row overflow-hidden">
                {post.image_url && (
                    <div className="w-full md:w-56 lg:w-72 flex-shrink-0">
                        <img src={post.image_url} alt={post.title} className="object-cover h-48 w-full md:h-full" />
                    </div>
                )}
                <div className="flex flex-col flex-grow">
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
                  <div className="p-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {post.post_tags?.map(pt => pt.tags && (
                        <Link to={`/blog/tags/${pt.tags.slug}`} key={pt.tags.slug} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                          {pt.tags.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-16">
          {searchTerm 
            ? `No posts found for "${searchTerm}".` 
            : "No posts have been published yet. Check back soon!"}
        </p>
      )}
    </div>
  );
};

export default BlogIndexPage;
