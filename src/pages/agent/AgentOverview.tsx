import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, TrendingUp, Award, Link2, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const AgentOverview = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('referrals').select('*').eq('agent_id', user.id),
      supabase.from('applications').select('*').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ]).then(([refRes, appRes, profRes]) => {
      setReferrals(refRes.data || []);
      setApplications(appRes.data || []);
      setProfile(profRes.data);
    });
  }, [user]);

  const totalCommission = referrals.reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const converted = referrals.filter(r => r.status === 'converted').length;
  const referralLink = user ? `${window.location.origin}/eligibilitate?ref=${user.id.slice(0, 8)}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Link copiat!' });
  };

  const stats = [
    { label: 'Total Referrals', value: referrals.length, icon: Users },
    { label: 'Converted', value: converted, icon: Award },
    { label: 'Total Commission', value: `£${totalCommission}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground">Welcome, {profile?.full_name || user?.user_metadata?.full_name || 'Agent'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-6 border border-border">
            <s.icon className="w-8 h-8 text-primary mb-4" />
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" /> Your Referral Link
        </h3>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="font-mono text-sm" />
          <Button variant="outline" onClick={copyLink}><Copy className="w-4 h-4" /></Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Share this link with prospective students. Conversions are tracked automatically.</p>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Recent Applications</h2>
        </div>
        <div className="divide-y divide-border">
          {applications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No applications from your referrals yet.</div>
          ) : (
            applications.map(a => (
              <div key={a.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{a.course_slug}</p>
                  <p className="text-sm text-muted-foreground">{a.campus || 'No campus'}</p>
                </div>
                <Badge variant={a.status === 'enrolled' ? 'default' : 'secondary'}>{a.status}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentOverview;
