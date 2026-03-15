import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { DollarSign, TrendingUp, Target, Loader2, ArrowUpRight } from 'lucide-react';

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_COLORS: Record<string, string> = {
  lead: '#0a1628', qualified: '#1a2d4a', proposal: '#2a4570',
  negotiation: '#d4a843', won: '#22c55e', lost: '#ef4444',
};

const CeoSales = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
    setDeals(data || []);
    setLoading(false);
  };

  const pipelineData = STAGES.map((stage) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: deals.filter((d) => d.stage === stage).length,
    value: deals.filter((d) => d.stage === stage).reduce((s, d) => s + (d.value || 0), 0),
    fill: STAGE_COLORS[stage],
  }));

  const totalRevenue = deals.filter((d) => d.stage === 'won').reduce((s, d) => s + (d.value || 0), 0);
  const avgDealSize = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + (d.value || 0), 0) / deals.length) : 0;
  const winRate = deals.length > 0 ? Math.round((deals.filter((d) => d.stage === 'won').length / deals.length) * 100) : 0;

  // Revenue trend - group by month
  const revenueTrend = deals.reduce((acc: any[], deal) => {
    const month = new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.revenue += deal.value || 0;
    else acc.push({ month, revenue: deal.value || 0 });
    return acc;
  }, []).slice(-8);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Sales Pipeline</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `€${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-[#d4a843]' },
          { label: 'Avg Deal Size', value: `€${avgDealSize.toLocaleString()}`, icon: Target, color: 'text-blue-600' },
          { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: 'text-emerald-600' },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-[#0a1628]">{kpi.value}</p>
              <p className="text-sm text-gray-500">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Pipeline by Stage</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="stage" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Revenue Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#d4a843" strokeWidth={2} dot={{ fill: '#d4a843', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deals */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Top Deals</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deals.slice(0, 10).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0a1628] truncate">{deal.title}</p>
                  <p className="text-xs text-gray-500">{new Date(deal.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#0a1628]">€{(deal.value || 0).toLocaleString()}</span>
                  <Badge variant={deal.stage === 'won' ? 'default' : deal.stage === 'lost' ? 'destructive' : 'outline'}>
                    {deal.stage}
                  </Badge>
                </div>
              </div>
            ))}
            {deals.length === 0 && <p className="text-gray-400 text-center py-6">No deals yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoSales;
