import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Star, GraduationCap, PoundSterling, TrendingUp, Users, Shield, BookOpen, FileText, Phone, UserCheck, Lightbulb, Calculator, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEOHead, { organizationSchema, faqSchema } from '@/components/SEOHead';
import heroImage from '@/assets/hero-main.jpg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const universities = [
  'Global Banking School', 'QA Higher Education', 'Regent College London',
  'Solent University', 'London Metropolitan University', 'Northumbria University',
  'Ulster University', 'University of Bolton', 'LSST',
];

const courses = [
  { title: 'Psychology & Counselling', category: 'Psychology', level: 'BSc', duration: '4 years', campuses: '4 Campuses', price: '£9,535/year', slug: 'psychology-counselling', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80' },
  { title: 'Computing', category: 'Technology', level: 'BSc', duration: '4 years', campuses: '4 Campuses', price: '£9,535/year', slug: 'computing', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
  { title: 'Global Business', category: 'Business', level: 'BSc', duration: '4 years', campuses: '4 Campuses', price: '£9,535/year', slug: 'global-business-management', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80' },
  { title: 'Accounting & Finance', category: 'Business', level: 'BSc', duration: '4 years', campuses: '4 Campuses', price: '£9,535/year', slug: 'accounting-financial-management', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
  { title: 'MSc Global Business', category: 'Business', level: 'MSc', duration: '1 year', campuses: '4 Campuses', price: '£8,595/year', slug: 'msc-global-business', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80' },
  { title: 'HND Cyber Security', category: 'Technology', level: 'HND', duration: '2 years', campuses: '4 Campuses', price: '£6,355/year', slug: 'hnd-cyber-security', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80' },
];

const locations = [
  { name: 'London', slug: 'london', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { name: 'Birmingham', slug: 'birmingham', img: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=600&q=80' },
  { name: 'Manchester', slug: 'manchester', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80' },
  { name: 'Leeds', slug: 'leeds', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80' },
  { name: 'East London', slug: 'east-london', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { name: 'Greenford', slug: 'greenford', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
];

const testimonials = [
  { name: 'Silviu Stefan Haba', course: 'Business & Tourism', funding: '£18,397/an', quote: 'Prin EduForYou am reusit sa gasesc cel mai bun job din viata mea in industria turismului.' },
  { name: 'David', course: 'Business', funding: '£13,000/an', quote: 'Am reusit sa imi schimb complet viata financiara cu ajutorul EduForYou.' },
  { name: 'Ana Ignat', course: 'Manchester GBS', funding: '£9,700/an', quote: 'Povestea mea de succes cu EduForYou este constanta si inspirationala.' },
];

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title="Free UK University Consultancy"
        description="Access UK university education with up to £25,000/year in Student Finance. We guide you from course selection to graduation — completely free. Over 7,000 students helped."
        canonical="https://eduforyou.co.uk"
        jsonLd={organizationSchema}
      />
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="UK University Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              {t('hero.badge')}
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              {t('hero.title1')} <br />
              <span className="text-gradient-orange">{t('hero.title2')}</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-secondary-foreground/70 mb-8 max-w-xl">
              {t('hero.subtitle')}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
              <Link to="/eligibilitate">
                <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2 text-base px-8">
                  {t('hero.cta1')} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/cursuri">
                <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-navy-light/30 font-semibold text-base px-8">
                  {t('hero.cta2')}
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 text-sm text-secondary-foreground/60">
              {[t('hero.noFees'), t('hero.successRate'), t('hero.students')].map((text, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" /> {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '7,000+', label: t('stats.studentsHelped') },
              { value: '£138M+', label: t('stats.financingSecured') },
              { value: '5.0/5.0', label: t('stats.googleRating') },
              { value: '94%', label: t('stats.successRate') },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* University Partners Marquee */}
      <section className="bg-secondary/50 py-10 overflow-hidden border-y border-border/30">
        <div className="container mx-auto px-4 mb-6">
          <p className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('partners.title')}</p>
        </div>
        <div className="flex animate-scroll-left">
          {[...universities, ...universities, ...universities].map((uni, i) => (
            <div key={i} className="flex-shrink-0 px-8 py-4">
              <div className="bg-card rounded-lg px-6 py-3 border border-border/50 shadow-sm whitespace-nowrap">
                <span className="text-sm font-medium text-foreground/70">{uni}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('courses.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('courses.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">{t('courses.subtitle')}</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {courses.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/cursuri/${course.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">{course.category}</span>
                      <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold">{course.level}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-card-foreground mb-2">{course.title}</h3>
                    <div className="text-sm text-muted-foreground mb-3">{course.duration} · {course.campuses}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">{course.price}</span>
                      <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('courses.viewDetails')} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/cursuri">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                {t('courses.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* E.D.U. Method */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">{t('edu.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{t('edu.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-secondary-foreground/70 max-w-2xl mx-auto">{t('edu.subtitle')}</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { letter: 'E', title: t('edu.evaluate'), desc: t('edu.evaluateDesc'), color: 'from-primary to-orange-light' },
              { letter: 'D', title: t('edu.deliver'), desc: t('edu.deliverDesc'), color: 'from-orange-light to-gold' },
              { letter: 'U', title: t('edu.unlock'), desc: t('edu.unlockDesc'), color: 'from-gold to-success' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative bg-navy-light/30 rounded-2xl p-8 border border-navy-light/20 hover:border-primary/30 transition-all group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="font-display font-bold text-2xl text-primary-foreground">{item.letter}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-primary-foreground mb-3">{item.title}</h3>
                <p className="text-secondary-foreground/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('why.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('why.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">{t('why.subtitle')}</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PoundSterling, title: t('why.free.title'), desc: t('why.free.desc') },
              { icon: BookOpen, title: t('why.guidance.title'), desc: t('why.guidance.desc') },
              { icon: Users, title: t('why.support.title'), desc: t('why.support.desc') },
              { icon: Shield, title: t('why.funding.title'), desc: t('why.funding.desc') },
              { icon: TrendingUp, title: t('why.results.title'), desc: t('why.results.desc') },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Steps */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('steps.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('steps.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">{t('steps.subtitle')}</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
              <motion.div key={num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: num * 0.05 }}
                className="relative bg-card rounded-xl p-6 border border-border group hover:border-primary/30 transition-all">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{num}</div>
                <h4 className="font-display font-bold text-foreground mb-2 mt-2">{t(`steps.${num}`)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`steps.${num}.desc`)}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/eligibilitate">
              <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                {t('hero.cta1')} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ikigai Section */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">{t('ikigai.badge')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{t('ikigai.title')}</motion.h2>
              <motion.p variants={fadeUp} className="text-secondary-foreground/70 mb-8">{t('ikigai.subtitle')}</motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/ikigai">
                  <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2 text-base px-10">
                    {t('ikigai.cta')} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {['What You Love', 'Your Skills', 'World Needs', 'Career Path'].map((label, i) => (
                  <div key={i} className="bg-navy-light/30 rounded-xl p-4 border border-navy-light/20">
                    <span className="text-sm text-secondary-foreground/60">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Finance */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('finance.badge')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('finance.title')}</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-8">{t('finance.subtitle')}</motion.p>
              <motion.div variants={fadeUp} className="space-y-4 mb-8">
                {[
                  { title: t('finance.tuition'), desc: t('finance.tuitionDesc') },
                  { title: t('finance.maintenance'), desc: t('finance.maintenanceDesc') },
                  { title: t('finance.repayment'), desc: t('finance.repaymentDesc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-card rounded-lg p-4 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link to="/calculator-finantare">
                  <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                    {t('finance.cta')} <Calculator className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-gold/20 rounded-2xl p-8 border border-primary/20">
                <div className="text-center">
                  <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
                  <div className="font-display text-4xl font-bold text-foreground mb-2">£25,000+</div>
                  <div className="text-muted-foreground">Per Year Available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('locations.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground">{t('locations.title')}</motion.h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((loc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/locatii/${loc.slug}`} className="group block rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all">
                  <div className="relative h-32 overflow-hidden">
                    <img src={loc.img} alt={`${loc.name} Campus`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="font-display font-bold text-primary-foreground">{loc.name}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('eligibility.badge')}</motion.div>
              <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('eligibility.title')}</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-6">{t('eligibility.subtitle')}</motion.p>
              <motion.div variants={fadeUp} className="space-y-3">
                {[
                  '100% free — no hidden fees ever',
                  'Response within 24 hours',
                  'Personalised course recommendation',
                  'Student Finance guidance included',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success" /> {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <h3 className="font-display font-bold text-xl text-card-foreground mb-6">Quick Eligibility Check</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder={`${t('eligibility.fullName')} *`} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="tel" placeholder={`${t('eligibility.phone')} *`} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="email" placeholder={`${t('eligibility.email')} *`} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="date" placeholder={t('eligibility.dob')} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <select className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">{t('eligibility.residence')} *</option>
                    <option>UK/Irish Citizen</option>
                    <option>Settled Status (EU)</option>
                    <option>Pre-settled Status (EU)</option>
                    <option>Indefinite Leave to Remain</option>
                    <option>Refugee Status</option>
                    <option>Other / Not Sure</option>
                  </select>
                  <select className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">{t('eligibility.course')} *</option>
                    <option>Business & Management</option>
                    <option>Computing & Technology</option>
                    <option>Psychology & Counselling</option>
                    <option>Health & Social Care</option>
                    <option>Construction Management</option>
                    <option>Accounting & Finance</option>
                    <option>Not Sure Yet</option>
                  </select>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                    {t('eligibility.submit')}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">{t('eligibility.privacy')}</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">{t('testimonials.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{t('testimonials.title')}</motion.h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { value: '6,288+', label: 'Students helped' },
              { value: '£31M+', label: 'Funding generated' },
              { value: '4.8/5', label: 'Trustpilot · 163 reviews' },
              { value: '94%', label: 'Success rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-navy-light/30 rounded-xl p-6 border border-navy-light/20">
                <p className="text-secondary-foreground/80 italic mb-4">„{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary-foreground">{t.name}</div>
                    <div className="text-sm text-secondary-foreground/60">{t.course}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary-foreground/50">Financing</div>
                    <div className="text-primary font-bold">{t.funding}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Careers */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">EduForYou Team</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground">Want to join our team?</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/30 transition-all">
              <h3 className="font-display font-bold text-xl text-card-foreground mb-3">Work With Us</h3>
              <p className="text-muted-foreground mb-6">We're looking for passionate people who want to help students transform their lives. Remote positions available.</p>
              <Link to="/careers"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">View Open Positions</Button></Link>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/30 transition-all">
              <h3 className="font-display font-bold text-xl text-card-foreground mb-3">Refer Students</h3>
              <p className="text-muted-foreground mb-6">Earn generous commissions by referring students to our university programmes. Partnership programme with real benefits.</p>
              <Link to="/agents"><Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Learn More</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('faq.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('faq.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">{t('faq.subtitle')}</motion.p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <AccordionItem key={num} value={`faq-${num}`} className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="font-display font-semibold text-left text-card-foreground hover:text-primary">
                    {t(`faq.q${num}`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t(`faq.a${num}`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Student Finance Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{t('sf.badge')}</motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('sf.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">{t('sf.subtitle')}</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { title: t('sf.tuition.title'), amount: t('sf.tuition.amount'), desc: t('sf.tuition.desc') },
              { title: t('sf.maintenance.title'), amount: t('sf.maintenance.amount'), desc: t('sf.maintenance.desc') },
              { title: t('sf.repayment.title'), amount: t('sf.repayment.amount'), desc: t('sf.repayment.desc') },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center">
                <h3 className="font-display font-bold text-lg text-card-foreground mb-2">{item.title}</h3>
                <div className="text-2xl font-bold text-primary mb-2">{item.amount}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student-finance"><Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">{t('sf.cta1')}</Button></Link>
            <Link to="/calculator-finantare"><Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">{t('sf.cta2')}</Button></Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t('cta.title')}</motion.h2>
            <motion.p variants={fadeUp} className="text-secondary-foreground/70 max-w-2xl mx-auto mb-8">{t('cta.subtitle')}</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link to="/eligibilitate">
                <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2 text-base px-10">
                  {t('cta.primary')} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/webinar">
                <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-navy-light/30 font-semibold text-base px-10">
                  {t('cta.secondary')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
