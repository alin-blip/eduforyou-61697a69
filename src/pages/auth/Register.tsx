import { useState, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const AGENT_APPLICATION_WEBHOOK_URL =
  import.meta.env.VITE_N8N_AGENT_APPLICATION_WEBHOOK ||
  'https://eduforyou.app.n8n.cloud/webhook/agent-application';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const leadSource = searchParams.get('source');
  const isAgentLead = leadSource === 'agents';

  const sendAgentLeadToN8n = async () => {
    if (!isAgentLead) return;

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: '',
      occupation: 'Agent signup via /agents',
      salesExperience: '',
      experienceDetails: '',
      networkSize: '',
      whyAgent: 'Lead capturat din fluxul /agents → /auth/register',
      howHeard: 'eduforyou.co.uk/agents',
    };

    const response = await fetch(AGENT_APPLICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook n8n a răspuns cu status ${response.status}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!gdprConsent) {
      toast({
        variant: 'destructive',
        title: 'Consimțământ necesar',
        description: 'Trebuie să accepți politica de confidențialitate pentru a continua.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Parolă prea scurtă',
        description: 'Parola trebuie să aibă cel puțin 6 caractere.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Eroare la înregistrare',
          description: error.message,
        });
        return;
      }

      await sendAgentLeadToN8n();

      setIsSuccess(true);
      toast({
        title: 'Cont creat cu succes!',
        description: 'Verifică-ți emailul pentru a confirma contul.',
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
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Verifică-ți emailul
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Am trimis un link de confirmare la <strong>{email}</strong>.
                Accesează linkul din email pentru a-ți activa contul.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link
                to="/auth/login"
                className="text-[#C6A248] hover:text-[#C6A248] font-medium hover:underline"
              >
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
                Creează cont
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                {isAgentLead ? 'Înregistrează-te ca agent EduForYou' : 'Înregistrează-te pe EduForYou'}
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nume complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ion Popescu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>

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
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parolă</Label>
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

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="gdpr"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => setGdprConsent(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="gdpr" className="text-sm leading-snug text-gray-600 cursor-pointer">
                  Sunt de acord cu{' '}
                  <Link to="/privacy" className="text-[#C6A248] hover:underline">
                    politica de confidențialitate
                  </Link>{' '}
                  și prelucrarea datelor personale conform GDPR.
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C6A248] hover:from-[#C6A248] hover:to-[#C6A248] text-white"
                disabled={isLoading || !gdprConsent}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Se creează contul...' : 'Creează cont'}
              </Button>

              <p className="text-sm text-center text-gray-500">
                Ai deja cont?{' '}
                <Link
                  to="/auth/login"
                  className="text-[#C6A248] hover:text-[#C6A248] font-medium hover:underline"
                >
                  Autentifică-te
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
