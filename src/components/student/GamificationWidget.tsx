import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, Star, Trophy, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const badgeDefinitions = [
  { id: 'first_login', label: 'First Login', icon: '🎉', description: 'Logged in for the first time' },
  { id: 'quiz_complete', label: 'Quiz Master', icon: '🧠', description: 'Completed eligibility quiz' },
  { id: 'first_doc', label: 'Paperwork Pro', icon: '📄', description: 'Uploaded first document' },
  { id: 'applied', label: 'Go-Getter', icon: '🚀', description: 'Submitted an application' },
  { id: 'streak_7', label: '7-Day Streak', icon: '🔥', description: 'Active 7 days in a row' },
  { id: 'enrolled', label: 'Student!', icon: '🎓', description: 'Enrolled in a course' },
];

const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2500];

const GamificationWidget = () => {
  const { user } = useAuth();
  const [gamification, setGamification] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetchGamification();
  }, [user]);

  const fetchGamification = async () => {
    if (!user) return;
    const { data } = await supabase.from('student_gamification').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      setGamification(data);
    } else {
      // Create initial record
      const { data: newData } = await supabase.from('student_gamification').insert({
        user_id: user.id, points: 10, badges: ['first_login'],
        last_activity_date: new Date().toISOString().split('T')[0], streak_days: 1,
      }).select().single();
      setGamification(newData);
    }
  };

  if (!gamification) return null;

  const currentLevel = gamification.level;
  const currentPoints = gamification.points;
  const nextThreshold = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1] * 2;
  const prevThreshold = levelThresholds[currentLevel - 1] || 0;
  const levelProgress = Math.round(((currentPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
  const earnedBadges = (gamification.badges as string[]) || [];

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{currentPoints}</p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">Lvl {currentLevel}</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Flame className="w-6 h-6 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{gamification.streak_days}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Level {currentLevel} → {currentLevel + 1}</span>
          <span className="text-sm text-muted-foreground">{currentPoints}/{nextThreshold} pts</span>
        </div>
        <Progress value={levelProgress} className="h-2" />
      </div>

      {/* Badges */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">Badges</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {badgeDefinitions.map(badge => {
            const earned = earnedBadges.includes(badge.id);
            return (
              <div key={badge.id} className={`text-center p-2 rounded-lg transition-all ${earned ? 'bg-primary/10' : 'opacity-30'}`}
                title={badge.description}>
                <span className="text-2xl">{badge.icon}</span>
                <p className="text-xs mt-1 text-foreground">{badge.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamificationWidget;
