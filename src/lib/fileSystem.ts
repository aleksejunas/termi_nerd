import React, { Children } from "react";
import { projects } from "@/data/projects";
import { about } from "@/lib/commands/about";
import { contact } from "@/lib/commands/contact";
import type { CommandResult } from "./commands/types";
import { type } from "os";

export interface VFile {
  type: "file";
  content: string | (() => CommandResult);
}

export interface VDirectory {
  type: "directory";
  children: { [key: string]: VFile | VDirectory };
}

export type VNode = VFile | VDirectory;

export const fs: VDirectory = {
  type: "directory",
  children: {
    "about.txt": { type: "file", content: () => about([]) },
    "contact.txt": { type: "file", content: () => contact([]) },
    "quotes.txt": {
      type: "file",
      content: `“The only way to do great work is to love what you do.” - Steve Jobs\n“The journey of a thousand miles begins with a single step.” - Lao Tzu\n“That which does not kill us makes us stronger.” - Friedrich Nietzsche\n"Life is what happens when you're busy making other plans." - John Lennon`,
    },
    projects: {
      type: "directory",
      children: projects.reduce(
        (acc, p) => {
          acc[`${p.slug}.txt`] = {
            type: "file" as const,
            content: `Title: ${p.title}\nDescription: ${p.description}\n\n${p.longDescription}\n\nTechnologies: ${p.technologies.join(", ")}\n\nCheck it out:\nLive: ${p.liveUrl || "N/A"}\nRepo: ${p.repoUrl || "N/A"}`,
          };
          return acc;
        },
        {} as { [key: string]: VFile },
      ),
    },
    mycode: {
      type: "directory",
      children: {
        "GreetingsPlanet.tsx": {
          type: "file",
          content: `import React from 'react';
export default function GreetingsPlanet() {
return <div>Greetings, Planet!</div>;
}
`,
        },
        "Counter.tsx": {
          type: "file",
          content: `import React, { useState } from 'react'
export default function Counter() {
const [count, setCount] = useState(0);
return (
<button onClick={() => setCount(count + 1)}>
Count: {count}
</button>
);
}
`,
        },
      },
    },
  },
};

export const resolvePath = (path: string, cwd: string): string => {
  // Trim trailing slash for directories, but not for root '/'
  const trimmedPath =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  const effectivePath = trimmedPath.startsWith("/")
    ? trimmedPath
    : cwd === "/"
      ? `/${trimmedPath}`
      : `${cwd}/${trimmedPath}`;

  const segments = effectivePath.split("/").filter(Boolean);
  const resolvedSegments: string[] = [];

  for (const segment of segments) {
    if (segment === "..") {
      resolvedSegments.pop();
    } else if (segment !== ".") {
      resolvedSegments.push(segment);
    }
  }

  return `/${resolvedSegments.join("/")}`;
};

export const getNode = (path: string, cwd: string): VNode | null => {
  const resolved = resolvePath(path, cwd);
  if (resolved === "/") return fs;

  const parts = resolved.split("/").filter((p) => p.length > 0);

  let currentNode: VNode = fs;
  for (const part of parts) {
    if (currentNode.type === "directory" && currentNode.children[part]) {
      currentNode = currentNode.children[part];
    } else {
      return null;
    }
  }
  return currentNode;
};
