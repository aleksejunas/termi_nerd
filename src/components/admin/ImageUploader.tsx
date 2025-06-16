import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check } from "lucide-react";

export const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [wasCopied, setWasCopied] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadedUrl(null); // Reset on new file selection
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedUrl(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("You must be logged in.");

      const filePath = `content-images/${session.user.id}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(data.path);
      setUploadedUrl(publicUrl);
      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (error: unknown) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(`![alt text](${uploadedUrl})`);
    setWasCopied(true);
    toast({
      title: "Copied!",
      description: "Markdown image link copied to clipboard.",
    });
    setTimeout(() => setWasCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="flex-grow"
        />
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Upload
        </Button>
      </div>
      {uploadedUrl && (
        <div className="p-2 bg-muted rounded-md flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {uploadedUrl}
            </a>
          </p>
          <Button size="icon" variant="ghost" onClick={copyToClipboard}>
            {wasCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
