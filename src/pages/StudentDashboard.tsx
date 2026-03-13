import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Lock, BookOpen, FileText, GraduationCap } from 'lucide-react';

const eduSteps = [
  { id: 'evaluate', label: 'Evaluate', desc: 'Check eligibility & find your course', icon: BookOpen },
  { id: 'deliver', label: 'Deliver', desc: 'Submit documents & apply', icon: FileText },
  { id: 'unlock', label: 'Unlock', desc: 'Start your degree', icon: GraduationCap },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const [appsRes, quizRes] = await Promise.all([
        supabase.from('applications').select('*').eq('user_id', user.id),
        supabase.from('quiz_results').select('*').eq('user_id', user.id),
      ]);
      setApplications(appsRes.data || []);
      setQuizResults(quizRes.data || []);
    };
    fetch();
  }, [user]);

  const currentStep = applications.length > 0
    ? applications.some(a => a.status === 'enrolled') ? 2 : 1
    : quizResults.length > 0 ? 1 : 0;

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Your E.D.U. Journey</h1>
            <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || 'Student'}</p>
          </div>

          {/* E.D.U. Journey Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {eduSteps.map((step, i) => (
              <div key={step.id} className={`rounded-xl p-6 border transition-all ${
                i <= currentStep ? 'border-primary bg-primary/5' : 'border-border bg-card opacity-60'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {i < currentStep ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : i === currentStep ? (
                    <Circle className="w-6 h-6 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                  <h3 className="font-display font-bold text-foreground">{step.label}</h3>
                </div>
                <step.icon className="w-10 h-10 text-primary/30 mb-2" />
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Applications */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Your Applications</h2>
            </div>
            <div className="divide-y divide-border">
              {applications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No applications yet. Take the eligibility quiz to get started!
                </div>
              ) : (
                applications.map(app => (
                  <div key={app.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{app.course_slug}</p>
                      <p className="text-sm text-muted-foreground">{app.campus}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'enrolled' ? 'bg-green-100 text-green-700'
                        : app.status === 'submitted' ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>{app.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentDashboard;
