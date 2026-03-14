import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, BookOpen, User, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { coursesData } from '@/data/courses';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
];

const steps = [
  { label: 'Campus', icon: MapPin },
  { label: 'Course', icon: BookOpen },
  { label: 'Details', icon: User },
  { label: 'Confirm', icon: CheckCircle2 },
];

const BookAppointment = () => {
  const [step, setStep] = useState(0);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [form, setForm] = useState({
    campus_id: '', course_interest: '', full_name: '', email: '', phone: '',
    preferred_date: undefined as Date | undefined, preferred_time: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from('campuses').select('*').eq('is_active', true).then(({ data }) => setCampuses(data || []));
  }, []);

  const selectedCampus = campuses.find(c => c.id === form.campus_id);

  const canNext = () => {
    if (step === 0) return !!form.campus_id;
    if (step === 1) return !!form.course_interest;
    if (step === 2) return !!form.full_name && !!form.email && !!form.preferred_date && !!form.preferred_time;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from('appointments').insert({
      campus_id: form.campus_id,
      course_interest: form.course_interest,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
      preferred_date: form.preferred_date ? format(form.preferred_date, 'yyyy-MM-dd') : null,
      preferred_time: form.preferred_time,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: 'Could not book appointment. Please try again.', variant: 'destructive' });
    } else {
      setSubmitted(true);
      // Send confirmation email
      const courseTitle = coursesData.find(c => c.slug === form.course_interest)?.title || form.course_interest;
      supabase.functions.invoke('send-transactional-email', {
        body: {
          template: 'appointment-confirmation',
          recipientEmail: form.email,
          fullName: form.full_name,
          campusName: selectedCampus?.name || '',
          courseInterest: courseTitle,
          preferredDate: form.preferred_date ? format(form.preferred_date, 'PPP') : '',
          preferredTime: form.preferred_time,
        },
      }).catch(console.error);
      // Send SMS confirmation if phone provided
      if (form.phone) {
        supabase.functions.invoke('send-sms', {
          body: {
            to: form.phone,
            message: `Hi ${form.full_name}, your appointment at ${selectedCampus?.name || 'our campus'} on ${form.preferred_date ? format(form.preferred_date, 'PPP') : ''} at ${form.preferred_time} is confirmed. — EduForYou`,
            recipientName: form.full_name,
          },
        }).catch(console.error);
      }
      // Track abandoned cart recovery
      if (form.email) {
        await supabase.from('abandoned_carts').update({ recovered: true }).eq('email', form.email).eq('product_type', 'appointment');
      }
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 text-center max-w-lg">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
              <CheckCircle2 className="w-20 h-20 text-success mx-auto" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Appointment Booked!</h1>
            <p className="text-muted-foreground mb-2">
              We've received your booking for <strong>{selectedCampus?.name}</strong> campus.
            </p>
            <p className="text-muted-foreground mb-6">
              {form.preferred_date && format(form.preferred_date, 'PPP')} at {form.preferred_time}
            </p>
            <p className="text-sm text-muted-foreground">We'll send a confirmation to <strong>{form.email}</strong></p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Book an Appointment" description="Visit one of our campuses and speak with an advisor. Book your free consultation appointment today." canonical="https://eduforyou.co.uk/book-appointment" />
      <section className="py-12 bg-background min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground text-center mb-8">Visit one of our campuses and speak with an advisor</p>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  i <= step ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={cn("text-sm font-medium hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                {i < steps.length - 1 && <div className={cn("w-8 md:w-16 h-0.5 mx-1", i < step ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {/* Step 0: Campus */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Select a Campus</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {campuses.map(c => (
                      <div key={c.id} onClick={() => setForm({ ...form, campus_id: c.id })}
                        className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
                          form.campus_id === c.id ? "border-primary bg-primary/5" : "border-border"
                        )}>
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.address_line1}, {c.city}</p>
                        <p className="text-xs text-muted-foreground">{c.postcode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Course */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">What course are you interested in?</h2>
                  <Select value={form.course_interest} onValueChange={v => setForm({ ...form, course_interest: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a course..." /></SelectTrigger>
                    <SelectContent>
                      {coursesData.map(c => (
                        <SelectItem key={c.slug} value={c.slug}>{c.title} ({c.level})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Your Details</h2>
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="John Smith" />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+44 7xxx xxx xxx" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.preferred_date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.preferred_date ? format(form.preferred_date, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={form.preferred_date} onSelect={d => setForm({ ...form, preferred_date: d })}
                            disabled={d => d < new Date()} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Preferred Time *</Label>
                      <Select value={form.preferred_time} onValueChange={v => setForm({ ...form, preferred_time: v })}>
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Confirm Your Appointment</h2>
                  <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Campus</span><span className="font-medium text-foreground">{selectedCampus?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="font-medium text-foreground">{coursesData.find(c => c.slug === form.course_interest)?.title || form.course_interest}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{form.full_name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-foreground">{form.email}</span></div>
                    {form.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">{form.phone}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{form.preferred_date && format(form.preferred_date, 'PPP')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium text-foreground">{form.preferred_time}</span></div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookAppointment;
