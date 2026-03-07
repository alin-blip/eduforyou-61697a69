import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, GraduationCap, PoundSterling, Clock } from 'lucide-react';

const StudentFinancePage = () => (
  <Layout>
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Student Finance England</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Everything you need to know about funding your UK university education through Student Finance.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: GraduationCap, title: 'Tuition Fee Loan', amount: 'Up to £9,535/year', desc: 'Paid directly to your university. You never handle this money yourself.' },
            { icon: PoundSterling, title: 'Maintenance Loan', amount: 'Up to £14,000/year', desc: 'For living costs. Paid into your bank account in 3 instalments per year.' },
            { icon: Clock, title: 'Repayment', amount: '9% over £25,000', desc: 'Only after graduation. If you earn under £25k, you pay nothing.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border text-center">
              <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
              <div className="text-2xl font-bold text-primary mb-2">{item.amount}</div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Who is Eligible?</h2>
          <div className="space-y-3">
            {[
              'UK or Irish citizens who have lived in the UK for 3+ years',
              'EU citizens with Settled Status or Pre-Settled Status (5+ years)',
              'People with Indefinite Leave to Remain',
              'Refugees and those with Humanitarian Protection',
              'Must be studying a qualifying course at a recognised institution',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/calculator-finantare">
              <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                Calculate Your Finance <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/eligibilitate">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                Check Eligibility
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default StudentFinancePage;
