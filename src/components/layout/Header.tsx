import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ro', label: 'RO', flag: '🇷🇴' },
  { code: 'hu', label: 'HU', flag: '🇭🇺' },
  { code: 'pl', label: 'PL', flag: '🇵🇱' },
];

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = roles.includes('admin') ? '/admin' : roles.includes('agent') ? '/agent' : '/student';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: t('nav.courses'), href: '/cursuri' },
    { label: t('nav.professionalCourses'), href: '/cursuri-profesionale' },
    { label: t('nav.locations'), href: '/locatii' },
    { label: t('nav.eligibility'), href: '/eligibilitate' },
    { label: t('nav.ikigaiQuiz'), href: '/ikigai' },
    { label: t('nav.webinars'), href: '/webinar' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-navy-light/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-primary-foreground text-lg leading-tight">
                Edu<span className="text-primary">For</span>You
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">You Dream. We Deliver.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-sm text-secondary-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-navy-light/30"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-secondary-foreground/80 hover:text-primary-foreground border border-navy-light/30 rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag} {currentLang.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 bg-secondary border border-navy-light/30 rounded-md shadow-lg overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-navy-light/30 transition-colors ${
                        language === lang.code ? 'text-primary' : 'text-secondary-foreground/80'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link to={dashboardPath} className="hidden md:inline-flex">
                  <Button size="sm" variant="ghost" className="text-secondary-foreground/80 hover:text-primary-foreground font-semibold">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden md:inline-flex text-secondary-foreground/80 hover:text-primary-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" className="hidden md:inline-flex">
                <Button size="sm" variant="ghost" className="text-secondary-foreground/80 hover:text-primary-foreground font-semibold">
                  {t('nav.signIn')}
                </Button>
              </Link>
            )}

            {/* CTAs */}
            <Link to="/book-appointment">
              <Button size="sm" variant="outline" className="hidden md:inline-flex border-primary text-primary hover:bg-primary/10 font-semibold">
                {t('nav.bookAppointment') || 'Book Appointment'}
              </Button>
            </Link>
            <Link to="/eligibilitate">
              <Button size="sm" className="hidden md:inline-flex bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                {t('nav.checkEligibility')}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="xl:hidden">
                <button className="p-2 text-secondary-foreground/80 hover:text-primary-foreground">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-secondary border-navy-light/20 w-80">
                <SheetTitle className="text-primary-foreground font-display">Menu</SheetTitle>
                <nav className="flex flex-col gap-1 mt-8">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        to={item.href}
                        className="px-4 py-3 text-secondary-foreground/80 hover:text-primary-foreground hover:bg-navy-light/30 rounded-md transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-t border-navy-light/20 my-4" />
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link to={dashboardPath} className="px-4 py-3 text-secondary-foreground/80 hover:text-primary-foreground hover:bg-navy-light/30 rounded-md transition-colors">
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="px-4 py-3 text-left text-secondary-foreground/80 hover:text-primary-foreground hover:bg-navy-light/30 rounded-md transition-colors"
                        >
                          Sign Out
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login" className="px-4 py-3 text-secondary-foreground/80 hover:text-primary-foreground hover:bg-navy-light/30 rounded-md transition-colors">
                        {t('nav.signIn')}
                      </Link>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Link to="/book-appointment">
                      <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10">
                        {t('nav.bookAppointment') || 'Book Appointment'}
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/eligibilitate">
                      <Button className="w-full mt-2 bg-primary hover:bg-orange-dark text-primary-foreground">
                        {t('nav.checkEligibility')}
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
