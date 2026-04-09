import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { coursesData } from '@/data/courses';
import {
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Star,
  Trophy,
  Car,
  Palmtree,
  Store,
  Send,
  Clock,
  Crown,
  Zap,
  Gem,
} from 'lucide-react';

interface Referral {
  id: string;
  referred_name: string;
  referred_email: string;
  status: string;
  commission_amount: number | null;
  created_at: string;
  course_interest: string | null;
}

interface Membership {
  id: string;
  tier: string;
  status: string;
  started_at: string;
}

const commissionTiers = [
  {
    name: 'Starter',
    amount: '£500',
    description: 'Per înscriere',
    icon: Star,
    gradient: 'from-blue-500 to-blue-600',
    requirement: 'Nivel de bază',
  },
  {
    name: 'Pro',
    amount: '£750',
    description: 'Per înscriere',
    icon: Zap,
    gradient: 'from-[#D4AF37] to-[#C6A248]',
    requirement: '10+ studenți înscriși',
  },
  {
    name: 'Elite',
    amount: '£1000',
    description: 'Per înscriere',
    icon: Gem,
    gradient: 'from-purple-500 to-purple-700',
    requirement: '25+ studenți înscriși',
  },
];

const milestones = [
  {
    target: 25,
    reward: 'Vacanță în Dubai',
    description: 'Vacanță all-inclusive de 7 zile în Dubai pentru tine și un însoțitor',
    icon: Palmtree,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    target: 100,
    reward: 'BMW',
    description: 'Mașină BMW seria 3 nouă - totul inclus',
    icon: Car,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    target: 200,
    reward: 'Franciză',
    description: 'Pachet complet de franciză EduForYou în orașul tău',
    icon: Store,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
];

const AgentDashboardHome = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    referred_name: '',
    referred_email: '',
    referred_phone: '',
    course_interest: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [refRes, memRes] = await Promise.all([
        supabase
          .from('referrals')
          .select('*')
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('agent_memberships')
          .select('*')
          .eq('agent_id', user.id)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      setReferrals((refRes.data as Referral[]) || []);
      setMembership(memRes.data as Membership | null);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const totalReferrals = referrals.length;
  const enrolledStudents = referrals.filter(
    (r) => r.status === 'converted' || r.status === 'enrolled'
  ).length;
  const totalEarnings = referrals.reduce(
    (s, r) => s + (Number(r.commission_amount) || 0),
    0
  );
  const conversionRate =
    totalReferrals > 0
      ? ((enrolledStudents / totalReferrals) * 100).toFixed(1)
      : '0.0';

  const kpis = [
    {
      label: 'Total Referraluri',
      value: totalReferrals,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Studenți Înscriși',
      value: enrolledStudents,
      icon: GraduationCap,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'Câștiguri Totale',
      value: `£${totalEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-[#D4AF37]',
      bg: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10',
    },
    {
      label: 'Rată de Conversie',
      value: `${conversionRate}%`,
      icon: BarChart3,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  const handleSubmitReferral = async () => {
    if (!user || !form.referred_name || !form.referred_email) {
      toast({
        title: 'Eroare',
        description: 'Numele și emailul sunt obligatorii.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('referrals').insert({
      ...form,
      agent_id: user.id,
    });
    if (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut adăuga referralul.',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Referral adăugat cu succes!' });
      setForm({
        referred_name: '',
        referred_email: '',
        referred_phone: '',
        course_interest: '',
      });
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      setReferrals((data as Referral[]) || []);
    }
    setSubmitting(false);
  };

  const recentActivity = referrals.slice(0, 5);

  const currentTier = membership?.tier || 'Starter';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Centru de Comandă
        </h1>
        <p className="text-muted-foreground mt-1">
          Bine ai venit! Monitorizează performanța și gestionează referralurile tale.
        </p>
      </div>

      {/* Membership Status */}
      <Card className="border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 dark:to-[#D4AF37]/10">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="font-semibold text-foreground">
                Membru {currentTier}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {membership?.status === 'active' ? 'Activ' : 'În așteptare'}
              </p>
            </div>
          </div>
          <Badge className="bg-[#D4AF37] text-white hover:bg-[#D4AF37]/90">
            {currentTier}
          </Badge>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commission Tiers */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Nivele de Comision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commissionTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative overflow-hidden ${
                currentTier === tier.name
                  ? 'ring-2 ring-[#D4AF37] shadow-lg'
                  : 'shadow-sm'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5`}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <tier.icon className="w-8 h-8 text-[#D4AF37]" />
                  {currentTier === tier.name && (
                    <Badge className="bg-[#D4AF37] text-white">Actual</Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <p className="text-3xl font-bold text-[#D4AF37] mt-1">
                  {tier.amount}
                </p>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
                <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
                  {tier.requirement}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestone Bonuses */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Bonusuri de Etapă
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((m) => {
            const achieved = enrolledStudents >= m.target;
            const progress = Math.min(
              (enrolledStudents / m.target) * 100,
              100
            );
            return (
              <Card
                key={m.target}
                className={`shadow-sm ${achieved ? 'ring-2 ring-emerald-500' : ''}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground">{m.reward}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {m.description}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {enrolledStudents}/{m.target} studenți
                      </span>
                      <span className="font-medium text-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          achieved ? 'bg-emerald-500' : 'bg-[#D4AF37]'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {achieved && (
                    <Badge className="mt-3 bg-emerald-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" /> Deblocat!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Referral Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#D4AF37]" />
            Referral Rapid
          </CardTitle>
          <CardDescription>
            Adaugă un nou student recomandat direct din dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Numele studentului *"
              value={form.referred_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, referred_name: e.target.value }))
              }
            />
            <Input
              placeholder="Email *"
              type="email"
              value={form.referred_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, referred_email: e.target.value }))
              }
            />
            <Input
              placeholder="Telefon"
              value={form.referred_phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, referred_phone: e.target.value }))
              }
            />
            <Select
              value={form.course_interest}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, course_interest: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Curs de interes" />
              </SelectTrigger>
              <SelectContent>
                {coursesData.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="mt-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
            onClick={handleSubmitReferral}
            disabled={submitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Se trimite...' : 'Trimite Referral'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            Activitate Recentă
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Nicio activitate recentă. Adaugă primul tău referral!
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {r.referred_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.course_interest || 'Fără curs specificat'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        r.status === 'converted' || r.status === 'enrolled'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {r.status === 'converted'
                        ? 'Convertit'
                        : r.status === 'enrolled'
                        ? 'Înscris'
                        : r.status === 'contacted'
                        ? 'Contactat'
                        : r.status === 'rejected'
                        ? 'Respins'
                        : 'În așteptare'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString('ro-RO')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboardHome;
