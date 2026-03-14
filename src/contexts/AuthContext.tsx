import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'agent' | 'student';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, roles: [],
  hasRole: () => false, signOut: async () => {},
  isSubscribed: false, subscriptionEnd: null, checkSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const fetchRoles = async (userId: string) => {
    console.log('[Auth] fetchRoles called for:', userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    console.log('[Auth] fetchRoles result:', data, 'error:', error);
    setRoles(data?.map(r => r.role as AppRole) || []);
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (!error && data) {
        setIsSubscribed(data.subscribed || false);
        setSubscriptionEnd(data.subscription_end || null);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRoles(session.user.id);

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

          // Check subscription after auth
          setTimeout(() => checkSubscription(), 100);
        } else {
          setRoles([]);
          setIsSubscribed(false);
          setSubscriptionEnd(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRoles(session.user.id);
        checkSubscription();
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role: AppRole) => roles.includes(role);
  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, hasRole, signOut, isSubscribed, subscriptionEnd, checkSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
