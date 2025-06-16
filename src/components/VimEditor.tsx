import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface VimEditorProps {
  filename: string;
  content: string;
  onExit: () => void;
}

const getLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'jsx';
        case 'ts':
            return 'typescript';
        case 'tsx':
            return 'tsx';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'html':
            return 'html';
        case 'py':
            return 'python';
        case 'rb':
            return 'ruby';
        case 'java':
            return 'java';
        case 'go':
            return 'go';
        case 'sh':
        case 'bash':
            return 'bash';
        case 'sql':
            return 'sql';
        case 'yml':
        case 'yaml':
            return 'yaml';
        default:
            return 'plaintext';
    }
};

const customStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
};

const codeTagProps = {
    style: {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
    }
};

const VimEditor: React.FC<VimEditorProps> = ({ filename, content, onExit }) => {
    const [command, setCommand] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (command.startsWith(':q')) {
            onExit();
        }
        // Could add other commands later, for now, just clear
        setCommand('');
    }

    const lines = content.split('\n');
    const language = getLanguage(filename);

    return (
        <div className="flex-grow flex flex-col h-full bg-terminal-bg text-terminal-fg font-mono text-sm" onClick={() => inputRef.current?.focus()}>
            <div className="flex-grow p-2 overflow-y-auto flex">
                <div className="text-right text-terminal-blue pr-4 select-none">
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>
                <div className="flex-grow">
                    <SyntaxHighlighter
                        language={language}
                        style={atomDark}
                        customStyle={customStyle}
                        codeTagProps={codeTagProps}
                    >
                        {content.trimEnd()}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="flex justify-between items-center bg-gray-700 text-white px-2 h-6 font-bold text-xs">
                <span>"{filename}" [readonly]</span>
                <span>{lines.length}L, {content.length}C</span>
            </div>
            <form onSubmit={handleCommandSubmit} className="flex items-center bg-terminal-bg h-6 px-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    spellCheck="false"
                    autoCapitalize="none"
                    autoComplete="off"
                    placeholder="type :q to exit"
                />
            </form>
        </div>
    );
};

export default VimEditor;
