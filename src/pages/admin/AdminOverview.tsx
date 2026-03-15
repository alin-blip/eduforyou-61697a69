import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users, GitBranch, PoundSterling, Target, ArrowUpRight, Loader2,
  Mail, MessageSquare, Calendar, ShoppingCart, TrendingUp, BookOpen,
  UserPlus, BarChart3, RefreshCw,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';

const STAGE_COLORS: Record<string, string> = {
  new: '#60a5fa',
  contacted: '#818cf8',
  qualified: '#a78bfa',
  application: '#f59e0b',
  documents: '#fb923c',
  finance_application: '#34d399',
  converted: '#10b981',
  enrolled: '#10b981',
  lost: '#ef4444',
};

interface CrmStats {
  contacts: { today: number; thisWeek: number; total: number };
  students: { total: number; thisMonth: number };
  pipeline: { revenue: number; enrolled: number; conversionRate: number; total: number };
  purchases: { total: number; byProduct: { product: string; count: number; total: number }[] };
  appointments: { today: number; total: number };
  emails: { total: number; today: number };
  sms: { total: number; delivered: number };
  abandonedCarts: { total: number; recovered: number };
}

interface DealByStage {
  stage: string;
  count: number;
}

const AdminOverview = () => {
  const [crmStats, setCrmStats] = useState<CrmStats | null>(null);
  const [dealsByStage, setDealsByStage] = useState<DealByStage[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartISO = monthStart.toISOString();

    const [
      contactsAllRes,
      contactsTodayRes,
      contactsWeekRes,
      profilesRes,
      profilesMonthRes,
      ordersRes,
      recentRes,
      appointmentsTodayRes,
      appointmentsTotalRes,
    ] = await Promise.all([
      supabase.from('contacts').select('id, status', { count: 'exact' }),
      supabase.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', weekAgoISO),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', monthStartISO),
      supabase.from('orders').select('amount_total, status, product').eq('status', 'completed'),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('appointments' as any).select('id', { count: 'exact', head: true }).gte('date', todayISO).catch(() => ({ count: 0 })) as any,
      supabase.from('appointments' as any).select('id', { count: 'exact', head: true }).catch(() => ({ count: 0 })) as any,
    ]);

    // Pipeline counts from contacts
    const statusCounts: Record<string, number> = {};
    (contactsAllRes.data || []).forEach((c: any) => {
      const s = c.status || 'new';
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const stageEntries = Object.entries(statusCounts).map(([stage, count]) => ({ stage, count }));
    setDealsByStage(stageEntries);

    const totalContacts = contactsAllRes.count || 0;
    const enrolledCount = statusCounts['enrolled'] || statusCounts['converted'] || 0;
    const conversionRate = totalContacts > 0 ? Math.round((enrolledCount / totalContacts) * 100) : 0;

    const ordersData = ordersRes.data || [];
    const totalRevenue = ordersData.reduce((sum: number, o: any) => sum + (o.amount_total || 0), 0);

    // Group orders by product
    const productMap: Record<string, { count: number; total: number }> = {};
    ordersData.forEach((o: any) => {
      const p = o.product || 'other';
      if (!productMap[p]) productMap[p] = { count: 0, total: 0 };
      productMap[p].count += 1;
      productMap[p].total += o.amount_total || 0;
    });
    const byProduct = Object.entries(productMap).map(([product, vals]) => ({ product, ...vals }));

    setCrmStats({
      contacts: {
        today: contactsTodayRes.count || 0,
        thisWeek: contactsWeekRes.count || 0,
        total: totalContacts,
      },
      students: {
        total: profilesRes.count || 0,
        thisMonth: profilesMonthRes.count || 0,
      },
      pipeline: {
        revenue: totalRevenue / 100,
        enrolled: enrolledCount,
        conversionRate,
        total: totalContacts,
      },
      purchases: {
        total: ordersData.length,
        byProduct,
      },
      appointments: {
        today: (appointmentsTodayRes as any)?.count || 0,
        total: (appointmentsTotalRes as any)?.count || 0,
      },
      emails: { total: 0, today: 0 },
      sms: { total: 0, delivered: 0 },
      abandonedCarts: { total: 0, recovered: 0 },
    });

    setRecentContacts(recentRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
      </div>
    );
  }

  const c = crmStats?.contacts;
  const s = crmStats?.students;
  const p = crmStats?.pipeline;
  const pur = crmStats?.purchases;
  const ac = crmStats?.abandonedCarts;
  const apt = crmStats?.appointments;
  const sms = crmStats?.sms;
  const emails = crmStats?.emails;

  const pipelineData = dealsByStage.map((d) => ({
    name: d.stage.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    value: d.count,
    color: STAGE_COLORS[d.stage] || '#94a3b8',
  }));

  const kpis = [
    { label: 'Lead-uri Azi', value: c?.today ?? 0, sub: `${c?.thisWeek ?? 0} saptamana aceasta`, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/contacts' },
    { label: 'Studenti Total', value: s?.total ?? 0, sub: `+${s?.thisMonth ?? 0} luna aceasta`, icon: Target, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/students' },
    { label: 'Revenue (Enrolled)', value: `£${Number(p?.revenue ?? 0).toLocaleString()}`, sub: `${p?.enrolled ?? 0} inrolati`, icon: PoundSterling, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/pipeline' },
    { label: 'Rata Conversie', value: `${p?.conversionRate ?? 0}%`, sub: `${p?.total ?? 0} deal-uri totale`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/pipeline' },
    { label: 'Programari Azi', value: apt?.today ?? 0, sub: `${apt?.total ?? 0} total`, icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-50', href: '/admin/appointments' },
    { label: 'Cosuri Abandonate', value: ac?.total ?? 0, sub: `${ac?.recovered ?? 0} recuperate`, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/carts' },
    { label: 'Emailuri Trimise', value: emails?.total ?? 0, sub: `${emails?.today ?? 0} azi`, icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/email-templates' },
    { label: 'SMS-uri Trimise', value: sms?.total ?? 0, sub: `${sms?.delivered ?? 0} livrate`, icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50', href: '/admin/sms' },
  ];

  const purchaseRows = [
    { label: 'Ebook', count: pur?.byProduct?.find((p) => p.product?.includes('ebook'))?.count ?? 0, revenue: pur?.byProduct?.find((p) => p.product?.includes('ebook'))?.total ?? 0 },
    { label: 'Audiobook', count: pur?.byProduct?.find((p) => p.product?.includes('audio'))?.count ?? 0, revenue: pur?.byProduct?.find((p) => p.product?.includes('audio'))?.total ?? 0 },
    { label: 'Agent Plan', count: pur?.byProduct?.find((p) => p.product?.includes('agent'))?.count ?? 0, revenue: pur?.byProduct?.find((p) => p.product?.includes('agent'))?.total ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">CRM Dashboard</h2>
          <p className="text-slate-500 mt-1">Sistem de operare EduForYou — date in timp real</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchAll()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Actualizeaza
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.href}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.bg} group-hover:scale-110 transition-transform`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              Pipeline pe Etape
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineData.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Niciun deal in pipeline</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pipelineData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" fontSize={11} />
                  <YAxis dataKey="name" type="category" fontSize={10} width={110} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {pipelineData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-600" />
              Vanzari Produse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchaseRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{row.label}</p>
                    <p className="text-xs text-slate-500">{row.count} vanzari</p>
                  </div>
                  <p className="font-bold text-slate-900">£{Number(row.revenue || 0).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Total Vanzari</p>
                  <p className="text-xs text-blue-600">{pur?.total ?? 0} tranzactii</p>
                </div>
                <p className="font-bold text-blue-900">
                  £{purchaseRows.reduce((sum, r) => sum + Number(r.revenue || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Contacte Recente
              </CardTitle>
              <Link to="/admin/contacts">
                <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                  Vezi toate <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!recentContacts?.length ? (
              <div className="text-center py-6 text-slate-400 text-sm">Niciun contact</div>
            ) : (
              <div className="space-y-2">
                {recentContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
                        {(contact.full_name || contact.email || '?')[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{contact.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{contact.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{contact.status || 'new'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Actiuni Rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: 'Email Templates', href: '/admin/email-templates', icon: Mail, color: 'text-blue-600' },
                { label: 'Secvente Email', href: '/admin/email-sequences', icon: BarChart3, color: 'text-purple-600' },
                { label: 'Programari', href: '/admin/appointments', icon: Calendar, color: 'text-cyan-600' },
                { label: 'Cosuri Abandonate', href: '/admin/carts', icon: ShoppingCart, color: 'text-orange-600' },
                { label: 'SMS Logs', href: '/admin/sms', icon: MessageSquare, color: 'text-pink-600' },
                { label: 'Funnel Analytics', href: '/admin/funnel', icon: TrendingUp, color: 'text-green-600' },
              ].map((action) => (
                <Link key={action.label} to={action.href}>
                  <div className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{action.label}</span>
                    <ArrowUpRight className="w-3 h-3 ml-auto text-slate-300 group-hover:text-slate-500" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
