/**
 * Evergreen urgency banner for agents
 */
import { X, Flame } from "lucide-react";
import { useState } from "react";

export default function UrgencyBannerAgents() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-b border-gold/30">
      <div className="flex items-center justify-center gap-2 sm:gap-4 px-4 py-2.5 text-center flex-wrap">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span className="text-white font-[var(--font-display)] text-xs sm:text-sm font-semibold">
            Disponibil Acum — Vizioneza Oricand Webinarul de Agenti Certificati!
          </span>
        </div>
        <a
          href="#register-section"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-black font-[var(--font-display)] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors"
        >
          Vezi Webinar
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
        aria-label="Inchide"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
