import { BookOpen, FileText, GraduationCap } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import type { EduPhase } from '@/hooks/useEduJourney';

interface EDUPhaseBadgeProps {
  phase: EduPhase;
  isActive?: boolean;
  isCompleted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PHASE_CONFIG: Record<EduPhase, { letter: string; bg: string; activeBg: string; icon: React.ElementType }> = {
  evaluate: { letter: 'E', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', activeBg: 'bg-blue-500 text-white', icon: BookOpen },
  deliver: { letter: 'D', bg: 'bg-[#D4AF37]/20 text-[#C6A248] dark:bg-[#D4AF37]/30 dark:text-[#EAC67E]', activeBg: 'bg-[#D4AF37] text-white', icon: FileText },
  unlock: { letter: 'U', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', activeBg: 'bg-green-500 text-white', icon: GraduationCap },
};

const SIZE_MAP = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

const EDUPhaseBadge = ({ phase, isActive = false, isCompleted = false, size = 'md' }: EDUPhaseBadgeProps) => {
  const config = PHASE_CONFIG[phase];
  const sizeClass = SIZE_MAP[size];

  if (isCompleted) {
    return (
      <div className={`${sizeClass} rounded-full flex items-center justify-center bg-green-500 text-white`}>
        <CheckCircle2 className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        isActive ? `${config.activeBg} animate-pulse` : config.bg
      }`}
    >
      {config.letter}
    </div>
  );
};

export default EDUPhaseBadge;
