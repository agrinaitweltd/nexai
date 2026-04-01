
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * SyncUser monitors the Supabase auth session.
 * It's imported but currently a no-op since AppContext handles auth state.
 */
export default function SyncUser() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('[SyncUser] Session active:', session.user.email);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return null;
}
