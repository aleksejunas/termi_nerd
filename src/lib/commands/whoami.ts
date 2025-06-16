
import { supabase } from '@/integrations/supabase/client';
import type { Command } from './types';

export const whoami: Command = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      return session.user.email;
    }
    return "guest";
};
