/**
 * Header Component - E.D.U. Method Platform
 * Design: Always dark (#0A0A0A) sticky header, opaque, with logo
 * Simplified: Logo left, main links center, CTA right
 * Mobile: hamburger menu
 * Shows on ALL public pages (including courses)
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Banner height constant — must match WebinarAnnouncementBanner
const BANNER_HEIGHT = 40; // px (approx 2.5rem / py-2.5 + text)
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LOGO_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/106208815/pfqgUoDdpaWiyRKC.png';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'ro', label: 'Romana', flag: '\u{1F1F7}\u{1F1F4}' },
  { code: 'hu', label: 'Magyar', flag: '\u{1F1ED}\u{1F1FA}' },
  { code: 'pl', label: 'Polski', flag: '\u{1F1F5}\u{1F1F1}' },
];

// Language-aware URL map
const NAV_LINK_DEFS = [
  { key: 'courses',      ro: '/cursuri',              en: '/courses',     hu: '/courses',     pl: '/courses' },
  { key: 'proCourses',   ro: '/cursuri-profesionale', en: '/cursuri-profesionale', hu: '/cursuri-profesionale', pl: '/cursuri-profesionale' },
  { key: 'locations',    ro: '/locatii',              en: '/locations',   hu: '/locations',   pl: '/locations' },
  { key: 'eligibility',  ro: '/eligibilitate',        en: '/eligibility', hu: '/eligibility', pl: '/eligibility' },
  { key: 'ikigai',       ro: '/ikigai',               en: '/ikigai',      hu: '/ikigai',      pl: '/ikigai' },
  { key: 'webinar',      ro: '/webinar',              en: '/webinar',     hu: '/webinar',     pl: '/webinar' },
  { key: 'blog',         ro: '/blog',                 en: '/blog',        hu: '/blog',        pl: '/blog' },
  { key: 'contact',      ro: '/contact',              en: '/contact',     hu: '/contact',     pl: '/contact' },
];

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  agent: '/agent',
  admin: '/admin',
  consultant: '/admin',
  user: '/student',
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Build language-aware nav links
  const NAV_LINKS = NAV_LINK_DEFS.map((def) => ({
    key: def.key,
    href: (def as any)[language] ?? def.ro,
  }));

  // Auth state
  const { user, roles, rolesLoading, signOut } = useAuth();
  const isLoggedIn = !!user;

  const getDashboardPath = () => {
    if (rolesLoading) return '/student';
    if (roles.includes('admin')) return '/admin';
    if (roles.includes('agent')) return '/agent';
    return '/student';
  };
  const dashboardPath = getDashboardPath();
  const firstName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || '';

  const handleLogout = async () => {
    await signOut();
    toast.success(t('nav.loggedOut') || 'Logged out successfully');
    navigate('/');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isDashboard =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/agent') ||
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/ceo') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/login');

  if (isDashboard) return null;

  return (
    <>
      <header
        className="fixed left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/10"
        style={{ position: 'fixed', top: BANNER_HEIGHT }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img src={LOGO_URL} alt="EduForYou logo" className="w-9 h-9 object-contain" />
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight font-sans text-white">
                  Edu<span className="text-[#E67E22]">ForYou</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#E67E22]/80">
                  {t('footer.tagline') || 'You Dream. We Deliver.'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden xl:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const def = NAV_LINK_DEFS.find(d => d.key === link.key)!;
                const allHrefs = [def.ro, def.en, def.hu, def.pl].filter(Boolean);
                const isActive = allHrefs.some(h => location.pathname === h || (h !== '/' && location.pathname.startsWith(h)));
                return (
                  <Link
                    key={link.key}
                    to={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-[#E67E22] bg-[#E67E22]/10'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t(`nav.${link.key}`) || link.key}
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Desktop */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 text-white/70 hover:bg-white/10 transition-colors text-sm font-medium">
                    <span className="text-base">{currentLang.flag}</span>
                    <span>{currentLang.code.toUpperCase()}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[150px]">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 cursor-pointer ${
                        language === lang.code ? 'font-semibold bg-accent' : ''
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {language === lang.code && (
                        <span className="ml-auto text-[#E67E22]">&#10003;</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-semibold gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#1a252f] flex items-center justify-center text-white text-xs font-bold">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      {firstName}
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={dashboardPath} className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        {t('nav.myDashboard') || 'Dashboard'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/student" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        {t('nav.profile') || 'Profile'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout') || 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      {t('nav.signIn') || 'Sign In'}
                    </Button>
                  </Link>
                  <Link to="/eligibilitate">
                    <Button
                      size="sm"
                      className="bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-semibold shadow-md"
                    >
                      {t('nav.checkEligibility') || 'Check Eligibility'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: language + hamburger */}
            <div className="xl:hidden flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-white/20 text-white">
                    <span>{currentLang.flag}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 cursor-pointer ${
                        language === lang.code ? 'font-semibold' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="p-2 text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-[#0A0A0A] border-t border-white/10 shadow-lg animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
            <nav className="container py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const def = NAV_LINK_DEFS.find(d => d.key === link.key)!;
                const allHrefs = [def.ro, def.en, def.hu, def.pl].filter(Boolean);
                const isActive = allHrefs.some(h => location.pathname === h || (h !== '/' && location.pathname.startsWith(h)));
                return (
                  <Link
                    key={link.key}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-[#E67E22] bg-[#E67E22]/10'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t(`nav.${link.key}`) || link.key}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-semibold gap-2">
                        <LayoutDashboard className="w-4 h-4" /> {t('nav.myDashboard') || 'Dashboard'}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout') || 'Logout'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        {t('nav.signIn') || 'Sign In'}
                      </Button>
                    </Link>
                    <Link to="/eligibilitate" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-semibold">
                        {t('nav.checkEligibility') || 'Check Eligibility'}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Spacer to prevent content from hiding behind fixed header + announcement banner */}
      <div style={{ height: `calc(${BANNER_HEIGHT}px + 4rem)` }} className="lg:hidden" />
      <div style={{ height: `calc(${BANNER_HEIGHT}px + 4.5rem)` }} className="hidden lg:block" />
    </>
  );
};

export default Header;
