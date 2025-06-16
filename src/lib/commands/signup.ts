
import { supabase } from '@/integrations/supabase/client';
import type { Command } from './types';

export const signup: Command = async (args: string[]) => {
    const [email] = args;
    if (!email) {
      return "Usage: signup <email>";
    }
    return { command: 'prompt_password', payload: { type: 'signup', email } };
};

export const completeSignup = async (email: string, password: string): Promise<string> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      return `Signup failed: ${error.message}`;
    }
    return "Signup successful! Please check your email for a confirmation link. (You can disable email confirmation in your Supabase project settings for easier development).";
}
