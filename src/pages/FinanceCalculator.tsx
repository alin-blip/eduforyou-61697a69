import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const FinanceCalculator = () => {
  const [livingIn, setLivingIn] = useState('london');
  const [courseYears, setCourseYears] = useState('4');

  const tuition = 9535;
  const maintenance = livingIn === 'london' ? 14000 : 10500;
  const years = parseInt(courseYears);
  const totalPerYear = tuition + maintenance;
  const totalOverall = totalPerYear * years;

  return (
    <Layout>
      <SEOHead title="Student Finance Calculator" description="Calculate how much Student Finance you could receive for your UK university degree. Tuition and maintenance loan estimates." canonical="https://eduforyou.co.uk/finance-calculator" />
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Finance Calculator</h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Calculate how much Student Finance you could receive for your UK university degree.</p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Where will you be studying?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'london', label: 'London' }, { value: 'outside', label: 'Outside London' }].map(opt => (
                    <button key={opt.value} onClick={() => setLivingIn(opt.value)}
                      className={`px-4 py-3 rounded-xl border transition-all font-medium ${livingIn === opt.value ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Course Duration</label>
                <div className="grid grid-cols-4 gap-3">
                  {['1', '2', '3', '4'].map(y => (
                    <button key={y} onClick={() => setCourseYears(y)}
                      className={`px-4 py-3 rounded-xl border transition-all font-medium ${courseYears === y ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                      {y} year{y !== '1' ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-display font-bold text-xl text-foreground">Your Estimated Finance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-sm text-muted-foreground">Tuition Fee Loan</div>
                    <div className="font-display text-2xl font-bold text-primary">£{tuition.toLocaleString()}<span className="text-sm font-normal">/year</span></div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="text-sm text-muted-foreground">Maintenance Loan</div>
                    <div className="font-display text-2xl font-bold text-primary">£{maintenance.toLocaleString()}<span className="text-sm font-normal">/year</span></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-gold/10 rounded-xl p-6 border border-primary/20 text-center">
                  <div className="text-sm text-muted-foreground">Total per year</div>
                  <div className="font-display text-3xl font-bold text-foreground">£{totalPerYear.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-2">Total over {years} year{years > 1 ? 's' : ''}: <span className="font-bold text-primary">£{totalOverall.toLocaleString()}</span></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">Estimates based on Student Finance England rates. Actual amounts may vary.</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/eligibilitate">
              <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                Check Eligibility <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FinanceCalculator;
