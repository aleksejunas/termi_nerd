
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { commands } from '@/lib/commands';
import type { FsCommand, RegularCommand } from '@/lib/commands/types';
import type { Tables } from '@/integrations/supabase/types';
import { useTheme } from '@/components/theme-provider';
import { getNode } from '@/lib/fileSystem';
import { tutorialSteps } from '@/lib/tutorialSteps';
import { completeLogin } from '@/lib/commands/login';
import { completeSignup } from '@/lib/commands/signup';

type Post = Tables<'posts'>;

interface Line {
  id: number;
  text: string | React.JSX.Element;
  type: 'input' | 'output' | 'system';
}

export const useTerminal = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const { setTerminalTheme } = useTheme();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [cwd, setCwd] = useState('/');
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
  const [authAction, setAuthAction] = useState<{ type: 'login' | 'signup', email: string } | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isVimRunning, setIsVimRunning] = useState(false);
  const [vimFile, setVimFile] = useState<{ filename: string; content: string } | null>(null);

  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: commands.welcome([]) as React.JSX.Element, type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN') {
        toast({
          title: 'Signed In',
          description: `Welcome back, ${session?.user?.email}`,
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed Out',
          description: 'You have been successfully logged out.',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  useEffect(() => {
    if (!editingPost) {
      inputRef.current?.focus();
    }
  }, [editingPost]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const getPromptCwd = (path: string) => {
    if (path === '/') return '~';
    const homeRelative = path.startsWith('/') ? path.substring(1) : path;
    const parts = homeRelative.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart ? `~/${lastPart}` : '~';
  }

  const PROMPT = session?.user?.email 
    ? `${session.user.email.split('@')[0]}@portfolio:${getPromptCwd(cwd)}$` 
    : `guest@portfolio:${getPromptCwd(cwd)}$`;

  const handleSavePost = async (content: string) => {
    if (!editingPost) return;

    const { error } = await supabase
        .from('posts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', editingPost.id);

    if (error) {
        toast({
            title: "Error",
            description: `Failed to save post: ${error.message}`,
            variant: "destructive",
        });
    } else {
        toast({
            title: "Success",
            description: `Post "${editingPost.title}" saved successfully.`,
        });
        setEditingPost(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleExitGame = () => {
    setIsGameRunning(false);
    setLines(prev => [...prev, { id: prev.length, text: 'Game over. Hope you had fun!', type: 'system' }]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleExitVim = () => {
    setIsVimRunning(false);
    setVimFile(null);
    setLines(prev => [...prev, { id: prev.length, text: '', type: 'output' }]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const processCommand = async (commandStr: string) => {
    const [command, ...args] = commandStr.trim().split(/\s+/);
    let output: string | React.JSX.Element;

    if (tutorialActive) {
        if (commandStr.trim() === 'exit') {
            setTutorialActive(false);
            setLines(prev => [...prev, { id: prev.length, text: 'Exited tutorial.', type: 'output' }]);
            return;
        }

        const currentStep = tutorialSteps[tutorialStep];
        if (currentStep.validator(command, args, cwd)) {
            const originalCmd = commands[command];
            let cmdOutput: string | React.JSX.Element | null = null;
            if (originalCmd) {
                 if (originalCmd.length === 2) {
                    const result = await (originalCmd as FsCommand)(args, { cwd, setCwd });
                    if (typeof result === 'string' || React.isValidElement(result)) cmdOutput = result;
                } else {
                    const result = await (originalCmd as RegularCommand)(args);
                     if (typeof result === 'string' || React.isValidElement(result)) cmdOutput = result;
                }
            }

            let successOutput: React.JSX.Element;
            const nextStep = tutorialSteps[tutorialStep + 1];

            if (nextStep) {
                successOutput = (
                    <div>
                        <div className="text-terminal-green">{currentStep.successMessage}</div>
                        <div className="mt-2">{nextStep.message}</div>
                    </div>
                );
                setTutorialStep(s => s + 1);
            } else {
                successOutput = (
                    <div>
                        <div className="text-terminal-green">{currentStep.successMessage}</div>
                        <p className="mt-2 font-bold">Congratulations! You've completed the tutorial.</p>
                        <p>You can now explore on your own. Type `help` to see all commands.</p>
                    </div>
                );
                setTutorialActive(false);
            }
            
            const finalOutput = (
                <div>
                    {cmdOutput && <div>{cmdOutput}</div>}
                    <div className={cmdOutput ? 'mt-2' : ''}>{successOutput}</div>
                </div>
            );

            setLines(prev => [...prev, { id: prev.length, text: finalOutput, type: 'output' }]);
        } else {
            setLines(prev => [...prev, { id: prev.length, text: `That's not quite right. Hint: ${currentStep.hint}`, type: 'output' }]);
        }
        return;
    }

    const cmd = commands[command];

    if (cmd) {
      let result;
      // Using function arity to distinguish between command types
      if (cmd.length === 2) {
          result = await (cmd as FsCommand)(args, { cwd, setCwd });
      } else {
          result = await (cmd as RegularCommand)(args);
      }
      
      if (typeof result === 'object' && result !== null && !React.isValidElement(result) && 'command' in result) {
        if (result.command === 'edit_post') {
          setEditingPost(result.payload as Post);
          return;
        }
        if (result.command === 'prompt_password') {
          setAuthAction(result.payload as { type: 'login' | 'signup', email: string });
          setIsAwaitingPassword(true);
          return;
        }
        if (result.command === 'set_theme') {
          setTerminalTheme(result.payload as any);
          output = `Theme set to ${result.payload}`;
        } else if (result.command === 'start_tutorial') {
            setTutorialActive(true);
            setTutorialStep(0);
            output = tutorialSteps[0].message as React.JSX.Element;
        } else if (result.command === 'start_pacman') {
            setIsGameRunning(true);
            output = 'Starting Pac-Man...';
        } else if (result.command === 'start_vim') {
            setIsVimRunning(true);
            setVimFile(result.payload as { filename: string; content: string });
            output = '';
        } else {
            output = `Unknown internal command.`;
        }
      } else if (result === "clear_screen") {
        setLines([]);
        return;
      } else {
        output = result as string | React.JSX.Element;
      }

    } else if (command.trim() === "") {
      output = "";
    } else {
      output = `Command not found: ${command}. Type 'help' for available commands.`;
    }
    
    if (output !== "") {
      setLines(prev => [...prev, { id: prev.length, text: output, type: 'output' }]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (suggestions.length > 0) {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) setSuggestions([]);
    
    if (isAwaitingPassword && authAction) {
      const password = input;
      setInput('');
      setIsAwaitingPassword(false);

      let resultMessage: string;
      if (authAction.type === 'login') {
        resultMessage = await completeLogin(authAction.email, password);
      } else { // signup
        resultMessage = await completeSignup(authAction.email, password);
      }

      setLines(prev => [...prev, { id: prev.length, text: resultMessage, type: 'output' }]);
      setAuthAction(null);
      return;
    }

    const fullPrompt = `${PROMPT} ${input}`;

    if (input.trim() === '') {
      setLines(prev => [...prev, { id: prev.length, text: PROMPT, type: 'input' }]);
    } else {
      setLines(prev => [...prev, { id: prev.length, text: fullPrompt, type: 'input' }]);
      await processCommand(input);
      if (input.trim() !== "") {
          setHistory(prev => [input, ...prev.filter(h => h !== input)].slice(0, 50));
      }
    }
    setHistoryIndex(-1);
    setInput('');
  };
  
  const handleSlugSuggestions = (slugs: (string | null)[], commandPrefix: string) => {
    const potentialSlugs = slugs.filter((s): s is string => s !== null);
    if (potentialSlugs.length === 0) {
      setSuggestions([]);
      return;
    }
    const slugPart = input.trimStart().split(' ')[2] || '';

    if (potentialSlugs.length === 1) {
      setInput(commandPrefix + potentialSlugs[0] + ' ');
      setSuggestions([]);
    } else if (potentialSlugs.length > 1) {
      let commonPrefix = '';
      const sortedSlugs = [...potentialSlugs].sort();
      const first = sortedSlugs[0];
      const last = sortedSlugs[sortedSlugs.length - 1];
      for (let i = 0; i < first.length; i++) {
        if (first[i] === last[i]) {
          commonPrefix += first[i];
        } else {
          break;
        }
      }
      if (commonPrefix.length > slugPart.length) {
        setInput(commandPrefix + commonPrefix);
        setSuggestions([]);
      } else {
        setSuggestions(potentialSlugs);
      }
    }
  };

  const handleTabCompletion = async () => {
    const trimmedInput = input.trimStart();
    const parts = trimmedInput.split(/\s+/);
    const commandName = parts[0];
    const isTypingCommand = parts.length === 1 && !input.endsWith(' ');

    if (isTypingCommand) {
      const potentialCommands = Object.keys(commands).filter(c => c.startsWith(commandName));
      if (potentialCommands.length === 1) {
        setInput(potentialCommands[0] + ' ');
      } else if (potentialCommands.length > 1) {
        setSuggestions(potentialCommands);
      }
      return;
    }

    const subCommands: Record<string, string[]> = {
        post: ['new', 'publish', 'list', 'show', 'edit'],
    };

    // Subcommand completion
    if (subCommands[commandName] && parts.length === 2) {
        const subCommandPart = parts[1];
        const potentialSubCommands = subCommands[commandName].filter(sc => sc.startsWith(subCommandPart));
        
        if (potentialSubCommands.length === 1) {
            setInput(`${commandName} ${potentialSubCommands[0]} `);
            setSuggestions([]);
        } else if (potentialSubCommands.length > 1) {
            let commonPrefix = '';
            const sorted = [...potentialSubCommands].sort();
            const first = sorted[0];
            const last = sorted[sorted.length - 1];
            for (let i = 0; i < first.length; i++) {
                if (first[i] === last[i]) {
                    commonPrefix += first[i];
                } else {
                    break;
                }
            }
            if (commonPrefix.length > subCommandPart.length) {
                setInput(`${commandName} ${commonPrefix}`);
                setSuggestions([]);
            } else {
                setSuggestions(potentialSubCommands);
            }
        }
        return;
    }
    
    // Filesystem completion
    const fsCommands = ['cd', 'ls', 'cat', 'vim'];
    if (fsCommands.includes(commandName)) {
      const isTypingArg = parts.length > 1 || (parts.length === 1 && input.endsWith(' '));
    
      if (isTypingArg) {
        const pathArg = parts.length > 1 ? parts[parts.length - 1] : "";
        
        const lastSlash = pathArg.lastIndexOf('/');
        const dirPart = pathArg.substring(0, lastSlash + 1);
        const filePart = pathArg.substring(lastSlash + 1);
        
        const dirNode = getNode(dirPart || '.', cwd);
    
        if (dirNode && dirNode.type === 'directory') {
          const children = Object.keys(dirNode.children);
          const completions = children.filter(c => c.startsWith(filePart));
    
          if (completions.length === 1) {
            const completed = completions[0];
            const fullPath = dirPart + completed;
            const node = dirNode.children[completed];
            const suffix = node.type === 'directory' ? '/' : ' ';
            setInput(`${commandName} ${fullPath}${suffix}`);
            setSuggestions([]);
          } else if (completions.length > 1) {
            let commonPrefix = '';
            const sorted = completions.sort();
            const first = sorted[0], last = sorted[sorted.length-1];
            for (let i = 0; i < first.length && i < last.length; i++) {
              if (first[i] === last[i]) commonPrefix += first[i];
              else break;
            }
    
            if (commonPrefix.length > filePart.length) {
              setInput(`${commandName} ${dirPart}${commonPrefix}`);
              setSuggestions([]);
            } else {
              setSuggestions(completions);
            }
          }
        }
        return;
      }
    }

    // Argument completion (slugs for 'post' command)
    if (commandName === 'post' && parts.length >= 3) {
      const subCommand = parts[1];
      const slugPart = parts[2] || '';
      
      if (subCommand === 'show') {
        const { data: posts, error } = await supabase.from('posts').select('slug, is_published').ilike('slug', `${slugPart}%`);
        if (error || !posts) return;
        const { data: { session } } = await supabase.auth.getSession();
        const potentialSlugs = posts.filter(p => p.is_published || session?.user).map(p => p.slug);
        handleSlugSuggestions(potentialSlugs, `post show `);
      } else if (['edit', 'publish'].includes(subCommand)) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: posts, error } = await supabase.from('posts').select('slug').ilike('slug', `${slugPart}%`);
        if (error || !posts) return;
        const potentialSlugs = posts.map(p => p.slug);
        handleSlugSuggestions(potentialSlugs, `post ${subCommand} `);
      }
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0 && e.key !== 'Tab') {
        setSuggestions([]);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex >= 0) {
        const newIndex = Math.max(-1, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex] || '');
      }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        await handleTabCompletion();
    }
  };
  
  const handleClick = () => {
    if (!editingPost && !isGameRunning && !isVimRunning) {
      inputRef.current?.focus();
    }
  };

  return {
    lines,
    input,
    suggestions,
    editingPost,
    isAwaitingPassword,
    isGameRunning,
    isVimRunning,
    vimFile,
    PROMPT,
    inputRef,
    scrollRef,
    handleCancelEdit,
    handleClick,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    handleSavePost,
    handleExitGame,
    handleExitVim,
  };
}
