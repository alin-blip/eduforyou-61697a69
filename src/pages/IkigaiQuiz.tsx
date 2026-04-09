import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Heart, Zap, Globe, Briefcase, Sparkles } from 'lucide-react';
import { coursesData } from '@/data/courses';

const ikigaiQuestions = [
  {
    id: 'passion',
    title: 'What do you love doing?',
    subtitle: 'Select the activities that bring you joy and fulfilment.',
    icon: Heart,
    options: [
      { label: 'Helping people solve problems', tags: ['Psychology', 'Health'] },
      { label: 'Working with numbers and data', tags: ['Business', 'Technology'] },
      { label: 'Creating and building things', tags: ['Technology', 'Construction'] },
      { label: 'Leading and managing teams', tags: ['Business'] },
      { label: 'Understanding how people think', tags: ['Psychology'] },
      { label: 'Analysing information and research', tags: ['Technology', 'Business'] },
    ],
  },
  {
    id: 'skills',
    title: 'What are you good at?',
    subtitle: 'Choose the skills that come naturally to you.',
    icon: Zap,
    options: [
      { label: 'Communication and empathy', tags: ['Psychology', 'Health'] },
      { label: 'Logical thinking and problem-solving', tags: ['Technology'] },
      { label: 'Organisation and planning', tags: ['Business', 'Construction'] },
      { label: 'Creativity and innovation', tags: ['Technology', 'Business'] },
      { label: 'Attention to detail', tags: ['Business', 'Construction'] },
      { label: 'Working under pressure', tags: ['Health', 'Business'] },
    ],
  },
  {
    id: 'world',
    title: 'What does the world need?',
    subtitle: 'What cause or area feels most important to you?',
    icon: Globe,
    options: [
      { label: 'Better mental health support', tags: ['Psychology', 'Health'] },
      { label: 'Technological innovation', tags: ['Technology'] },
      { label: 'Stronger businesses and economies', tags: ['Business'] },
      { label: 'Better infrastructure and housing', tags: ['Construction'] },
      { label: 'Financial literacy and access', tags: ['Business'] },
      { label: 'Healthcare for everyone', tags: ['Health'] },
    ],
  },
  {
    id: 'career',
    title: 'What career excites you?',
    subtitle: 'Pick the career direction you find most appealing.',
    icon: Briefcase,
    options: [
      { label: 'Therapist, counsellor, or social worker', tags: ['Psychology', 'Health'] },
      { label: 'Software developer or data analyst', tags: ['Technology'] },
      { label: 'Manager, entrepreneur, or consultant', tags: ['Business'] },
      { label: 'Accountant or financial analyst', tags: ['Business'] },
      { label: 'Project manager or site manager', tags: ['Construction'] },
      { label: 'Cybersecurity specialist', tags: ['Technology'] },
    ],
  },
];

const IkigaiQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = ikigaiQuestions[step];

  const toggleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter(a => a !== option) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const getRecommendations = () => {
    const tagCounts: Record<string, number> = {};
    Object.entries(answers).forEach(([qId, selectedLabels]) => {
      const question = ikigaiQuestions.find(q => q.id === qId);
      if (!question) return;
      selectedLabels.forEach(label => {
        const option = question.options.find(o => o.label === label);
        option?.tags.forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
      });
    });
    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const topCategory = sorted[0]?.[0] || 'Business';
    return coursesData.filter(c => c.category === topCategory).slice(0, 3);
  };

  const handleFinish = () => setShowResult(true);
  const recommended = showResult ? getRecommendations() : [];

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 inline mr-1" /> Ikigai Quiz
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Discover Your Perfect Course
          </h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Answer 4 quick questions to find the intersection of your passions, skills, purpose, and career path.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          {!showResult ? (
            <>
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {ikigaiQuestions.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <currentQ.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">{currentQ.title}</h2>
                      <p className="text-muted-foreground text-sm">{currentQ.subtitle} (Pick up to 2)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentQ.options.map(opt => {
                      const selected = (answers[currentQ.id] || []).includes(opt.label);
                      return (
                        <button key={opt.label} onClick={() => toggleAnswer(currentQ.id, opt.label)}
                          className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                            selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
                          }`}>
                          <span className="font-medium text-foreground">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {step < ikigaiQuestions.length - 1 ? (
                  <Button onClick={() => setStep(s => s + 1)} disabled={!(answers[currentQ.id]?.length)} className="bg-primary hover:bg-gold-dark text-primary-foreground gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleFinish} disabled={!(answers[currentQ.id]?.length)} className="bg-primary hover:bg-gold-dark text-primary-foreground gap-2">
                    See Results <Sparkles className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">Your Recommended Courses</h2>
              <p className="text-muted-foreground mb-10">Based on your Ikigai profile, here are the courses that best match your passions, skills, and career goals.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {recommended.map(course => (
                  <Link key={course.id} to={`/cursuri/${course.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
                    <div className="h-36 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{course.level}</span>
                      <h3 className="font-display font-bold text-foreground mt-2 mb-1">{course.title}</h3>
                      <span className="text-primary font-bold text-sm">{course.price}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/eligibilitate">
                  <Button size="lg" className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2">
                    Check Eligibility <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={() => { setStep(0); setShowResult(false); setAnswers({}); }}>
                  Retake Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default IkigaiQuiz;
