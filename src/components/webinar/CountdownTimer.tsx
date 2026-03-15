import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const FlipDigit = ({ value, label }: { value: number; label: string }) => {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-900 text-white shadow-lg sm:h-20 sm:w-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
        <span
          key={display}
          className="animate-flip text-2xl font-bold tabular-nums sm:text-3xl"
        >
          {display}
        </span>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </span>

      <style>{`
        @keyframes flip {
          0% { transform: rotateX(90deg); opacity: 0; }
          50% { transform: rotateX(-10deg); opacity: 1; }
          100% { transform: rotateX(0deg); opacity: 1; }
        }
        .animate-flip {
          animation: flip 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">
          Evenimentul a început!
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <FlipDigit value={timeLeft.days} label="Zile" />
      <span className="mt-[-1.5rem] text-2xl font-bold text-gray-400">:</span>
      <FlipDigit value={timeLeft.hours} label="Ore" />
      <span className="mt-[-1.5rem] text-2xl font-bold text-gray-400">:</span>
      <FlipDigit value={timeLeft.minutes} label="Min" />
      <span className="mt-[-1.5rem] text-2xl font-bold text-gray-400">:</span>
      <FlipDigit value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
