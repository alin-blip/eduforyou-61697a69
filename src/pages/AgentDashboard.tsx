import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, TrendingUp, Award, FileText, Plus, Copy, Link2, Trophy, X, Save, Medal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { coursesData } from '@/data/courses';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', nationality: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  // New referral form
  const [showNewReferral, setShowNewReferral] = useState(false);
  const [referralForm, setReferralForm] = useState({ referred_name: '', referred_email: '', referred_phone: '', course_interest: '' });

  useEffect(() => {
    if (user) {
      fetchData();
      fetchProfile();
      fetchLeaderboard();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase.rpc('get_agent_leaderboard');
    setLeaderboard(data || []);
  };

  const fetchData = async () => {
    if (!user) return;
    const [refRes, appRes] = await Promise.all([
      supabase.from('referrals').select('*').eq('agent_id', user.id).order('created_at', { ascending: false }),
      supabase.from('applications').select('*').eq('agent_id', user.id).order('created_at', { ascending: false }),
    ]);
    setReferrals(refRes.data || []);
    setApplications(appRes.data || []);
  };

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    if (data) {
      setProfile(data);
      setProfileForm({ full_name: data.full_name || '', phone: data.phone || '', nationality: data.nationality || '' });
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from('profiles').update(profileForm).eq('user_id', user.id);
    setEditingProfile(false);
    fetchProfile();
    toast({ title: 'Profil actualizat' });
  };

  const submitReferral = async () => {
    if (!user || !referralForm.referred_name || !referralForm.referred_email) return;
    await supabase.from('referrals').insert({ ...referralForm, agent_id: user.id });
    setShowNewReferral(false);
    setReferralForm({ referred_name: '', referred_email: '', referred_phone: '', course_interest: '' });
    fetchData();
    toast({ title: 'Referral adăugat!' });
  };

  const referralLink = user ? `${window.location.origin}/eligibilitate?ref=${user.id.slice(0, 8)}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Link copiat!' });
  };

  const totalCommission = referrals.reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const paidCommission = referrals.filter(r => r.commission_paid).reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const converted = referrals.filter(r => r.status === 'converted').length;

  const stats = [
    { label: 'Total Referrals', value: referrals.length, icon: Users },
    { label: 'Converted', value: converted, icon: Award },
    { label: 'Total Commission', value: `£${totalCommission}`, icon: TrendingUp },
  ];

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name || user?.user_metadata?.full_name || 'Agent'}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map(s => (
                  <div key={s.label} className="bg-card rounded-xl p-6 border border-border">
                    <s.icon className="w-8 h-8 text-primary mb-4" />
                    <p className="text-3xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Referral Link */}
              <div className="bg-card rounded-xl p-6 border border-border mb-6">
                <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" /> Your Referral Link
                </h3>
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" onClick={copyLink}><Copy className="w-4 h-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Share this link with prospective students. Conversions are tracked automatically.</p>
              </div>

              {/* Recent Applications */}
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Students' Applications</h2>
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
            </TabsContent>

            {/* REFERRALS */}
            <TabsContent value="referrals">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Referrals</h2>
                  <Button size="sm" onClick={() => setShowNewReferral(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Referral
                  </Button>
                </div>

                {showNewReferral && (
                  <div className="p-6 border-b border-border bg-muted/30 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Student Name *" value={referralForm.referred_name} onChange={e => setReferralForm(f => ({ ...f, referred_name: e.target.value }))} />
                      <Input placeholder="Email *" type="email" value={referralForm.referred_email} onChange={e => setReferralForm(f => ({ ...f, referred_email: e.target.value }))} />
                      <Input placeholder="Phone" value={referralForm.referred_phone} onChange={e => setReferralForm(f => ({ ...f, referred_phone: e.target.value }))} />
                      <Select value={referralForm.course_interest} onValueChange={v => setReferralForm(f => ({ ...f, course_interest: v }))}>
                        <SelectTrigger><SelectValue placeholder="Course Interest" /></SelectTrigger>
                        <SelectContent>
                          {coursesData.map(c => <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setShowNewReferral(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                      <Button size="sm" onClick={submitReferral}><Save className="w-4 h-4 mr-1" /> Submit</Button>
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
                        <TableCell>
                          <Badge variant={r.status === 'converted' ? 'default' : 'secondary'}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {referrals.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No referrals yet. Add your first one!</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* COMMISSIONS */}
            <TabsContent value="commissions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-foreground">£{totalCommission}</p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Paid Out</p>
                  <p className="text-3xl font-bold text-primary">£{paidCommission}</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground">Commission History</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.filter(r => Number(r.commission_amount) > 0).map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.referred_name}</TableCell>
                        <TableCell>£{r.commission_amount}</TableCell>
                        <TableCell>
                          <Badge variant={r.commission_paid ? 'default' : 'secondary'}>
                            {r.commission_paid ? 'Paid' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.converted_at ? new Date(r.converted_at).toLocaleDateString() : '—'}</TableCell>
                      </TableRow>
                    ))}
                    {referrals.filter(r => Number(r.commission_amount) > 0).length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No commissions yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* PROFILE */}
            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border max-w-lg">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Profile</h2>
                  {!editingProfile && <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>Edit</Button>}
                </div>
                <div className="p-6 space-y-4">
                  {editingProfile ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <Input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Nationality</label>
                        <Input value={profileForm.nationality} onChange={e => setProfileForm(f => ({ ...f, nationality: e.target.value }))} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                        <Button onClick={saveProfile}>Save</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium text-foreground">{profile?.full_name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{profile?.phone || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nationality</p>
                        <p className="font-medium text-foreground">{profile?.nationality || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent ID</p>
                        <p className="font-mono text-sm text-foreground">{user?.id.slice(0, 8)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AgentDashboard;
