import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const jobs = [
  { id: '1', title: 'Student Consultant', type: 'Full-time / Remote', location: 'Remote', desc: 'Guide prospective students through their university application journey.' },
  { id: '2', title: 'Education Advisor', type: 'Full-time', location: 'London', desc: 'Provide personalised course recommendations and eligibility assessments.' },
  { id: '3', title: 'Marketing Specialist', type: 'Full-time / Remote', location: 'Remote', desc: 'Create and manage campaigns to reach potential students across Europe.' },
  { id: '4', title: 'Agent Partnership Manager', type: 'Full-time', location: 'London', desc: 'Build and manage our network of education referral agents.' },
];

const CareersPage = () => (
  <Layout>
    <SEOHead title="Careers at EduForYou" description="Join our mission to make UK university education accessible to everyone. View open positions and apply today." canonical="https://eduforyou.co.uk/careers" noindex />
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Careers at EduForYou</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Join our mission to make UK university education accessible to everyone.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-card-foreground">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{job.desc}</p>
                </div>
                <Button className="bg-primary hover:bg-gold-dark text-primary-foreground shrink-0 gap-2">
                  Apply <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default CareersPage;
