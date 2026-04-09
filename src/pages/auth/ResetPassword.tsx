import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Parolă prea scurtă',
        description: 'Parola trebuie să aibă cel puțin 6 caractere.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Parolele nu coincid',
        description: 'Te rugăm să introduci aceeași parolă în ambele câmpuri.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Eroare',
          description: error.message,
        });
        return;
      }

      toast({
        title: 'Parolă actualizată',
        description: 'Parola ta a fost schimbată cu succes.',
      });

      navigate('/auth/login');
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
                Parolă nouă
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Introdu noua ta parolă
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Parolă nouă</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minim 6 caractere"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmă parola</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repetă parola"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C6A248] hover:from-[#C6A248] hover:to-[#C6A248] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Se actualizează...' : 'Salvează parola nouă'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
