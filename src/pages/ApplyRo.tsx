import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Loader2, ArrowLeft, Shield, Clock, Users, BadgeCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackLead } from '@/lib/tracking';

const LOCATII = ['Londra', 'Birmingham', 'Manchester', 'Leeds', 'Altă locație'];
const CURSURI = [
  'Management în Afaceri',
  'Informatică și IT',
  'Sănătate și Asistență Socială',
  'Psihologie',
  'Management în Construcții',
  'Contabilitate și Finanțe',
  'Management în Turism',
  'Antreprenoriat',
  'Securitate Cibernetică',
  'Nu știu încă',
];
const PROGRAME = [
  '1 zi campus + 1 zi online (Hibrid)',
  'Seara 18:00–20:00 (2 zile/săpt.)',
  '4 ore/săpt. în campus',
  'Nu știu încă',
];
const TESTE = [
  'Workshop în grup de 6 persoane',
  'O zi de curs demonstrativ',
  'Fără test scris (interviu + citit)',
  'Nu știu / Vreau să aflu mai multe',
];

interface FormState {
  full_name: string;
  email: string;
  location: string;
  course: string;
  schedule: string;
  assessment: string;
}

const INITIAL_FORM: FormState = {
  full_name: '',
  email: '',
  location: '',
  course: '',
  schedule: '',
  assessment: '',
};

const ApplyRoPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      newErrors.full_name = 'Te rugăm să introduci numele complet.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      newErrors.email = 'Te rugăm să introduci o adresă de email validă.';
    if (!form.location) newErrors.location = 'Te rugăm să selectezi locația.';
    if (!form.course) newErrors.course = 'Te rugăm să selectezi cursul dorit.';
    if (!form.schedule) newErrors.schedule = 'Te rugăm să selectezi programul dorit.';
    if (!form.assessment) newErrors.assessment = 'Te rugăm să selectezi preferința pentru test.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Save to Supabase contacts table
      const { error } = await supabase.from('contacts').insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        source: 'apply_form_ro',
        notes: [
          `Locație: ${form.location}`,
          `Curs: ${form.course}`,
          `Program: ${form.schedule}`,
          `Test: ${form.assessment}`,
          `Limbă: ro`,
        ].join(' | '),
        course_interest: form.course,
        status: 'new',
      });

      if (error) throw error;

      // Fire tracking events
      trackLead('apply_form_ro', {
        location: form.location,
        course: form.course,
        language: 'ro',
      });

      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'apply_form_submit',
          language: 'ro',
          form_location: form.location,
          form_course: form.course,
        });
      }

      // Send confirmation email (fire-and-forget)
      supabase.functions
        .invoke('send-transactional-email', {
          body: {
            template: 'contact-confirmation',
            recipientEmail: form.email.trim(),
            fullName: form.full_name.trim(),
            subject: `Aplicație — ${form.course}`,
            message: `Îți mulțumim că ai aplicat la EduForYou! Am primit aplicația ta pentru ${form.course} în ${form.location}. Un consilier te va contacta în maxim 24 de ore.`,
          },
        })
        .catch(() => {/* silently ignore */});

      setSubmitted(true);
    } catch (err: any) {
      console.error('[ApplyRo] Submit error:', err);
      toast({
        title: 'Ceva nu a mers bine',
        description: err?.message || 'Te rugăm să încerci din nou sau să ne contactezi direct.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  return (
    <Layout>
      <SEOHead
        title="Aplică acum — Fără costuri, Fără test scris"
        description="Aplică la EduForYou și începe-ți parcursul universitar în UK. Consiliere gratuită, Student Finance, rată de succes 94%. Fără costuri ascunse, niciodată."
        canonical="/ro/apply"
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,165,54,0.08),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Aplicație Gratuită — Fără Costuri Ascunse
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Aplică acum —{' '}
              <em className="text-gold not-italic">Fără costuri, Fără test scris</em>
            </h1>
            <p className="text-secondary-foreground/70 text-lg max-w-xl mx-auto mb-10">
              Completează formularul de mai jos și unul dintre consilierii noștri te va contacta în 24 de ore — complet gratuit.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { value: '7.000+', label: 'Studenți ajutați' },
                { value: '94%', label: 'Rată de succes' },
                { value: '£25K', label: 'Max/an Student Finance' },
                { value: '100%', label: 'Serviciu gratuit' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="font-display text-3xl font-bold text-gold leading-none">{stat.value}</span>
                  <span className="text-secondary-foreground/60 text-sm mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Form / Success ────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg">
                  <div className="mb-8 pb-6 border-b border-border">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                      Detaliile aplicației tale
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Toate câmpurile sunt obligatorii. Durează{' '}
                      <span className="text-gold font-semibold">sub 2 minute</span>.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Nume complet */}
                    <div className="space-y-1.5">
                      <Label htmlFor="full_name_ro" className="text-sm font-semibold">
                        Nume complet <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="full_name_ro"
                        type="text"
                        placeholder="ex. Ion Popescu"
                        value={form.full_name}
                        onChange={e => setField('full_name', e.target.value)}
                        className={errors.full_name ? 'border-destructive focus-visible:ring-destructive' : ''}
                        autoComplete="name"
                      />
                      {errors.full_name && (
                        <p className="text-destructive text-xs">{errors.full_name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email_ro" className="text-sm font-semibold">
                        Adresă de email <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="email_ro"
                        type="email"
                        placeholder="emailul@tau.com"
                        value={form.email}
                        onChange={e => setField('email', e.target.value)}
                        className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs">{errors.email}</p>
                      )}
                    </div>

                    {/* Locație + Curs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Locație <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.location} onValueChange={v => setField('location', v)}>
                          <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selectează orașul" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATII.map(l => (
                              <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.location && (
                          <p className="text-destructive text-xs">{errors.location}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Curs dorit <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.course} onValueChange={v => setField('course', v)}>
                          <SelectTrigger className={errors.course ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selectează un curs" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURSURI.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.course && (
                          <p className="text-destructive text-xs">{errors.course}</p>
                        )}
                      </div>
                    </div>

                    {/* Program + Test */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Program dorit <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.schedule} onValueChange={v => setField('schedule', v)}>
                          <SelectTrigger className={errors.schedule ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selectează un program" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROGRAME.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.schedule && (
                          <p className="text-destructive text-xs">{errors.schedule}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Test preferat <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.assessment} onValueChange={v => setField('assessment', v)}>
                          <SelectTrigger className={errors.assessment ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Selectează o opțiune" />
                          </SelectTrigger>
                          <SelectContent>
                            {TESTE.map(a => (
                              <SelectItem key={a} value={a}>{a}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.assessment && (
                          <p className="text-destructive text-xs">{errors.assessment}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2 space-y-3">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="w-full bg-orange hover:bg-gold-dark text-white font-bold text-base h-14 shadow-lg shadow-orange/25 transition-all hover:-translate-y-0.5"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Se trimite…
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Trimite aplicația
                          </>
                        )}
                      </Button>
                      <p className="text-muted-foreground text-xs text-center leading-relaxed">
                        Prin trimiterea formularului ești de acord cu{' '}
                        <Link to="/legal/privacy" className="text-gold hover:underline">
                          Politica de Confidențialitate
                        </Link>
                        . Acesta este un serviciu <strong>100% gratuit</strong> — fără costuri ascunse, niciodată.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Trust bar */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                  {[
                    { icon: Shield, text: '100% Securizat și Confidențial' },
                    { icon: Clock, text: 'Răspuns în 24 de ore' },
                    { icon: BadgeCheck, text: 'Fără costuri ascunse — niciodată' },
                    { icon: Users, text: '7.000+ studenți ajutați' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div className="bg-card border border-green-500/30 rounded-2xl p-8 md:p-12 text-center shadow-lg shadow-green-500/5">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                    Aplicație primită!
                  </h2>
                  <p className="text-muted-foreground text-base max-w-md mx-auto mb-8 leading-relaxed">
                    Îți mulțumim — aplicația ta a fost trimisă cu succes. Un consilier EduForYou te va contacta la{' '}
                    <strong className="text-gold">{form.email}</strong> în maxim{' '}
                    <strong className="text-foreground">24 de ore</strong>.
                  </p>

                  <div className="space-y-3 max-w-sm mx-auto mb-8 text-left">
                    {[
                      { n: 1, title: 'Verifică-ți inbox-ul', desc: 'Vei primi un email de confirmare în scurt timp.' },
                      { n: 2, title: 'Apel cu consilierul', desc: 'Te vom suna în 24 de ore pentru a-ți prezenta opțiunile.' },
                      { n: 3, title: 'Începe parcursul tău', desc: 'Te ghidăm de la înscriere până la absolvire — gratuit.' },
                    ].map(({ n, title, desc }) => (
                      <div key={n} className="flex items-start gap-3 bg-muted/40 rounded-xl p-3.5 border border-border">
                        <span className="w-6 h-6 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {n}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{title}</p>
                          <p className="text-muted-foreground text-xs">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-navy">
                    <Link to="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Înapoi la EduForYou
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default ApplyRoPage;
