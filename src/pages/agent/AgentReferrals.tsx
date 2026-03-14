import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { coursesData } from '@/data/courses';

const AgentReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ referred_name: '', referred_email: '', referred_phone: '', course_interest: '' });

  const fetchReferrals = async () => {
    if (!user) return;
    const { data } = await supabase.from('referrals').select('*').eq('agent_id', user.id).order('created_at', { ascending: false });
    setReferrals(data || []);
  };

  useEffect(() => { fetchReferrals(); }, [user]);

  const submit = async () => {
    if (!user || !form.referred_name || !form.referred_email) return;
    await supabase.from('referrals').insert({ ...form, agent_id: user.id });
    setShowNew(false);
    setForm({ referred_name: '', referred_email: '', referred_phone: '', course_interest: '' });
    fetchReferrals();
    toast({ title: 'Referral adăugat!' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Your Referrals</h2>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus className="w-4 h-4 mr-1" /> Add Referral</Button>
        </div>

        {showNew && (
          <div className="p-6 border-b border-border bg-muted/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Student Name *" value={form.referred_name} onChange={e => setForm(f => ({ ...f, referred_name: e.target.value }))} />
              <Input placeholder="Email *" type="email" value={form.referred_email} onChange={e => setForm(f => ({ ...f, referred_email: e.target.value }))} />
              <Input placeholder="Phone" value={form.referred_phone} onChange={e => setForm(f => ({ ...f, referred_phone: e.target.value }))} />
              <Select value={form.course_interest} onValueChange={v => setForm(f => ({ ...f, course_interest: v }))}>
                <SelectTrigger><SelectValue placeholder="Course Interest" /></SelectTrigger>
                <SelectContent>
                  {coursesData.map(c => <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
              <Button size="sm" onClick={submit}><Save className="w-4 h-4 mr-1" /> Submit</Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.referred_name}</TableCell>
                <TableCell className="text-sm">{r.referred_email}</TableCell>
                <TableCell className="text-sm">{r.course_interest || '—'}</TableCell>
                <TableCell><Badge variant={r.status === 'converted' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {referrals.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No referrals yet. Add your first one!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AgentReferrals;
