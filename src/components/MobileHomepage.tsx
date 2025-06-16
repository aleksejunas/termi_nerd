
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHomepage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-terminal-bg text-terminal-fg p-4 text-center">
      <pre className="text-terminal-cyan whitespace-pre-wrap font-bold text-lg mb-4">
        {`A L E K S E J U N A S`}
      </pre>
      <p className="text-terminal-cyan font-bold mb-6">
        Welcome to my portfolio!
      </p>
      <p className="mb-8 text-sm text-muted-foreground">
        The full interactive terminal experience is available on desktop.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button asChild>
          <Link to="/blog">
            Explore Site
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" className="bg-transparent hover:bg-terminal-fg/10 border-terminal-fg/20">
          <a href="https://github.com/aleksejunas" target="_blank" rel="noopener noreferrer">
            <Github />
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MobileHomepage;
