import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Star, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const EbookPage = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-bold mb-4 animate-pulse">
                Limited Time Offer
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                From Unhappy Career<br />to <span className="text-gradient-orange">Fulfilment</span>
              </h1>
              <p className="text-secondary-foreground/70 text-lg mb-6">
                The guide that shows you whether you're made for employment, freelancing, or entrepreneurship. 14 chapters, self-assessment test, and actionable strategies.
              </p>
              <div className="flex gap-4 items-center mb-6">
                <span className="text-3xl font-bold text-primary line-through opacity-60">£9</span>
                <span className="text-5xl font-bold text-primary">£5</span>
                <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-bold">Save 44%</span>
              </div>

              {/* Countdown */}
              <div className="flex gap-3 mb-8">
                {[
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((t, i) => (
                  <div key={i} className="bg-navy-light/40 rounded-xl p-3 text-center min-w-[70px] border border-navy-light/20">
                    <div className="font-display text-2xl font-bold text-primary">{String(t.value).padStart(2, '0')}</div>
                    <div className="text-xs text-secondary-foreground/50">{t.label}</div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-bold gap-2 text-lg px-10">
                Get the Book — £5 <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex justify-center">
              <div className="bg-gradient-to-br from-primary/20 to-gold/20 rounded-2xl p-8 border border-primary/20">
                <BookOpen className="w-32 h-32 text-primary mx-auto mb-4" />
                <div className="text-center">
                  <div className="font-display text-xl font-bold text-primary-foreground">Ebook</div>
                  <div className="text-secondary-foreground/60">14 Chapters · PDF</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">What You'll Learn</h2>
          <div className="space-y-4">
            {[
              'How to discover your true calling using the Ikigai method',
              'Whether you\'re meant for employment, freelancing, or entrepreneurship',
              'Self-assessment test with personalised career profile',
              'Actionable strategies for career transition',
              'Real stories from people who changed their lives',
              'How to create a sustainable career plan',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-card rounded-lg p-4 border border-border">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EbookPage;
