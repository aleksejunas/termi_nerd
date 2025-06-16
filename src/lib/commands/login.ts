
import { supabase } from '@/integrations/supabase/client';
import type { Command } from './types';

export const login: Command = async (args: string[]) => {
    const [email] = args;
    if (!email) {
      return "Usage: login <email>";
    }
    // Return a special object to trigger password prompt
    return { command: 'prompt_password', payload: { type: 'login', email } };
};

// This will be called by useTerminal after getting the password
export const completeLogin = async (email: string, password: string): Promise<string> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return `Login failed: ${error.message}`;
    }
    return `Logged in as ${data.user?.email}`;
}
