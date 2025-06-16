
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const fetchGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be 500 characters or less'),
});

const GuestbookPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['guestbook'],
    queryFn: fetchGuestbookEntries,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  const addEntryMutation = useMutation<void, Error, z.infer<typeof formSchema>>({
    mutationFn: async (newEntry: z.infer<typeof formSchema>) => {
      const { error } = await supabase.from('guestbook').insert({
        name: newEntry.name,
        message: newEntry.message,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guestbook'] });
      toast.success('Your message has been added to the guestbook!');
      form.reset();
    },
    onError: (err: Error) => {
      toast.error(`Failed to add entry: ${err.message}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addEntryMutation.mutate(values);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Guestbook</h1>
      <p className="text-muted-foreground mb-8">Leave a message for future visitors.</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Leave a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={addEntryMutation.isPending}>
                {addEntryMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Entries</h2>
      {isLoading && <p>Loading entries...</p>}
      {error && <p className="text-destructive">Error loading entries: {error.message}</p>}
      <div className="space-y-4">
        {entries?.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle>{entry.name}</CardTitle>
              <CardDescription>
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{entry.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GuestbookPage;
