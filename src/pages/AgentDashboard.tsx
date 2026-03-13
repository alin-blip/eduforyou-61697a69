import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, TrendingUp, Award, FileText } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      setReferrals(data || []);
    };
    fetchReferrals();
  }, [user]);

  const stats = [
    { label: 'Total Referrals', value: referrals.length, icon: Users },
    { label: 'Pending', value: referrals.filter(r => r.status === 'submitted').length, icon: FileText },
    { label: 'Enrolled', value: referrals.filter(r => r.status === 'enrolled').length, icon: Award },
  ];

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || 'Agent'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-card rounded-xl p-6 border border-border">
                <s.icon className="w-8 h-8 text-primary mb-4" />
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Your Referrals</h2>
            </div>
            <div className="divide-y divide-border">
              {referrals.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No referrals yet. Start referring students!</div>
              ) : (
                referrals.map(r => (
                  <div key={r.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{r.course_slug}</p>
                      <p className="text-sm text-muted-foreground">{r.campus || 'No campus'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{r.status}</span>
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

export default AgentDashboard;
