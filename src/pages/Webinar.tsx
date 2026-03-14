import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Calendar, Users } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const webinars = [
  { id: '1', title: 'How to Study in the UK for Free', date: 'Every Wednesday, 7 PM', type: 'Live Webinar', spots: '50 spots', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80' },
  { id: '2', title: 'Student Finance Explained', date: 'Every Thursday, 6 PM', type: 'Live Webinar', spots: '30 spots', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
  { id: '3', title: 'Become an Education Agent', date: 'First Monday of the month', type: 'Agent Webinar', spots: '20 spots', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80' },
];

const WebinarPage = () => (
  <Layout>
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Free Webinars</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Join our free live webinars and learn everything about studying in the UK with Student Finance.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {webinars.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={w.image} alt={w.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-6 h-6 text-primary-foreground ml-1" /></div>
                </div>
              </div>
              <div className="p-5">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{w.type}</span>
                <h3 className="font-display font-bold text-lg text-card-foreground mt-3 mb-3">{w.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {w.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {w.spots}</span>
                </div>
                <Button className="w-full bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                  Register Free
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default WebinarPage;
