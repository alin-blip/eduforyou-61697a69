/**
 * Home Page – EduForYou Webinar Landing Page
 * Design: Brutalist Authority – dark bg, gold accents, Space Grotesk display, DM Sans body
 * Structure: Russell Brunson Perfect Webinar style
 * Brand Voice: Direct, autoritar, disciplinat, protector (EduForYou Brand Voice Guide)
 * Sections: Hero → Confruntare → 3 Secrete → EduMethod → De ce e gratuit → Bonus → Social Proof → Quiz → Cursuri → FAQ → CTA
 */
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Clock,
  Gift,
  GraduationCap,
  Heart,
  MapPin,
  PiggyBank,
  Plus,
  Shield,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import CountdownTimer from "@/components/webinar/CountdownTimer";
import { useLanguage } from "@/i18n/LanguageContext";
import AnimatedCounter from "@/components/webinar/AnimatedCounter";
import EligibilityQuiz from "@/components/webinar/EligibilityQuiz";
import ScrollReveal from "@/components/webinar/ScrollReveal";
import TestimonialsCarousel from "@/components/webinar/TestimonialsCarousel";
import { useTracking } from "@/hooks/useTracking";
import SEO from "@/components/SEO";

// Asset URLs
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/pfqgUoDdpaWiyRKC.png";
const GUIDE_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/cPsODpsWbeEbNjFz.png";
const HERO_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/cz5WEyHE1hTeoNFOp8JYtX/sandbox/OQ8Y3rAFv0gVqAYWy0aBwk-img-1_1771578811000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3o1V0V5SEUxaFRlb05GT3A4Sll0WC9zYW5kYm94L09ROFkzckFGdjBnVnFBWVd5MGFCd2staW1nLTFfMTc3MTU3ODgxMTAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=aztKVyjQzcAO0ArkR-qsWCR3eXB3ibpOwxWVQC7hN9TE71QqpNxGVe1A7nJw-8YWgMEL2ql7ZarOujhI3tlzTXyUBdu8hiXV4WEfFrFCI~oTCQiHhbuagWLnld-Z~uXMgEsW5Lt1D39a8gD-EEsnWNpWqMI53idEFqlfxtCuYpfNdN6yLLVY~6Js-rdc4H5HDB0Zl4qduoCv~~hH1yG66odmwkUPxp60WqfXQvGMSEG6idvigvrqqyBXw-X3nPJUbnrp1emfoZjKSdJfxZgyvuAqWY9oc3xx88qOSQ5ACcXhytrBHpwiu9X7gmq9zIov5JbFZQ25njgAkIt3yzaqHg__";
const CONFRONTATION_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/cz5WEyHE1hTeoNFOp8JYtX/sandbox/OQ8Y3rAFv0gVqAYWy0aBwk-img-2_1771578813000_na1fn_Y29uZnJvbnRhdGlvbi1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3o1V0V5SEUxaFRlb05GT3A4Sll0WC9zYW5kYm94L09ROFkzckFGdjBnVnFBWVd5MGFCd2staW1nLTJfMTc3MTU3ODgxMzAwMF9uYTFmbl9ZMjl1Wm5KdmJuUmhkR2x2YmkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qqOkuelTupIXTYmwvGzvLxwzsnu6pPHWlOjM8HUSA7etKIYoRrJrv1Vi2po-i3VH8NWEmbCRhZHAKeHak5~zxzJ63XClHBoE2HCpeHKTMU8CLdQDJK2du0bzaYPe0J5YX9CEJS0bBwv2G89I9lAjZtmngBB2bPLXnO-n35vHAAPvPsDa6bTnjabRntQN~HNYaAoJunumXtMbBuFky0KRYj~2biK1AZoi9V~lVo8cA5zS8nxwe9nRuMmrL~ooaLyYuLMYv2FLoO-4YOWrjyvq-7xskx6qdpIzVKjbNZ1CdGRHMduJYkq7U0M21V82UyZVhOeAHfAs7~STi-gewR9yeQ__";
const TRANSFORMATION_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/cz5WEyHE1hTeoNFOp8JYtX/sandbox/OQ8Y3rAFv0gVqAYWy0aBwk-img-3_1771578800000_na1fn_dHJhbnNmb3JtYXRpb24tYmc.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3o1V0V5SEUxaFRlb05GT3A4Sll0WC9zYW5kYm94L09ROFkzckFGdjBnVnFBWVd5MGFCd2staW1nLTNfMTc3MTU3ODgwMDAwMF9uYTFmbl9kSEpoYm5ObWIzSnRZWFJwYjI0dFltYy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rc5V6wZiAkKSlw7Rg5jlsKzfTZWvIPwN37DfnvEHDcdilGh-kc5q8-F7-nCh~MUJ~ehH7jSBrcs1Qf~D~uGQTfAsTbxoRntdbf9OwkN82-6qgMaBVI~ghKxIBCi4dhqPIXg3QwAANJylD4wpwg-pt2ISYzRrXHMca92VUwz2tbx~CrDBcNVoxN7nZ-jLRgwupB-Ast1ahfyT7Aya1jSUkgRr35enJISLxDhAFcNjlI3DJRIPSvGgLoXc9f5QSM9cfrEO5wP~WcfpgduWZlt7btQVt~D2QQlTitREeUBXhaiUg9o45iYvUV9XCqaIMp0svMSjE7MBLzEZO8a0A2OCsg__";
const REFERRAL_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/cz5WEyHE1hTeoNFOp8JYtX/sandbox/OQ8Y3rAFv0gVqAYWy0aBwk-img-4_1771578809000_na1fn_cmVmZXJyYWwtdmlzdWFs.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3o1V0V5SEUxaFRlb05GT3A4Sll0WC9zYW5kYm94L09ROFkzckFGdjBnVnFBWVd5MGFCd2staW1nLTRfMTc3MTU3ODgwOTAwMF9uYTFmbl9jbVZtWlhKeVlXd3RkbWx6ZFdGcy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=kxbLhXAcHJ~pbxhJex4YKy6YqeT8tZ87Xzu2~5cddJKL3AfwKPEhkODCs9kWpXPHu~bMoCfjyD96b3LlttPyFHhtd-FGr0fPP2mMgpNHMTjY5TW9B52JwhkexOL5mfqx2gCL3xs7oyQ4-BoYIvFTq~xo~PoOD8WCfl8QQ43bWN9zs92iQh-groKwI45IV3q9etNT9z0v~rI67SZDZ0GCK-0Z9Itrwl2Y5iwUWW6d3pe1idtckk~RH5iclI1ua0rS6qHPwsxD66Ii5txQF0yxvKA865U9p4TKZrtdyQqZPkb4TFF60MNaluIAU1PLZk6OvvC89YtOQHha38tm2EXuMg__";
const ALIN_PHOTO = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/mGOAPBSUbTiTKuPu.jpg";
const EDUMETHOD_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/cz5WEyHE1hTeoNFOp8JYtX/sandbox/OQ8Y3rAFv0gVqAYWy0aBwk-img-5_1771578813000_na1fn_ZWR1bWV0aG9kLXZpc3VhbA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY3o1V0V5SEUxaFRlb05GT3A4Sll0WC9zYW5kYm94L09ROFkzckFGdjBnVnFBWVd5MGFCd2staW1nLTVfMTc3MTU3ODgxMzAwMF9uYTFmbl9aV1IxYldWMGFHOWtMWFpwYzNWaGJBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=r8j0OVECuOSE08bZ7ccA6cWxle4wbyEiTE2aPE~rvqZBFSxWs6PCC7su8-yOhKljVDps~WKSY1K4GDtFat76SVmgbtxkk9PdzyxAdnzn87J0V9UZZ8E4RULOkSje46JvPmnYUPUCdnTiDyVzEUfhtEoMPEtBydfc-erL4lwS~egAbOwYVnGJF9u90E2BesIUqeOV7zvRMUi9yB534L8ASmEVhew-rkcpv7dunMF1puz2kxfr1eXIca7lUWDi~gUgT9b8Ww8NlR~pDfr25qAGMVMg-g~1~aIhDu3vBGseNHFItEg186laWrsQmEfZjL4qbAym0ttaGPl55TGdW5D1Yg__";

// FAQ_ITEMS moved inside component to access t()

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

export default function WebinarUniversity() {
  const { t } = useLanguage();
  useTracking("Webinar University", "webinar");
  const FAQ_ITEMS = [
    { q: t("webinarUni.faq1Q"), a: t("webinarUni.faq1A") },
    { q: t("webinarUni.faq2Q"), a: t("webinarUni.faq2A") },
    { q: t("webinarUni.faq3Q"), a: t("webinarUni.faq3A") },
    { q: t("webinarUni.faq4Q"), a: t("webinarUni.faq4A") },
    { q: t("webinarUni.faq5Q"), a: t("webinarUni.faq5A") },
    { q: t("webinarUni.faq6Q"), a: t("webinarUni.faq6A") },
    { q: t("webinarUni.faq7Q"), a: t("webinarUni.faq7A") },
    { q: t("webinarUni.faq8Q"), a: t("webinarUni.faq8A") },
  ];
  const scrollToQuiz = () => {
    document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <SEO
        title="Webinar Universitate — Ghid Complet Înscriere UK | EduForYou"
        description="Webinar complet despre procesul de înscriere la universitate în UK. Află totul despre cursuri, finanțare și campusuri."
        canonical="/webinar/universitate"
      />
      {/* ===== NAVBAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-white/10">
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
          <a
            href="https://event.webinarjam.com/llowom/register/o1z0zmby?webinar_id=13"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold font-[var(--font-display)] font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-black transition-all"
          >
            {t("webinarUni.navCta")}
          </a>
        </div>
      </div>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-28">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Student confident la universitate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30" />
        </div>

        <div className="relative container py-20 sm:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <ScrollReveal delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/30 bg-gold/5 mb-6">
                <Zap className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-[var(--font-display)] font-semibold uppercase tracking-wider">
                  {t("webinarUni.heroBadge")}
                </span>
              </div>
            </ScrollReveal>

            {/* Main Headline – sentence case */}
            <ScrollReveal delay={200}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 mb-4 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-white text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">{t("webinarUni.liveDate")}</span>
              </div>
              <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] mb-6">
                Înscrie-te la universitate în UK,
                <br />
                adu un prieten și
                <br />
                <span className="text-gold">câștigă de la £500</span> prin recomandări de recrutare.
              </h1>
            </ScrollReveal>

            {/* 3 Webinar Learning Cards – always side by side */}
            <ScrollReveal delay={280}>
              <div className="flex flex-row gap-2 sm:gap-3 mb-8 w-full">
                {/* Card 1 */}
                <div className="flex-1 min-w-0 border border-gold/30 bg-gold/5 p-2 sm:p-4">
                  <div className="text-gold text-lg sm:text-2xl mb-1 sm:mb-2">🎯</div>
                  <p className="font-[var(--font-display)] font-bold text-white text-[10px] sm:text-sm leading-tight mb-0.5 sm:mb-1">
                    {t("webinarUni.card1Title")}
                  </p>
                  <p className="text-white/50 font-[var(--font-body)] text-[9px] sm:text-xs leading-tight">
                    {t("webinarUni.card1Sub")}
                  </p>
                </div>
                {/* Card 2 */}
                <div className="flex-1 min-w-0 border border-gold/30 bg-gold/5 p-2 sm:p-4">
                  <div className="text-gold text-lg sm:text-2xl mb-1 sm:mb-2">💰</div>
                  <p className="font-[var(--font-display)] font-bold text-white text-[10px] sm:text-sm leading-tight mb-0.5 sm:mb-1">
                    {t("webinarUni.card2Title")}
                  </p>
                  <p className="text-white/50 font-[var(--font-body)] text-[9px] sm:text-xs leading-tight">
                    E.D.U Method™
                  </p>
                </div>
                {/* Card 3 */}
                <div className="flex-1 min-w-0 border border-gold/30 bg-gold/5 p-2 sm:p-4">
                  <div className="text-gold text-lg sm:text-2xl mb-1 sm:mb-2">🤝</div>
                  <p className="font-[var(--font-display)] font-bold text-white text-[10px] sm:text-sm leading-tight mb-0.5 sm:mb-1">
                    {t("webinarUni.card3Title")}
                  </p>
                  <p className="text-white/50 font-[var(--font-body)] text-[9px] sm:text-xs leading-tight">
                    {t("webinarUni.card3Sub")}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Sub-headline */}
            <ScrollReveal delay={300}>
              <p className="text-lg sm:text-xl text-white/60 font-[var(--font-body)] leading-relaxed max-w-2xl mb-8">
                În plus, obții finanțare până la £25,000 pe an și toate serviciile noastre gratuite.
                Participă la webinarul nostru gratuit disponibil acum și află totul.
              </p>
            </ScrollReveal>

            {/* Countdown */}
            <ScrollReveal delay={400}>
              <div className="mb-8">
                <p className="text-sm text-white/40 font-[var(--font-display)] uppercase tracking-wider mb-3">
                  {t("webinarUni.countdownLabel")}
                </p>
                <CountdownTimer />
              </div>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={500}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToQuiz}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
                >
                  {t("webinarUni.heroCta")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#ce-inveti"
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-[var(--font-display)] font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  {t("webinarUni.heroCtaSecondary")}
                  <ChevronDown className="w-5 h-5" />
                </a>
              </div>
            </ScrollReveal>

            {/* Quick Stats */}
            <ScrollReveal delay={600}>
              <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= 4 ? "text-gold fill-gold" : "text-gold fill-gold/70"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-white/40">{t("webinarUni.trustpilotShort")}</p>
                </div>
                <div>
                  <p className="font-[var(--font-display)] font-bold text-white text-xl">37K+</p>
                  <p className="text-sm text-white/40">{t("webinarUni.statTiktok")}</p>
                </div>
                <div>
                  <p className="font-[var(--font-display)] font-bold text-white text-xl">7,000+</p>
                  <p className="text-sm text-white/40">{t("webinarUni.statStudents")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: CONFRUNTAREA (Pattern Interrupt) ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={CONFRONTATION_IMG}
            alt="Muncitor în depozit"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/70" />
        </div>

        <div className="relative container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-6">
              {t("webinarUni.confrontBadge")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8 max-w-4xl">
              Câți ani mai vrei să pierzi în jobul ăsta?
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-12">
            <ScrollReveal delay={200}>
              <p className="text-lg text-white/60 font-[var(--font-body)] leading-relaxed">
                Realitatea din UK pentru mulți este dură: muncă fizică, ore suplimentare, zero perspective
                de avansare. Fiecare an petrecut așa te costă nu doar bani, ci și respect de sine și
                timp pe care nu-l vei mai recupera niciodată.
              </p>
              <p className="text-lg text-white/60 font-[var(--font-body)] leading-relaxed mt-4">
                Diferența dintre un salariu minim și o carieră de £35,000/an este de peste £15,000 anual.
                În 5 ani, inacțiunea ta te costă £75,000. Ești pregătit să plătești acest preț?
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="space-y-6">
                <div className="border border-red-500/20 bg-red-500/5 p-6">
                  <p className="text-red-400 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider mb-2">
                    {t("webinarUni.inactionCost")}
                  </p>
                  <p className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white">
                    £<AnimatedCounter end={75000} />
                  </p>
                  <p className="text-white/40 text-sm mt-1">{t("webinarUni.inactionDesc")}</p>
                </div>

                <div className="border border-gold/20 bg-gold/5 p-6">
                  <p className="text-gold font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider mb-2">
                    {t("webinarUni.gainTitle")}
                  </p>
                  <p className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white">
                    £<AnimatedCounter end={35000} suffix="/an" />
                  </p>
                  <p className="text-white/40 text-sm mt-1">{t("webinarUni.gainDesc")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: CELE 3 SECRETE (Russell Brunson) ===== */}
      <section id="ce-inveti" className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              {t("webinarUni.secretsBadge")}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-4xl">
              3 lucruri care îți vor schimba perspectiva asupra carierei
            </h2>
            <p className="text-white/50 font-[var(--font-body)] text-lg leading-relaxed mb-12 max-w-3xl">
              Acesta nu este un webinar motivațional. Este un training de execuție în care îți arătăm
              exact ce trebuie să faci, cum să faci și de ce funcționează.
            </p>
          </ScrollReveal>

          {/* Secret 1: Ikigai */}
          <ScrollReveal delay={100}>
            <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 mb-6 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 border-2 border-gold bg-gold/10 flex items-center justify-center">
                  <span className="font-[var(--font-display)] text-2xl font-bold text-gold">01</span>
                </div>
                <div>
                  <h3 className="font-[var(--font-display)] font-bold text-white text-xl sm:text-2xl mb-3">
                    Cum să alegi cursul prin metoda <span className="text-gold">Ikigai</span>
                  </h3>
                  <p className="text-white/60 font-[var(--font-body)] text-lg leading-relaxed mb-4">
                    Nu alegi un curs la întâmplare. Îți arătăm metoda Ikigai care unește 4 elemente esențiale:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { emoji: "❤️", text: "Ce îți place să faci" },
                      { emoji: "💪", text: "La ce ești bun" },
                      { emoji: "🌍", text: "Ce are nevoie piața" },
                      { emoji: "💰", text: "Pe ce poți fi foarte bine plătit" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2.5 p-3 border border-white/5 bg-white/[0.01]">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-white/70 font-[var(--font-body)] text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 font-[var(--font-body)] text-sm mt-4 leading-relaxed">
                    Fără această aliniere, riști să pierzi 4 ani de zile și finanțarea doar ca să te găsești în același job – sau într-un job pe care îl urăști.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Secret 2: E.D.U Method */}
          <ScrollReveal delay={200}>
            <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 mb-6 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 border-2 border-gold bg-gold/10 flex items-center justify-center">
                  <span className="font-[var(--font-display)] text-2xl font-bold text-gold">02</span>
                </div>
                <div>
                  <h3 className="font-[var(--font-display)] font-bold text-white text-xl sm:text-2xl mb-3">
                    Metoda <span className="text-gold">E.D.U</span> care elimină confuzia
                  </h3>
                  <p className="text-white/60 font-[var(--font-body)] text-lg leading-relaxed mb-4">
                    Totul este 1 la 1 cu un consultant dedicat. Eliminăm confuzia legată de:
                  </p>
                  <ul className="space-y-2.5 mb-4">
                    {[
                      "Alegerea cursului potrivit pentru tine",
                      "Programul de studiu și cum se integrează cu jobul tău",
                      "Frica de trecere a testului de admitere – te pregătim complet",
                      "Asigurarea că primești suma maximă la finanțare în funcție de situația ta",
                      "Documentele necesare și fiecare pas al procesului",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-white/60 font-[var(--font-body)]">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/40 font-[var(--font-body)] text-sm leading-relaxed">
                    Nu ești singur în acest proces. Ai un consultant care te ghidează de la prima întâlnire până la înscrierea finală.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Secret 3: Earn While You Learn */}
          <ScrollReveal delay={300}>
            <div className="border border-gold/20 bg-gold/[0.03] p-6 sm:p-10 hover:border-gold/40 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 border-2 border-gold bg-gold/20 flex items-center justify-center">
                  <span className="font-[var(--font-display)] text-2xl font-bold text-gold">03</span>
                </div>
                <div>
                  <h3 className="font-[var(--font-display)] font-bold text-white text-xl sm:text-2xl mb-3">
                    Cum să <span className="text-gold">câștigi</span> în timp ce înveți
                  </h3>
                  <p className="text-white/60 font-[var(--font-body)] text-lg leading-relaxed mb-4">
                    Sistemul nostru de comisionare progresiv îți permite să câștigi bani reali în timp ce studiezi:
                  </p>

                  <div className="space-y-2 mb-6">
                    {[
                      { range: "1 – 8 studenți recomandați", amount: "£500", highlight: false },
                      { range: "9+ studenți recomandați", amount: "£600", highlight: false },
                      { range: "25+ studenți recomandați", amount: "£700", highlight: true },
                    ].map((tier) => (
                      <div
                        key={tier.range}
                        className={`flex items-center justify-between p-4 border ${
                          tier.highlight
                            ? "border-gold/40 bg-gold/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-white font-[var(--font-body)]">{tier.range}</span>
                        <span className="font-[var(--font-display)] font-bold text-gold text-xl">
                          {tier.amount}/student
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border border-gold/30 bg-gold/10 mb-4">
                    <p className="text-gold font-[var(--font-display)] text-sm font-bold uppercase tracking-wider mb-2">
                      Bonus: 5+ studenți recomandați
                    </p>
                    <p className="text-white/70 font-[var(--font-body)] text-sm leading-relaxed">
                      Dacă aduci peste 5 studenți (ex: 10 studenți), primești <strong className="text-white">plată lunară</strong> pentru
                      jumătate din studenții care au primit oferta. Aceasta devine o sursă de venit recurentă.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 border border-white/10 bg-white/[0.02]">
                    <Zap className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-white/70 font-[var(--font-body)] text-sm leading-relaxed">
                      <strong className="text-white">Acces gratuit la programul de referral</strong> – de obicei costă £200/lună,
                      dar ca student EduForYou primești acces complet gratuit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 4: EDUMETHOD ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                  {t("webinarUni.methodBadge")}
                </p>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {t("webinarUni.methodTitle")}
                </h2>
                <p className="text-white/50 font-[var(--font-body)] text-lg leading-relaxed mb-10">
                  Am creat EduMethod nu ca pe o soluție magică, ci ca pe un framework ingineresc pentru succes.
                  Este un proces structurat care te ghidează de la decizie la absolvire.
                </p>
              </ScrollReveal>

              <div className="space-y-6">
                {[
                  {
                    letter: "E",
                    title: "EVALUATE",
                    subtitle: "Evaluăm. Aliniem. Planificăm.",
                    desc: "Verificăm eligibilitatea, aliniem cursul cu viziunea ta de carieră și stabilim un plan clar. Fără aliniere, nu există start.",
                  },
                  {
                    letter: "D",
                    title: "DELIVER",
                    subtitle: "Executăm. Ghidăm. Finalizăm.",
                    desc: "Te ghidăm pas cu pas prin procesul de aplicare, finanțare și înscriere. Primești checklist, suport pentru documente și pregătire pentru test.",
                  },
                  {
                    letter: "U",
                    title: "UNLOCK",
                    subtitle: "Deblocăm. Susținem. Transformăm.",
                    desc: "Odată intrat, nu ești singur. Ai acces la comunitate, suport academic și oportunități de carieră. Misiunea noastră se termină la absolvirea ta.",
                  },
                ].map((step, i) => (
                  <ScrollReveal key={step.letter} delay={i * 150}>
                    <div className="flex gap-5 group">
                      <div className="flex-shrink-0 w-14 h-14 border-2 border-gold bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-all duration-300">
                        <span className="font-[var(--font-display)] text-2xl font-bold text-gold group-hover:text-black transition-colors">
                          {step.letter}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-[var(--font-display)] font-bold text-white text-lg">
                          {step.title}
                        </h3>
                        <p className="text-gold/70 text-sm font-[var(--font-display)] mb-1">
                          {step.subtitle}
                        </p>
                        <p className="text-white/50 font-[var(--font-body)] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <ScrollReveal delay={200} direction="right">
              <div className="relative">
                <img
                  src={EDUMETHOD_IMG}
                  alt="EduMethod – Evaluate, Deliver, Unlock"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: DE CE E GRATUIT + POVESTEA FONDATORULUI ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D] relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img
                  src={REFERRAL_IMG}
                  alt="Comunitatea EduForYou"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0D0D]/30" />
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal>
                <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                  {t("webinarUni.freeBadge")}
                </p>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Serviciile noastre sunt <span className="text-gold">100% gratuite</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-white/60 font-[var(--font-body)] text-lg leading-relaxed mb-6">
                  Universitatea ne plătește pentru serviciile noastre la 3-4 luni după ce studentul începe studiile.
                  Acest model ne permite să oferim consultanță complet gratuită și chiar să plătim comision
                  celor care recomandă alți studenți.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="space-y-3 mb-6">
                  {[
                    t("webinarUni.freeItem1"),
                    t("webinarUni.freeItem2"),
                    t("webinarUni.freeItem3"),
                    t("webinarUni.freeItem4"),
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-white/70 font-[var(--font-body)]">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="p-5 border border-gold/20 bg-gold/5">
                  <p className="text-gold font-[var(--font-display)] text-sm font-bold uppercase tracking-wider mb-3">
                    {t("webinarUni.founderBadge")}
                  </p>
                  <p className="text-white/70 font-[var(--font-body)] leading-relaxed italic">
                    „Am lucrat pe TIR până când mi-am schimbat viața urmând o universitate. Dacă eu am reușit,
                    reușești și tu. Din acea experiență s-a născut EduForYou – agenția care a schimbat viața
                    a peste <strong className="text-white not-italic">7,000 de români din UK</strong> prin acces la educație universitară."
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5B: CINE SUNT – POVESTEA LUI ALIN ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0A0A0A] to-[#0D0D0D]" />
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
                    alt="Alin-Florin Radu – Co-fondator EduForYou"
                    className="relative w-full aspect-[4/5] object-cover object-top"
                  />
                </div>
                <div className="mt-4 p-4 border border-gold/20 bg-gold/5">
                  <p className="font-[var(--font-display)] font-bold text-white text-sm">Alin-Florin Radu</p>
                  <p className="text-gold text-xs font-[var(--font-display)] uppercase tracking-wider mt-1">{t("webinarUni.alinRole")}</p>
                  <p className="text-white/40 text-xs mt-1">Co-fondator EduForYou</p>
                </div>
              </div>
            </ScrollReveal>
            </div>

            {/* Story - 3 cols */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                  {t("webinarUni.whoAmI")}
                </p>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                  De la TIR la universitate.<br />
                  <span className="text-gold">De la universitate la EduForYou.</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="space-y-4 text-white/60 font-[var(--font-body)] leading-relaxed">
                  <p>
                    Am condus TIR-uri prin toată Europa. Într-o zi am decis că vreau mai mult.
                    M-am înscris la <strong className="text-white">Criminology în Luton</strong> – sincer, doar pentru banii de întreținere (£8,500).
                    Nu pentru pasiune. Am renunțat.
                  </p>
                  <p>
                    Am fost dat afară de la job. A doua șansă a venit la <strong className="text-white">London Metropolitan University – Marketing</strong>.
                    De data asta, cu un scop clar. În anul 2, împreună cu soția mea Sarah, am fondat <strong className="text-gold">EduForYou</strong>.
                  </p>
                  <p>
                    Am văzut combinațiile din industrie – diplome false, fraude, oameni care profitau de studenți.
                    Am știut că <strong className="text-white">doar fiind oameni vom reuși</strong>. Și am avut dreptate.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      <AnimatedCounter end={7000} suffix="+" />
                    </p>
                    <p className="text-white/40 text-xs mt-1">{t("webinarUni.statRomanians")}</p>
                  </div>
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      £<AnimatedCounter end={35} suffix="M" />
                    </p>
                    <p className="text-white/40 text-xs mt-1">{t("webinarUni.statFunding")}</p>
                  </div>
                  <div className="border border-gold/20 bg-gold/5 p-4 text-center">
                    <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                      <AnimatedCounter end={2000} />
                    </p>
                    <p className="text-white/40 text-xs mt-1">{t("webinarUni.statGoal")}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="p-5 border border-gold/30 bg-gold/10">
                  <p className="text-white font-[var(--font-body)] leading-relaxed italic">
                    „Scopul meu pentru 2026: <strong className="text-gold not-italic">2,000 de români</strong> înscriși la universitate.
                    Nu pentru că e un număr frumos. Ci pentru că fiecare dintre ei merită o șansă reală.
                    Exact cum am primit-o și eu."
                  </p>
                  <p className="text-gold/70 text-sm mt-3 font-[var(--font-display)]">— Alin-Florin Radu, Co-fondator EduForYou</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5C: SECRETUL £4,000 ECONOMIE ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 bg-gold/10 mb-5">
                  <PiggyBank className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">
                    {t("webinarUni.bonusBadge")}
                  </span>
                </div>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Cum economisești <span className="text-gold">~£4,000/an</span> ca student
                </h2>
                <p className="text-white/60 font-[var(--font-body)] text-lg leading-relaxed mb-8">
                  La webinar îți arătăm un secret pe care puțini studenți îl cunosc.
                  Complet legal. Complet documentat. Și poate face diferența între un an de stres financiar și un an de libertate.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="space-y-4">
                  {[
                    {
                      icon: PiggyBank,
                      title: "Economie de ~£4,000/an în taxe",
                      desc: "Metoda legală prin care poți reduce semnificativ costurile ca student. Îți explicăm pas cu pas la webinar.",
                    },
                    {
                      icon: GraduationCap,
                      title: "Nu plătești pe examene",
                      desc: "Testele se simt ca o practică suplimentară, nu ca un examen tradițional. Sistemul e construit să te ajute să treci.",
                    },
                    {
                      icon: Briefcase,
                      title: "Platforma de joburi + freelancing",
                      desc: "Acces la o platformă dedicată studenților cu oportunități de joburi part-time și freelancing aliniate cu cursul tău.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-5 border border-white/10 bg-white/[0.02] hover:border-gold/20 transition-all">
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
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200} direction="right">
              <div className="border border-gold/20 bg-gold/[0.03] p-8 sm:p-10">
                <p className="text-gold font-[var(--font-display)] font-bold text-xl mb-6 uppercase tracking-wider">
                  {t("webinarUni.whyMatters")}
                </p>
                <div className="space-y-6">
                  <div>
                    <p className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white">
                      ~£<AnimatedCounter end={4000} /><span className="text-gold">/an</span>
                    </p>
                    <p className="text-white/40 text-sm mt-1">{t("webinarUni.savingsDesc")}</p>
                  </div>
                  <div className="h-px bg-gold/20" />
                  <div>
                    <p className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white">
                      ~£<AnimatedCounter end={16000} />
                    </p>
                    <p className="text-white/40 text-sm mt-1">{t("webinarUni.savingsTotal")}</p>
                  </div>
                  <div className="h-px bg-gold/20" />
                  <p className="text-white/60 font-[var(--font-body)] leading-relaxed">
                    Acești bani rămân în buzunarul tău. La webinar îți arătăm exact cum.
                    Plus: cum să folosești platforma de joburi pentru venit suplimentar.
                  </p>
                  <button
                    onClick={scrollToQuiz}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
                  >
                    {t("webinarUni.secretCta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: BONUS – GHID GRATUIT ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3" />
        <div className="relative container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 bg-gold/10 mb-5">
                <Gift className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs font-[var(--font-display)] font-bold uppercase tracking-wider">
                  {t("webinarUni.guideBadge")}
                </span>
              </div>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Înscrie-te la webinar și primești <span className="text-gold">gratuit</span>
              </h2>
              <p className="text-white/50 font-[var(--font-body)] text-lg max-w-2xl mx-auto">
                Toți participanții la webinar primesc ghidul Student Referral Starter Kit – un ghid practic de 9 pagini care îți explică pas cu pas cum să câștigi £500–£700 per student recomandat.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Book mockup */}
            <ScrollReveal direction="left">
              <div className="relative flex justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-75" />
                <div className="relative">
                  {/* Shadow/depth effect */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#1a1500] rounded-sm" />
                  <div className="absolute -bottom-2 -right-2 w-full h-full bg-[#2a2200] rounded-sm" />
                  <img
                    src={GUIDE_IMG}
                    alt="Student Referral Starter Kit – ghid gratuit EduForYou"
                    className="relative w-full max-w-xs sm:max-w-sm object-contain drop-shadow-2xl"
                    style={{ filter: "drop-shadow(0 20px 40px rgba(212,175,55,0.2))" }}
                  />
                  {/* FREE badge overlay */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30">
                    <div className="text-center">
                      <p className="font-[var(--font-display)] font-bold text-black text-xs leading-none">100%</p>
                      <p className="font-[var(--font-display)] font-bold text-black text-xs leading-none">FREE</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Guide contents */}
            <ScrollReveal delay={150} direction="right">
              <div>
                <h3 className="font-[var(--font-display)] font-bold text-white text-2xl sm:text-3xl mb-2">
                  Student Referral Starter Kit
                </h3>
                <p className="text-gold font-[var(--font-display)] text-sm font-semibold mb-6">
                  EduForYou | E.D.U Method™ · 9 pagini
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: "🎓",
                      title: "Educație",
                      desc: "Înțelegi exact cum funcționează sistemul de finanțare și ce cursuri sunt disponibile pentru tine.",
                    },
                    {
                      icon: "£",
                      title: "Comision",
                      desc: "Ghid pas cu pas pentru a câștiga £500–£700 per student recomandat, cu structura completă a comisionului progresiv.",
                    },
                    {
                      icon: "🎯",
                      title: "Plan 30 de zile",
                      desc: "Un plan de acțiune concret pe 30 de zile pentru a-ți construi primul venit din recomandări.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-4 border border-white/10 bg-white/[0.02]">
                      <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0 text-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-[var(--font-display)] font-semibold text-white text-sm mb-1">
                          {item.title}
                        </h4>
                        <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-gold/30 bg-gold/10 mb-6">
                  <p className="text-white/80 font-[var(--font-body)] text-sm leading-relaxed">
                    <strong className="text-gold">Valoare reală: £47.</strong> Tu îl primești complet gratuit
                    când te înscrii la webinarul disponibil acum.
                  </p>
                </div>

                <button
                  onClick={scrollToQuiz}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-gold-light transition-all group"
                >
                  Vreau ghidul + locul la webinar
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6b: EBOOK BONUS ===== */}
      <section className="py-16 sm:py-20 bg-[#0a1628] border-t border-gold/10">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 p-8 border border-gold/20 bg-gold/5">
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-4xl">📖</span>
                </div>
                <span className="inline-block bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1">GRATUIT</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-gold text-xs font-black uppercase tracking-widest mb-2">Bonus pentru participanți</p>
                <h3 className="font-[var(--font-display)] font-bold text-white text-xl sm:text-2xl mb-2">
                  De la Cariera Nefericită la Împlinire
                </h3>
                <p className="text-white/50 font-[var(--font-body)] text-sm leading-relaxed mb-4">
                  Ghidul care te ajută să ieși din capcana unui job nesatisfăcător și să construiești o carieră cu sens. Descarcă gratuit după înregistrare.
                </p>
                <a
                  href="https://drive.google.com/open?id=1pr49i9MOftUH-U07VtjqP1AZ6uf7vfsH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold font-[var(--font-display)] font-bold text-sm uppercase tracking-wider hover:bg-gold hover:text-black transition-all"
                >
                  Descarcă Ebook-ul Gratuit
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 7: SOCIAL PROOF ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4 text-center">
              {t("webinarUni.proofBadge")}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-12 text-center max-w-3xl mx-auto">
              Peste 7,000 de studenți au ales deja calea corectă.
            </h2>
          </ScrollReveal>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {[
              { value: 7000, suffix: "+", label: t("webinarUni.statStudents"), prefix: "" },
              { value: 35, suffix: "M+", label: t("webinarUni.proofFunding"), prefix: "£" },
              { value: 700, suffix: "", label: t("webinarUni.proofCommission"), prefix: "£" },
              { value: 37, suffix: "K+", label: t("webinarUni.statTiktok"), prefix: "" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
                  <p className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-gold">
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/40 text-sm mt-1 font-[var(--font-body)]">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Case Studies – 17 Real Student Stories Carousel */}
          <ScrollReveal delay={100}>
            <TestimonialsCarousel />
          </ScrollReveal>

          {/* Trustpilot badge */}
          <ScrollReveal delay={300}>
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-5 h-5 ${i <= 4 ? "text-gold fill-gold" : "text-gold fill-gold/70"}`} />
                ))}
              </div>
              <span className="text-white/50 font-[var(--font-body)]">
                <strong className="text-white">4.8/5</strong> pe Trustpilot · 163 recenzii verificate
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 8: TRANSFORMATION ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={TRANSFORMATION_IMG}
            alt="Absolvire universitate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        </div>
        <div className="relative container text-center">
          <ScrollReveal>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
              Peste 4 ani, vei fi absolvent cu o carieră.
              <br />
              <span className="text-gold">Sau vei fi exact în același loc.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-white/60 font-[var(--font-body)] mb-8 max-w-2xl mx-auto">
              {t("webinarUni.finalBadge")}. Noi oferim sistemul. Tu execuți.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 px-10 py-5 bg-gold text-black font-[var(--font-display)] font-bold text-lg uppercase tracking-wider hover:bg-gold-light transition-all group"
            >
              Înscrie-te la webinar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 9: ELIGIBILITY QUIZ ===== */}
      <section id="quiz-section" className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
                {t("webinarUni.quizBadge")}
              </p>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Înscrie-te la webinar în 30 de secunde.
              </h2>
              <p className="text-white/50 font-[var(--font-body)] text-lg max-w-2xl mx-auto">
                Webinar LIVE gratuit – disponibil acum. Răspunde la 3 întrebări și primești acces instant la formularul de înregistrare.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="max-w-2xl mx-auto p-6 sm:p-10 border border-white/10 bg-white/[0.01]">
              <EligibilityQuiz />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 10: CURSURI ȘI FINANȚARE ===== */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              {t("webinarUni.coursesBadge")}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-tight mb-12 max-w-3xl">
              Alege cursul care se aliniază cu viziunea ta de carieră.
            </h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* BSc */}
            <ScrollReveal>
              <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-[var(--font-display)] font-bold text-white text-lg">
                      BSc (Hons) – 4 ani
                    </h3>
                    <p className="text-white/40 text-sm">{t("webinarUni.bscSubtitle")}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Global Business & Entrepreneurship",
                    "Accounting & Financial Management",
                    "Business & Tourism Management",
                    "Construction Management",
                    "Health, Wellbeing & Social Care",
                  ].map((course) => (
                    <li key={course} className="flex items-center gap-2.5 text-white/60 font-[var(--font-body)]">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      {course}
                    </li>
                  ))}
                </ul>
                <p className="text-white/30 text-sm mt-4 font-[var(--font-body)]">
                  Taxe: £5,757–£9,575/an – acoperite de finanțare
                </p>
              </div>
            </ScrollReveal>

            {/* HND */}
            <ScrollReveal delay={100}>
              <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-[var(--font-display)] font-bold text-white text-lg">
                      HND – 2 ani
                    </h3>
                    <p className="text-white/40 text-sm">{t("webinarUni.hndSubtitle")}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "HND Digital Technology – Cyber Security",
                    "HND Business",
                    "HND Construction Management",
                  ].map((course) => (
                    <li key={course} className="flex items-center gap-2.5 text-white/60 font-[var(--font-body)]">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      {course}
                    </li>
                  ))}
                </ul>
                <p className="text-white/30 text-sm mt-4 font-[var(--font-body)]">
                  Taxe: ~£6,500/an – acoperite de finanțare
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Locations */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Londra – Stratford",
                "Londra – Greenford",
                "Birmingham",
                "Manchester",
                "Leeds",
              ].map((loc) => (
                <div
                  key={loc}
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/10 bg-white/[0.02]"
                >
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-white/70 font-[var(--font-body)] text-sm">{loc}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Financial info – updated figures */}
          <ScrollReveal delay={300}>
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Banknote,
                  title: t("webinarUni.finLoan"),
                  desc: "£10,500–£14,500/an direct în contul tău",
                },
                {
                  icon: Shield,
                  title: t("webinarUni.finGrants"),
                  desc: "£1,000–£9,000 – alocație părinți, adulți dependenți, îngrijire copil",
                },
                {
                  icon: Clock,
                  title: t("webinarUni.finSchedule"),
                  desc: "9-10 ore/săptămână. O zi campus, o zi online. Îți păstrezi jobul.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-white/10 bg-white/[0.02] p-5 text-center"
                >
                  <item.icon className="w-6 h-6 text-gold mx-auto mb-3" />
                  <h4 className="font-[var(--font-display)] font-semibold text-white text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-white/40 text-xs font-[var(--font-body)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SECTION 11: FAQ ===== */}
      <section className="py-20 sm:py-28 bg-[#0D0D0D]">
        <div className="container">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              {t("webinarUni.faqBadge")}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-tight mb-10 max-w-3xl">
              {t("webinarUni.faqTitle")}
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
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
        <div className="relative container text-center">
          <ScrollReveal>
            <p className="text-gold font-[var(--font-display)] font-semibold uppercase tracking-widest text-sm mb-4">
              {t("webinarUni.finalBadge")}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
              Nu închide această pagină fără să acționezi.
            </h2>
            <p className="text-xl text-white/50 font-[var(--font-body)] mb-10 max-w-2xl mx-auto">
              Acesta este testul tău de disciplină. Înscrie-te la webinar, rezervă-ți locul
              și primești ghidul Student Referral Starter Kit gratuit. Acum.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-black font-[var(--font-display)] font-bold text-lg uppercase tracking-wider hover:bg-gold-light transition-all group"
            >
              Înregistrează-te pentru webinarul live – disponibil acum
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/40 font-[var(--font-body)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> {t("webinarUni.finalItem1")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> {t("webinarUni.finalItem2")}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold" /> {t("webinarUni.finalItem3")}
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-gold" /> {t("webinarUni.finalItem4")}
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
              &copy; {new Date().getFullYear()} EduForYou. {t("webinarUni.footerRights")}
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
