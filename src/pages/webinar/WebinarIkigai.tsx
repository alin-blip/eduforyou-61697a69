/**
 * Webinar Landing Page – EduForYou
 * "IKIGAI: Cursul Perfect. Cariera Potrivită. Finanțare Completă."
 * Design: Brutalist Authority – dark bg, gold accents, Space Grotesk display, DM Sans body
 * Brand Voice: Direct, empowerment, navy + gold (EduForYou Brand Voice Guide)
 * Presenter: Alin Radu (fondatorul EduForYou)
 * Evergreen – fără date hardcodate
 * CTA URL: https://www.eduforyou.co.uk/ikigai
 */
import { useState, useEffect, useRef } from "react";

// GTM dataLayer type declaration
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
import {
  ChevronDown,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  Gift,
  Compass,
  Brain,
  Star,
  Lightbulb,
  Users,
  BookOpen,
  Shield,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  Rocket,
  HeadphonesIcon,
  Eye,
  MessageCircle,
  Facebook,
  PoundSterling,
  ListChecks,
  CalendarDays,
  Headphones,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import AnimatedCounter from "@/components/webinar/AnimatedCounter";

/* ===== WebinarJam Embed Component ===== */
const WebinarJamEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Remove any previously injected script to avoid duplicates on re-render
      const existing = containerRef.current.querySelector('script');
      if (existing) existing.remove();

      const script = document.createElement('script');
      script.src =
        'https://event.webinarjam.com/register/8wg2gka4/embed-form?formButtonText=Register&formAccentColor=%23f6ab29&formAccentOpacity=0.95&formBgColor=%23000000&formBgOpacity=1';
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, []);

  // ─── GTM dataLayer: webinar_inregistrare (WebinarJam postMessage listener) ───
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const data = e.data as Record<string, string> | null;
      if (
        data &&
        (data.type === 'wj-registration-complete' ||
          data.event === 'registration_complete')
      ) {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'webinar_inregistrare',
            user_data: {
              email: data.email || '',
              first_name: data.firstName || data.first_name || '',
              last_name: data.lastName || data.last_name || '',
            },
          });
        } catch (_err) {}
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      className="wj-embed-wrapper w-full"
      data-webinar-hash="8wg2gka4"
      ref={containerRef}
    />
  );
};
/* ===== Voomly Video Embed Component ===== */
const VoomlyEmbed = () => {
  useEffect(() => {
    const SCRIPT_SRC = 'https://embed.voomly.softwarepublishingapp.com/embed/embed-build.js';
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      className="voomly-embed w-full"
      data-id="GyROv6YUDJbcyh4DwBHIp8IgGgyd2NMQmD8VRo5aNIAPfzR4D"
      data-ratio="1.777778"
      data-type="v"
      data-skin-color="#2758EB"
      data-shadow=""
      style={{
        width: '100%',
        aspectRatio: '1.77778 / 1',
        background: 'linear-gradient(45deg, rgb(142, 150, 164) 0%, rgb(201, 208, 222) 100%)',
        borderRadius: '10px',
      }}
    />
  );
};

import ScrollReveal from "@/components/webinar/ScrollReveal";
import TestimonialsCarousel from "@/components/webinar/TestimonialsCarousel";
import SocialProofToast from "@/components/webinar/SocialProofToast";
import { useTracking } from "@/hooks/useTracking";
import SEO from "@/components/SEO";

// Asset URLs – reuse existing brand assets
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/pfqgUoDdpaWiyRKC.png";
const ALIN_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/mGOAPBSUbTiTKuPu.jpg";

// Primary CTA URL – evergreen landing page
const CTA_URL = "https://www.eduforyou.co.uk/ikigai";
const FB_GROUP_URL = "https://www.facebook.com/groups/eduforyou";

/* ===== FAQ Component ===== */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
      >
        <span className="font-[var(--font-display)] font-semibold text-white text-base sm:text-lg pr-4">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-white/60 font-[var(--font-body)] leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Este webinarul gratuit?",
    a: "Da, 100% gratuit. Zero taxe, zero costuri ascunse. Participi, înveți și primești acces la bonusuri exclusive. Nu ai nevoie de card de credit sau de niciun angajament financiar.",
  },
  {
    q: "Dacă particip, sunt obligat să mă înscriu la un curs?",
    a: "Nu. Webinarul este informativ și educațional. Scopul este să-ți ofere claritate în direcția profesională și să-ți arate opțiunile disponibile. Decizia de a te înscrie la un curs rămâne 100% a ta.",
  },
  {
    q: "Pot studia gratuit în UK?",
    a: "Da. Dacă ai settled status, pre-settled status sau cetățenie britanică, poți accesa finanțare completă prin Student Finance England. Aceasta acoperă integral taxele de școlarizare și oferă și un grant de întreținere. La webinar îți arătăm exact cum funcționează procesul.",
  },
  {
    q: "Trebuie să am nivel ridicat de engleză?",
    a: "Nu neapărat. Există cursuri cu cerințe diferite de limbă, iar noi te ajutăm să găsești varianta potrivită pentru nivelul tău actual. Mulți studenți EduForYou au început cu un nivel mediu de engleză și au progresat rapid.",
  },
  {
    q: "Care sunt opțiunile de program de studiu?",
    a: "Există trei variante: Zi (Luni + Marți, 9:45–14:15/45), Seară (18:00–21:00 — 3 seri pe săptămână, sau 16:30–18:00 — 2 seri) și Weekend (Sâmbătă sau Duminică, 10:00–17:00 + 3 ore Vineri sau Luni). La webinar discutăm care variantă se potrivește cel mai bine situației tale.",
  },
  {
    q: "Ce este programul de referral EduForYou?",
    a: "Prin programul nostru de referral poți câștiga £500+ pentru fiecare persoană pe care o recomanzi și care se înscrie cu succes la universitate prin EduForYou. Este o oportunitate reală de venit suplimentar, fără niciun cost din partea ta.",
  },
];

/* ===== Live Viewers Counter ===== */
function LiveViewersCounter() {
  const [viewers, setViewers] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return Math.max(3, Math.min(12, next));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Eye className="w-4 h-4 text-gold" />
      <span className="text-white/60 text-sm font-[var(--font-body)]">
        <strong className="text-gold">{viewers} persoane</strong> vizualizează acum
      </span>
    </div>
  );
}

/* ===== Step Badge for 7-step agenda ===== */
function StepBadge({ step, title, desc, isSpecial = false }: { step: string; title: string; desc: string; isSpecial?: boolean }) {
  return (
    <div
      className={`flex items-start gap-4 sm:gap-5 p-4 sm:p-5 border transition-all duration-300 ${
        isSpecial
          ? "border-gold/40 bg-gold/10 hover:border-gold/60"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-[var(--font-display)] font-bold text-sm ${
          isSpecial
            ? "bg-gold text-black"
            : "bg-white/5 border border-white/20 text-gold"
        }`}
      >
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className={`font-[var(--font-display)] font-semibold text-base sm:text-lg ${
            isSpecial ? "text-gold" : "text-white"
          }`}
        >
          {title}
        </h4>
        {desc && (
          <p className="text-white/40 font-[var(--font-body)] text-sm mt-1 leading-relaxed">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

export default function WebinarIkigai() {
  useTracking("Webinar Ikigai", "webinar");

  const goToCTA = () => {
    window.open(CTA_URL, "_blank", "noopener,noreferrer");
  };

  const scrollToSignup = () => {
    document
      .getElementById("signup-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <SEO
        title="IKIGAI: Cursul Perfect. Cariera Potrivită. Finanțare Completă. | EduForYou"
        description="Descoperă în 90 de minute metoda japoneză prin care alegi cursul universitar corect în UK — fără să renunți la job și fără să pierzi 4 ani pe direcția greșită."
        canonical="/webinar/ikigai"
      />
      {/* Social Proof Toast */}
      <SocialProofToast />

      {/* ===== URGENCY BANNER ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-b border-gold/30">
        <div className="flex items-center justify-center gap-2 sm:gap-4 px-4 py-2.5 text-center flex-wrap">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span className="text-white font-[var(--font-display)] text-xs sm:text-sm font-semibold">
              Webinar GRATUIT —{" "}
              <span className="text-gold font-bold">
                Locuri limitate disponibile
              </span>
            </span>
          </div>
          <span className="text-white/20 hidden sm:inline">·</span>
          <button
            onClick={() => {
              const el = document.getElementById('signup-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/50 text-xs font-[var(--font-display)] cursor-pointer hover:text-white/80 transition-colors"
          >
            Înscrie-te acum
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('signup-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-gold text-black font-[var(--font-display)] font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            Rezervă locul
          </button>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <div className="fixed top-10 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="EduForYou logo"
              className="w-9 h-9 object-contain"
            />
            <span className="font-[var(--font-display)] font-bold text-white text-lg">
              Edu<span className="text-gold">ForYou</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <LiveViewersCounter />
            <button
              onClick={() => {
                const el = document.getElementById('signup-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold font-[var(--font-display)] font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-black transition-all"
            >
              Înscrie-te gratuit
            </button>
          </div>
        </div>
      </div>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(212,175,55,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(212,175,55,0.2) 0%, transparent 50%)",
          }}
        />

        <div className="relative container py-20 sm:py-24">
          {/* ===== HERO GRID: 2 columns desktop, stacked mobile ===== */}
          {/* Mobile order: headline(1) → subheadline(2) → video(3) → form(4) */}
          {/* Desktop: left col = headline + subheadline + video | right col = form */}
          <div className="grid lg:grid-cols-11 gap-10 xl:gap-14 items-start">

            {/* ── LEFT COLUMN (desktop: 6/11 ≈ 55%) ── */}
            <div className="lg:col-span-6 flex flex-col gap-0">

              {/* Badges */}
              <ScrollReveal delay={100}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5">
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    <span className="text-gold text-xs font-[var(--font-display)] font-semibold uppercase tracking-wider">
                      Webinar GRATUIT cu Alin Radu
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-white text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">
                      LIVE — Webinar Online Gratuit
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* 1 — Main Headline */}
              <ScrollReveal delay={150}>
                <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
                  IKIGAI: Cursul Perfect.
                  <br />
                  <span className="text-gold">Cariera Potrivită.</span>
                  <br />
                  <span className="text-white/70">Finanțare Completă.</span>
                </h1>
              </ScrollReveal>

              {/* 2 — Sub-headline */}
              <ScrollReveal delay={220}>
                <p className="text-lg sm:text-xl text-white/60 font-[var(--font-body)] leading-relaxed mb-6">
                  Descoperă în{" "}
                  <strong className="text-gold">90 de minute</strong>{" "}
                  metoda japoneză prin care alegi cursul universitar corect în UK — fără să renunți la job și fără să pierzi 4 ani pe direcția greșită.
                </p>
              </ScrollReveal>

              {/* 3 — Voomly Video */}
              <ScrollReveal delay={280}>
                <div className="w-full mb-6">
                  <VoomlyEmbed />
                </div>
              </ScrollReveal>

              {/* 4 — WebinarJam Form (mobile only — shown below video on small screens) */}
              <div className="lg:hidden">
                <ScrollReveal delay={320}>
                  <div className="border border-gold/20 bg-white/[0.02] p-6">
                    <div className="text-center mb-6">
                      <p className="text-gold font-[var(--font-display)] font-bold text-sm uppercase tracking-wider mb-2">
                        Locuri Limitate
                      </p>
                      <p className="text-white/50 font-[var(--font-body)] text-sm">
                        Înregistrează-te acum pentru acces gratuit + bonusuri exclusive
                      </p>
                    </div>
                    <div className="h-px bg-white/10 mb-6" />
                    <p className="text-white font-[var(--font-display)] font-bold text-lg text-center mb-4">
                      Înscrie-te Gratuit
                    </p>
                    <WebinarJamEmbed />
                  </div>
                </ScrollReveal>
              </div>

              {/* Social proof inline */}
              <ScrollReveal delay={350}>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
                  <div className="flex -space-x-2">
                    {["A", "B", "C", "D", "E"].map((letter) => (
                      <div
                        key={letter}
                        className="w-8 h-8 rounded-full bg-gold/20 border-2 border-[#0A0A0A] flex items-center justify-center"
                      >
                        <span className="text-gold text-xs font-bold">
                          {letter}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-[var(--font-display)] font-bold text-sm">
                      2,847+ participanți
                    </p>
                    <p className="text-white/40 text-xs font-[var(--font-body)]">
                      s-au înscris deja
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a
                    href={CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
                  >
                    Vreau Să Particip
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#ce-inveti"
                    className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-[var(--font-display)] font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all"
                  >
                    Ce vei învăța
                    <ChevronDown className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-white/40 text-sm font-[var(--font-body)]">
                  90 minute · 100% gratuit · Bonusuri exclusive pentru participanți
                </p>
              </ScrollReveal>

              {/* Quick Stats */}
              <ScrollReveal delay={500}>
                <div className="flex flex-wrap gap-6 sm:gap-10 mt-8 pt-8 border-t border-white/10">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= 4
                              ? "text-gold fill-gold"
                              : "text-gold fill-gold/70"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/40">
                      4.8/5 Trustpilot · 163 recenzii
                    </p>
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] font-bold text-white text-xl">
                      7,000+
                    </p>
                    <p className="text-sm text-white/40">Studenți ajutați</p>
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] font-bold text-white text-xl">
                      50+
                    </p>
                    <p className="text-sm text-white/40">Universități partenere</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* ── RIGHT COLUMN (desktop: 5/11 ≈ 45%) — Signup Form, hidden on mobile ── */}
            <div className="hidden lg:block lg:col-span-5">
              <ScrollReveal delay={300} direction="right">
                <div className="border border-gold/20 bg-white/[0.02] p-6 sm:p-8 sticky top-32">
                  <div className="text-center mb-6">
                    <p className="text-gold font-[var(--font-display)] font-bold text-sm uppercase tracking-wider mb-2">
                      Locuri Limitate
                    </p>
                    <p className="text-white/50 font-[var(--font-body)] text-sm">
                      Înregistrează-te acum pentru acces gratuit + bonusuri exclusive
                    </p>
                  </div>

                  <div className="h-px bg-white/10 mb-6" />

                  <p className="text-white font-[var(--font-display)] font-bold text-lg text-center mb-4">
                    Înscrie-te Gratuit
                  </p>

                  <WebinarJamEmbed />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION 2: DESPRE ALIN RADU ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D] relative overflow-hidden">
        <div className="relative container">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Photo - 2 cols */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <div className="relative">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-gold/30 to-gold/5 blur-sm" />
                    <img
                      src={ALIN_PHOTO}
                      alt="Alin Radu – Fondator EduForYou"
                      className="relative w-full aspect-[4/5] object-cover object-top"
                    />
                  </div>
                  <div className="mt-4 p-4 border border-gold/20 bg-gold/5">
                    <p className="font-[var(--font-display)] font-bold text-white text-sm">
                      Alin Radu
                    </p>
                    <p className="text-gold text-xs font-[var(--font-display)] uppercase tracking-wider mt-1">
                      Fondator EduForYou · Speaker Principal
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Mentor · Coach · Antreprenor în Educație
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Bio - 3 cols */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                  Speaker Principal
                </p>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                  Alin Radu
                  <br />
                  <span className="text-gold">
                    Fondator EduForYou · 7,000+ studenți ajutați
                  </span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="space-y-4 text-lg text-white/60 font-[var(--font-body)] leading-relaxed">
                  <p>
                    Am condus TIR-uri prin toată Europa. Știu exact cum e să te
                    simți blocat, fără direcție, fără un plan. Într-o zi am decis
                    că vreau mai mult. M-am înscris la{" "}
                    <strong className="text-white">
                      Criminology în Luton
                    </strong>{" "}
                    — sincer, doar pentru banii de finanțare. Am ales greșit. Am
                    renunțat.
                  </p>
                  <p>
                    A doua șansă a venit la{" "}
                    <strong className="text-white">
                      London Metropolitan University – Marketing
                    </strong>
                    . De data asta, cu un scop clar. Am ales cu inima și cu
                    mintea. Am descoperit ce mă pasionează cu adevărat. Și din
                    acea experiență s-a născut{" "}
                    <strong className="text-gold">EduForYou</strong>.
                  </p>
                  <p>
                    De aceea am creat acest webinar. Pentru că{" "}
                    <strong className="text-white">
                      eu am făcut greșeala pe care tu o poți evita
                    </strong>
                    . Am pierdut timp, bani și energie pe un curs greșit. Acum
                    ajut mii de români să aleagă direcția corectă — fie că e
                    angajat, freelancer sau antreprenor.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      <AnimatedCounter end={7000} suffix="+" />
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Studenți ajutați
                    </p>
                  </div>
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      <AnimatedCounter end={50} suffix="+" />
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Universități partenere
                    </p>
                  </div>
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      £<AnimatedCounter end={250} suffix="K+" />
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Venit generat
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="p-5 border border-gold/30 bg-gold/10">
                  <p className="text-white font-[var(--font-body)] leading-relaxed italic">
                    „Am ales greșit prima dată. Am pierdut un an și finanțarea.
                    Nu vreau să faci aceeași greșeală. De aceea am creat metoda
                    IKIGAI — ca tu să alegi corect de la prima încercare."
                  </p>
                  <p className="text-gold font-[var(--font-display)] font-bold text-sm mt-3">
                    — Alin Radu, Fondator EduForYou
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: CE VEI ÎNVĂȚA ===== */}
      <section id="ce-inveti" className="py-20 sm:py-28">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              Ce vei învăța
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl">
              În 90 de minute vei pleca cu un plan concret
            </h2>
            <p className="text-white/50 font-[var(--font-body)] text-lg leading-relaxed mb-12 max-w-3xl">
              Nu teorie. Nu motivație goală. Pași reali, sistem dovedit, direcție clară.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Compass,
                title: "Claritate în carieră cu metoda IKIGAI",
                desc: "Descoperă intersecția dintre ce iubești, ce ești bun, ce are nevoie piața și ce plătește bine. Alegi cu sistem, nu la întâmplare.",
                num: "01",
              },
              {
                icon: Target,
                title: "Angajat, Freelancer sau Startup?",
                desc: "Cum funcționează fiecare drum în realitate — avantaje, dezavantaje, exemple concrete din piața UK.",
                num: "02",
              },
              {
                icon: GraduationCap,
                title: "Cursul perfect + direcția ta",
                desc: "Cum alegi cursul universitar potrivit pentru direcția ta: angajat stabil, freelancer flexibil sau antreprenor.",
                num: "03",
              },
              {
                icon: BookOpen,
                title: "Studii 100% Finanțate în UK",
                desc: "Pașii exacți de înscriere la un curs finanțat complet prin Student Finance. Zero costuri din buzunarul tău.",
                num: "04",
              },
              {
                icon: CalendarDays,
                title: "Program flexibil: Zi, Seară sau Weekend",
                desc: "Studiezi fără să renunți la job. Opțiuni de program adaptate vieții tale reale din UK.",
                num: "05",
              },
              {
                icon: PoundSterling,
                title: "Cum economisești până la £9K pe an",
                desc: "Taxe, council tax, reduceri studenți, burse și programul de referral — surse reale de economii și venit suplimentar.",
                num: "06",
                isSpecial: true,
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div
                  className={`h-full p-6 border transition-all duration-300 hover:border-gold/40 ${
                    item.isSpecial
                      ? "border-gold/30 bg-gold/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                        item.isSpecial
                          ? "bg-gold/20 border-2 border-gold"
                          : "bg-gold/10 border border-gold/30"
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-white/20 font-[var(--font-display)] font-bold text-3xl">
                      {item.num}
                    </span>
                  </div>
                  <h3
                    className={`font-[var(--font-display)] font-bold text-lg mb-2 ${
                      item.isSpecial ? "text-gold" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: CEI 7 PAȘI — AGENDA ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <ListChecks className="w-5 h-5 text-gold" />
              <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm">
                Cei 7 Pași
              </p>
            </div>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl">
              De la zero la admis — procesul complet
            </h2>
            <p className="text-white/50 font-[var(--font-body)] text-lg leading-relaxed mb-12 max-w-3xl">
              Fiecare pas este clar, concret și ghidat de echipa EduForYou. Știi exact ce urmează.
            </p>
          </ScrollReveal>

          <div className="max-w-3xl space-y-3">
            <ScrollReveal delay={100}>
              <StepBadge
                step="01"
                title="Eligibilitate — verificare"
                desc="Verificăm împreună dacă îndeplinești condițiile pentru finanțare completă prin Student Finance England."
              />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <StepBadge
                step="02"
                title="IKIGAI — cursul perfect + direcția angajat / freelancer / startup"
                desc="Identificăm cursul potrivit pentru tine folosind metoda IKIGAI și stabilim direcția de carieră."
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <StepBadge
                step="03"
                title="Admission AI Platform — simulare 1 la 1"
                desc="Sesiune personalizată pe platforma noastră AI de admitere — simulăm întregul proces înainte să aplici."
              />
            </ScrollReveal>
            <ScrollReveal delay={250}>
              <StepBadge
                step="04"
                title="Testul de admitere"
                desc="Te pregătim și te ghidăm pas cu pas pentru testul de admitere la universitate."
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <StepBadge
                step="05"
                title="Aplicația de finanțare 1 la 1"
                desc="Completăm împreună aplicația Student Finance — fără erori, fără stres, cu suport dedicat."
              />
            </ScrollReveal>
            <ScrollReveal delay={350}>
              <StepBadge
                step="06"
                title="Oferta — admis oficial la universitate în UK"
                desc="Primești oferta oficială de admitere. Ești student în UK."
                isSpecial
              />
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <StepBadge
                step="07"
                title="Enrolment — începe universitatea"
                desc="Te înscrii oficial, alegi programul de studiu și începi primul semestru."
                isSpecial
              />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={450}>
            <div className="max-w-3xl mt-8">
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
              >
                Vreau Să Parcurg Cei 7 Pași
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 5: PROGRAM DE STUDIU ===== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-5 h-5 text-gold" />
              <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm">
                Program Flexibil
              </p>
            </div>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl">
              Studiezi fără să renunți la job
            </h2>
            <p className="text-white/50 font-[var(--font-body)] text-lg leading-relaxed mb-12 max-w-3xl">
              Trei variante de program adaptate vieții tale reale. Tu alegi ce funcționează.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {[
              {
                icon: Briefcase,
                label: "Zi",
                schedule: "Luni + Marți",
                time: "9:45 – 14:15 / 14:45",
                desc: "Ideal dacă lucrezi după-amiaza sau seara. Două zile pe săptămână, dimineața.",
                highlight: false,
              },
              {
                icon: Clock,
                label: "Seară",
                schedule: "3 seri: 18:00 – 21:00",
                time: "sau 2 seri: 16:30 – 18:00",
                desc: "Perfectă pentru cei care lucrează în ture de zi. Studiezi după program.",
                highlight: true,
              },
              {
                icon: Award,
                label: "Weekend",
                schedule: "Sâmbătă sau Duminică",
                time: "10:00 – 17:00 + 3 ore Vineri sau Luni",
                desc: "Maximizezi weekendul. Ideal dacă programul tău de lucru e fix în timpul săptămânii.",
                highlight: false,
              },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 120}>
                <div
                  className={`h-full p-6 sm:p-8 border transition-all duration-300 hover:border-gold/50 ${
                    item.highlight
                      ? "border-gold/40 bg-gold/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-12 h-12 flex items-center justify-center ${
                        item.highlight
                          ? "bg-gold/20 border-2 border-gold"
                          : "bg-gold/10 border border-gold/30"
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span
                      className={`font-[var(--font-display)] font-bold text-xl ${
                        item.highlight ? "text-gold" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.highlight && (
                      <span className="ml-auto px-2 py-0.5 bg-gold text-black text-xs font-[var(--font-display)] font-bold uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="font-[var(--font-display)] font-semibold text-white text-base mb-1">
                    {item.schedule}
                  </p>
                  <p className="text-gold font-[var(--font-display)] font-bold text-sm mb-4">
                    {item.time}
                  </p>
                  <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <p className="text-white/30 font-[var(--font-body)] text-sm mt-6 max-w-3xl">
              * Programele disponibile variază în funcție de universitate și curs. La webinar discutăm varianta potrivită pentru situația ta.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 6: BONUSURI — ÎNSCRIEREA CU EDUFORYOU ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3" />
        <div className="relative container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 bg-gold/10 mb-5">
                <Gift className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">
                  Bonusuri exclusive
                </span>
              </div>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Ce primești când aplici{" "}
                <span className="text-gold">cu EduForYou</span>
              </h2>
              <p className="text-white/50 font-[var(--font-body)] text-lg max-w-2xl mx-auto">
                Nu ești singur în proces. Primești instrumente reale care îți economisesc timp și bani.
              </p>
            </div>
          </ScrollReveal>

          {/* Webinar attendance bonuses */}
          <ScrollReveal delay={100}>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/5 mb-6">
                <Star className="w-3.5 h-3.5 text-gold" />
                <span className="text-white/70 text-xs font-[var(--font-display)] font-semibold uppercase tracking-wider">
                  Bonus pentru toți participanții
                </span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mb-12">
            <ScrollReveal delay={150}>
              <div className="relative flex items-start gap-4 p-6 border border-gold/30 bg-gold/10 hover:border-gold/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gold/20 border-2 border-gold flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-gold font-[var(--font-display)] font-bold text-xs uppercase tracking-wider mb-1">
                    Ebook GRATUIT
                  </p>
                  <h3 className="font-[var(--font-display)] font-bold text-white text-lg mb-1">
                    „De la Carieră Nefericită la Împlinire"
                  </h3>
                  <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                    Ghidul complet pentru a-ți redescoperi direcția profesională și a face pasul spre o viață cu sens.
                  </p>
                </div>
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gold text-black font-[var(--font-display)] font-bold text-xs uppercase">
                  GRATUIT
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative flex items-start gap-4 p-6 border border-gold/30 bg-gold/10 hover:border-gold/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gold/20 border-2 border-gold flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-gold font-[var(--font-display)] font-bold text-xs uppercase tracking-wider mb-1">
                    Audiobook complet GRATUIT
                  </p>
                  <h3 className="font-[var(--font-display)] font-bold text-white text-lg mb-1">
                    Audiobook „De la Carieră Nefericită la Împlinire"
                  </h3>
                  <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                    Versiunea audio completă — ascultă în drum spre muncă, la sală sau oriunde ești.{" "}
                    <strong className="text-gold">Disponibil pentru cei care rămân până la final.</strong>
                  </p>
                </div>
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gold text-black font-[var(--font-display)] font-bold text-xs uppercase">
                  GRATUIT
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Application bonuses */}
          <ScrollReveal delay={250}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/5 mb-6">
              <BadgeCheck className="w-3.5 h-3.5 text-gold" />
              <span className="text-white/70 text-xs font-[var(--font-display)] font-semibold uppercase tracking-wider">
                Bonusuri pentru cei care aplică cu EduForYou
              </span>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {[
              {
                icon: ListChecks,
                title: "Platformă tracking aplicație pas cu pas",
                desc: "Urmărești în timp real fiecare etapă a aplicației tale — știi mereu unde ești și ce urmează.",
              },
              {
                icon: Compass,
                title: "IKIGAI Apply",
                desc: "Acces la instrumentul nostru exclusiv de matching curs-carieră bazat pe metoda IKIGAI.",
              },
              {
                icon: PoundSterling,
                title: "Economisești până la £9K pe an",
                desc: "Ghid complet: taxe studenți, council tax, reduceri, burse și surse de finanțare suplimentară.",
              },
              {
                icon: GraduationCap,
                title: "Sesiune video examene",
                desc: "Nu mai plătești £700–£1,000 pe an pentru pregătire examene. Sesiunile sunt incluse.",
              },
              {
                icon: TrendingUp,
                title: "Referral Program: £500+ per recomandare",
                desc: "Recomanzi un prieten care se înscrie cu succes — câștigi £500 sau mai mult. Fără limită.",
              },
              {
                icon: Facebook,
                title: "Acces la comunitatea EduForYou",
                desc: "Intri în grupul privat de Facebook cu mii de studenți și absolvenți EduForYou din UK.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="flex items-start gap-4 p-5 border border-white/10 bg-white/[0.02] h-full hover:border-gold/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-display)] font-semibold text-white text-base mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Facebook Group CTA */}
          <ScrollReveal delay={500}>
            <div className="mt-10 max-w-5xl">
              <a
                href={FB_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 border border-[#1877F2]/40 bg-[#1877F2]/10 text-white font-[var(--font-display)] font-bold text-base hover:bg-[#1877F2]/20 hover:border-[#1877F2]/60 transition-all group"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                Alătură-te grupului EduForYou pe Facebook
                <ArrowRight className="w-5 h-5 text-[#1877F2] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 7: SUPORT 1-LA-1 GRATUIT ===== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5 mb-5">
                  <HeadphonesIcon className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">
                    Suport complet
                  </span>
                </div>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  Suport 1-la-1 <span className="text-gold">Gratuit</span>
                </h2>
                <p className="text-white/50 font-[var(--font-body)] text-lg max-w-2xl mx-auto">
                  Ghidaj personalizat complet pentru alegerea cursului,
                  pregătirea dosarului și procesul de înscriere.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Compass,
                  title: "Consiliere pentru alegerea cursului",
                  desc: "Un consultant dedicat te ajută să alegi cursul perfect pe baza profilului tău Ikigai.",
                },
                {
                  icon: BookOpen,
                  title: "Ajutor la pregătirea testului",
                  desc: "Te ghidăm pas cu pas prin pregătirea pentru testul de admitere și documentele necesare.",
                },
                {
                  icon: Shield,
                  title: "Suport la aplicație",
                  desc: "De la completarea formularelor până la obținerea finanțării — suntem alături de tine.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 100}>
                  <div className="h-full p-6 border border-white/10 bg-white/[0.02] text-center hover:border-gold/30 transition-all duration-300">
                    <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-[var(--font-display)] font-bold text-white text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: DE CE SĂ PARTICIPI ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              De ce să participi?
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl">
              Pentru că acest webinar îți va da exact ce îți lipsește acum
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              {
                icon: Lightbulb,
                title: "Claritate în direcția profesională",
                desc: "Nu mai ghicești. Decizi cu sistem.",
              },
              {
                icon: Target,
                title: "Metodă simplă de alegere",
                desc: "Ikigai — framework-ul care aliniază pasiunea cu piața.",
              },
              {
                icon: GraduationCap,
                title: "Pași concreți pentru studii finanțate",
                desc: "Exact ce trebuie să faci, pas cu pas.",
              },
              {
                icon: Users,
                title: "Suport real de la experți",
                desc: "Nu ești singur. Echipa EduForYou e alături de tine.",
              },
              {
                icon: Gift,
                title: "Bonusuri valoroase",
                desc: "Ebook + Audiobook gratuit + instrumente exclusive pentru aplicanți.",
              },
              {
                icon: MessageCircle,
                title: "Networking cu alți profesioniști",
                desc: "Comunitate de români ambițioși din UK.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="flex items-start gap-4 p-5 border border-white/10 bg-white/[0.02] h-full hover:border-gold/30 transition-all duration-300">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-display)] font-semibold text-white text-base mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="text-center mt-10">
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
              >
                Vreau Să Particip Gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 9: SOCIAL PROOF ===== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4 text-center">
              Rezultate dovedite
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-12 text-center max-w-3xl mx-auto">
              Peste 7,000 de studenți au ales deja calea corectă.
            </h2>
          </ScrollReveal>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {[
              { value: 7000, suffix: "+", label: "Studenți ajutați", prefix: "" },
              { value: 50, suffix: "+", label: "Universități partenere", prefix: "" },
              { value: 163, suffix: "", label: "Recenzii Trustpilot", prefix: "" },
              { value: 37, suffix: "K+", label: "Urmăritori TikTok", prefix: "" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                  <p className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-gold">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="text-white/40 text-sm mt-1 font-[var(--font-body)]">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Testimonials Carousel */}
          <ScrollReveal delay={100}>
            <TestimonialsCarousel />
          </ScrollReveal>

          {/* Trustpilot badge */}
          <ScrollReveal delay={300}>
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= 4
                        ? "text-gold fill-gold"
                        : "text-gold fill-gold/70"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/50 font-[var(--font-body)]">
                <strong className="text-white">4.8/5</strong> pe Trustpilot ·
                163 recenzii verificate
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 10: SIGNUP FORM ===== */}
      <section id="signup-section" className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                Rezervă-ți locul gratuit
              </p>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Înscrie-te la webinar în 30 de secunde.
              </h2>
              <p className="text-white/50 font-[var(--font-body)] text-lg max-w-2xl mx-auto">
                Webinar LIVE gratuit — completează formularul și primești acces instant + bonusuri exclusive.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="max-w-2xl mx-auto p-6 sm:p-10 border border-white/10 bg-white/[0.01]">
              <WebinarJamEmbed />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              FAQ
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-tight mb-10 max-w-3xl">
              Întrebări Frecvente
            </h2>
          </ScrollReveal>

          <div className="max-w-3xl space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 50}>
                <FAQItem q={item.q} a={item.a} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 12: FINAL CTA ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
        <div className="relative container text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/10 mb-6">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-[var(--font-display)] font-bold uppercase tracking-wider">
                Locuri limitate disponibile
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
              Ești pregătit să faci pasul următor?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-xl text-white/50 font-[var(--font-body)] mb-10 max-w-2xl mx-auto">
              Înscrie-te acum și descoperă direcția corectă pentru cariera ta —
              cu suport gratuit la fiecare pas.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-black font-[var(--font-display)] font-bold text-lg uppercase tracking-wider hover:bg-gold-light transition-all group"
            >
              Rezervă-ți Locul Gratuit
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/40 font-[var(--font-body)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> 100% Gratuit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> Fără obligații
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> Acces instant
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-gold" /> Ebook + Audiobook GRATUIT
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t border-white/5">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="EduForYou logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-[var(--font-display)] font-bold text-white">
                Edu<span className="text-gold">ForYou</span>
              </span>
            </div>
            <p className="text-white/30 text-sm font-[var(--font-body)]">
              &copy; {new Date().getFullYear()} EduForYou. Toate drepturile
              rezervate.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.trustpilot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors text-sm font-[var(--font-body)]"
              >
                Trustpilot
              </a>
              <a
                href={FB_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors text-sm font-[var(--font-body)]"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/@eduforyou"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors text-sm font-[var(--font-body)]"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
