import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2 } from 'lucide-react';

const IkigaiSignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('contacts' as any).insert({
        full_name: name,
        email,
        phone: phone || null,
        course_interest: 'webinar-ikigai',
        source: 'webinar-signup',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Înscriere reușită!',
        description: 'Te-ai înscris cu succes la webinarul IKIGAI.',
      });
    } catch (err: any) {
      const isDuplicate = err?.message?.includes('duplicate') || err?.code === '23505';
      if (isDuplicate) {
        setSubmitted(true);
        toast({
          title: 'Deja înscris',
          description: 'Acest email este deja înregistrat pentru webinar.',
        });
      } else {
        toast({
          title: 'Eroare',
          description: 'A apărut o eroare. Te rugăm să încerci din nou.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-green-50 p-8 text-center">
        <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
        <h3 className="text-xl font-bold text-gray-900">Felicitări!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Te-ai înscris cu succes la webinarul IKIGAI. Vei primi un email de confirmare în curând.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-lg md:p-8">
      <h3 className="mb-1 text-xl font-bold text-gray-900">
        Înscrie-te la Webinar
      </h3>
      <p className="mb-6 text-sm text-gray-600">
        Completează formularul pentru a-ți rezerva locul gratuit.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Numele complet *
          </label>
          <Input
            type="text"
            placeholder="Ex: Ion Popescu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Adresa de email *
          </label>
          <Input
            type="email"
            placeholder="email@exemplu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Telefon (opțional)
          </label>
          <Input
            type="tel"
            placeholder="+44 7XXX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !name || !email}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C6A248] py-6 text-base font-semibold text-white hover:from-[#C6A248] hover:to-[#C6A248]"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Rezervă Locul Gratuit'
          )}
        </Button>
      </form>

      <p className="mt-3 text-center text-xs text-gray-400">
        100% gratuit. Datele tale sunt protejate conform GDPR.
      </p>
    </div>
  );
};

export default IkigaiSignupForm;
