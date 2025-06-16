
import React from 'react';
import type { Command } from './types';

export const contact: Command = () => (
    <div>
      <p>Get in touch:</p>
      <ul className="list-disc list-inside ml-4">
        <li>Email: <a href="mailto:your.email@example.com" className="text-terminal-blue underline hover:text-terminal-cyan">your.email@example.com</a></li>
        <li>GitHub: <a href="https://github.com/aleksejunas" target="_blank" rel="noopener noreferrer" className="text-terminal-blue underline hover:text-terminal-cyan">github.com/aleksejunas</a></li>
        <li>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-terminal-blue underline hover:text-terminal-cyan">linkedin.com/in/yourprofile</a></li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">Replace these with your actual links!</p>
    </div>
);
