import React from "react";
import type { Command } from "./types";

export const help: Command = () => (
  <div>
    <p>Available commands:</p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>
        <span className="text-terminal-green">welcome</span> - Display the
        welcome banner.
      </li>
      <li>
        <span className="text-terminal-green">help</span> - Show this help
        message.
      </li>
      <li>
        <span className="text-terminal-green">tutorial</span> - Start an
        interactive tutorial.
      </li>
      <li>
        <span className="text-terminal-green">about</span> - Display information
        about me (or use `cat about.txt`).
      </li>
      <li>
        <span className="text-terminal-green">projects</span> - Navigate to
        projects directory.
      </li>
      <li>
        <span className="text-terminal-green">contact</span> - Show my contact
        information (or use `cat contact.txt`).
      </li>
      <li>
        <span className="text-terminal-green">blog</span> - View published blog
        posts (or visit{" "}
        <a
          href="/blog"
          target="_blank"
          className="text-terminal-blue underline"
        >
          /blog
        </a>
        ).
      </li>
      <li>
        <span className="text-terminal-green">post [subcommand]</span> - Manage
        posts. Try 'post list', 'post show [slug]', 'post edit [slug]'.
      </li>
      <li>
        <span className="text-terminal-green">clear</span> - Clear the terminal
        screen.
      </li>
      <li>
        <span className="text-terminal-green">date</span> - Display the current
        date and time.
      </li>
      <li>
        <span className="text-terminal-green">echo [text]</span> - Print text to
        the terminal.
      </li>
      <li>
        <span className="text-terminal-green">whoami</span> - Display the
        current user.
      </li>
      <li>
        <span className="text-terminal-green">signup [email]</span> - Create a
        new account.
      </li>
      <li>
        <span className="text-terminal-green">login [email]</span> - Log in to
        an account.
      </li>
      <li>
        <span className="text-terminal-green">logout</span> - Log out from the
        current account.
      </li>
      <li>
        <span className="text-terminal-green">neofetch</span> - Display system
        information.
      </li>
      <li>
        <span className="text-terminal-green">pacman</span> - Play a game of
        Pac-Man.
      </li>
    </ul>
    <p className="mt-4 font-bold">File System Commands:</p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>
        <span className="text-terminal-green">ls [path]</span> - List files and
        directories.
      </li>
      <li>
        <span className="text-terminal-green">cd [path]</span> - Change
        directory (e.g., `cd projects`, `cd ..`).
      </li>
      <li>
        <span className="text-terminal-green">cat [file]</span> - Display file
        content.
      </li>
      <li>
        <span className="text-terminal-green">vim [file]</span> - Open a file in
        a simulated Vim editor.
      </li>
      <li>
        <span className="text-terminal-green">pwd</span> - Print name of
        current/working directory.
      </li>
      <li>
        <span className="text-terminal-green">grep [pattern] [file]</span> -
        Search for a pattern in a file.
      </li>
    </ul>
  </div>
);
