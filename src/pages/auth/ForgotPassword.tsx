import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Eroare',
          description: error.message,
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: 'Email trimis',
        description: 'Verifică-ți emailul pentru instrucțiuni de resetare.',
      });
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

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#D4AF37]/10 via-white to-[#D4AF37]/10">
          <Card className="w-full max-w-md shadow-xl border-0 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Verifică-ți emailul
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Am trimis instrucțiuni de resetare a parolei la{' '}
                <strong>{email}</strong>. Verifică și folderul de spam.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center text-[#C6A248] hover:text-[#C6A248] font-medium hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la autentificare
              </Link>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

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
                Resetare parolă
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Introdu emailul asociat contului tău
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
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Se trimite...' : 'Trimite link de resetare'}
              </Button>

              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center text-sm text-gray-500 hover:text-[#C6A248]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la autentificare
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
