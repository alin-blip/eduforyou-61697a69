import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const redirectByRole = () => {
    if (hasRole('admin')) {
      navigate('/admin');
    } else if (hasRole('agent')) {
      navigate('/agent');
    } else {
      navigate('/student');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Eroare la autentificare',
          description: error.message === 'Invalid login credentials'
            ? 'Email sau parolă incorectă.'
            : error.message,
        });
        return;
      }

      toast({
        title: 'Autentificare reușită',
        description: 'Bine ai revenit!',
      });

      // Small delay to allow roles to load
      setTimeout(() => {
        redirectByRole();
      }, 500);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Eroare',
        description: 'A apărut o eroare neașteptată. Încearcă din nou.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#D4AF37]/10 via-white to-[#D4AF37]/10">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C6A248] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Autentificare
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Intră în contul tău EduForYou
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Parolă</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#C6A248] hover:text-[#C6A248] hover:underline"
                  >
                    Ai uitat parola?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Introdu parola"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C6A248] hover:from-[#C6A248] hover:to-[#C6A248] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Se autentifică...' : 'Autentificare'}
              </Button>

              <p className="text-sm text-center text-gray-500">
                Nu ai cont?{' '}
                <Link
                  to="/auth/register"
                  className="text-[#C6A248] hover:text-[#C6A248] font-medium hover:underline"
                >
                  Creează cont
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
