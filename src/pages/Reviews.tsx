import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const reviews = [
  { name: 'Silviu Stefan Haba', course: 'Business & Tourism', funding: '£18,397/an', rating: 5, text: 'Prin EduForYou am reusit sa gasesc cel mai bun job din viata mea in industria turismului.' },
  { name: 'David', course: 'Business', funding: '£13,000/an', rating: 5, text: 'Am reusit sa imi schimb complet viata financiara cu ajutorul EduForYou.' },
  { name: 'Ana Ignat', course: 'Manchester GBS', funding: '£9,700/an', rating: 5, text: 'Povestea mea de succes cu EduForYou este constanta si inspirationala.' },
  { name: 'Maria C.', course: 'Psychology', funding: '£12,500/an', rating: 5, text: 'The team at EduForYou made the entire process so simple. I never imagined going to university was possible for me.' },
  { name: 'Andrei P.', course: 'Computing', funding: '£15,000/an', rating: 5, text: 'From the first call to my first day at university, everything was handled perfectly. Truly a free service!' },
  { name: 'Ioana M.', course: 'Health & Social Care', funding: '£11,000/an', rating: 5, text: 'I was sceptical at first but they proved me wrong. Now I\'m studying what I love with full funding.' },
];

const ReviewsPage = () => (
  <Layout>
    <SEOHead title="Student Reviews — 4.8/5 on Trustpilot" description="Read verified reviews from students who studied in the UK with EduForYou. 163+ reviews, 4.8/5 rating on Trustpilot." canonical="https://eduforyou.co.uk/reviews" />
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Student Reviews</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-gold fill-gold" />)}
        </div>
        <p className="text-secondary-foreground/70">4.8/5 on Trustpilot · 163+ verified reviews</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border">
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-gold fill-gold" />)}
              </div>
              <p className="text-muted-foreground italic mb-4">„{review.text}"</p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="font-semibold text-foreground">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.course}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Funding</div>
                  <div className="text-primary font-bold">{review.funding}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/eligibilitate">
            <Button size="lg" className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2">
              Start Your Success Story <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ReviewsPage;
