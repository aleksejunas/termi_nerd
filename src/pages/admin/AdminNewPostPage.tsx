
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PostForm, PostFormValues } from '@/components/PostForm';
import { useToast } from '@/components/ui/use-toast';
import type { TablesInsert } from '@/integrations/supabase/types';

const AdminNewPostPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const createPostMutation = useMutation({
        mutationFn: async (values: PostFormValues) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error("You must be logged in to create a post.");

            let imageUrl: string | null = null;
            if (values.image_upload) {
                const file = values.image_upload;
                const filePath = `${session.user.id}/${Date.now()}_${file.name}`;
                const { data, error: uploadError } = await supabase.storage.from('post-images').upload(filePath, file);
                
                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
                
                const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);
                imageUrl = publicUrl;
            }

            const newPost: TablesInsert<'posts'> = {
                title: values.title,
                slug: values.slug,
                content: values.content,
                is_published: values.is_published,
                author_id: session.user.id,
                published_at: values.is_published ? new Date().toISOString() : null,
                image_url: imageUrl,
            };

            const { error } = await supabase.from('posts').insert(newPost);
            if (error) {
                if (error.code === '23505') throw new Error(`A post with slug "${values.slug}" already exists.`);
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Post created successfully." });
            navigate('/admin');
        },
        onError: (error) => {
            toast({ title: "Error", description: `Failed to create post: ${error.message}`, variant: 'destructive' });
        }
    });

    const handleSubmit = (values: PostFormValues) => {
        createPostMutation.mutate(values);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">New Post</h1>
            <PostForm 
                onSubmit={handleSubmit} 
                isSubmitting={createPostMutation.isPending}
                onCancel={() => navigate('/admin')}
            />
        </div>
    );
};

export default AdminNewPostPage;
