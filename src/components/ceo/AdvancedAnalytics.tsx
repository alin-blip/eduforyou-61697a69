import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const AdvancedAnalytics = () => {
  const [leadsOverTime, setLeadsOverTime] = useState<any[]>([]);
  const [sourceBreakdown, setSourceBreakdown] = useState<any[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const [contactsRes, appsRes] = await Promise.all([
      supabase.from('contacts').select('created_at, source, status'),
      supabase.from('applications').select('created_at, status'),
    ]);

    const contacts = contactsRes.data || [];
    const apps = appsRes.data || [];

    // Leads over time (last 12 weeks)
    const weeks: Record<string, { leads: number; apps: number }> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = d.toISOString().slice(0, 10);
      weeks[key] = { leads: 0, apps: 0 };
    }
    const weekKeys = Object.keys(weeks);

    contacts.forEach(c => {
      const created = c.created_at.slice(0, 10);
      const wk = weekKeys.reduce((best, k) => created >= k ? k : best, weekKeys[0]);
      if (weeks[wk]) weeks[wk].leads++;
    });
    apps.forEach(a => {
      const created = a.created_at.slice(0, 10);
      const wk = weekKeys.reduce((best, k) => created >= k ? k : best, weekKeys[0]);
      if (weeks[wk]) weeks[wk].apps++;
    });

    setLeadsOverTime(weekKeys.map(k => ({
      week: new Date(k).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      Leads: weeks[k].leads,
      Applications: weeks[k].apps,
    })));

    // Source breakdown
    const sources: Record<string, number> = {};
    contacts.forEach(c => {
      const s = c.source || 'unknown';
      sources[s] = (sources[s] || 0) + 1;
    });
    setSourceBreakdown(Object.entries(sources).map(([name, value]) => ({ name, value })));

    // Status breakdown
    const statuses: Record<string, number> = {};
    contacts.forEach(c => {
      const s = c.status || 'new';
      statuses[s] = (statuses[s] || 0) + 1;
    });
    setStatusBreakdown(Object.entries(statuses).map(([name, value]) => ({ name, value })));

    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Leads & Applications over time */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Leads & Applications (12 weeks)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={leadsOverTime}>
            <defs>
              <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Area type="monotone" dataKey="Leads" stroke="hsl(var(--primary))" fill="url(#gradLeads)" strokeWidth={2} />
            <Area type="monotone" dataKey="Applications" stroke="hsl(var(--chart-2))" fill="url(#gradApps)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" /> Lead Sources
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sourceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {sourceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Lead Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
