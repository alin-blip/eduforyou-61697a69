/*
 * Footer Component - EduForYou Platform
 * 5-column layout: About, Courses, Locations, Resources, Contact
 * Newsletter signup with GDPR checkbox
 * Bottom bar with legal links, Companies House info, and Google Reviews badge
 */
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, MessageCircle, Star, Building2 } from 'lucide-react';
import { BRAND, CAMPUSES } from '@/data/courses';
import { useLanguage } from '@/i18n/LanguageContext';
import NewsletterForm from '@/components/NewsletterForm';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1a252f] text-white/80">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
            <div className="flex-1">
              <h3 className="text-lg font-serif text-white mb-1">{t('footer.newsletter') || 'Newsletter'}</h3>
              <p className="text-sm text-white/50">{t('footer.newsletterDesc') || 'Primeste cele mai noi oportunitati de studii gratuite in UK.'}</p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <NewsletterForm variant="inline" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - 5 Columns */}
      <div className="container py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: About */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E67E22] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#1a252f]" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-sans">EduForYou</div>
                <div className="text-[10px] tracking-widest uppercase text-[#E67E22]">{t('footer.tagline') || 'You Dream. We Deliver.'}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              {t('footer.desc') || BRAND.description}
            </p>
            {/* Social Icons */}
            <div className="flex gap-2">
              {[
                { label: 'Facebook', href: 'https://facebook.com/eduforyou', icon: 'f' },
                { label: 'Instagram', href: 'https://instagram.com/eduforyou', icon: 'ig' },
                { label: 'TikTok', href: 'https://tiktok.com/@eduforyou', icon: 'tk' },
                { label: 'LinkedIn', href: 'https://linkedin.com/company/eduforyou', icon: 'in' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 hover:bg-[#E67E22] hover:text-[#1a252f] transition-colors"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Courses */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.courses') || 'Courses'}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { key: 'footer.courseBusiness', label: t('footer.courseBusiness') || 'Business Management' },
                { key: 'footer.courseComputing', label: t('footer.courseComputing') || 'Computing' },
                { key: 'footer.coursePsychology', label: t('footer.coursePsychology') || 'Psychology' },
                { key: 'footer.courseAccounting', label: t('footer.courseAccounting') || 'Accounting & Finance' },
                { key: 'footer.courseConstruction', label: t('footer.courseConstruction') || 'Construction Management' },
                { key: 'footer.courseHealth', label: t('footer.courseHealth') || 'Health & Social Care' },
              ].map((c) => (
                <li key={c.key}>
                  <Link to="/cursuri" className="hover:text-[#E67E22] transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/ikigai" className="text-[#E67E22] hover:text-[#f0a05c] transition-colors font-medium">
                  {t('footer.ikigaiQuiz') || 'IKIGAI Quiz'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.locations') || 'Locations'}</h4>
            <ul className="space-y-2.5 text-sm">
              {CAMPUSES.map((campus) => (
                <li key={campus.id}>
                  <Link to={`/locatii/${campus.slug}`} className="hover:text-[#E67E22] transition-colors">
                    {campus.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.resources') || 'Resources'}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/calculator-finantare" className="hover:text-[#E67E22] transition-colors">{t('footer.financeCalc') || 'Finance Calculator'}</Link></li>
              <li><Link to="/student-finance" className="hover:text-[#E67E22] transition-colors">{t('footer.studentFinance') || 'Student Finance Guide'}</Link></li>
              <li><Link to="/about" className="hover:text-[#E67E22] transition-colors">{t('footer.about') || 'About Us'}</Link></li>
              <li><Link to="/why-free" className="hover:text-[#E67E22] transition-colors">{t('footer.whyFree') || 'Why Free?'}</Link></li>
              <li><Link to="/blog" className="hover:text-[#E67E22] transition-colors">{t('nav.blog') || 'Blog'}</Link></li>
              <li><Link to="/reviews" className="hover:text-[#E67E22] transition-colors">{t('footer.reviews') || 'Leave a Review'}</Link></li>
              <li><Link to="/careers" className="hover:text-[#E67E22] transition-colors">{t('footer.careers') || 'Careers'}</Link></li>
              <li><Link to="/agents" className="hover:text-[#E67E22] transition-colors">{t('footer.becomeAgent') || 'Become an Agent'}</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.contact') || 'Contact'}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-[#E67E22] transition-colors">{BRAND.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-[#E67E22] transition-colors">{BRAND.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace(/\s/g, '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E67E22] transition-colors"
                >
                  {t('footer.whatsapp') || 'WhatsApp'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                <span className="text-white/50 text-xs leading-relaxed">{BRAND.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Companies House Info Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#E67E22]/60" />
            <span>
              <strong className="text-white/60">EDUFORYOU LTD</strong> — {t('footer.companyNumber') || 'Company Number'} {BRAND.companyNumber} — {t('footer.registeredIn') || 'Registered in England & Wales'}
            </span>
          </div>
          <div className="text-white/30">
            {t('footer.registeredOffice') || 'Registered Office'}: {BRAND.address}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; 2026 EduForYou Ltd. {t('footer.rights') || 'All rights reserved.'}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="hover:text-[#E67E22] transition-colors">
              {t('footer.about') || 'About Us'}
            </Link>
            <Link to="/legal/privacy" className="hover:text-[#E67E22] transition-colors">
              {t('footer.privacy') || 'Privacy Notice'}
            </Link>
            <Link to="/legal/terms" className="hover:text-[#E67E22] transition-colors">
              {t('footer.terms') || 'Terms & Conditions'}
            </Link>
            <Link to="/student-finance" className="hover:text-[#E67E22] transition-colors">
              {t('footer.studentFinance') || 'Student Finance Guide'}
            </Link>
            <Link to="/legal/cookies" className="hover:text-[#E67E22] transition-colors">
              {t('footer.cookies') || 'Cookie Policy'}
            </Link>
            <Link to="/reviews" className="hover:text-[#E67E22] transition-colors">
              {t('footer.reviews') || 'Leave a Review'}
            </Link>
            {/* Google Reviews Badge */}
            <a
              href="https://g.page/eduforyou"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 hover:bg-white/20 transition-colors"
            >
              <Star className="w-3 h-3 text-[#E67E22] fill-[#E67E22]" />
              <span className="text-white/70 font-medium">{BRAND.stats.googleRating}</span>
              <span className="text-white/40">{t('footer.googleReviews') || 'Google Reviews'}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
