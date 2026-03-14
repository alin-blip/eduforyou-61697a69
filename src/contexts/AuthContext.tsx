import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'agent' | 'student';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesLoading: boolean;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, rolesLoading: true, roles: [],
  hasRole: () => false, signOut: async () => {},
  isSubscribed: false, subscriptionEnd: null, checkSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const fetchRoles = useCallback(async (userId: string) => {
    try {
      setRolesLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      if (error) {
        console.error('[Auth] fetchRoles error:', error);
        setRoles([]);
      } else {
        setRoles(data?.map(r => r.role as AppRole) || []);
      }
    } catch (e) {
      console.error('[Auth] fetchRoles exception:', e);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (!error && data) {
        setIsSubscribed(data.subscribed || false);
        setSubscriptionEnd(data.subscription_end || null);
      }
    } catch {
      // silently fail
    }
  }, []);

  const signOut = useCallback(async () => {
    // Immediate local cleanup so UI reacts instantly
    setUser(null);
    setSession(null);
    setRoles([]);
    setRolesLoading(false);
    setIsSubscribed(false);
    setSubscriptionEnd(null);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('[Auth] signOut error:', e);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setRolesLoading(false);
    }, 5000);

    // NON-ASYNC callback — defer async work
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Defer role fetching to avoid blocking the auth callback
          setTimeout(() => {
            fetchRoles(session.user.id);
            checkSubscription();
          }, 0);

          if (event === 'SIGNED_IN' && session.user.created_at) {
            const createdAt = new Date(session.user.created_at).getTime();
            if (Date.now() - createdAt < 60000) {
              supabase.functions.invoke('send-transactional-email', {
                body: {
                  template: 'welcome',
                  recipientEmail: session.user.email,
                  fullName: session.user.user_metadata?.full_name || '',
                },
              }).catch(console.error);
            }
          }
        } else {
          setRoles([]);
          setRolesLoading(false);
          setIsSubscribed(false);
          setSubscriptionEnd(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchRoles(session.user.id);
        checkSubscription();
      } else {
        setRolesLoading(false);
      }
    }).catch(() => {
      setLoading(false);
      setRolesLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchRoles, checkSubscription]);

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);

  return (
    <AuthContext.Provider value={{ user, session, loading, rolesLoading, roles, hasRole, signOut, isSubscribed, subscriptionEnd, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
