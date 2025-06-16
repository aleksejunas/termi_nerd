
import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // This runs only on the client-side to get the current page URL
    setUrl(window.location.href);
  }, []);
  
  if (!url) {
    return null; // Don't render until the URL is available
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link.');
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold whitespace-nowrap">Share this post:</h3>
        <div className="flex items-center gap-2 flex-wrap">
            {socialLinks.map((social) => (
                <Button variant="outline" size="sm" asChild key={social.name}>
                    <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${social.name}`}
                        className="flex items-center gap-2"
                    >
                        {social.icon}
                        <span className="hidden sm:inline">{social.name}</span>
                    </a>
                </Button>
            ))}
            <Button variant="outline" size="sm" onClick={handleCopyLink} aria-label="Copy link" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
            </Button>
        </div>
    </div>
  );
};

export default SocialShare;
