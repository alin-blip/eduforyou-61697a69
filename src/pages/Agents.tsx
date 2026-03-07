import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, PoundSterling, Trophy, Star } from 'lucide-react';

const AgentsPage = () => (
  <Layout>
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Become an Education Agent</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Earn generous commissions by referring students to UK university programmes. Join our growing network of education agents.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: PoundSterling, title: 'Competitive Commissions', desc: 'Earn up to £500 per successful student referral' },
            { icon: Users, title: 'Marketing Support', desc: 'Access branded materials, landing pages, and training' },
            { icon: Trophy, title: 'Leaderboard & Bonuses', desc: 'Top agents earn extra bonuses and VIP perks' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border text-center">
              <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-primary/5 to-gold/5 rounded-2xl p-8 md:p-12 border border-primary/10 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Apply to become an EduForYou agent today. We'll provide you with everything you need to start earning commissions.</p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default AgentsPage;
