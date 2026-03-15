import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney, EDU_STEPS } from '@/hooks/useEduJourney';
import EDUJourneyTracker from '@/components/edu/EDUJourneyTracker';
import GamificationBar from '@/components/gamification/GamificationBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  ClipboardCheck,
  Brain,
  FileSearch,
  PoundSterling,
  Gift,
  Building2,
} from 'lucide-react';

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

const EDUDashboard = () => {
  const { user } = useAuth();
  const { journey, isLoading, overallProgress, currentPhase, nextStep, getPhaseProgress } = useEduJourney();
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

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

  const evalProgress = getPhaseProgress('evaluate');
  const deliverProgress = getPhaseProgress('deliver');
  const unlockProgress = getPhaseProgress('unlock');

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
      {/* Welcome Banner */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Bun venit, {firstName}!
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Parcursul tău E.D.U. este {progress}% complet. Continuă așa!
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className={`bg-gradient-to-r ${phaseColors[activePhase]} text-white border-0 px-3 py-1`}
                >
                  Faza: {phaseLabels[activePhase]}
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
                    strokeDasharray={`${progress}, 100`}
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
                  <span className="text-lg font-bold text-foreground">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Bar */}
      <GamificationBar />

      {/* Next Step Guidance */}
      {next && (
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {(() => {
                  const Icon = STEP_ICONS[next.key] || Target;
                  return <Icon className="w-5 h-5 text-primary" />;
                })()}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Pasul Următor - {phaseLabels[next.phase]}
                </p>
                <p className="font-semibold text-foreground text-base">{next.label}</p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link to={STEP_ROUTES[next.key] || '/student/journey'}>
                Începe <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
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
            <p className="text-2xl font-bold text-foreground">{progress}%</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* E.D.U. Journey Tracker */}
      <EDUJourneyTracker />

      {/* Bottom Row: Messages + Consultation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Messages Preview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Mesaje Recente
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/messages">
                  Vezi Toate <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Niciun mesaj nou.
              </p>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{msg.subject || 'Mesaj nou'}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.content?.substring(0, 60)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consultation Booking */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Consultanță
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Programează o întâlnire cu un consilier EDU pentru a discuta despre parcursul tău academic.
            </p>
            {appointments.length > 0 && (
              <div className="space-y-2">
                {appointments.slice(0, 2).map(appt => (
                  <div key={appt.id} className="flex items-center justify-between text-sm bg-background/60 rounded-lg p-2">
                    <span>{appt.preferred_date} la {appt.preferred_time}</span>
                    <Badge variant="secondary" className="text-xs">{appt.status}</Badge>
                  </div>
                ))}
              </div>
            )}
            <Button asChild className="w-full">
              <Link to="/book-appointment">
                <Calendar className="w-4 h-4 mr-2" />
                Programează Consultanță
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Acces Rapid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/profile">
                <Users className="w-5 h-5" />
                <span className="text-xs">Profil</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/documents">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Documente</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/applications">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs">Aplicații</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-3 flex-col gap-1">
              <Link to="/student/referral">
                <Gift className="w-5 h-5" />
                <span className="text-xs">Referral</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EDUDashboard;
