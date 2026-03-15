import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'dark' | 'light' | 'inline' | 'card';
}

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
};

const NewsletterForm = ({ variant = 'light' }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !gdprAccepted) return;

    setLoading(true);
    try {
      const utm = getUtmParams();
      const { error } = await supabase.from('newsletter_subscribers' as any).insert({
        email,
        name: name || null,
        gdpr_accepted: true,
        ...utm,
        subscribed_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Succes!',
        description: 'Te-ai abonat cu succes la newsletter.',
      });
    } catch (err: any) {
      const isDuplicate = err?.message?.includes('duplicate') || err?.code === '23505';
      toast({
        title: isDuplicate ? 'Deja abonat' : 'Eroare',
        description: isDuplicate
          ? 'Acest email este deja abonat la newsletter.'
          : 'A apărut o eroare. Te rugăm să încerci din nou.',
        variant: isDuplicate ? 'default' : 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg p-6 text-center',
          variant === 'dark' ? 'bg-gray-800 text-white' : 'bg-green-50 text-green-800',
          variant === 'card' && 'border shadow-sm'
        )}
      >
        <div className="mb-2 text-3xl">&#10003;</div>
        <p className="text-lg font-semibold">Mulțumim pentru abonare!</p>
        <p className="mt-1 text-sm opacity-80">Vei primi cele mai noi informații pe email.</p>
      </div>
    );
  }

  const isDark = variant === 'dark';
  const isInline = variant === 'inline';
  const isCard = variant === 'card';

  return (
    <div
      className={cn(
        'rounded-lg',
        isDark && 'bg-gray-900 p-6 text-white',
        !isDark && !isInline && 'bg-white p-6',
        isCard && 'border shadow-sm',
        isInline && 'bg-transparent'
      )}
    >
      {!isInline && (
        <div className="mb-4">
          <h3
            className={cn(
              'text-lg font-semibold',
              isDark ? 'text-white' : 'text-gray-900'
            )}
          >
            Abonează-te la Newsletter
          </h3>
          <p
            className={cn(
              'mt-1 text-sm',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}
          >
            Primește cele mai noi oportunități de studii gratuite în UK.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={cn(isInline ? 'flex items-end gap-2' : 'space-y-3')}>
        {!isInline && (
          <Input
            type="text"
            placeholder="Numele tău (opțional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(isDark && 'border-gray-700 bg-gray-800 text-white placeholder:text-gray-500')}
          />
        )}

        <Input
          type="email"
          placeholder="Adresa ta de email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn(
            isInline && 'flex-1',
            isDark && 'border-gray-700 bg-gray-800 text-white placeholder:text-gray-500'
          )}
        />

        <div className={cn('flex items-start gap-2', isInline && 'hidden')}>
          <Checkbox
            id="gdpr-newsletter"
            checked={gdprAccepted}
            onCheckedChange={(checked) => setGdprAccepted(checked === true)}
            className={cn(isDark && 'border-gray-600')}
          />
          <label
            htmlFor="gdpr-newsletter"
            className={cn(
              'text-xs leading-tight',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            Sunt de acord cu prelucrarea datelor personale conform GDPR.
          </label>
        </div>

        {isInline && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="gdpr-newsletter-inline"
              checked={gdprAccepted}
              onCheckedChange={(checked) => setGdprAccepted(checked === true)}
            />
            <label htmlFor="gdpr-newsletter-inline" className="whitespace-nowrap text-xs text-gray-500">
              GDPR
            </label>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !email || !gdprAccepted}
          className={cn(
            'w-full',
            isInline && 'w-auto',
            isDark
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Abonează-te
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterForm;
