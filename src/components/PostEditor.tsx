
import React, { useState } from 'react';
import type { Tables } from '@/integrations/supabase/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';

type Post = Tables<'posts'>;

interface PostEditorProps {
  post: Post;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState(post.content || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(content);
    // The parent component will handle closing the editor on success
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-terminal-bg rounded-lg shadow-xl p-6 w-full max-w-3xl flex flex-col gap-4 border border-terminal-green">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-terminal-cyan">Editing: {post.title}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={isSaving}>
            <X className="h-6 w-6 text-terminal-fg" />
          </Button>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow bg-gray-900 text-terminal-fg border-terminal-blue focus:ring-terminal-cyan font-mono h-96 resize-none"
          placeholder="Start writing your post content here... (Markdown is supported!)"
          disabled={isSaving}
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save & Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
