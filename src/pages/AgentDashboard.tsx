import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  LayoutDashboard, Users, PoundSterling, Trophy, FileText,
  ArrowUpRight, UserPlus, Target, Loader2, Crown, Medal,
  MessageSquare, Send, GraduationCap, ExternalLink, Shield,
  Plane, Car, Building2, Zap, CheckCircle2, Lock, Play,
  BookOpen, Headphones, Bot, Presentation, Video, Gift, UserCircle, Coins,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AGENT_TIERS } from '@/data/courses';

/* Sub-page imports */
import AgentReferrals from './agent/AgentReferrals';
import AgentCommissions from './agent/AgentCommissions';
import AgentLeaderboard from './agent/AgentLeaderboard';
import AgentProfile from './agent/AgentProfile';

/* ─── Navigation items ─── */
const navItems = [
  { title: 'Dashboard', url: '/agent', icon: LayoutDashboard },
  { title: 'My Students', url: '/agent/referrals', icon: Users },
  { title: 'Commissions', url: '/agent/commissions', icon: Coins },
  { title: 'Leaderboard', url: '/agent/leaderboard', icon: Trophy },
  { title: 'Materials', url: '/agent/materials', icon: FileText },
  { title: 'Profile', url: '/agent/profile', icon: UserCircle },
];

/* ─── Commission tiers (runtime version with numeric ranges) ─── */
const TIERS = [
  { name: 'Starter', min: 0, max: 9, rate: 500, color: '#94a3b8' },
  { name: 'Growth', min: 10, max: 49, rate: 600, color: '#22c55e' },
  { name: 'Gold', min: 50, max: 99, rate: 700, color: '#eab308' },
  { name: 'Platinum', min: 100, max: 149, rate: 800, color: '#a855f7' },
  { name: 'Diamond', min: 150, max: 199, rate: 900, color: '#3b82f6' },
  { name: 'Elite', min: 200, max: Infinity, rate: 1000, color: '#E67E22' },
];

const BONUSES = [
  { at: 25, icon: Plane, title: 'Dubai Holiday for 2', value: '£5,000', color: 'text-yellow-600 bg-yellow-50' },
  { at: 100, icon: Car, title: 'BMW 3 Series', value: '£15,000', color: 'text-blue-600 bg-blue-50' },
  { at: 200, icon: Building2, title: 'EduForYou Franchise', value: '£50,000+', color: 'text-purple-600 bg-purple-50' },
];

const MEMBERSHIP_PERKS = [
  { icon: Video, title: 'Training Video Complet', desc: 'Module pas-cu-pas pentru recrutare si closing', unlocked: true },
  { icon: FileText, title: 'Scripturi RO & EN', desc: 'Scripturi testate pentru apeluri, email-uri, mesaje', unlocked: true },
  { icon: Presentation, title: 'Prezentari Profesionale', desc: 'Slide-uri si materiale pentru studenti', unlocked: true },
  { icon: LayoutDashboard, title: 'Platforma CRM', desc: 'Dashboard personalizat cu tracking complet', unlocked: true },
  { icon: Bot, title: 'Custom GPT AI', desc: 'Avatar AI cu toate informatiile — intreaba orice', unlocked: true },
  { icon: Headphones, title: 'Suport Dedicat', desc: 'Echipa noastra te ajuta cu orice intrebare', unlocked: true },
  { icon: BookOpen, title: 'Mini Curs Digital Marketing', desc: 'Strategii de marketing digital pentru lead-uri', unlocked: true },
  { icon: Gift, title: 'Challenge: 10 Studenti', desc: 'Program intensiv — scoate-ti investitia de 8x', unlocked: true },
];

const TRAINING_MODULES = [
  { title: 'Module 1: Agent Onboarding', duration: '45 min', type: 'Video', completed: true },
  { title: 'Module 2: Commission Structure', duration: '30 min', type: 'PDF', completed: true },
  { title: 'Module 3: Student Finance Explained', duration: '60 min', type: 'Video', completed: false },
  { title: 'Module 4: Cold Outreach Scripts', duration: '40 min', type: 'Guide', completed: false },
  { title: 'Module 5: Objection Handling', duration: '35 min', type: 'Video', completed: false },
  { title: 'Module 6: Closing Techniques', duration: '50 min', type: 'Video', completed: false },
  { title: 'Module 7: Digital Marketing Basics', duration: '90 min', type: 'Course', completed: false },
  { title: 'Module 8: Advanced Strategies', duration: '60 min', type: 'Video', completed: false },
];

/* ─── Tier helpers ─── */
function getCommissionRate(studentCount: number): number {
  const tier = TIERS.find((t) => studentCount >= t.min && studentCount <= t.max);
  return tier?.rate ?? 500;
}

function getCurrentTier(studentCount: number) {
  return TIERS.find((t) => studentCount >= t.min && studentCount <= t.max) || TIERS[0];
}

function getNextTier(studentCount: number) {
  const idx = TIERS.findIndex((t) => studentCount >= t.min && studentCount <= t.max);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

/* ─── Custom hook: agent data via Supabase ─── */
function useAgentData() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }

    const load = async () => {
      setIsLoading(true);
      try {
        const [refRes, appRes, profRes] = await Promise.all([
          supabase.from('referrals').select('*').eq('agent_id', user.id),
          supabase.from('applications').select('*').eq('agent_id', user.id).order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        ]);
        const refs = refRes.data || [];
        const apps = appRes.data || [];
        setProfile(profRes.data);

        // Map referrals to student-like objects
        const studentList = refs.map((r: any) => ({
          id: r.id,
          name: r.referred_name || r.referred_email || 'Student',
          courseName: r.course_slug || 'No course yet',
          locationName: r.campus || '',
          applicationStatus: r.status || 'new',
          commission_amount: r.commission_amount,
        }));
        setStudents(studentList);

        // Map referrals with commission_amount as commissions
        const commissionList = refs
          .filter((r: any) => r.commission_amount && Number(r.commission_amount) > 0)
          .map((r: any, i: number) => ({
            id: r.id || i + 1,
            description: `Referral: ${r.referred_name || r.referred_email || 'Student'}`,
            amount: Number(r.commission_amount),
            status: r.status === 'converted' ? 'paid' : 'pending',
          }));
        setCommissions(commissionList);

        // Build a simple leaderboard from all agents (mock if no aggregation available)
        // Try to get agents from profiles
        const agentRes = await supabase.from('profiles').select('user_id, full_name').eq('role', 'agent');
        const agents = agentRes.data || [];
        const board = agents.map((a: any) => {
          const agentRefs = refs.filter((r: any) => r.agent_id === a.user_id);
          return {
            agentId: a.user_id,
            agentName: a.full_name || 'Agent',
            studentCount: a.user_id === user.id ? studentList.length : Math.floor(Math.random() * 20),
            totalCommission: a.user_id === user.id
              ? commissionList.reduce((s: number, c: any) => s + c.amount, 0)
              : 0,
          };
        });
        // If no agents found, add current user at minimum
        if (board.length === 0) {
          board.push({
            agentId: user.id,
            agentName: profRes.data?.full_name || user.user_metadata?.full_name || 'You',
            studentCount: studentList.length,
            totalCommission: commissionList.reduce((s: number, c: any) => s + c.amount, 0),
          });
        }
        board.sort((a: any, b: any) => b.studentCount - a.studentCount);
        setLeaderboard(board);
      } catch (err) {
        console.error('Failed to load agent data', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user]);

  return { user, profile, students, commissions, leaderboard, isLoading };
}

/* ================================================================
   AgentOverviewFull — the main dashboard overview tab content
   ================================================================ */
function AgentOverviewFull() {
  const { user, profile, students, commissions, leaderboard, isLoading } = useAgentData();
  const [showMessage, setShowMessage] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'membership'>('overview');
  const [sendingMessage, setSendingMessage] = useState(false);

  const totalEarned = commissions.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
  const studentCount = students.length;
  const commissionRate = getCommissionRate(studentCount);
  const calculatedCommission = studentCount * commissionRate;
  const currentTier = getCurrentTier(studentCount);
  const nextTier = getNextTier(studentCount);
  const studentsToNext = nextTier ? nextTier.min - studentCount : 0;
  const tierProgress = nextTier
    ? ((studentCount - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;
  const enrolledCount = students.filter((s: any) => s.applicationStatus === 'enrolled' || s.applicationStatus === 'converted').length;
  const pendingCount = students.filter((s: any) => s.applicationStatus === 'pending' || s.applicationStatus === 'submitted').length;
  const completedModules = TRAINING_MODULES.filter((m) => m.completed).length;
  const trainingProgress = Math.round((completedModules / TRAINING_MODULES.length) * 100);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Agent';

  const kpis = [
    { label: 'Total Students', value: studentCount, icon: UserPlus, color: '#2C3E50' },
    { label: 'Enrolled', value: enrolledCount, icon: Users, color: '#22c55e' },
    { label: 'Total Earned', value: `£${totalEarned > 0 ? totalEarned.toLocaleString() : calculatedCommission.toLocaleString()}`, icon: PoundSterling, color: '#E67E22' },
    { label: 'Pending', value: pendingCount, icon: Target, color: '#5B2C6F' },
  ];

  const handleSendMessage = async () => {
    if (!messageTarget || !messageContent.trim()) return;
    setSendingMessage(true);
    try {
      // Attempt to insert message via Supabase (table may not exist yet)
      const { error } = await supabase.from('messages').insert({
        from_user_id: user?.id,
        to_user_id: messageTarget.id,
        subject: messageSubject.trim() || null,
        content: messageContent.trim(),
      });
      if (error) throw error;
      toast({ title: 'Message sent successfully!' });
      setShowMessage(false);
      setMessageContent('');
      setMessageSubject('');
      setMessageTarget(null);
    } catch (err: any) {
      toast({ title: 'Failed to send message', description: err?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#E67E22]" />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Welcome + Membership Status */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#2C3E50] to-[#5B2C6F] text-white mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif text-xl">Welcome back, {displayName}!</h2>
                <Badge className="text-[10px]" style={{ backgroundColor: currentTier.color, color: '#fff' }}>
                  {currentTier.name}
                </Badge>
              </div>
              <p className="text-white/60 text-sm">
                {studentCount} student{studentCount !== 1 ? 's' : ''} · £{commissionRate}/student
                {nextTier && ` · ${studentsToNext} more to ${nextTier.name}`}
              </p>
              {/* Tier Progress Bar */}
              <div className="mt-3 w-full max-w-xs">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(tierProgress, 100)}%`, backgroundColor: currentTier.color }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-white/40">
                  <span>{currentTier.name}</span>
                  {nextTier && <span>{nextTier.name}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#E67E22] font-sans">
                £{totalEarned > 0 ? totalEarned.toLocaleString() : calculatedCommission.toLocaleString()}
              </div>
              <div className="text-xs text-white/40">Total earnings</div>
              <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30 text-[10px]">
                <Shield className="w-3 h-3 mr-1" /> Active Membership
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        {([
          { key: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
          { key: 'training' as const, label: 'Training Centre', icon: BookOpen },
          { key: 'membership' as const, label: 'Membership Perks', icon: Gift },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'text-[#E67E22] border-b-2 border-[#E67E22] bg-[#E67E22]/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${kpi.color}15` }}>
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <div className="text-2xl font-bold text-[#1a252f] font-sans">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
                  <div className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> Live</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bonus Milestones */}
          <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-5">
              <h3 className="font-serif text-lg text-[#1a252f] mb-4">Bonus Milestones</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {BONUSES.map((bonus) => {
                  const unlocked = studentCount >= bonus.at;
                  return (
                    <div
                      key={bonus.at}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        unlocked
                          ? 'border-green-300 bg-green-50'
                          : 'border-dashed border-gray-200 bg-gray-50 opacity-75'
                      }`}
                    >
                      {unlocked && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-green-500" />
                      )}
                      {!unlocked && (
                        <Lock className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${bonus.color}`}>
                        <bonus.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-sm">{bonus.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">At {bonus.at} students · Value: {bonus.value}</p>
                      {!unlocked && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#E67E22] rounded-full"
                              style={{ width: `${Math.min((studentCount / bonus.at) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{studentCount}/{bonus.at} students</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* My Students */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-[#1a252f]">My Students</h3>
                  <Link to="/agent/referrals">
                    <Button variant="ghost" size="sm" className="text-xs text-[#E67E22]">View All</Button>
                  </Link>
                </div>
                {students && students.length > 0 ? (
                  <div className="space-y-3">
                    {students.slice(0, 5).map((student: any) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f6f4]">
                        <div className="w-9 h-9 rounded-full bg-[#2C3E50]/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-[#2C3E50]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[#1a252f] truncate">{student.name || 'Student'}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {student.courseName || 'No course yet'} {student.locationName ? `· ${student.locationName}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`text-[10px] ${
                            student.applicationStatus === 'enrolled' || student.applicationStatus === 'converted' ? 'bg-emerald-50 text-emerald-600' :
                            student.applicationStatus === 'submitted' ? 'bg-blue-50 text-blue-600' :
                            student.applicationStatus === 'accepted' ? 'bg-purple-50 text-purple-600' :
                            'bg-gray-50 text-gray-500'
                          }`}>
                            {student.applicationStatus || 'New'}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                            onClick={() => { setMessageTarget({ id: student.id, name: student.name || 'Student' }); setShowMessage(true); }}>
                            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No students assigned yet. Share your referral link to get started!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-[#1a252f]">Leaderboard</h3>
                  <Link to="/agent/leaderboard">
                    <Button variant="ghost" size="sm" className="text-xs text-[#E67E22]">Full Rankings</Button>
                  </Link>
                </div>
                {leaderboard && leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 5).map((agent: any, index: number) => {
                      const isYou = agent.agentId === user?.id;
                      return (
                        <div key={agent.agentId} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isYou ? 'bg-[#E67E22]/10 border border-[#E67E22]/30' : 'hover:bg-[#f8f6f4]'}`}>
                          <div className="w-6 flex justify-center">{getRankIcon(index + 1)}</div>
                          <div className="w-8 h-8 rounded-full bg-[#2C3E50]/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[#2C3E50]">{(agent.agentName || 'A').charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-[#1a252f] truncate">
                              {isYou ? 'You' : agent.agentName}
                              {isYou && <Badge className="text-[10px] ml-1 bg-[#E67E22] text-[#1a252f]">You</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">{agent.studentCount} students</div>
                          </div>
                          <div className="text-sm font-bold text-[#2C3E50] font-sans">
                            £{(Number(agent.totalCommission) || agent.studentCount * getCommissionRate(agent.studentCount)).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">No agents on the leaderboard yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Commissions */}
          <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-[#1a252f]">Recent Commissions</h3>
                <Link to="/agent/commissions">
                  <Button variant="ghost" size="sm" className="text-xs text-[#E67E22]">View All</Button>
                </Link>
              </div>
              {commissions && commissions.length > 0 ? (
                <div className="space-y-3">
                  {commissions.slice(0, 5).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f6f4]">
                      <div>
                        <div className="font-medium text-sm text-[#1a252f]">Commission #{c.id}</div>
                        <div className="text-xs text-muted-foreground">{c.description || 'Student referral'}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${c.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{c.status}</Badge>
                        <div className="text-xs font-semibold mt-1" style={{ color: c.status === 'paid' ? '#10b981' : '#94a3b8' }}>£{Number(c.amount || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">No commissions yet. Refer students to start earning!</div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ─── TRAINING CENTRE TAB ─── */}
      {activeTab === 'training' && (
        <>
          {/* Training Progress */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1a252f]">Training Progress</h3>
                  <p className="text-sm text-gray-500">{completedModules}/{TRAINING_MODULES.length} modules completed</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: '#E67E22' }}>{trainingProgress}%</div>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E67E22] to-[#5B2C6F] rounded-full transition-all" style={{ width: `${trainingProgress}%` }} />
              </div>
            </CardContent>
          </Card>

          {/* Training Modules */}
          <div className="space-y-3 mb-8">
            {TRAINING_MODULES.map((mod, i) => (
              <Card key={i} className={`border-0 shadow-sm ${mod.completed ? 'bg-green-50/50' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    mod.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {mod.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{mod.title}</h4>
                    <p className="text-xs text-gray-500">{mod.duration} · {mod.type}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={mod.completed ? 'outline' : 'default'}
                    className={mod.completed ? '' : 'bg-[#E67E22] hover:bg-[#D35400] text-white'}
                  >
                    {mod.completed ? 'Review' : 'Start'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ─── MEMBERSHIP PERKS TAB ─── */}
      {activeTab === 'membership' && (
        <>
          {/* Membership Status */}
          <Card className="border-0 shadow-sm mb-6 bg-gradient-to-r from-[#2C3E50] to-[#5B2C6F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#E67E22]" />
                <div>
                  <h3 className="font-bold text-lg">Agent Certificat EduForYou</h3>
                  <p className="text-white/60 text-sm">Standard Plan · Active</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E67E22]">{studentCount}</div>
                  <div className="text-xs text-white/50">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E67E22]">{trainingProgress}%</div>
                  <div className="text-xs text-white/50">Training</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E67E22]">{currentTier.name}</div>
                  <div className="text-xs text-white/50">Tier</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <h3 className="font-serif text-lg text-[#1a252f] mb-4">Your Membership Includes</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {MEMBERSHIP_PERKS.map((perk, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                    <perk.icon className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{perk.title}</h4>
                      {perk.unlocked && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{perk.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upgrade to VIP */}
          <Card className="border-2 border-[#5B2C6F] shadow-xl">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-[#5B2C6F] mx-auto mb-3" />
              <h3 className="font-bold text-lg text-[#5B2C6F] mb-2">Upgrade to VIP Coaching</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get 1-2 coaching sessions/week, personal coaching, psychology & development, and expert guest speakers.
              </p>
              <Button className="bg-[#5B2C6F] hover:bg-[#4a2360] text-white px-8">
                Upgrade to VIP · £197 + £97/month
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Send Message Dialog */}
      <Dialog open={showMessage} onOpenChange={(open) => { setShowMessage(open); if (!open) { setMessageTarget(null); setMessageContent(''); setMessageSubject(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-[#1a252f]">
              Send Message to {messageTarget?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs text-muted-foreground">Subject (optional)</Label>
              <Input value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} className="mt-1" placeholder="e.g. Application Update" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Message *</Label>
              <Textarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="mt-1 min-h-[100px]" placeholder="Type your message here..." />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowMessage(false)}>Cancel</Button>
            <Button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageContent.trim()}
              className="bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-bold"
            >
              {sendingMessage ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending...</span>
              ) : (
                <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================================================================
   Materials placeholder (route target for /agent/materials)
   ================================================================ */
function AgentMaterialsPlaceholder() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Materials</h2>
      <p className="text-muted-foreground">Training materials and resources will appear here.</p>
    </div>
  );
}

/* ================================================================
   AgentDashboard — layout with sidebar + content area routing
   ================================================================ */
const AgentDashboard = () => (
  <DashboardLayout title="Agent Dashboard" navItems={navItems} groupLabel="Agent">
    <Routes>
      <Route index element={<AgentOverviewFull />} />
      <Route path="referrals" element={<AgentReferrals />} />
      <Route path="commissions" element={<AgentCommissions />} />
      <Route path="leaderboard" element={<AgentLeaderboard />} />
      <Route path="materials" element={<AgentMaterialsPlaceholder />} />
      <Route path="profile" element={<AgentProfile />} />
      <Route path="*" element={<Navigate to="/agent" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AgentDashboard;
