import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SESSION_KEY = 'exit_intent_shown';

const ExitIntentPopupGlobal = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showPopup = useCallback(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, 'true');
    setOpen(true);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Desktop: mouseleave at top of document
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: 45s inactivity
    let mobileTimeout: ReturnType<typeof setTimeout> | null = null;
    const isMobile = window.innerWidth < 768;

    const resetMobileTimer = () => {
      if (mobileTimeout) clearTimeout(mobileTimeout);
      mobileTimeout = setTimeout(() => {
        showPopup();
      }, 45000);
    };

    if (isMobile) {
      resetMobileTimer();
      window.addEventListener('touchstart', resetMobileTimer, { passive: true });
      window.addEventListener('scroll', resetMobileTimer, { passive: true });
    } else {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (mobileTimeout) clearTimeout(mobileTimeout);
      if (isMobile) {
        window.removeEventListener('touchstart', resetMobileTimer);
        window.removeEventListener('scroll', resetMobileTimer);
      }
    };
  }, [showPopup]);

  const handleCTA = () => {
    setOpen(false);
    navigate('/ikigai');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Stai! Nu pleca încă...
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Descoperă ce carieră ți se potrivește cu adevărat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <h3 className="text-center text-lg font-semibold text-blue-700">
            Descoperă-ți Pasiunea cu Testul IKIGAI Gratuit
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">&#10003;</span>
              <span>Află ce domeniu universitar ți se potrivește în doar 5 minute</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">&#10003;</span>
              <span>Primești recomandări personalizate de cursuri finanțate integral</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">&#10003;</span>
              <span>Ghidare gratuită pentru accesarea Student Finance England</span>
            </li>
          </ul>

          <Button
            onClick={handleCTA}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-6 text-base font-semibold text-white hover:from-orange-600 hover:to-red-600"
          >
            Începe Testul IKIGAI Gratuit
          </Button>

          <p className="text-center text-xs text-gray-400">
            100% gratuit. Fără obligații.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopupGlobal;
