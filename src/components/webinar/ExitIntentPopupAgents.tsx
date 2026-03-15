/**
 * ExitIntentPopupAgents – triggers when mouse moves toward top of viewport (exit intent)
 * Also triggers on mobile after 45s of inactivity
 * Adapted for the Agents webinar – Brutalist Authority design
 */
import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Briefcase, Shield } from "lucide-react";

export default function ExitIntentPopupAgents() {
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const trigger = useCallback(() => {
    if (triggered) return;
    const dismissed = sessionStorage.getItem("edu_exit_agents_dismissed");
    if (dismissed) return;
    setTriggered(true);
    setVisible(true);
  }, [triggered]);

  // Desktop: detect mouse moving to top of page
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        trigger();
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [trigger]);

  // Mobile: trigger after 45 seconds of page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        trigger();
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [trigger]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("edu_exit_agents_dismissed", "1");
  };

  const handleCTA = () => {
    handleDismiss();
    document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-gold/30 shadow-2xl shadow-black">
          {/* Gold top accent */}
          <div className="h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors z-10"
            aria-label="Inchide"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-gold" />
              <span className="text-gold font-[var(--font-display)] text-xs font-bold uppercase tracking-widest">
                Asteapta! Nu pleca inca
              </span>
            </div>

            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              Nu rata sansa de a deveni Agent Certificat EduForYou.
            </h2>
            <p className="text-white/60 font-[var(--font-body)] leading-relaxed mb-6">
              Webinarul este <strong className="text-white">gratuit</strong> si
              iti arata exact cum poti castiga <strong className="text-gold">&pound;500–&pound;2,000 per student</strong> recomandat,
              cu training complet, CRM dedicat si suport 1-la-1.
            </p>

            {/* Benefits */}
            <div className="p-4 border border-gold/20 bg-gold/5 mb-6 space-y-2">
              <p className="font-[var(--font-display)] font-bold text-white text-sm mb-2">
                Ce primesti ca Agent Certificat:
              </p>
              <div className="space-y-1.5">
                {[
                  "Comisioane scalabile: \u00A3500 \u2192 \u00A32,000/student",
                  "Training complet + scripturi dovedite",
                  "CRM dedicat pentru tracking",
                  "Bonusuri: Dubai, BMW, Franciza",
                ].map((item, i) => (
                  <p key={i} className="text-white/60 text-sm flex items-center gap-2">
                    <span className="text-gold">{"\u2713"}</span> {item}
                  </p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-yellow-400 transition-all group mb-3"
            >
              Inscrie-te gratuit la webinar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-white/30 font-[var(--font-body)]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-gold/50" /> 100% gratuit
              </span>
              <span>&middot;</span>
              <span>Fara investitie initiala</span>
              <span>&middot;</span>
              <span>Fara experienta necesara</span>
            </div>

            {/* Dismiss link */}
            <p className="text-center mt-4">
              <button
                onClick={handleDismiss}
                className="text-white/20 hover:text-white/40 text-xs underline font-[var(--font-body)] transition-colors"
              >
                Nu, multumesc. Nu ma intereseaza.
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
