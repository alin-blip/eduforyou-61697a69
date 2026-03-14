import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Gift, CheckCircle2 } from 'lucide-react';

const StudentReferral = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '' });

  useEffect(() => {
    if (!user) return;
    supabase.from('referrals').select('*').eq('agent_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReferrals(data || []));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name || !form.email) return;
    setLoading(true);
    const { error } = await supabase.from('referrals').insert({
      agent_id: user.id,
      referred_name: form.name,
      referred_email: form.email,
      referred_phone: form.phone || null,
      course_interest: form.course || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Referral Submitted!', description: 'Thank you for referring a friend.' });
      setForm({ name: '', email: '', phone: '', course: '' });
      const { data } = await supabase.from('referrals').select('*').eq('agent_id', user.id).order('created_at', { ascending: false });
      setReferrals(data || []);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          Refer a Friend
        </h1>
        <p className="text-muted-foreground mt-1">
          Know someone who could benefit from a UK degree? Refer them and earn rewards!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{referrals.length}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {referrals.filter(r => r.status === 'converted').length}
            </p>
            <p className="text-sm text-muted-foreground">Converted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              £{referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Rewards Earned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submit a Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Friend's Full Name *</Label>
              <Input id="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="email">Friend's Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="course">Course Interest (optional)</Label>
              <Input id="course" value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Referral'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {referrals.map(ref => (
                <div key={ref.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{ref.referred_name}</p>
                    <p className="text-sm text-muted-foreground">{ref.referred_email}</p>
                  </div>
                  <Badge variant={ref.status === 'converted' ? 'default' : 'secondary'}>{ref.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentReferral;
