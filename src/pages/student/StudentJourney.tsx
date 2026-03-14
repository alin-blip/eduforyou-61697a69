import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Lock, BookOpen, FileText, GraduationCap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const eduSteps = [
  {
    id: 'evaluate', label: 'Evaluate', icon: BookOpen,
    subSteps: [
      { label: 'Take eligibility quiz', link: '/eligibilitate' },
      { label: 'Explore courses', link: '/cursuri' },
      { label: 'Choose your degree', link: '/cursuri' },
    ],
  },
  {
    id: 'deliver', label: 'Deliver', icon: FileText,
    subSteps: [
      { label: 'Upload ID document', link: '/student/documents' },
      { label: 'Upload proof of address', link: '/student/documents' },
      { label: 'Submit application', link: '/student/applications' },
    ],
  },
  {
    id: 'unlock', label: 'Unlock', icon: GraduationCap,
    subSteps: [
      { label: 'Application accepted', link: '/student/applications' },
      { label: 'Enrolment confirmed', link: '/student/applications' },
      { label: 'Start your degree', link: '/student/applications' },
    ],
  },
];

const StudentJourney = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('applications').select('*').eq('user_id', user.id),
      supabase.from('quiz_results').select('*').eq('user_id', user.id),
      supabase.from('student_documents').select('*').eq('user_id', user.id),
    ]).then(([apps, quiz, docs]) => {
      setApplications(apps.data || []);
      setQuizResults(quiz.data || []);
      setDocuments(docs.data || []);
    });
  }, [user]);

  const hasQuiz = quizResults.length > 0;
  const hasApp = applications.length > 0;
  const isAccepted = applications.some(a => a.status === 'accepted' || a.status === 'enrolled');
  const isEnrolled = applications.some(a => a.status === 'enrolled');

  const completedSubSteps = [
    hasQuiz, true, hasApp,
    documents.some(d => d.document_type === 'id'),
    documents.some(d => d.document_type === 'address'),
    hasApp,
    isAccepted, isEnrolled, isEnrolled,
  ];

  const totalComplete = completedSubSteps.filter(Boolean).length;
  const progressPercent = Math.round((totalComplete / completedSubSteps.length) * 100);
  const currentStep = isEnrolled ? 3 : isAccepted ? 2 : hasApp ? 2 : hasQuiz ? 1 : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Overall Progress</p>
          <p className="text-sm font-bold text-primary">{progressPercent}%</p>
        </div>
        <Progress value={progressPercent} className="h-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eduSteps.map((step, i) => {
          const stepOffset = i * 3;
          const stepComplete = completedSubSteps.slice(stepOffset, stepOffset + 3).filter(Boolean).length;
          return (
            <div key={step.id} className={`rounded-xl p-6 border transition-all ${
              i < currentStep ? 'border-primary bg-primary/5'
                : i === currentStep ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                : 'border-border bg-card opacity-60'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {i < currentStep ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : i === currentStep ? (
                  <Circle className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
                <h3 className="font-display font-bold text-lg text-foreground">{step.label}</h3>
                <span className="ml-auto text-xs text-muted-foreground">{stepComplete}/3</span>
              </div>
              <step.icon className="w-8 h-8 text-primary/30 mb-3" />
              <ul className="space-y-2">
                {step.subSteps.map((sub, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    {completedSubSteps[stepOffset + j] ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    {!completedSubSteps[stepOffset + j] && i <= currentStep ? (
                      <Link to={sub.link} className="text-primary hover:underline">{sub.label}</Link>
                    ) : (
                      <span className={completedSubSteps[stepOffset + j] ? 'text-foreground' : 'text-muted-foreground'}>{sub.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentJourney;
