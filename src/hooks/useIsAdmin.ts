
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const checkIsAdmin = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return false;
  }

  const { data, error } = await supabase.rpc('has_role', {
    _user_id: session.user.id,
    _role: 'admin',
  });

  if (error) {
    console.error('Error checking admin status:', error.message);
    return false;
  }
  
  return data === true;
};

export const useIsAdmin = () => {
  return useQuery({
    queryKey: ['userIsAdmin'],
    queryFn: checkIsAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
