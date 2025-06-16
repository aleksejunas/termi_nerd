
import { supabase } from '@/integrations/supabase/client';
import type { Command } from './types';

export const logout: Command = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return `Logout failed: ${error.message}`;
    }
    return "Logged out successfully.";
};
