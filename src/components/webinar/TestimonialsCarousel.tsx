/**
 * TestimonialsCarousel – 17 real EduForYou student case studies
 * Design: Brutalist Authority – dark bg, gold accents, Space Grotesk display
 * Auto-advances every 6s, prev/next navigation, dot indicators
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Silviu Stefan Haba",
    yt: "z9pKe2ZKXh4",
    financing: "£18,397/an",
    field: "Business & Tourism",
    quote: "Prin EduForYou am reusit sa gasesc cel mai bun job din viata mea in industria turismului.",
  },
  {
    name: "David",
    yt: "MIaVdJVidVQ",
    financing: "£13,000/an",
    field: "",
    quote: "Am reusit sa imi schimb complet viata financiara cu ajutorul EduForYou.",
  },

  {
    name: "Ana Ignat",
    yt: "7CPqqszj2bQ",
    financing: "£9,700/an",
    field: "Manchester GBS",
    quote: "Povestea mea de succes cu EduForYou este constanta si inspirationala.",
  },
  {
    name: "Cristian (DNC Accounting)",
    yt: "aavT3QomECY",
    financing: null,
    field: "Accounting",
    quote: "Cu ajutorul EduForYou am reusit sa imi deschid propriul cabinet de contabilitate. Acum sunt antreprenor!",
  },
  {
    name: "MCB Drylining Ltd",
    yt: "NL8LEjbEFrE",
    financing: null,
    field: "Construction",
    quote: "Ca antreprenor multi-milionar, recomand cu incredere serviciile EduForYou.",
  },
  {
    name: "Victor Macsek",
    yt: "CqcTQjRMR7s",
    financing: null,
    field: "Digital Technology",
    quote: "Suportul anual si focusul pe tehnologie de la EduForYou m-au ajutat sa construiesc o cariera solida in IT.",
  },
  {
    name: "Markus Mark",
    yt: "btQqKE_bOfk",
    financing: null,
    field: "Digital Technology",
    quote: "RECOMAND CU INCREDERE EDUFORYOU! Mi-au deschis usi in lumea tehnologiei.",
  },
  {
    name: "Delia",
    yt: "mAc7XWM6EVk",
    financing: null,
    field: "",
    quote: "Visul meu de a studia in UK s-a implinit datorita EduForYou. Sunt in anul 3!",
  },
  {
    name: "Oana Cojocaru",
    yt: "-gBXhZq3inI",
    financing: null,
    field: "HR & Management",
    quote: "Schimbarea carierei prin HR & Management a fost cea mai buna decizie.",
  },
  {
    name: "Rebeca Ciolan",
    yt: "t8VktC0GWJo",
    financing: null,
    field: "",
    quote: "Experienta cu EduForYou a fost exceptionala - m-au ghidat pas cu pas.",
  },
  {
    name: "Ioan",
    yt: "GBha-pwke30",
    financing: null,
    field: "",
    quote: "Recenzia mea foarte pozitiva pentru EduForYou - experienta a fost minunata!",
  },
  {
    name: "Marius",
    yt: "0i60589EWHQ",
    financing: null,
    field: "",
    quote: "GRATUIT - da, ai auzit bine! Procesul a fost simplu si complet gratuit.",
  },
  {
    name: "Alex & Lavinia",
    yt: "iQT2uVhWWrw",
    financing: null,
    field: "",
    quote: "Ca echipa, ne-am sustinut reciproc si amandoi am reusit sa ne atingem obiectivele.",
  },
  {
    name: "Csaba",
    yt: "1W4hlj4KJBI",
    financing: null,
    field: "",
    quote: "Ca student international, EduForYou m-a ajutat sa ma integrez perfect.",
  },
  {
    name: "Adrian",
    yt: "KTqr6002oZM",
    financing: null,
    field: "",
    quote: "Feedback-ul meu pentru EduForYou este constant pozitiv - rezultatele vorbesc de la sine.",
  },
  {
    name: "Omar",
    yt: "mJVLuq288xM",
    financing: null,
    field: "",
    quote: "Diversitatea de background-uri din programele EduForYou m-a ajutat sa gasesc exact ce cautam.",
  },
];

// Show 3 cards at a time on desktop, 1 on mobile
const CARDS_DESKTOP = 3;

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = TESTIMONIALS.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused]);

  // Get 3 visible cards (wrapping)
  const visibleIndices = [0, 1, 2].map((offset) => (current + offset) % total);

  return (
    <div className="relative">
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {visibleIndices.map((idx, pos) => {
          const t = TESTIMONIALS[idx];
          return (
            <div
              key={`${idx}-${pos}`}
              className="border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col h-full transition-all duration-500"
            >
              {/* Video */}
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${t.yt}?rel=0&modestbranding=1`}
                  title={`${t.name} – EduForYou testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-[var(--font-display)] font-bold text-white text-sm">{t.name}</p>
                    {t.field && (
                      <p className="text-white/40 text-xs font-[var(--font-body)]">{t.field}</p>
                    )}
                  </div>
                  {t.financing && (
                    <span className="flex-shrink-0 px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold text-xs font-[var(--font-display)] font-bold">
                      {t.financing}
                    </span>
                  )}
                </div>
                <p className="text-white/60 font-[var(--font-body)] text-xs leading-relaxed italic mt-auto">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {/* Prev / Next */}
        <button
          onClick={prev}
          className="flex items-center justify-center w-10 h-10 border border-white/20 bg-white/[0.03] text-white/70 hover:border-gold hover:text-gold transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-4" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="flex items-center justify-center w-10 h-10 border border-white/20 bg-white/[0.03] text-white/70 hover:border-gold hover:text-gold transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Counter */}
      <p className="text-center text-white/30 text-xs font-[var(--font-body)] mt-3">
        {current + 1} – {Math.min(current + CARDS_DESKTOP, total)} din {total} testimoniale
      </p>
    </div>
  );
}
