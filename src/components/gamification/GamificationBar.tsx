import { Flame, Star, Trophy, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';

const BADGE_LABELS: Record<string, string> = {
  first_login: 'Prima Conectare',
  eligibility_done: 'Eligibilitate Verificată',
  documents_uploaded: 'Documente Încărcate',
  test_completed: 'Test Completat',
  application_sent: 'Aplicație Trimisă',
  plan_created: 'Plan Creat',
  cv_ready: 'CV Pregătit',
  finance_started: 'Finanțare Începută',
  streak_7: 'Serie 7 Zile',
  streak_30: 'Serie 30 Zile',
};

const GamificationBar = () => {
  const { points, level, streak, badges, levelProgress, nextLevelThreshold, isLoading } = useGamification();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-4 animate-pulse h-24" />
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-[#D4AF37]/20 p-4 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Level Badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C6A248] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
              {level}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Nivel</p>
            <p className="text-lg font-bold text-[#D4AF37]">Level {level}</p>
          </div>
        </div>

        {/* Points */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-xs text-gray-400">Puncte</p>
            <p className="text-base font-semibold">{points.toLocaleString()}</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${streak > 0 ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
          <div>
            <p className="text-xs text-gray-400">Serie</p>
            <p className="text-base font-semibold">
              {streak} {streak === 1 ? 'zi' : 'zile'}
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">Progres Nivel</p>
            <p className="text-xs text-[#D4AF37]">{points}/{nextLevelThreshold}</p>
          </div>
          <div className="relative h-2 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Row */}
      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badges.map(badge => (
            <Badge
              key={badge}
              variant="outline"
              className="text-[10px] border-[#D4AF37]/30 text-[#EAC67E] bg-[#D4AF37]/10"
            >
              <Zap className="w-3 h-3 mr-1" />
              {BADGE_LABELS[badge] || badge}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamificationBar;
