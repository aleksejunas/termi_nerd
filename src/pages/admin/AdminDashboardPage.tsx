
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Post = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_at: string;
};

const fetchAllPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, is_published, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === '42501') throw new Error("You don't have permission to view posts.");
    throw new Error(error.message);
  }
  return data || [];
};

const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: posts, isLoading, isError, error } = useQuery({
        queryKey: ['all_posts'],
        queryFn: fetchAllPosts,
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            const { error } = await supabase.from('posts').delete().eq('id', postId);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Post deleted successfully." });
            queryClient.invalidateQueries({ queryKey: ['all_posts'] });
        },
        onError: (error) => {
            toast({ title: "Error", description: `Failed to delete post: ${error.message}`, variant: 'destructive' });
        }
    });

    if (isLoading) {
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
          </div>
        );
    }

    if (isError) {
        return <div className="text-destructive">Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <Button onClick={() => navigate('/admin/posts/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Post
                </Button>
            </div>
            {posts && posts.length > 0 ? (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="mb-1">{post.title}</CardTitle>
                                        <CardDescription>
                                            Created on {new Date(post.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-end items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/posts/edit/${post.slug}`)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the post
                                            titled "{post.title}".
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deletePostMutation.mutate(post.id)}>
                                            Continue
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No posts found. Create one to get started!</p>
            )}
        </div>
    );
};

export default AdminDashboardPage;
