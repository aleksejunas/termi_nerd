
import React from 'react';
import type { FsCommand } from './types';
import { ls } from './ls';

export const projects: FsCommand = (args, context) => {
    context.setCwd('/projects');
    return (
        <div>
            <p className="mb-2">Changed directory to /projects. Use `ls` to see projects, and `cat [filename]` to view details.</p>
            {ls(args, { ...context, cwd: '/projects' }) as React.ReactNode}
        </div>
    )
};
