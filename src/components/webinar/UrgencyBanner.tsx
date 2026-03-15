import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const MIN_SPOTS = 7;
const MAX_SPOTS = 23;

const getInitialSpots = (): number => {
  const stored = sessionStorage.getItem('urgency_spots');
  if (stored) return parseInt(stored, 10);

  const spots = Math.floor(Math.random() * (MAX_SPOTS - MIN_SPOTS + 1)) + MIN_SPOTS;
  sessionStorage.setItem('urgency_spots', String(spots));
  return spots;
};

const UrgencyBanner = () => {
  const [spots, setSpots] = useState<number>(getInitialSpots);

  useEffect(() => {
    // Decrease spots slowly over time
    const interval = setInterval(() => {
      setSpots((prev) => {
        const next = Math.max(MIN_SPOTS, prev - 1);
        sessionStorage.setItem('urgency_spots', String(next));
        return next;
      });
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 px-4 py-3 text-center shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse text-yellow-200" />
        <p className="text-sm font-bold text-white sm:text-base">
          Doar{' '}
          <span className="inline-flex min-w-[2ch] items-center justify-center rounded bg-white/20 px-1.5 py-0.5 tabular-nums">
            {spots}
          </span>{' '}
          locuri rămase!
        </p>
        <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse text-yellow-200" />
      </div>
      <p className="mt-1 text-xs text-white/80">
        Înscrie-te acum pentru a-ți garanta locul la webinar
      </p>
    </div>
  );
};

export default UrgencyBanner;
