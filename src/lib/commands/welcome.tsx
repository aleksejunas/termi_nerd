import React from "react";
import type { Command } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

export const welcome: Command = () => (
  <div className="inline-block">
    <pre className="text-terminal-cyan whitespace-pre-wrap font-bold hidden md:block text-[10px] leading-tight">
      {`
███████ ██      ███████ ██   ██ ███████ ███████      ██ ██    ██ ███    ██  █████  ███████
██   ██ ██      ██      ██  ██  ██      ██           ██ ██    ██ ████   ██ ██   ██ ██
███████ ██      █████   █████   ███████ █████        ██ ██    ██ ██ ██  ██ ███████ ███████
██   ██ ██      ██      ██  ██       ██ ██      ██   ██ ██    ██ ██  ██ ██ ██   ██      ██
██   ██ ███████ ███████ ██   ██ ███████ ███████  █████   ██████  ██   ████ ██   ██ ███████
`}
    </pre>
    <pre className="text-terminal-cyan whitespace-pre-wrap font-bold block md:hidden text-center text-lg">
      {`A L E K S E J U N A S`}
    </pre>
    <div className="flex items-center gap-x-4 mt-2">
      <p className="text-terminal-cyan font-bold flex-grow">
        Welcome to my interactive portfolio! Type 'help' to see available
        commands.
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button asChild variant="ghost" size="icon">
          <a
            href="https://github.com/aleksejunas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/blog">
            Explore Site
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild size="icon" className="sm:hidden">
          <Link to="/blog" aria-label="Explore Site">
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  </div>
);
