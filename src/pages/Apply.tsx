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

const LOCATIONS = ['London', 'Birmingham', 'Manchester', 'Leeds', 'Other location'];
const COURSES = [
  'Business Management',
  'Computing & IT',
  'Health & Social Care',
  'Psychology',
  'Construction Management',
  'Accounting & Finance',
  'Tourism Management',
  'Entrepreneurship',
  'Cyber Security',
  "Not sure yet",
];
const SCHEDULES = [
  '1 day campus + 1 day online (Hybrid)',
  'Evenings 18:00–20:00 (2 days/week)',
  '4 hours/week on campus',
  'Not sure yet',
];
const ASSESSMENTS = [
  'Group workshop (6 people)',
  'One-day demo class',
  'No written test (interview + reading)',
  'Not sure / I want to find out more',
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

const ApplyPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      newErrors.full_name = 'Please enter your full name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      newErrors.email = 'Please enter a valid email address.';
    if (!form.location) newErrors.location = 'Please select your location.';
    if (!form.course) newErrors.course = 'Please select a course.';
    if (!form.schedule) newErrors.schedule = 'Please select a schedule.';
    if (!form.assessment) newErrors.assessment = 'Please select an assessment preference.';
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
        source: 'apply_form_en',
        notes: [
          `Location: ${form.location}`,
          `Course: ${form.course}`,
          `Schedule: ${form.schedule}`,
          `Assessment: ${form.assessment}`,
          `Language: en`,
        ].join(' | '),
        course_interest: form.course,
        status: 'new',
      });

      if (error) throw error;

      // Fire tracking events
      trackLead('apply_form_en', {
        location: form.location,
        course: form.course,
        language: 'en',
      });

      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'apply_form_submit',
          language: 'en',
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
            subject: `Application — ${form.course}`,
            message: `Thank you for applying to EduForYou! We received your application for ${form.course} in ${form.location}. An advisor will contact you within 24 hours.`,
          },
        })
        .catch(() => {/* silently ignore */});

      setSubmitted(true);
    } catch (err: any) {
      console.error('[Apply] Submit error:', err);
      toast({
        title: 'Something went wrong',
        description: err?.message || 'Please try again or contact us directly.',
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
        title="Apply Now — Free UK University Education"
        description="Apply to EduForYou and start your UK university journey. Free guidance, Student Finance support, 94% success rate. No hidden fees, ever."
        canonical="/apply"
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
              Free Application — No Hidden Fees
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Start Your UK University{' '}
              <em className="text-gold not-italic">Journey Today</em>
            </h1>
            <p className="text-secondary-foreground/70 text-lg max-w-xl mx-auto mb-10">
              Fill in the form below and one of our advisors will contact you within 24 hours — completely free.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { value: '7,000+', label: 'Students helped' },
                { value: '94%', label: 'Success rate' },
                { value: '£25K', label: 'Max/year Student Finance' },
                { value: '100%', label: 'Free service' },
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
                      Your Application Details
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      All fields are required. Takes{' '}
                      <span className="text-gold font-semibold">under 2 minutes</span> to complete.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="full_name" className="text-sm font-semibold">
                        Full Name <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="e.g. John Smith"
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
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address <span className="text-gold">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setField('email', e.target.value)}
                        className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs">{errors.email}</p>
                      )}
                    </div>

                    {/* Location + Course */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Location <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.location} onValueChange={v => setField('location', v)}>
                          <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            {LOCATIONS.map(l => (
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
                          Desired Course <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.course} onValueChange={v => setField('course', v)}>
                          <SelectTrigger className={errors.course ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {COURSES.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.course && (
                          <p className="text-destructive text-xs">{errors.course}</p>
                        )}
                      </div>
                    </div>

                    {/* Schedule + Assessment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">
                          Preferred Schedule <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.schedule} onValueChange={v => setField('schedule', v)}>
                          <SelectTrigger className={errors.schedule ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCHEDULES.map(s => (
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
                          Preferred Assessment <span className="text-gold">*</span>
                        </Label>
                        <Select value={form.assessment} onValueChange={v => setField('assessment', v)}>
                          <SelectTrigger className={errors.assessment ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSESSMENTS.map(a => (
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
                        className="w-full bg-orange hover:bg-orange-dark text-white font-bold text-base h-14 shadow-lg shadow-orange/25 transition-all hover:-translate-y-0.5"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send My Application
                          </>
                        )}
                      </Button>
                      <p className="text-muted-foreground text-xs text-center leading-relaxed">
                        By submitting you agree to our{' '}
                        <Link to="/legal/privacy" className="text-gold hover:underline">
                          Privacy Policy
                        </Link>
                        . This is a <strong>100% free</strong> service — no hidden fees, ever.
                      </p>
                    </div>
                  </form>
                </div>

                {/* Trust bar */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                  {[
                    { icon: Shield, text: '100% Secure & Confidential' },
                    { icon: Clock, text: 'Response within 24 hours' },
                    { icon: BadgeCheck, text: 'No hidden fees — ever' },
                    { icon: Users, text: '7,000+ students helped' },
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
                    Application Received!
                  </h2>
                  <p className="text-muted-foreground text-base max-w-md mx-auto mb-8 leading-relaxed">
                    Thank you — your application has been submitted successfully. An EduForYou advisor will contact you at{' '}
                    <strong className="text-gold">{form.email}</strong> within{' '}
                    <strong className="text-foreground">24 hours</strong>.
                  </p>

                  <div className="space-y-3 max-w-sm mx-auto mb-8 text-left">
                    {[
                      { n: 1, title: 'Check your inbox', desc: "You'll receive a confirmation email shortly." },
                      { n: 2, title: 'Advisor call', desc: "We'll call you within 24 hours to discuss your options." },
                      { n: 3, title: 'Start your journey', desc: "We'll guide you from enrolment to graduation — free." },
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
                      Back to EduForYou
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

export default ApplyPage;
