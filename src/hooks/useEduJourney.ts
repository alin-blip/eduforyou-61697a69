import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const EDU_STEPS = [
  { key: 'eligibility', label: 'Verificare Eligibilitate', phase: 'evaluate' as const, step: 1 },
  { key: 'course_match', label: 'Potrivire Cursuri', phase: 'evaluate' as const, step: 2 },
  { key: 'edu_plan', label: 'Plan E.D.U.', phase: 'evaluate' as const, step: 3 },
  { key: 'test_prep', label: 'Pregătire Test', phase: 'evaluate' as const, step: 4 },
  { key: 'documents', label: 'Documente', phase: 'deliver' as const, step: 5 },
  { key: 'cv_builder', label: 'CV & Personal Statement', phase: 'deliver' as const, step: 6 },
  { key: 'document_checks', label: 'Verificare Documente', phase: 'deliver' as const, step: 7 },
  { key: 'university_response', label: 'Răspuns Universitate', phase: 'deliver' as const, step: 8 },
  { key: 'finance', label: 'Finanțare SFE', phase: 'unlock' as const, step: 9 },
  { key: 'bonuses', label: 'Bonusuri', phase: 'unlock' as const, step: 10 },
  { key: 'freedom_circle', label: 'Freedom Circle', phase: 'unlock' as const, step: 11 },
] as const;

export type EduPhase = 'evaluate' | 'deliver' | 'unlock';

export interface EduStepStatus {
  step_key: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed_at?: string;
}

export function useEduJourney() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: journey, isLoading } = useQuery({
    queryKey: ['edu-journey', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('edu_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.error('[useEduJourney] fetch error:', error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: steps = [] } = useQuery({
    queryKey: ['edu-steps', journey?.id],
    queryFn: async () => {
      if (!journey) return [];
      const { data, error } = await supabase
        .from('edu_application_steps')
        .select('*')
        .eq('application_id', journey.id);
      if (error) {
        console.error('[useEduJourney] steps error:', error);
        return [];
      }
      return (data || []) as EduStepStatus[];
    },
    enabled: !!journey,
  });

  const updateStep = useMutation({
    mutationFn: async ({ stepKey, status }: { stepKey: string; status: string }) => {
      if (!journey) throw new Error('No journey found');
      const existing = steps.find((s: any) => s.step_key === stepKey);
      if (existing) {
        const { error } = await supabase
          .from('edu_application_steps')
          .update({
            status,
            ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
          })
          .eq('application_id', journey.id)
          .eq('step_key', stepKey);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('edu_application_steps')
          .insert({
            application_id: journey.id,
            step_key: stepKey,
            status,
            ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edu-steps'] });
    },
  });

  const getStepStatus = (stepKey: string): 'pending' | 'in_progress' | 'completed' => {
    const step = steps.find((s: any) => s.step_key === stepKey);
    return (step as any)?.status || 'pending';
  };

  const getPhaseProgress = (phase: EduPhase) => {
    const phaseSteps = EDU_STEPS.filter(s => s.phase === phase);
    const completed = phaseSteps.filter(s => getStepStatus(s.key) === 'completed').length;
    return { completed, total: phaseSteps.length, percent: Math.round((completed / phaseSteps.length) * 100) };
  };

  const overallProgress = () => {
    const completed = EDU_STEPS.filter(s => getStepStatus(s.key) === 'completed').length;
    return Math.round((completed / EDU_STEPS.length) * 100);
  };

  const currentPhase = (): EduPhase => {
    const evalProgress = getPhaseProgress('evaluate');
    const deliverProgress = getPhaseProgress('deliver');
    if (evalProgress.completed < evalProgress.total) return 'evaluate';
    if (deliverProgress.completed < deliverProgress.total) return 'deliver';
    return 'unlock';
  };

  const nextStep = () => {
    return EDU_STEPS.find(s => getStepStatus(s.key) !== 'completed') || null;
  };

  return {
    journey,
    steps,
    isLoading,
    updateStep,
    getStepStatus,
    getPhaseProgress,
    overallProgress,
    currentPhase,
    nextStep,
    EDU_STEPS,
  };
}
