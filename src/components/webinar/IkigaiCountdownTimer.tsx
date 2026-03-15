import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';

const STORAGE_KEY = 'ikigai_countdown_start';
const COUNTDOWN_HOURS = 48;

const getTargetDate = (): Date => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (stored) {
    const startTime = parseInt(stored, 10);
    const target = startTime + COUNTDOWN_HOURS * 60 * 60 * 1000;

    // If not expired, return the target
    if (target > now) {
      return new Date(target);
    }

    // Expired - reset with a new anchor
    localStorage.removeItem(STORAGE_KEY);
  }

  // Set new anchor
  localStorage.setItem(STORAGE_KEY, String(now));
  return new Date(now + COUNTDOWN_HOURS * 60 * 60 * 1000);
};

const IkigaiCountdownTimer = () => {
  const [targetDate] = useState<Date>(() => getTargetDate());
  const [, setTick] = useState(0);

  // Force re-check every minute in case the timer expired
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (targetDate.getTime() <= now) {
        // Reset the countdown
        localStorage.removeItem(STORAGE_KEY);
        setTick((t) => t + 1);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-wider text-orange-600">
        Webinarul începe în:
      </p>
      <CountdownTimer targetDate={targetDate} />
      <p className="mt-3 text-xs text-gray-500">
        Locurile se ocupă rapid. Înscrie-te acum!
      </p>
    </div>
  );
};

export default IkigaiCountdownTimer;
