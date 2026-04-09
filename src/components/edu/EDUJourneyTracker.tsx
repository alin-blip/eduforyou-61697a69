import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, BookOpen, FileText, GraduationCap, ClipboardCheck, Brain, FileSearch, Building2, PoundSterling, Gift, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEduJourney, EDU_STEPS, EduPhase } from '@/hooks/useEduJourney';
import EDUPhaseBadge from './EDUPhaseBadge';

const STEP_ROUTES: Record<string, string> = {
  eligibility: '/student/edu/eligibility',
  course_match: '/student/edu/course-match',
  edu_plan: '/student/edu/plan',
  test_prep: '/student/edu/test-prep',
  documents: '/student/edu/documents',
  cv_builder: '/student/edu/cv-builder',
  document_checks: '/student/edu/document-checks',
  university_response: '/student/edu/document-checks',
  finance: '/student/edu/finance',
  bonuses: '/student/edu/bonuses',
  freedom_circle: '/student/edu/freedom-circle',
};

const STEP_ICONS: Record<string, React.ElementType> = {
  eligibility: ClipboardCheck,
  course_match: BookOpen,
  edu_plan: Brain,
  test_prep: FileSearch,
  documents: FileText,
  cv_builder: FileText,
  document_checks: FileSearch,
  university_response: Building2,
  finance: PoundSterling,
  bonuses: Gift,
  freedom_circle: Users,
};

const PHASE_CONFIG: Record<EduPhase, { label: string; gradient: string; color: string; icon: React.ElementType }> = {
  evaluate: { label: 'Evaluate', gradient: 'from-blue-500 to-cyan-400', color: 'text-blue-500', icon: BookOpen },
  deliver: { label: 'Deliver', gradient: 'from-[#D4AF37] to-purple-500', color: 'text-[#D4AF37]', icon: FileText },
  unlock: { label: 'Unlock', gradient: 'from-green-500 to-lime-400', color: 'text-green-500', icon: GraduationCap },
};

const EDUJourneyTracker = () => {
  const { getStepStatus, getPhaseProgress, currentPhase } = useEduJourney();
  const activePhase = currentPhase();
  const phases: EduPhase[] = ['evaluate', 'deliver', 'unlock'];

  return (
    <div className="space-y-6">
      {/* Phase Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map(phase => {
          const config = PHASE_CONFIG[phase];
          const progress = getPhaseProgress(phase);
          const isActive = phase === activePhase;
          const isCompleted = progress.percent === 100;

          return (
            <Card
              key={phase}
              className={`transition-all duration-300 ${
                isActive ? 'ring-2 ring-offset-2 ring-offset-background' : ''
              } ${isActive ? 'ring-blue-500' : ''} ${
                isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EDUPhaseBadge phase={phase} isActive={isActive} isCompleted={isCompleted} />
                    <CardTitle className="text-base">{config.label}</CardTitle>
                  </div>
                  <Badge variant={isCompleted ? 'default' : 'secondary'}>
                    {progress.completed}/{progress.total}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{progress.percent}% completat</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Steps List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pașii Tăi E.D.U.</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {EDU_STEPS.map(step => {
              const status = getStepStatus(step.key);
              const Icon = STEP_ICONS[step.key] || Circle;
              const phaseConfig = PHASE_CONFIG[step.phase];
              const route = STEP_ROUTES[step.key];
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in_progress';

              return (
                <Link
                  key={step.key}
                  to={route}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted/50 group ${
                    isInProgress ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isInProgress ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${isCompleted ? 'text-green-500' : phaseConfig.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${
                      isCompleted ? 'border-green-300 text-green-600' :
                      isInProgress ? 'border-blue-300 text-blue-600' :
                      'border-muted text-muted-foreground'
                    }`}
                  >
                    {step.phase.charAt(0).toUpperCase()}{step.step}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EDUJourneyTracker;
