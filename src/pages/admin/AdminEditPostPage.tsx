
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm, PostFormValues } from '@/components/PostForm';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

const fetchPostBySlug = async (slug: string) => {
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
    if (error) throw new Error(error.message);
    return data;
};

const AdminEditPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPostBySlug(slug!),
        enabled: !!slug,
    });

    const updatePostMutation = useMutation({
        mutationFn: async ({ postId, values }: { postId: string, values: PostFormValues }) => {
            let imageUrl = values.image_url;

            // Handle image removal or replacement
            if (values.image_upload) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) throw new Error("You must be logged in to update a post.");
                
                // If there's an old image, remove it from storage
                if (post?.image_url) {
                    try {
                        const oldPath = new URL(post.image_url).pathname.split('/post-images/')[1];
                        await supabase.storage.from('post-images').remove([oldPath]);
                    } catch (e) {
                        console.error("Could not remove old image, continuing...", e);
                    }
                }
                
                // Upload new image
                const file = values.image_upload;
                const filePath = `${session.user.id}/${Date.now()}_${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage.from('post-images').upload(filePath, file);

                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(uploadData.path);
                imageUrl = publicUrl;

            } else if (imageUrl === null && post?.image_url) {
                // Image was removed by the user in the form
                 try {
                    const oldPath = new URL(post.image_url).pathname.split('/post-images/')[1];
                    await supabase.storage.from('post-images').remove([oldPath]);
                } catch (e) {
                    console.error("Could not remove old image, continuing...", e);
                }
            }


            const updatedPost: TablesUpdate<'posts'> = {
                title: values.title,
                slug: values.slug,
                content: values.content,
                is_published: values.is_published,
                published_at: values.is_published && !post?.is_published ? new Date().toISOString() : post?.published_at,
                image_url: imageUrl,
            };
            const { error } = await supabase.from('posts').update(updatedPost).eq('id', postId);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Post updated successfully." });
            queryClient.invalidateQueries({ queryKey: ['all_posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', slug] });
            navigate('/admin');
        },
        onError: (error) => {
            toast({ title: "Error", description: `Failed to update post: ${error.message}`, variant: 'destructive' });
        }
    });

    const handleSubmit = (values: PostFormValues) => {
        if (!post) return;
        updatePostMutation.mutate({ postId: post.id, values });
    };

    if (isLoading) {
        return (
            <div>
                <Skeleton className="h-10 w-1/2 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        )
    }

    if (isError) {
        return <div className="text-destructive">Error loading post: {error.message}</div>
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
            <PostForm 
                post={post}
                onSubmit={handleSubmit}
                isSubmitting={updatePostMutation.isPending}
                onCancel={() => navigate('/admin')}
            />
        </div>
    );
};

export default AdminEditPostPage;
