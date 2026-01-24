import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export function useSupabaseUser() {
  const [user, setUser] = useState<Awaited<ReturnType<typeof supabaseBrowser.auth.getUser>>['data']['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      const { data } = await supabaseBrowser.auth.getUser();
      if (mounted) setUser(data.user ?? null);
      setLoading(false);
    };

    init();

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseBrowser.auth.signOut();
  };

  return { user, loading, signOut };
}
