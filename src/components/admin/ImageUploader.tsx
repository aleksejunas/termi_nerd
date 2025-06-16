import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded?: (markdownImage: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
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

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
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

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!uploadedUrl) return;
    const markdownImage = `![Image description](${uploadedUrl})`;
    navigator.clipboard.writeText(markdownImage);
    setWasCopied(true);
    toast({
      title: "Copied!",
      description: "Markdown image link copied to clipboard. Paste it into your content and update the description.",
    });
    setTimeout(() => setWasCopied(false), 2000);
  };

  const insertImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!uploadedUrl) return;
    const markdownImage = `![Image description](${uploadedUrl})`;
    if (onImageUploaded) {
      onImageUploaded(markdownImage);
      toast({
        title: "Image inserted",
        description: "The image has been inserted into your content. Don't forget to update the description!",
      });
    } else {
      copyToClipboard(e);
    }
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
        <Button onClick={handleUpload} disabled={isUploading || !file} type="button">
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Upload
        </Button>
      </div>
      {uploadedUrl && (
        <div className="space-y-4">
          <div className="space-y-4">
            {onImageUploaded ? (
              <Button size="sm" onClick={insertImage} type="button" className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" />
                Insert into Content
              </Button>
            ) : (
              <Button size="icon" variant="ghost" onClick={copyToClipboard} type="button">
                {wasCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
            <div className="p-2 bg-muted rounded-md">
              <p className="text-sm font-mono mb-2">
                ![Image description]({uploadedUrl})
              </p>
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
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <p>
                {onImageUploaded
                  ? "The image has been uploaded. Click 'Insert into Content' above to add it to your post."
                  : "Click the copy button to copy the Markdown image link. Then paste it into your content and update the description."}
              </p>
            </div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={uploadedUrl}
              alt="Uploaded preview"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
