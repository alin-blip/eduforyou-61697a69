import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { ArrowRight, ArrowLeft, CheckCircle2, User, Phone, MapPin, BookOpen, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackLead } from '@/lib/tracking';

const META_PIXEL_ID = '1930929073773570';

const steps = [
  { id: 'residence', icon: MapPin },
  { id: 'personal', icon: User },
  { id: 'contact', icon: Phone },
  { id: 'course', icon: BookOpen },
  { id: 'result', icon: CheckCircle2 },
];

const residenceOptions = [
  'UK/Irish Citizen',
  'Settled Status (EU)',
  'Pre-settled Status (EU)',
  'Indefinite Leave to Remain',
  'Refugee Status',
  'Other / Not Sure',
];

const courseOptions = [
  'Business & Management',
  'Computing & Technology',
  'Psychology & Counselling',
  'Health & Social Care',
  'Construction Management',
  'Accounting & Finance',
  'Not Sure Yet',
];

const EligibilityPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    residence: '', fullName: '', phone: '', email: '', dob: '', course: '',
  });

  // Account creation state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const pixelFiredRef = useRef(false);

  // Fire Lead pixel when reaching step 4
  useEffect(() => {
    if (step === 4 && !pixelFiredRef.current) {
      pixelFiredRef.current = true;

      // Meta Pixel Lead event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'eligibility_quiz',
          content_category: form.course,
        });
      }

      // GA4 Lead event
      trackLead('eligibility_quiz', { course: form.course, residence: form.residence });
    }
  }, [step, form.course, form.residence]);

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const canNext = () => {
    switch (step) {
      case 0: return !!form.residence;
      case 1: return !!form.fullName && !!form.dob;
      case 2: return !!form.phone && !!form.email;
      case 3: return !!form.course;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    let didTimeout = false;
    const safetyTimeout = window.setTimeout(() => {
      didTimeout = true;
      setSubmitting(false);
      toast({
        title: 'Error',
        description: 'Request timed out. Please try again.',
        variant: 'destructive',
      });
    }, 25000);

    try {
      console.log('[Eligibility] Inserting contact...');
      const { error: contactError } = await supabase.from('contacts').insert({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        residence_status: form.residence,
        course_interest: form.course,
        date_of_birth: form.dob || null,
        source: 'eligibility_quiz',
      });
      console.log('[Eligibility] Contact insert done', { contactError });

      if (contactError) throw contactError;

      // Fire-and-forget quiz result insert
      supabase.from('quiz_results').insert({
        quiz_type: 'eligibility',
        answers: form as any,
        result: { eligible: form.residence !== 'Other / Not Sure' },
      }).then(({ error }) => {
        if (error) console.error('Eligibility quiz result insert failed:', error);
      });

      if (!didTimeout) setStep(4);
    } catch (err: any) {
      if (!didTimeout) {
        toast({
          title: 'Error',
          description: err?.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      window.clearTimeout(safetyTimeout);
      setSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setCreatingAccount(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password,
        options: {
          data: { full_name: form.fullName },
        },
      });

      if (error) throw error;

      setAccountCreated(true);
      toast({
        title: 'Account created!',
        description: 'Check your email to verify your account, then you can log in.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingAccount(false);
    }
  };

  const isEligible = form.residence !== 'Other / Not Sure';

  return (
    <Layout>
      <SEOHead title="Check Your Eligibility" description="Find out if you qualify for free UK university education in 2 minutes. Take our eligibility quiz now." canonical="/eligibilitate" />
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('eligibility.title')}
          </h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">{t('eligibility.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-1 w-8 md:w-16 mx-1 rounded transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">What is your residence status?</h2>
                  <p className="text-muted-foreground mb-6">Select the option that best describes your current UK residency status.</p>
                  <div className="space-y-3">
                    {residenceOptions.map(opt => (
                      <button key={opt} onClick={() => updateForm('residence', opt)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                          form.residence === opt ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-foreground hover:border-primary/30'
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt}</span>
                          {form.residence === opt && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Personal Details</h2>
                  <p className="text-muted-foreground mb-6">Tell us a bit about yourself.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                      <input type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Date of Birth *</label>
                      <input type="date" value={form.dob} onChange={(e) => updateForm('dob', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Contact Information</h2>
                  <p className="text-muted-foreground mb-6">How can we reach you?</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+44 7XXX XXXXXX" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Email Address *</label>
                      <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">What would you like to study?</h2>
                  <p className="text-muted-foreground mb-6">Choose the area that interests you most.</p>
                  <div className="space-y-3">
                    {courseOptions.map(opt => (
                      <button key={opt} onClick={() => updateForm('course', opt)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                          form.course === opt ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-foreground hover:border-primary/30'
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt}</span>
                          {form.course === opt && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10">
                  {isEligible ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </div>
                      <h2 className="font-display text-3xl font-bold text-foreground mb-4">Great News! You're Likely Eligible!</h2>
                      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Based on your answers, you appear to meet the eligibility criteria for UK university education with Student Finance. A consultant will contact you within 24 hours.
                      </p>
                      <div className="bg-card rounded-xl p-6 border border-border max-w-md mx-auto mb-8">
                        <div className="space-y-2 text-sm text-left">
                          <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium text-foreground">{form.fullName}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><span className="font-medium text-foreground">{form.residence}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Interest:</span><span className="font-medium text-foreground">{form.course}</span></div>
                        </div>
                      </div>

                      {/* Account creation section */}
                      {!accountCreated ? (
                        <div className="bg-card rounded-xl p-6 border border-border max-w-md mx-auto text-left">
                          <div className="flex items-center gap-2 mb-3">
                            <Lock className="w-5 h-5 text-primary" />
                            <h3 className="font-display text-lg font-semibold text-foreground">Create Your Account</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Set a password to access your student dashboard and track your application progress.
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Password *</label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Min. 6 characters"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Confirm Password *</label>
                              <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Re-enter password"
                              />
                            </div>
                            <Button
                              onClick={handleCreateAccount}
                              disabled={creatingAccount || !password || !confirmPassword}
                              className="w-full bg-primary hover:bg-orange-dark text-primary-foreground gap-2"
                            >
                              {creatingAccount ? 'Creating Account...' : 'Create Account'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-success/10 rounded-xl p-6 border border-success/20 max-w-md mx-auto">
                          <div className="flex items-center gap-2 justify-center">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            <p className="font-medium text-foreground">Account created! Check your email to verify.</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="font-display text-3xl font-bold text-foreground mb-4">Let's Discuss Your Options</h2>
                      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Your situation may require a more detailed assessment. Our team will review your case personally and explore all possible options.
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="bg-primary hover:bg-orange-dark text-primary-foreground gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canNext() || submitting} className="bg-primary hover:bg-orange-dark text-primary-foreground gap-2">
                  {submitting ? 'Submitting...' : 'Submit'} <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EligibilityPage;
