import type React from "react";
import type { Tables } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;

// Using a generic object for command results from readonly files
// where 'as const' is not used, so 'command' property is inferred as string.
type GenericCommandObject = { command: string; payload: unknown };

export type CommandOutput = string | React.JSX.Element | GenericCommandObject;
export type CommandResult = CommandOutput | Promise<CommandOutput>;

export type CommandContext = {
  cwd: string;
  setCwd: (path: string) => void;
};

// For casting inside useTerminal to get some type safety back on arity checks
export type FsCommand = (
  args: string[],
  context: CommandContext,
) => CommandResult;
export type RegularCommand = (args: string[]) => CommandResult;

// This general type is flexible enough to handle all command signatures from readonly files.
// Arity is checked at runtime to determine which kind of command it is.
export type Command = (...args: unknown[]) => CommandResult;
