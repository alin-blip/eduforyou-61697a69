/**
 * EDU Dashboard - E.D.U. Method Journey Tracker
 * Complete student dashboard showing the E.D.U. pipeline:
 *   E -- Evaluate (Eligibility, Course Match, E.D.U Plan, Test Prep)
 *   D -- Deliver  (Documents, CV Builder, Doc Checks, University Response)
 *   U -- Unlock   (Student Finance, Bonuses, Freedom Circle)
 *
 * Features:
 * - 3-phase pipeline header with progress visualization
 * - Green checkmarks on completed steps
 * - Prominent "Next Step" card with CTA
 * - Welcome card with overall progress
 * - Gamification bar
 * - Quick stats cards
 * - Upcoming tasks list
 * - Recommended courses section
 * - Consultation booking + messages
 * - Start Journey CTA (if no application yet)
 * - Uses Supabase queries (no tRPC)
 */
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney, EDU_STEPS, type EduPhase } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import GamificationBar from '@/components/gamification/GamificationBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { COURSES, type Course } from '@/data/courses';
import {
  ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronRight,
  Clock, FileText, GraduationCap, Gift, Loader2,
  MessageSquare, Phone, PoundSterling, Rocket, Shield,
  Sparkles, Star, Target, TrendingUp, Users,
  Award, Brain, Building2, ClipboardCheck, FileSearch,
  Send, Inbox,
} from 'lucide-react';

// ─── Step routes ───────────────────────────────────────────
const STEP_ROUTES: Record<string, string> = {
  eligibility: '/student/edu/eligibility',
  course_match: '/student/edu/course-match',
  edu_plan: '/student/edu/plan',
  test_prep: '/student/edu/test-prep',
  documents: '/student/documents',
  cv_builder: '/student/cv',
  document_checks: '/student/edu/document-checks',
  university_response: '/student/edu/document-checks',
  finance: '/student/finance',
  bonuses: '/student/edu/bonuses',
  freedom_circle: '/student/edu/freedom-circle',
};

// ─── Step icons ────────────────────────────────────────────
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

// ─── Phase configuration ───────────────────────────────────
const PHASE_CONFIG = {
  evaluate: {
    letter: 'E',
    title: 'Evaluate',
    subtitle: 'Discover your path',
    gradient: 'from-blue-600 to-cyan-500',
    bgActive: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    bgInactive: 'bg-slate-200',
    textActive: 'text-white',
    textInactive: 'text-slate-500',
    accentColor: 'blue',
    icon: <Shield className="w-5 h-5" />,
  },
  deliver: {
    letter: 'D',
    title: 'Deliver',
    subtitle: 'Submit & apply',
    gradient: 'from-orange-500 to-amber-500',
    bgActive: 'bg-gradient-to-br from-orange-500 to-amber-500',
    bgInactive: 'bg-slate-200',
    textActive: 'text-white',
    textInactive: 'text-slate-500',
    accentColor: 'orange',
    icon: <FileText className="w-5 h-5" />,
  },
  unlock: {
    letter: 'U',
    title: 'Unlock',
    subtitle: 'Finance & enroll',
    gradient: 'from-green-500 to-emerald-400',
    bgActive: 'bg-gradient-to-br from-green-500 to-emerald-400',
    bgInactive: 'bg-slate-200',
    textActive: 'text-white',
    textInactive: 'text-slate-500',
    accentColor: 'green',
    icon: <Rocket className="w-5 h-5" />,
  },
} as const;

// ─── Helper: determine next step info ──────────────────────
interface NextStepInfo {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  phase: EduPhase;
}

function getNextStepInfo(
  getStepStatus: (key: string) => 'pending' | 'in_progress' | 'completed',
): NextStepInfo {
  const hasEligibility = getStepStatus('eligibility') === 'completed';
  const hasCourseMatch = getStepStatus('course_match') === 'completed';
  const hasDocuments = getStepStatus('documents') === 'completed';

  if (!hasEligibility) {
    return {
      title: 'Verify your eligibility',
      description: 'The first step is to check if you are eligible for UK Student Finance. It only takes 2 minutes.',
      cta: 'Start Verification',
      href: '/student/edu/eligibility',
      icon: <Shield className="w-6 h-6" />,
      phase: 'evaluate',
    };
  }
  if (!hasCourseMatch) {
    return {
      title: 'Find your ideal course',
      description: 'Based on your eligibility and profile, choose the right university course for you.',
      cta: 'Match Courses',
      href: '/student/edu/course-match',
      icon: <GraduationCap className="w-6 h-6" />,
      phase: 'evaluate',
    };
  }
  if (!hasDocuments) {
    return {
      title: 'Prepare your documents',
      description: 'You have completed the evaluation! Now prepare the documents needed for your application.',
      cta: 'Prepare Documents',
      href: '/student/documents',
      icon: <FileText className="w-6 h-6" />,
      phase: 'deliver',
    };
  }
  return {
    title: 'Apply for Student Finance',
    description: 'Documents are ready! The next step is to apply for funding.',
    cta: 'Apply Now',
    href: '/student/finance',
    icon: <PoundSterling className="w-6 h-6" />,
    phase: 'unlock',
  };
}

// ─── Main Component ────────────────────────────────────────
const EDUDashboard = () => {
  const { user } = useAuth();
  const {
    journey, isLoading, getStepStatus, getPhaseProgress,
    overallProgress, currentPhase, nextStep, updateStep,
  } = useEduJourney();
  const { points, level, streak, badges, levelProgress, nextLevelThreshold } = useGamification();

  // ── Supabase data fetches ────────────────────────────────
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('messages').select('*').eq('receiver_id', user.id).eq('read', false).order('created_at', { ascending: false }).limit(3),
      supabase.from('appointments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
    ]).then(([prof, msgs, appts]) => {
      setProfile(prof.data);
      setMessages(msgs.data || []);
      setAppointments(appts.data || []);
    });
  }, [user]);

  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  const progress = overallProgress();
  const activePhase = currentPhase();
  const next = nextStep();
  const nextStepInfo = getNextStepInfo(getStepStatus);

  const phases = ['evaluate', 'deliver', 'unlock'] as const;

  // ── Phase progress computation ───────────────────────────
  const phaseStepStatuses = useMemo(() => {
    const result: Record<string, {
      total: number;
      completed: number;
      steps: { key: string; label: string; status: 'completed' | 'in_progress' | 'pending' }[];
    }> = {};

    for (const phase of phases) {
      const phaseSteps = EDU_STEPS.filter(s => s.phase === phase);
      const stepsWithStatus = phaseSteps.map((step) => ({
        key: step.key,
        label: step.label,
        status: getStepStatus(step.key),
      }));
      result[phase] = {
        total: phaseSteps.length,
        completed: stepsWithStatus.filter((s) => s.status === 'completed').length,
        steps: stepsWithStatus,
      };
    }
    return result;
  }, [journey, getStepStatus]);

  const overallCompleted = Object.values(phaseStepStatuses).reduce((sum, p) => sum + p.completed, 0);
  const overallTotal = Object.values(phaseStepStatuses).reduce((sum, p) => sum + p.total, 0);
  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  const evalProgress = getPhaseProgress('evaluate');
  const deliverProgress = getPhaseProgress('deliver');
  const unlockProgress = getPhaseProgress('unlock');

  // ── Recommended courses ──────────────────────────────────
  const recommendedCourses = useMemo((): Course[] => {
    return COURSES.slice(0, 4);
  }, []);

  // ── Upcoming tasks ───────────────────────────────────────
  const tasks = useMemo(() => {
    const list: { label: string; date: string; status: string; href?: string }[] = [];
    if (getStepStatus('eligibility') !== 'completed') {
      list.push({ label: 'Complete eligibility check', date: 'Now', status: 'pending', href: '/student/edu/eligibility' });
    }
    if (getStepStatus('eligibility') === 'completed' && getStepStatus('course_match') !== 'completed') {
      list.push({ label: 'Complete course matching', date: 'Now', status: 'pending', href: '/student/edu/course-match' });
    }
    if (getStepStatus('course_match') === 'completed' && getStepStatus('documents') !== 'completed') {
      list.push({ label: 'Upload required documents', date: 'Soon', status: 'not_started', href: '/student/documents' });
    }
    list.push({ label: 'Test preparation session', date: 'Q1 2026', status: 'not_started', href: '/student/preparation' });
    list.push({ label: 'Review course options', date: 'Q1 2026', status: 'not_started', href: '/student/journey' });
    return list;
  }, [getStepStatus]);

  const statusColors: Record<string, string> = {
    completed: 'text-emerald-600 bg-emerald-50',
    pending: 'text-amber-600 bg-amber-50',
    not_started: 'text-slate-500 bg-slate-100',
    in_progress: 'text-blue-600 bg-blue-50',
  };
  const statusLabels: Record<string, string> = {
    completed: 'Completed',
    pending: 'To Do',
    not_started: 'Not Started',
    in_progress: 'In Progress',
  };

  const phaseLabels: Record<string, string> = {
    evaluate: 'Evaluate',
    deliver: 'Deliver',
    unlock: 'Unlock',
  };

  const phaseColors: Record<string, string> = {
    evaluate: 'from-blue-500 to-cyan-400',
    deliver: 'from-orange-500 to-purple-500',
    unlock: 'from-green-500 to-lime-400',
  };

  // ── Loading state ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ═══ GAMIFICATION BAR ═══ */}
      <GamificationBar />

      {/* ═══ WELCOME + PROGRESS HEADER ═══ */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {firstName}!
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {journey
                  ? `You are in the ${phaseLabels[activePhase]} phase — ${overallPercentage}% complete`
                  : 'Ready to start your E.D.U. journey?'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className={`bg-gradient-to-r ${phaseColors[activePhase]} text-white border-0 px-3 py-1`}
                >
                  Phase: {phaseLabels[activePhase]}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="2.5"
                    strokeDasharray={`${overallPercentage}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{overallPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ E.D.U. PIPELINE -- 3 PHASE CARDS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
        {phases.map((phase, pi) => {
          const config = PHASE_CONFIG[phase];
          const phaseData = phaseStepStatuses[phase];
          const phasePercent = phaseData.total > 0 ? Math.round((phaseData.completed / phaseData.total) * 100) : 0;
          const isActive = phase === activePhase;
          const isCompleted = phaseData.completed === phaseData.total && phaseData.total > 0;
          const isPast = phases.indexOf(activePhase as typeof phases[number]) > pi;

          return (
            <div key={phase} className="relative flex">
              <div className={`flex-1 rounded-xl p-5 relative overflow-hidden transition-all ${
                isActive
                  ? `${config.bgActive} text-white shadow-lg`
                  : isPast || isCompleted
                  ? `${config.bgActive} text-white opacity-80`
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {/* Phase header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isActive || isPast || isCompleted ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : config.letter}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${isActive || isPast ? 'text-white' : 'text-slate-700'}`}>
                      {config.title}
                    </h3>
                    <p className={`text-xs ${isActive || isPast ? 'text-white/70' : 'text-slate-400'}`}>
                      {config.subtitle}
                    </p>
                  </div>
                  {isActive && (
                    <Badge className="ml-auto bg-white/20 text-white border-0 text-[9px] uppercase tracking-wider font-bold">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={isActive || isPast ? 'text-white/70' : 'text-slate-400'}>
                      {phasePercent}% complete
                    </span>
                    <span className={isActive || isPast ? 'text-white/70' : 'text-slate-400'}>
                      {phaseData.completed}/{phaseData.total}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${isActive || isPast ? 'bg-white/20' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isActive || isPast ? 'bg-white' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${phasePercent}%` }}
                    />
                  </div>
                </div>

                {/* Steps list */}
                <div className="space-y-1.5">
                  {phaseData.steps.map((step) => {
                    const route = STEP_ROUTES[step.key];
                    const isCurrent = step.status === 'pending' &&
                      phaseData.steps.findIndex((s) => s.status === 'pending') === phaseData.steps.indexOf(step) &&
                      isActive;

                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-all ${
                          isCurrent
                            ? isActive ? 'bg-white/20 font-semibold border border-white/30' : 'bg-white font-semibold border border-slate-300'
                            : ''
                        } ${route && step.status !== 'completed' ? 'cursor-pointer hover:bg-white/10' : ''}`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive || isPast ? 'text-green-300' : 'text-emerald-500'}`} />
                        ) : step.status === 'in_progress' ? (
                          <Loader2 className={`w-4 h-4 shrink-0 animate-spin ${isActive ? 'text-white' : 'text-blue-500'}`} />
                        ) : isCurrent ? (
                          <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border shrink-0 ${
                            isActive || isPast ? 'border-white/40' : 'border-slate-300'
                          }`} />
                        )}
                        {route && step.status !== 'completed' ? (
                          <Link
                            to={route}
                            className={`flex-1 ${
                              step.status === 'completed'
                                ? isActive || isPast ? 'text-green-200 line-through' : 'text-emerald-600 line-through'
                                : isCurrent
                                ? isActive ? 'text-white' : 'text-foreground'
                                : isActive || isPast ? 'text-white/60' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </Link>
                        ) : (
                          <span className={`flex-1 ${
                            step.status === 'completed'
                              ? isActive || isPast ? 'text-green-200 line-through' : 'text-emerald-600 line-through'
                              : isCurrent
                              ? isActive ? 'text-white' : 'text-foreground'
                              : isActive || isPast ? 'text-white/60' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                        )}
                        {isCurrent && (
                          <Badge className={`text-[9px] px-1.5 py-0 ${
                            isActive ? 'bg-white/20 text-white border-0' : 'bg-primary/15 text-primary border-0'
                          }`}>
                            Now
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Arrow connector between phases */}
              {pi < 2 && (
                <div className="hidden lg:flex items-center justify-center w-8 -mx-4 z-10">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ NEXT STEP + CONSULTATION + MESSAGES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Next Step Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-transparent shadow-lg h-full">
          <CardContent className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">
                Next Step
              </Badge>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/15 shrink-0 text-primary">
                {nextStepInfo.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">{nextStepInfo.title}</h3>
                <p className="text-xs text-muted-foreground">{nextStepInfo.description}</p>
              </div>
            </div>
            <div className="mt-auto">
              <Button asChild className="w-full font-bold shadow-md">
                <Link to={nextStepInfo.href}>
                  {nextStepInfo.cta} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Book Consultation */}
        <Card className="border-0 shadow-sm h-full bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">Book a Consultation</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Speak with an EduForYou consultant for personalised guidance through the admissions process.
            </p>
            {appointments.length > 0 && (
              <div className="space-y-2 w-full mb-3">
                {appointments.slice(0, 2).map(appt => (
                  <div key={appt.id} className="flex items-center justify-between text-sm bg-background/60 rounded-lg p-2">
                    <span className="text-xs">{appt.preferred_date} at {appt.preferred_time}</span>
                    <Badge variant="secondary" className="text-xs">{appt.status}</Badge>
                  </div>
                ))}
              </div>
            )}
            <Button asChild className="w-full">
              <Link to="/book-appointment">
                <Phone className="w-4 h-4 mr-2" /> Book Now
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-0 shadow-sm h-full">
          <CardContent className="p-5 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {messages.length}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Messages ({messages.length})</h3>
              </div>
            </div>

            {messages.length > 0 ? (
              <div className="flex-1 space-y-2">
                {messages.slice(0, 2).map((msg: any) => (
                  <div key={msg.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{msg.subject || 'New message'}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.content?.substring(0, 60)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                No new messages
              </div>
            )}

            <Button variant="ghost" size="sm" asChild className="mt-3">
              <Link to="/student/messages">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ═══ QUICK STATS ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{evalProgress.completed}/{evalProgress.total}</p>
            <p className="text-xs text-muted-foreground">Evaluate</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{deliverProgress.completed}/{deliverProgress.total}</p>
            <p className="text-xs text-muted-foreground">Deliver</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{unlockProgress.completed}/{unlockProgress.total}</p>
            <p className="text-xs text-muted-foreground">Unlock</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{overallPercentage}%</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* ═══ UPCOMING TASKS ═══ */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Tasks
          </h3>
          <div className="divide-y divide-border">
            {tasks.map((task, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-3 ${task.href ? 'cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' ? 'bg-emerald-500' :
                    task.status === 'pending' ? 'bg-amber-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                  {task.href ? (
                    <Link to={task.href} className="text-sm text-foreground hover:underline">{task.label}</Link>
                  ) : (
                    <span className="text-sm text-foreground">{task.label}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{task.date}</span>
                  <Badge className={`text-[10px] px-2 py-0.5 border-0 ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ RECOMMENDED COURSES ═══ */}
      {recommendedCourses.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Recommended Courses
              </h3>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Student Finance</Badge>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedCourses.map((course, i) => (
                <Link key={course.id} to={`/courses/${course.slug}`}>
                  <div className="group p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="relative h-24 rounded-lg overflow-hidden mb-3">
                      <img src={course.image} alt={course.nameShort} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {i === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 mr-0.5" /> Best Match
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] mb-2">
                      {course.level === 'undergraduate' ? 'BSc/BA' : course.level === 'postgraduate' ? 'MSc' : course.level === 'top-up' ? 'Top-Up' : 'HND'}
                    </Badge>
                    <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{course.nameShort}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{course.duration}</span>
                      <span>&middot;</span>
                      <span className="font-semibold text-foreground">{course.feesAnnual}/yr</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild className="text-xs">
                <Link to="/courses">
                  View All Courses <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ QUICK LINKS ═══ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/profile">
                <Users className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/documents">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Documents</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/applications">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs">Applications</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/referrals">
                <Gift className="w-5 h-5" />
                <span className="text-xs">Referral</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ═══ START JOURNEY CTA (if no journey yet) ═══ */}
      {!journey && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-green-500/5">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center gap-6 mb-6">
              {phases.map((phase) => {
                const config = PHASE_CONFIG[phase];
                return (
                  <div key={phase} className="flex flex-col items-center gap-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${config.bgActive} text-white shadow-lg`}>
                      {config.letter}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {config.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Welcome to the E.D.U. Method</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
              Start your journey to a UK university. We guide you through every step -- from eligibility verification to enrollment.
            </p>
            <Button asChild size="lg" className="font-bold shadow-lg">
              <Link to="/student/edu/eligibility">
                Start E.D.U. Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EDUDashboard;
