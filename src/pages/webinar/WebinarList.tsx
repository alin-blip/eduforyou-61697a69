/**
 * Webinar Listing Page – same gold/dark Brutalist Authority theme as eduforyou.academy
 */
import { ArrowRight, Zap, GraduationCap, Briefcase, Calendar, Clock, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/webinar/ScrollReveal";
import CountdownTimer from "@/components/webinar/CountdownTimer";
import { useLanguage } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/pfqgUoDdpaWiyRKC.png";

export default function WebinarListPage() {
  const { t } = useLanguage();

  const WEBINARS = [
    {
      slug: "university",
      icon: GraduationCap,
      badge: t("webinarList.liveBadge"),
      title: t("webinarList.universityTitle"),
      subtitle: t("webinarList.universitySubtitle"),
      points: [
        t("webinarList.universityPoint1"),
        t("webinarList.universityPoint2"),
        t("webinarList.universityPoint3"),
      ],
      cta: t("webinarList.cta"),
      when: t("webinarList.universityWhen"),
    },
    {
      slug: "agents",
      icon: Briefcase,
      badge: t("webinarList.liveBadge"),
      title: t("webinarList.agentsTitle"),
      subtitle: t("webinarList.agentsSubtitle"),
      points: [
        t("webinarList.agentsPoint1"),
        t("webinarList.agentsPoint2"),
        t("webinarList.agentsPoint3"),
      ],
      cta: t("webinarList.cta"),
      when: t("webinarList.agentsWhen"),
    },
    {
      slug: "ikigai",
      icon: Compass,
      badge: "NOU",
      title: t("webinarList.ikigaiTitle") || "Descoperă-ți Ikigai: Angajat, Freelancer sau Startup?",
      subtitle: t("webinarList.ikigaiSubtitle") || "Cum alegi direcția corectă — și cum poți studia GRATUIT în UK",
      points: [
        t("webinarList.ikigaiPoint1") || "Testul Ikigai live — descoperă la ce ești făcut",
        t("webinarList.ikigaiPoint2") || "Freedom Launchpad: planul tău personalizat de carieră",
        t("webinarList.ikigaiPoint3") || "Cum să studiezi gratuit cu finanțare completă în UK",
      ],
      cta: t("webinarList.cta"),
      when: t("webinarList.ikigaiWhen") || "Disponibil acum · Vizionează oricând",
    },
  ];

  const STATS = [
    { value: "7,000+", label: t("webinarList.statsStudents") },
    { value: "200+", label: t("webinarList.statsAgents") },
    { value: "£35M+", label: t("webinarList.statsFunding") },
    { value: "100%", label: t("webinarList.statsFree") },
  ];

  return (
    <div className="webinar-theme min-h-screen bg-[#0A0A0A]">
      <SEO
        title="Webinar Gratuit — Înscrie-te la Universitate | EduForYou"
        description="Participă la webinarul gratuit EduForYou și află cum te poți înscrie la universitate în UK cu finanțare completă."
        canonical="/webinar"
      />

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="EduForYou logo" className="w-9 h-9 object-contain" />
            <span className="font-[var(--font-display)] font-bold text-white text-lg">Edu<span className="text-gold">ForYou</span></span>
          </Link>
          <Link to="/" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 font-[var(--font-display)] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all">
            &#x2190; {t("webinarList.backToSite")}
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/3" />
        <div className="relative container">
          <ScrollReveal>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5 mb-6">
                <Zap className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-[var(--font-display)] font-semibold uppercase tracking-wider">{t("webinarList.liveWebinarsFree")}</span>
              </div>
              <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                {t("webinarList.heroTitle")} <span className="text-gold">{t("webinarList.heroTitleHighlight")}</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/50 font-[var(--font-body)] max-w-2xl mx-auto">
                {t("webinarList.heroSubtitle")}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex justify-center mt-8 mb-4">
              <div>
                <p className="text-sm text-white/40 font-[var(--font-display)] uppercase tracking-wider mb-3 text-center">{t("webinarList.nextWebinar")}</p>
                <CountdownTimer />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WEBINAR CARDS */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {WEBINARS.map((w, i) => (
              <ScrollReveal key={w.slug} delay={i * 150}>
                <div className="border border-white/10 bg-white/[0.02] h-full flex flex-col">
                  {/* Card header */}
                  <div className="p-6 sm:p-8 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <w.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div className={`px-2.5 py-0.5 text-xs font-[var(--font-display)] font-bold uppercase tracking-wider ${w.badge === "LIVE" ? "bg-red-600 text-white animate-pulse" : "border border-gold/30 bg-gold/5 text-gold"}`}>
                        {w.badge === "LIVE" && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 align-middle animate-pulse"></span>}
                        {w.badge}
                      </div>
                    </div>
                    <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                      {w.title}
                    </h2>
                    <p className="text-white/50 font-[var(--font-body)] text-sm">{w.subtitle}</p>
                  </div>
                  {/* Card body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-white/40 font-[var(--font-display)] uppercase tracking-wider mb-6">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {w.when.split("·")[0].trim()}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {w.when.split("·")[1]?.trim()}</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {w.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0" />
                          <span className="text-white/60 font-[var(--font-body)] text-sm">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={`/webinar/${w.slug}`} className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group">
                      {w.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="border border-white/10 bg-white/[0.02] p-5 text-center">
                  <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-1 font-[var(--font-body)]">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src={LOGO_URL} alt="EduForYou logo" className="w-8 h-8 object-contain" />
              <span className="font-[var(--font-display)] font-bold text-white">Edu<span className="text-gold">ForYou</span></span>
            </div>
            <p className="text-white/30 text-sm font-[var(--font-body)]">{`© ${new Date().getFullYear()} ${t("webinarList.footerCopyright")}`}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
