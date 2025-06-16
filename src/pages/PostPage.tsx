import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import SocialShare from '@/components/SocialShare';

const MarkdownImage: React.FC<{ src?: string; alt?: string }> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="my-6">
      {isLoading && (
        <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />
      )}
      <img 
        className={`max-w-full h-auto rounded-lg shadow-lg ${isLoading ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/placeholder.svg';
          target.alt = 'Image failed to load';
          setError(true);
          setIsLoading(false);
        }}
        {...props} 
      />
      {props.alt && !error && (
        <p className="text-sm text-muted-foreground mt-2 text-center">{props.alt}</p>
      )}
    </div>
  );
};

const fetchPost = async (slug: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_tags(tags(name, slug))')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error) throw new Error(error.message);
  
  if (data && !data.is_published) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        return null; // Don't show unpublished posts to guests
    }
  }

  return data;
};

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
        if (!error && data) {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, []);

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <article>
        <Skeleton className="h-96 w-full mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-5/6 mb-4" />
      </article>
    );
  }

  if (isError) {
    return <div className="text-destructive">Error fetching post: {error.message}</div>;
  }

  if (!post) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-muted-foreground mb-4">The post you are looking for does not exist or has been moved.</p>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  const tags = post.post_tags?.map(pt => pt.tags).filter(Boolean) as { name: string, slug: string }[] || [];
  
  return (
    <article>
        {post.image_url && (
            <img 
                src={post.image_url} 
                alt={`Cover image for ${post.title}`}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8" 
            />
        )}
        <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{post.title}</h1>
            {post.published_at && (
                <p className="text-muted-foreground">
                    Published on {new Date(post.published_at).toLocaleDateString()}
                </p>
            )}
             {tags.length > 0 && (
              <div className="flex justify-center flex-wrap gap-2 mt-4">
                {tags.map(tag => (
                  <Button key={tag.slug} variant="secondary" size="sm" asChild className="rounded-full">
                    <Link to={`/blog/tags/${tag.slug}`}>
                      {tag.name}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
        </div>
      <div className="max-w-none prose dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-12 mb-4 border-b pb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-10 mb-4 border-b pb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-8 mb-4" {...props} />,
            p: ({node, ...props}) => <p className="mb-6 leading-relaxed" {...props} />,
            a: ({node, ...props}) => <a className="text-primary underline hover:no-underline" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="mb-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-muted pl-4 italic my-6" {...props} />,
            code: ({node, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <pre className="bg-muted text-muted-foreground p-4 rounded-md my-6 overflow-x-auto text-sm">
                    <code {...props} className={className}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-muted text-muted-foreground font-mono rounded-sm px-1.5 py-1 text-sm" {...props}>
                    {children}
                  </code>
                );
            },
            img: ({node, ...props}) => {
              console.log('Rendering image:', props);
              return <MarkdownImage {...props} />;
            },
          }}
        >
            {(() => {
              console.log('Post content:', post.content);
              return post.content || '';
            })()}
        </ReactMarkdown>
        <div className="flex items-center justify-between mt-8 border-t pt-4">
          <SocialShare title={post.title} />
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="ml-4">
              <Link to={`/admin/posts/edit/${post.slug}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostPage;
