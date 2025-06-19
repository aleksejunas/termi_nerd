import React from "react";
import Cursor from "./Cursor";
import PostEditor from "./PostEditor";
import { useTerminal } from "@/hooks/useTerminal";
import PacmanGame from "./PacmanGame";
import VimEditor from "./VimEditor";

const Terminal: React.FC = () => {
  const {
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
  } = useTerminal();

  return (
    <div
      className="flex flex-col h-full p-3 bg-terminal-bg text-terminal-fg font-mono text-sm overflow-y-auto focus:outline-none"
      onClick={isGameRunning || isVimRunning ? undefined : handleClick}
      tabIndex={0}
      ref={scrollRef}
    >
      {isGameRunning ? (
        <PacmanGame onExit={handleExitGame} />
      ) : isVimRunning && vimFile ? (
        <VimEditor
          filename={vimFile.filename}
          content={vimFile.content}
          onExit={handleExitVim}
        />
      ) : (
        <>
          {editingPost && (
            <PostEditor
              post={editingPost}
              onSave={handleSavePost}
              onCancel={handleCancelEdit}
            />
          )}
          <div className="flex-grow">
            {lines.map((line) => (
              <div
                key={line.id}
                className={`whitespace-pre-wrap ${line.type === "input" ? "text-terminal-green" : ""}`}
              >
                {typeof line.text === "string"
                  ? line.text
                      .split("\n")
                      .map((part, i) => <div key={i}>{part}</div>)
                  : line.text}
              </div>
            ))}
          </div>
          {suggestions.length > 0 && (
            <div className="text-terminal-blue mt-1 mb-1 flex flex-wrap gap-x-4 gap-y-1">
              {suggestions.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-terminal-yellow mr-2">
              {isAwaitingPassword ? "Password:" : PROMPT}
            </span>
            <input
              ref={inputRef}
              type={isAwaitingPassword ? "password" : "text"}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent text-terminal-fg focus:outline-none"
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
            />
            <Cursor className="ml-1" />
          </form>
        </>
      )}
    </div>
  );
};

export default Terminal;
