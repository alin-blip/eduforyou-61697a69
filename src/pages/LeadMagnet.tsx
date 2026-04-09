import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Download,
  CheckCircle2,
  BookOpen,
  Loader2,
  Shield,
  PoundSterling,
  Lightbulb,
} from 'lucide-react';

interface GuideConfig {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  icon: typeof BookOpen;
  gradient: string;
  leadMagnet: string;
}

const guidesConfig: Record<string, GuideConfig> = {
  'ghid-gratuit': {
    title: 'Ghidul Gratuit pentru Studii în UK',
    subtitle: 'Tot ce trebuie să știi ca român în UK',
    description:
      'Descarcă ghidul nostru gratuit și descoperă pas cu pas cum poți accesa studii universitare finanțate integral prin Student Finance England.',
    benefits: [
      'Explicație completă Student Finance England',
      'Lista universităților și programelor disponibile',
      'Cerințe de eligibilitate detaliate',
      'Pași practici pentru aplicare',
      'Sfaturi de la studenți care au reușit',
    ],
    icon: BookOpen,
    gradient: 'from-[#D4AF37] to-[#C6A248]',
    leadMagnet: 'ghid-gratuit',
  },
  'ghid-finantare': {
    title: 'Ghidul de Finanțare SFE',
    subtitle: 'Maximizează finanțarea ta studentească',
    description:
      'Află exact cum funcționează Student Finance England, cât poți obține și cum să maximizezi împrumutul de întreținere.',
    benefits: [
      'Calculul exact al finanțării disponibile',
      'Cum să obții împrumutul de întreținere maxim',
      'Strategii de optimizare financiară',
      'Condiții de rambursare explicate simplu',
      'Greșeli frecvente de evitat',
    ],
    icon: PoundSterling,
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
    leadMagnet: 'ghid-finantare',
  },
  'ghid-transformare': {
    title: 'Ghidul de Transformare Profesională',
    subtitle: 'De la jobul actual la cariera visată',
    description:
      'Un ghid practic care te ajută să îți planifici tranziția de la jobul actual la o carieră bazată pe o diplomă universitară din UK.',
    benefits: [
      'Exerciții de auto-evaluare profesională',
      'Cum să alegi programul potrivit',
      'Plan de tranziție pas cu pas',
      'Strategii de echilibrare studii-muncă',
      'Studii de caz cu povești reale',
    ],
    icon: Lightbulb,
    gradient: 'from-[#C6A248] to-[#0A1628]',
    leadMagnet: 'ghid-transformare',
  },
};

function getGuideSlug(): string {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] || 'ghid-gratuit';
  return slug;
}

const LeadMagnet = () => {
  const slug = getGuideSlug();
  const guide = guidesConfig[slug] || guidesConfig['ghid-gratuit'];
  const Icon = guide.icon;

  const [form, setForm] = useState({ name: '', email: '' });
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !gdpr) {
      toast({
        title: 'Eroare',
        description: 'Completează email-ul și acceptă politica GDPR.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: form.email,
        name: form.name || null,
        source: 'lead-magnet',
        lead_magnet: guide.leadMagnet,
        gdpr_consent: true,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Succes!', description: 'Ghidul a fost trimis pe email.' });
    } catch (err: any) {
      toast({ title: 'Eroare', description: err.message || 'A apărut o eroare.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className={`bg-gradient-to-br ${guide.gradient} text-white py-16 md:py-24`}>
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Icon className="h-14 w-14 mx-auto mb-6 text-white/90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{guide.title}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{guide.subtitle}</p>
        </div>
      </section>

      {/* Content + Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce Vei Descoperi</h2>
              <p className="text-gray-600 mb-6">{guide.description}</p>
              <div className="space-y-3 mb-8">
                {guide.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#D4AF37]/10 rounded-lg p-4 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-bold text-gray-900 text-sm">100% Gratuit</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Descarcă ghidul complet fără niciun cost. Nu îți cerem cardul.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <Card className="p-6 md:p-8 shadow-lg">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ghidul Este Pe Drum!</h3>
                    <p className="text-gray-600">
                      Verifică email-ul (și folderul Spam) pentru linkul de descărcare.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Descarcă Ghidul Gratuit
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Completează formularul și primești ghidul pe email instant.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nume (opțional)</Label>
                        <Input
                          id="name"
                          placeholder="Ion Popescu"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ion@exemplu.ro"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="gdpr"
                          checked={gdpr}
                          onCheckedChange={(checked) => setGdpr(checked === true)}
                        />
                        <Label htmlFor="gdpr" className="text-xs text-gray-500 leading-tight cursor-pointer">
                          Sunt de acord cu prelucrarea datelor personale conform{' '}
                          <a href="/legal" className="text-[#C6A248] underline">
                            Politicii de Confidențialitate
                          </a>
                          . Pot să mă dezabonez oricând.
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || !gdpr}
                        className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg py-3 gap-2"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Se procesează...</>
                        ) : (
                          <><Download className="w-5 h-5" /> Descarcă Gratuit</>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LeadMagnet;
