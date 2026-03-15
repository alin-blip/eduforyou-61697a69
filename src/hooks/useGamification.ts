import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000];

export interface GamificationData {
  id: string;
  user_id: string;
  points: number;
  level: number;
  streak_days: number;
  badges: string[];
  last_activity_date: string;
}

export function useGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: gamification, isLoading } = useQuery({
    queryKey: ['gamification', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('student_gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) return data as unknown as GamificationData;

      // Create initial record
      const { data: newData } = await supabase
        .from('student_gamification')
        .insert({
          user_id: user.id,
          points: 10,
          badges: ['first_login'],
          last_activity_date: new Date().toISOString().split('T')[0],
          streak_days: 1,
        })
        .select()
        .single();

      return newData as unknown as GamificationData;
    },
    enabled: !!user,
  });

  const addPoints = useMutation({
    mutationFn: async ({ points, badge }: { points: number; badge?: string }) => {
      if (!gamification) throw new Error('No gamification data');
      const newPoints = (gamification.points || 0) + points;
      let newLevel = gamification.level || 1;
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newPoints >= LEVEL_THRESHOLDS[i]) {
          newLevel = i + 1;
          break;
        }
      }
      const badges = [...(gamification.badges || [])];
      if (badge && !badges.includes(badge)) {
        badges.push(badge);
      }

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = gamification.last_activity_date;
      let streak = gamification.streak_days || 1;
      if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) streak += 1;
        else if (diff > 1) streak = 1;
      }

      const { error } = await supabase
        .from('student_gamification')
        .update({
          points: newPoints,
          level: newLevel,
          badges,
          streak_days: streak,
          last_activity_date: today,
        })
        .eq('user_id', gamification.user_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
    },
  });

  const nextLevelThreshold = gamification
    ? LEVEL_THRESHOLDS[gamification.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 2
    : 100;

  const prevLevelThreshold = gamification
    ? LEVEL_THRESHOLDS[(gamification.level || 1) - 1] || 0
    : 0;

  const levelProgress = gamification
    ? Math.round(((gamification.points - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100)
    : 0;

  return {
    points: gamification?.points || 0,
    level: gamification?.level || 1,
    streak: gamification?.streak_days || 0,
    badges: (gamification?.badges as string[]) || [],
    addPoints,
    isLoading,
    levelProgress,
    nextLevelThreshold,
  };
}
