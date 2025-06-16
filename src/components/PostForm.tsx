import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { slugify } from '@/lib/slugify';
import type { Tables } from '@/integrations/supabase/types';
import { Switch } from "@/components/ui/switch"
import { Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ImageUploader } from '@/components/admin/ImageUploader';

type Post = Tables<'posts'>;

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in a valid format (e.g., "my-first-post").'),
  content: z.string().optional(),
  is_published: z.boolean().default(false),
  image_upload: z.instanceof(File).optional(),
  image_url: z.string().url().optional().nullable(),
});

export type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post | null;
  onSubmit: (values: PostFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ post, onSubmit, isSubmitting, onCancel }) => {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      is_published: post?.is_published || false,
      image_upload: undefined,
      image_url: post?.image_url || null,
    },
  });

  const titleValue = form.watch('title');
  const imageUrlValue = form.watch('image_url');

  useEffect(() => {
    // Only auto-slugify if it's a new post (no initial slug)
    if (titleValue && !post?.slug) {
        form.setValue('slug', slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form, post?.slug]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Your amazing post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="your-amazing-post-slug" {...field} />
              </FormControl>
               <FormDescription>
                This is the URL-friendly version of the title. It's usually generated automatically.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here. Markdown is supported."
                  className="min-h-[400px] font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Upload Image for Content</AccordionTrigger>
                <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Upload an image here, then copy the generated Markdown link and paste it into your content above.
                    </p>
                    <ImageUploader />
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <FormField
          control={form.control}
          name="image_upload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              {imageUrlValue && (
                <div className="my-2 relative w-64">
                  <img src={imageUrlValue} alt="Current cover" className="rounded-md object-cover w-full" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => {
                        form.setValue('image_url', null);
                        form.setValue('image_upload', undefined);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload a new image. If an image already exists, this will replace it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel>Publish</FormLabel>
                        <FormDescription>
                            Make this post visible to the public.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
};
