/**
 * ExitIntentPopup – triggers when mouse moves toward top of viewport (exit intent)
 * Also triggers on mobile after 45s of inactivity
 * Brutalist Authority design: dark, gold accents, direct copy
 */
import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Gift, Shield } from "lucide-react";

const GUIDE_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/106208815/cPsODpsWbeEbNjFz.png";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const trigger = useCallback(() => {
    if (triggered) return;
    const dismissed = sessionStorage.getItem("edu_exit_dismissed");
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
      // Only on mobile/touch devices
      if (window.matchMedia("(max-width: 768px)").matches) {
        trigger();
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [trigger]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("edu_exit_dismissed", "1");
  };

  const handleCTA = () => {
    handleDismiss();
    document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" });
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
              <Gift className="w-5 h-5 text-gold" />
              <span className="text-gold font-[var(--font-display)] text-xs font-bold uppercase tracking-widest">
                Inainte sa pleci
              </span>
            </div>

            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              Ai ratat ceva important.
            </h2>
            <p className="text-white/60 font-[var(--font-body)] leading-relaxed mb-6">
              Webinarul este <strong className="text-white">gratuit</strong> si
              iti arata exact cum sa te inscrii la universitate in UK cu finantare completa –
              si cum sa castigi <strong className="text-gold">&pound;500–&pound;700</strong> pentru fiecare prieten recomandat.
            </p>

            {/* Guide offer */}
            <div className="flex items-center gap-4 p-4 border border-gold/20 bg-gold/5 mb-6">
              <img
                src={GUIDE_IMG}
                alt="Student Referral Starter Kit"
                className="w-16 h-20 object-contain flex-shrink-0"
              />
              <div>
                <p className="font-[var(--font-display)] font-bold text-white text-sm mb-1">
                  Bonus gratuit la inregistrare:
                </p>
                <p className="text-gold font-[var(--font-display)] text-sm font-semibold">
                  Student Referral Starter Kit
                </p>
                <p className="text-white/50 text-xs mt-1">Ghid de 9 pagini &middot; Valoare &pound;47 &middot; Gratuit</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-base uppercase tracking-wider hover:bg-yellow-400 transition-all group mb-3"
            >
              Rezerva-mi locul gratuit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-white/30 font-[var(--font-body)]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-gold/50" /> 100% gratuit
              </span>
              <span>&middot;</span>
              <span>Fara card de credit</span>
              <span>&middot;</span>
              <span>Anulezi oricand</span>
            </div>

            {/* Dismiss link */}
            <p className="text-center mt-4">
              <button
                onClick={handleDismiss}
                className="text-white/20 hover:text-white/40 text-xs underline font-[var(--font-body)] transition-colors"
              >
                Nu, multumesc. Nu vreau sa ma inscriu la universitate.
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
