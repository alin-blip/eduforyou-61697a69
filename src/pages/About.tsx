import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Award, Target, Heart, ArrowRight } from 'lucide-react';

const AboutPage = () => (
  <Layout>
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About EduForYou</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">We're on a mission to make UK university education accessible to everyone who qualifies.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">EduForYou was founded with a simple belief: everyone who qualifies for a UK university education should have access to it, regardless of their background or financial situation.</p>
            <p className="text-muted-foreground mb-6">We've helped over 7,000 students access university education and secure more than £138M in Student Finance funding. Our service is 100% free because universities pay us when students successfully enrol.</p>
            <Link to="/eligibilitate">
              <Button className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, value: '7,000+', label: 'Students Helped' },
              { icon: Award, value: '£138M+', label: 'Finance Secured' },
              { icon: Target, value: '94%', label: 'Success Rate' },
              { icon: Heart, value: '100%', label: 'Free Service' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/5 to-gold/5 rounded-2xl p-8 md:p-12 border border-primary/10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Why Is It Free?</h2>
          <p className="text-muted-foreground mb-4">Universities partner with us because we provide them with qualified, motivated students. When a student we recommend successfully enrols, the university pays us a referral fee. This model means:</p>
          <ul className="space-y-2 text-muted-foreground">
            {['You never pay anything — ever', 'We only succeed when you succeed', 'Our incentive is aligned with yours', 'No hidden fees, no catches'].map((item, i) => (
              <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </Layout>
);

export default AboutPage;
