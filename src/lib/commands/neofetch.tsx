
import React from 'react';
import type { Command } from './types';
import { supabase } from '@/integrations/supabase/client';

export const neofetch: Command = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user?.email ? session.user.email.split('@')[0] : 'guest';
    const host = "portfolio";

    const asciiArt = `
         _nnnn_
        dGGGGMMb
       @p~qp~~qMb
       M|@||@) M|
       @,----.JM|
      JS^\`.__.\`/SI
     d_      _bJ
    / /     \\ \\
   / /       \\ \\
   ( (       ) )
   | |       | |
  / /       / /
 ( (       ) )
  \\ \\     / /
   \\ \\   / /
    \`"''"'   \`"''"
    `;

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <pre className="text-terminal-blue hidden md:block">{asciiArt}</pre>
            <div className="font-mono">
                <p><span className="text-terminal-green">{user}@{host}</span></p>
                <p>------------------</p>
                <p><span className="text-terminal-cyan">OS</span>: Web Browser</p>
                <p><span className="text-terminal-cyan">Kernel</span>: React</p>
                <p><span className="text-terminal-cyan">Shell</span>: zsh</p>
                <p><span className="text-terminal-cyan">Uptime</span>: since you arrived</p>
                <p><span className="text-terminal-cyan">CPU</span>: V8 JavaScript Engine</p>
                <p><span className="text-terminal-cyan">GPU</span>: WebGL Renderer</p>
                <p><span className="text-terminal-cyan">Memory</span>: 1024MB</p>
            </div>
        </div>
    );
};
