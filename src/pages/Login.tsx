import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, roles, rolesLoading, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only redirect when auth is resolved AND roles are resolved
    if (authLoading || rolesLoading) return;
    if (!user) return;

    if (roles.length > 0) {
      const path = roles.includes('admin') ? '/admin' : roles.includes('agent') ? '/agent' : '/student';
      navigate(path, { replace: true });
    }
    // If user exists but no roles after loading, stay on login (edge case)
  }, [user, roles, rolesLoading, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Redirect handled by useEffect watching roles
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-display font-bold text-2xl">E</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-muted-foreground mt-2">{isRegister ? 'Start your education journey' : 'Sign in to your account'}</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-full bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline font-medium">
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
