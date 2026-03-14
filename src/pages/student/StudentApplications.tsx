import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const StudentApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('applications').select('*').eq('user_id', user.id).then(({ data }) => setApplications(data || []));
  }, [user]);

  return (
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
              <Badge variant={app.status === 'enrolled' || app.status === 'accepted' ? 'default' : 'secondary'}>
                {app.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
