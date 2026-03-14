import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Lock, BookOpen, FileText, GraduationCap, Calendar, Brain, Globe, Building2, Users2, Briefcase, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const eduPipeline = [
  {
    id: 'evaluate',
    label: 'Evaluate',
    icon: BookOpen,
    description: 'Discover your path and explore opportunities',
    subSteps: [
      { id: 'quiz', label: 'Take Eligibility Quiz', link: '/eligibilitate', icon: BookOpen },
      { id: 'ikigai', label: 'Complete Ikigai Assessment', link: '/student/launchpad/ikigai', icon: Brain },
      { id: 'catalog', label: 'Explore Course Catalog', link: '/cursuri', icon: FileText },
      { id: 'discovery', label: 'Book Discovery Call', link: '/book-appointment', icon: Calendar },
    ],
  },
  {
    id: 'deliver',
    label: 'Deliver',
    icon: FileText,
    description: 'Submit your documents and application',
    subSteps: [
      { id: 'id_doc', label: 'Upload ID Document', link: '/student/documents', icon: FileText },
      { id: 'address_doc', label: 'Upload Proof of Address', link: '/student/documents', icon: FileText },
      { id: 'application', label: 'Submit Application', link: '/student/applications', icon: FileText },
      { id: 'uni_submission', label: 'University Submission', link: '/student/applications', icon: Building2 },
    ],
  },
  {
    id: 'unlock',
    label: 'Unlock',
    icon: GraduationCap,
    description: 'Get accepted and start your journey',
    subSteps: [
      { id: 'accepted', label: 'Application Accepted', link: '/student/applications', icon: Award },
      { id: 'visa', label: 'Visa Guidance', link: '/student/preparation', icon: Globe },
      { id: 'accommodation', label: 'Accommodation Setup', link: '/student/preparation', icon: Building2 },
      { id: 'enrolled', label: 'Enrolment Confirmed', link: '/student/applications', icon: GraduationCap },
    ],
  },
];

const StudentJourney = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [ikigaiResults, setIkigaiResults] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('applications').select('*').eq('user_id', user.id),
      supabase.from('quiz_results').select('*').eq('user_id', user.id),
      supabase.from('student_documents').select('*').eq('user_id', user.id),
      supabase.from('ikigai_results').select('*').eq('user_id', user.id),
      supabase.from('appointments').select('*').eq('user_id', user.id),
    ]).then(([prof, apps, quiz, docs, ikigai, appts]) => {
      setProfile(prof.data);
      setApplications(apps.data || []);
      setQuizResults(quiz.data || []);
      setDocuments(docs.data || []);
      setIkigaiResults(ikigai.data || []);
      setAppointments(appts.data || []);
    });
  }, [user]);

  const hasQuiz = quizResults.length > 0;
  const hasIkigai = ikigaiResults.length > 0;
  const hasApp = applications.length > 0;
  const hasDiscoveryCall = appointments.length > 0;
  const isAccepted = applications.some(a => a.status === 'accepted' || a.status === 'enrolled');
  const isEnrolled = applications.some(a => a.status === 'enrolled');

  const completedMap: Record<string, boolean> = {
    quiz: hasQuiz,
    ikigai: hasIkigai,
    catalog: true,
    discovery: hasDiscoveryCall,
    id_doc: documents.some(d => d.document_type === 'id'),
    address_doc: documents.some(d => d.document_type === 'address'),
    application: hasApp,
    uni_submission: applications.some(a => a.status !== 'submitted'),
    accepted: isAccepted,
    visa: isEnrolled,
    accommodation: isEnrolled,
    enrolled: isEnrolled,
  };

  const allSteps = eduPipeline.flatMap(p => p.subSteps);
  const totalComplete = allSteps.filter(s => completedMap[s.id]).length;
  const progressPercent = Math.round((totalComplete / allSteps.length) * 100);

  const currentPhaseIndex = isAccepted ? 2 : hasApp ? 1 : 0;

  // Find next incomplete step
  const nextStep = allSteps.find(s => !completedMap[s.id]);

  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Your E.D.U. journey is {progressPercent}% complete. Keep going!
              </p>
            </div>
            <Badge variant="outline" className="text-primary border-primary self-start text-sm px-3 py-1">
              Phase: {eduPipeline[currentPhaseIndex].label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Overall Progress</p>
          <p className="text-sm font-bold text-primary">{progressPercent}%</p>
        </div>
        <Progress value={progressPercent} className="h-3" />
      </div>

      {/* Next Step Card */}
      {nextStep && (
        <Card className="border-primary ring-2 ring-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <nextStep.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Step</p>
                <p className="font-semibold text-foreground">{nextStep.label}</p>
              </div>
            </div>
            <Button asChild>
              <Link to={nextStep.link}>Get Started →</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* E.D.U. Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {eduPipeline.map((phase, i) => {
          const phaseComplete = phase.subSteps.filter(s => completedMap[s.id]).length;
          const isCurrentPhase = i === currentPhaseIndex;
          const isPastPhase = i < currentPhaseIndex;
          return (
            <Card key={phase.id} className={`transition-all ${
              isPastPhase ? 'border-primary/40 bg-primary/5'
                : isCurrentPhase ? 'border-primary ring-2 ring-primary/20'
                : 'border-border opacity-60'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {isPastPhase ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : isCurrentPhase ? (
                    <Circle className="w-6 h-6 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                  <CardTitle className="text-lg">{phase.label}</CardTitle>
                  <Badge variant="secondary" className="ml-auto">{phaseComplete}/{phase.subSteps.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{phase.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {phase.subSteps.map(sub => (
                    <li key={sub.id} className="flex items-center gap-3 text-sm">
                      {completedMap[sub.id] ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      {!completedMap[sub.id] && i <= currentPhaseIndex ? (
                        <Link to={sub.link} className="text-primary hover:underline">{sub.label}</Link>
                      ) : (
                        <span className={completedMap[sub.id] ? 'text-foreground' : 'text-muted-foreground'}>{sub.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Tasks */}
      {(applications.length > 0 || appointments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').map(appt => (
                <div key={appt.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Discovery Call</p>
                      <p className="text-xs text-muted-foreground">{appt.preferred_date} at {appt.preferred_time}</p>
                    </div>
                  </div>
                  <Badge>{appt.status}</Badge>
                </div>
              ))}
              {applications.filter(a => a.status === 'submitted' || a.status === 'under_review').map(app => (
                <div key={app.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Application: {app.course_slug}</p>
                      <p className="text-xs text-muted-foreground">Submitted {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{app.status}</Badge>
                </div>
              ))}
              {appointments.length === 0 && applications.length === 0 && (
                <p className="text-sm text-muted-foreground py-3">No upcoming tasks.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentJourney;
