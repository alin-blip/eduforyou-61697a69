import { useState, FormEvent, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  PoundSterling,
  GraduationCap,
  FileText,
  UserPlus,
  Building2,
  Shield,
  BadgeCheck,
  Send,
  Briefcase,
  Mail,
} from 'lucide-react';

/* ─── colour constants (inline, no CSS-var dependency) ─── */
const NAVY = '#0A1628';
const NAVY_LIGHT = '#122040';
const GOLD = '#D4AF37';
const GOLD_DARK = '#B8960E';
const GOLD_LIGHT = '#E8CC6E';

/* ─── animation presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

/* ─── data ─── */
const roleCards = [
  {
    icon: PoundSterling,
    title: 'Salary + Commission',
    desc: 'Fixed salary plus commission per enrolled student and per recruited agent. Your execution determines your income.',
  },
  {
    icon: Users,
    title: 'Manage Agents & Companies',
    desc: 'Recruit and manage individual agents and partner companies. Build the structure. Own the result.',
  },
  {
    icon: GraduationCap,
    title: 'Student Finance Expert',
    desc: 'Master the SFE process, university applications, and document processing. Precision is non-negotiable.',
  },
];

const responsibilities = [
  {
    icon: Shield,
    title: 'Student Finance England',
    desc: 'Process funding applications with discipline. Know every eligibility criterion. Execute without error.',
  },
  {
    icon: GraduationCap,
    title: 'University Applications',
    desc: 'Navigate UCAS and partner university internal systems. Guide each application to completion.',
  },
  {
    icon: FileText,
    title: 'Document Processing',
    desc: 'Verify and process student documents — IDs, proof of address, transcripts. Structure and accuracy define you.',
  },
  {
    icon: UserPlus,
    title: 'Agent Recruitment',
    desc: 'Recruit new agents. Onboard them. Monitor their performance. Build a system that delivers results.',
  },
  {
    icon: Building2,
    title: 'Company Partnerships',
    desc: 'Identify and onboard partner companies that send students. Expand the network with vision and courage.',
  },
];

const commissionCards = [
  { label: 'Fixed Salary', value: 'Negotiable', note: 'Based on experience and proven results' },
  { label: 'Student Commission', value: 'From £500', note: 'Per enrolled student' },
  { label: 'Agent Commission', value: 'Recurring', note: 'Commission from your recruited agents\' earnings' },
  { label: 'Milestone Bonus', value: '£500', note: 'Bonus when you bring 500 students' },
];

const requirements = [
  'Experience with Student Finance England (mandatory)',
  'Knowledge of UK university enrollment process',
  'Document processing experience',
  'Strong organizational and communication skills',
  'Fluent English (Romanian is a plus)',
];

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/PLACEHOLDER_SCRIPT_ID/exec';

/* ─── component ─── */
const AdminJobPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    sfeExperience: '',
    yearsExperience: '',
    aboutExperience: '',
    heardAbout: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          position: 'Admin — Agent & Company Manager',
        }),
      });
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        sfeExperience: '',
        yearsExperience: '',
        aboutExperience: '',
        heardAbout: '',
      });
    } catch {
      setStatus('error');
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Admin — Agent & Company Manager | Careers"
        description="Join EduForYou as Admin — Agent & Company Manager. Manage agents, partner companies, and student finance operations across the UK's strongest education network."
        canonical="https://eduforyou.co.uk/careers/admin"
      />

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section style={{ background: NAVY }} className="relative overflow-hidden">
        {/* decorative gradient orb */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: GOLD }}
        />
        <div className="container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ backgroundColor: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
          >
            <BadgeCheck className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-sm font-semibold" style={{ color: GOLD }}>
              Now Hiring
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Admin —{' '}
            <span style={{ color: GOLD }}>Agent & Company Manager</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
            style={{ color: '#94a3b8' }}
          >
            We're building the strongest education network in the UK.{' '}
            <strong className="text-white">We need someone who executes.</strong>
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 font-semibold text-lg px-8 py-3.5 rounded-lg transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* ═══════════════════ 2. ROLE OVERVIEW ═══════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: NAVY }}
          >
            The Role
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
            style={{ color: '#64748b' }}
          >
            Three pillars define this position. Each demands discipline, structure, and total ownership.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleCards.map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl p-6 bg-white border transition-all duration-300 hover:shadow-lg group"
                style={{ borderColor: '#e2e8f0' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = GOLD;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${GOLD}15` }}
                >
                  <card.icon className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: NAVY }}>
                  {card.title}
                </h3>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 3. RESPONSIBILITIES ═══════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: NAVY }}
          >
            Responsibilities
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
            style={{ color: '#64748b' }}
          >
            Every responsibility below requires execution, not intention. This is what you own.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responsibilities.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl p-6 border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = GOLD;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${NAVY}10` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: NAVY }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: NAVY }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. COMMISSION STRUCTURE ═══════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: NAVY }}
          >
            Commission Structure
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
            style={{ color: '#64748b' }}
          >
            Your compensation reflects your results. No ceiling. No limits. Pure execution.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionCards.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: GOLD }}
              >
                <div className="p-1" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_LIGHT})` }}>
                  <div className="text-center py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: GOLD }}>
                      {card.label}
                    </p>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
                <div className="p-4 bg-white text-center">
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    {card.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. WHO WE'RE LOOKING FOR ═══════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: NAVY }}
          >
            Who We're Looking For
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
            style={{ color: '#64748b' }}
          >
            This role demands courage, discipline, and a vision for transformation. Read every line.
          </motion.p>

          <div className="space-y-4">
            {requirements.map((req, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg border transition-all duration-200"
                style={{ borderColor: '#e2e8f0', backgroundColor: '#fafafa' }}
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <span className="font-medium" style={{ color: NAVY }}>
                  {req}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. APPLICATION FORM ═══════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#f8fafc' }} ref={formRef}>
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ color: NAVY }}
          >
            Apply Now
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto mb-10"
            style={{ color: '#64748b' }}
          >
            Fill in every field. Precision starts here.
          </motion.p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl p-8 text-center border"
              style={{ borderColor: GOLD, backgroundColor: '#ffffff' }}
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: GOLD }} />
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: NAVY }}>
                Application received.
              </h3>
              <p style={{ color: '#64748b' }}>
                We'll be in touch within 48 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="rounded-xl p-6 md:p-8 border bg-white space-y-5"
              style={{ borderColor: '#e2e8f0' }}
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                  style={{ borderColor: '#e2e8f0', color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 7XXX XXX XXX"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Current Location / City <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. London, Manchester"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                  style={{ borderColor: '#e2e8f0', color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* SFE Experience */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Experience with Student Finance England <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="sfeExperience"
                  required
                  value={formData.sfeExperience}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors bg-white"
                  style={{ borderColor: '#e2e8f0', color: formData.sfeExperience ? NAVY : '#94a3b8' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Yes" style={{ color: NAVY }}>Yes</option>
                  <option value="No" style={{ color: NAVY }}>No</option>
                </select>
              </div>

              {/* Years of experience */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Years of experience in education sector
                </label>
                <select
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors bg-white"
                  style={{ borderColor: '#e2e8f0', color: formData.yearsExperience ? NAVY : '#94a3b8' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="0-1" style={{ color: NAVY }}>0–1 years</option>
                  <option value="1-3" style={{ color: NAVY }}>1–3 years</option>
                  <option value="3-5" style={{ color: NAVY }}>3–5 years</option>
                  <option value="5+" style={{ color: NAVY }}>5+ years</option>
                </select>
              </div>

              {/* About experience */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  Tell us about your experience <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="aboutExperience"
                  required
                  rows={4}
                  value={formData.aboutExperience}
                  onChange={handleChange}
                  placeholder="Describe your relevant experience, achievements, and why you want this role."
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                  style={{ borderColor: '#e2e8f0', color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                />
              </div>

              {/* How did you hear */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>
                  How did you hear about us?
                </label>
                <select
                  name="heardAbout"
                  value={formData.heardAbout}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors bg-white"
                  style={{ borderColor: '#e2e8f0', color: formData.heardAbout ? NAVY : '#94a3b8' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Social Media" style={{ color: NAVY }}>Social Media</option>
                  <option value="Referral" style={{ color: NAVY }}>Referral</option>
                  <option value="Google" style={{ color: NAVY }}>Google</option>
                  <option value="Other" style={{ color: NAVY }}>Other</option>
                </select>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="rounded-lg p-3 text-sm font-medium text-center" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                  Something went wrong. Check your connection and try again.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 font-semibold text-base px-6 py-3 rounded-lg transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* ═══════════════════ 7. CTA FINAL ═══════════════════ */}
      <section style={{ background: NAVY }} className="relative overflow-hidden">
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: GOLD }}
        />
        <div className="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Mail className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD }} />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              Questions? Contact us directly.
            </h2>
            <p className="mb-6" style={{ color: '#94a3b8' }}>
              No hesitation. Reach out now.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminJobPage;
