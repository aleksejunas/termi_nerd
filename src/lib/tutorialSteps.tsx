
import React from 'react';
import { VFile, getNode, resolvePath } from './fileSystem';

export interface TutorialStep {
    message: React.ReactNode;
    validator: (command: string, args: string[], cwd: string) => boolean;
    successMessage: React.ReactNode;
    hint: string;
}

export const tutorialSteps: TutorialStep[] = [
    {
        message: (
            <div>
                <p>Welcome to the interactive terminal tutorial!</p>
                <p>Let's learn some basic commands. You can type `exit` at any time to leave the tutorial.</p>
                <p className="mt-2">First, let's find out where we are. Type `pwd` and press Enter.</p>
            </div>
        ),
        validator: (command) => command === 'pwd',
        successMessage: <p>`pwd` stands for 'Print Working Directory'. It shows you your current location in the file system.</p>,
        hint: "Type `pwd` to see your current directory.",
    },
    {
        message: <p>Great! Now, let's see what's in this directory. Type `ls` to list the contents.</p>,
        validator: (command) => command === 'ls',
        successMessage: <p>See? `ls` lists all files and directories. Directories are shown in blue.</p>,
        hint: "Type `ls` to list files and directories.",
    },
    {
        message: <p>Let's navigate into the `projects` directory. Use the `cd` command, which stands for 'Change Directory'. Type `cd projects`.</p>,
        validator: (command, args) => command === 'cd' && args[0] === 'projects',
        successMessage: <p>You've moved into the `projects` directory! Your prompt has updated to show your new location.</p>,
        hint: "Type `cd projects` to enter the projects directory.",
    },
    {
        message: <p>Now that you're in a new directory, let's see what's here. Use `ls` again.</p>,
        validator: (command) => command === 'ls',
        successMessage: <p>These are my project files. Let's inspect one.</p>,
        hint: "Type `ls` to see the files in the current directory.",
    },
    {
        message: <p>To view the contents of a file, use the `cat` command. Try it on one of the files, for example: `cat project-alpha.txt`</p>,
        validator: (command, args, cwd) => {
            if (command !== 'cat' || args.length === 0) return false;
            const node = getNode(args[0], cwd);
            return !!node && node.type === 'file';
        },
        successMessage: <p>`cat` displays the content of a file. Pretty handy!</p>,
        hint: "Type `cat` followed by a file name, like `cat project-alpha.txt`.",
    },
    {
        message: <p>Awesome. To go back to the home directory, you can type `cd ..`. The `..` means 'one level up'. Try it.</p>,
        validator: (command, args) => command === 'cd' && (args[0] === '..' || args[0] === '/home' || args[0] === '/'),
        successMessage: <p>You're back in the home directory (`/`).</p>,
        hint: "Type `cd ..` to go up one directory level.",
    },
    {
        message: <p>Let's learn a powerful command: `grep`. It's for searching text. I've added a `quotes.txt` file. Find the quote with the word 'love' by typing: `grep love quotes.txt`</p>,
        validator: (command, args) => command === 'grep' && args[0] === 'love' && args[1] === 'quotes.txt',
        successMessage: (
            <div>
              <p>Nice! `grep` found the line containing 'love' and highlighted it.</p>
              <p className="mt-2">In a real terminal, you could also "pipe" command outputs. For example: `cat quotes.txt | grep love`. This is a very powerful concept!</p>
            </div>
          ),
        hint: "Type `grep love quotes.txt`",
    },
];
