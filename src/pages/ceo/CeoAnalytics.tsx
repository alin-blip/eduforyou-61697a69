import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { BarChart3, Loader2, Calendar } from 'lucide-react';

const COLORS = ['#0a1628', '#d4a843', '#2a4570', '#b8912e', '#1a2d4a', '#6b7280'];

const CeoAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [c, a, d] = await Promise.all([
      supabase.from('contacts').select('id, created_at, source'),
      supabase.from('applications').select('id, created_at, status, course_slug'),
      supabase.from('deals').select('id, created_at, stage, value'),
    ]);
    setContacts(c.data || []);
    setApplications(a.data || []);
    setDeals(d.data || []);
    setLoading(false);
  };

  const filterByDate = (items: any[]) => {
    return items.filter((item) => {
      const date = new Date(item.created_at);
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  };

  const fc = filterByDate(contacts);
  const fa = filterByDate(applications);
  const fd = filterByDate(deals);

  // Trend data - group by month
  const buildTrend = (items: any[]) => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      const m = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).slice(-12);
  };

  // Source distribution
  const sourceDistribution = fc.reduce((acc: Record<string, number>, c) => {
    const src = (c.source || 'direct');
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(sourceDistribution).map(([name, value]) => ({ name, value }));

  // Application status breakdown
  const statusBreakdown = fa.reduce((acc: Record<string, number>, a) => {
    const st = a.status || 'pending';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(statusBreakdown).map(([status, count]) => ({ status, count }));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[#d4a843]" /> Business Analytics
        </h1>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
          <span className="text-gray-400">to</span>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
          <Button variant="outline" size="sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Reset</Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Contacts', value: fc.length },
          { label: 'Applications', value: fa.length },
          { label: 'Deals', value: fd.length },
          { label: 'Deal Value', value: `€${fd.reduce((s, d) => s + (d.value || 0), 0).toLocaleString()}` },
        ].map((k) => (
          <Card key={k.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-[#0a1628]">{k.value}</p>
              <p className="text-sm text-gray-500">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Contact Growth Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={buildTrend(fc)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="count" stroke="#d4a843" strokeWidth={2} dot={{ fill: '#d4a843', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Traffic Source Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Application Status Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#0a1628" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoAnalytics;
