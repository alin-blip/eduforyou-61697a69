import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">E</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-primary-foreground text-lg leading-tight">
                  Edu<span className="text-primary">For</span>You
                </span>
                <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">{t('footer.tagline')}</span>
              </div>
            </Link>
            <p className="text-sm text-secondary-foreground/60 mb-4">{t('footer.desc')}</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-navy-light/30 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-secondary-foreground/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">{t('footer.courses')}</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/cursuri" className="hover:text-primary transition-colors">BSc Programmes</Link></li>
              <li><Link to="/cursuri" className="hover:text-primary transition-colors">MSc Programmes</Link></li>
              <li><Link to="/cursuri-profesionale" className="hover:text-primary transition-colors">HND Programmes</Link></li>
              <li><Link to="/cursuri" className="hover:text-primary transition-colors">All Courses</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/team" className="hover:text-primary transition-colors">{t('footer.team')}</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">{t('footer.careers')}</Link></li>
              <li><Link to="/partners" className="hover:text-primary transition-colors">{t('footer.partners')}</Link></li>
              <li><Link to="/why-free" className="hover:text-primary transition-colors">{t('footer.whyFree')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/student-finance" className="hover:text-primary transition-colors">{t('footer.studentFinance')}</Link></li>
              <li><Link to="/calculator-finantare" className="hover:text-primary transition-colors">{t('footer.financeCalc')}</Link></li>
              <li><Link to="/ebook" className="hover:text-primary transition-colors">{t('footer.ebook')}</Link></li>
              <li><Link to="/reviews" className="hover:text-primary transition-colors">{t('footer.reviews')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">{t('footer.newsletter')}</h4>
            <div className="flex gap-2">
              <Input
                placeholder={t('footer.emailPlaceholder')}
                className="bg-navy-light/30 border-navy-light/20 text-secondary-foreground placeholder:text-secondary-foreground/40"
              />
              <Button size="sm" className="bg-primary hover:bg-gold-dark text-primary-foreground shrink-0">
                {t('footer.subscribe')}
              </Button>
            </div>
            <div className="mt-6">
              <h4 className="font-display font-semibold text-primary-foreground mb-3">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-secondary-foreground/60">
                <li><Link to="/legal/cookies" className="hover:text-primary transition-colors">{t('footer.cookies')}</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link to="/legal/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-light/20 mt-12 pt-8 text-center text-sm text-secondary-foreground/40">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
