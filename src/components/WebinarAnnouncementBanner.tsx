import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const SESSION_KEY = 'webinar_banner_dismissed';

const WebinarAnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-yellow-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        <Link
          to="/webinar/ikigai"
          className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:text-base"
        >
          <span className="hidden sm:inline">🎓</span>
          <span>
            Webinar GRATUIT IKIGAI - Înscrie-te acum!
          </span>
          <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium sm:inline">
            Locuri limitate
          </span>
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-2 shrink-0 rounded-md p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Închide banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default WebinarAnnouncementBanner;
