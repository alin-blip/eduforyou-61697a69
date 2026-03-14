import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, PoundSterling } from 'lucide-react';

const StudentFinanceTab = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('applications').select('*').eq('user_id', user.id),
      supabase.from('student_documents').select('*').eq('user_id', user.id),
    ]).then(([apps, docs]) => {
      setApplications(apps.data || []);
      setDocuments(docs.data || []);
    });
  }, [user]);

  const checklist = [
    { label: 'Student Finance England application', done: false },
    { label: 'Upload finance evidence', done: documents.some(d => d.document_type === 'finance') },
    { label: 'Tuition fee confirmation', done: applications.some(a => a.status === 'enrolled') },
    { label: 'Maintenance loan (optional)', done: false },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <PoundSterling className="w-5 h-5 text-primary" /> Student Finance Tracker
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Tuition Fee Status</p>
          <p className="text-lg font-bold text-foreground">
            {applications.some(a => a.status === 'enrolled') ? 'Funded' : 'Pending Application'}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Finance Documents</p>
          <p className="text-lg font-bold text-foreground">
            {documents.filter(d => d.document_type === 'finance').length} uploaded
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Checklist</h3>
        {checklist.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            {item.done ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
            <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFinanceTab;
