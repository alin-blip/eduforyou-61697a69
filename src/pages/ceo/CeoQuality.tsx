import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { ShieldCheck, Loader2, TrendingUp, AlertTriangle, CheckCircle, Star } from 'lucide-react';

const CeoQuality = () => {
  const [loading, setLoading] = useState(true);
  const [contentScores, setContentScores] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [content, apps] = await Promise.all([
      supabase.from('ai_content').select('id, cmo_score, status, type, created_at'),
      supabase.from('applications').select('id, status, created_at'),
    ]);
    setContentScores(content.data || []);
    setApplications(apps.data || []);
    setLoading(false);
  };

  const avgContentScore = contentScores.filter((c) => c.cmo_score != null).length > 0
    ? (contentScores.filter((c) => c.cmo_score != null).reduce((s, c) => s + (c.cmo_score || 0), 0) / contentScores.filter((c) => c.cmo_score != null).length).toFixed(1)
    : 'N/A';

  const approvalRate = contentScores.length > 0
    ? Math.round((contentScores.filter((c) => c.status === 'approved' || c.status === 'published').length / contentScores.length) * 100)
    : 0;

  const appSuccessRate = applications.length > 0
    ? Math.round((applications.filter((a) => a.status === 'enrolled' || a.status === 'accepted').length / applications.length) * 100)
    : 0;

  // Score distribution
  const scoreDistribution = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => ({
    score: score.toString(),
    count: contentScores.filter((c) => Math.round(c.cmo_score || 0) === score).length,
  }));

  // Quality trend by month
  const qualityTrend = contentScores.reduce((acc: any[], item) => {
    const month = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const existing = acc.find((a) => a.month === month);
    if (existing) {
      existing.total += item.cmo_score || 0;
      existing.count += 1;
    } else {
      acc.push({ month, total: item.cmo_score || 0, count: 1 });
    }
    return acc;
  }, []).map((a) => ({ month: a.month, score: a.count > 0 ? Number((a.total / a.count).toFixed(1)) : 0 }));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <ShieldCheck className="w-7 h-7 text-[#d4a843]" /> Quality Metrics
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Content Score', value: avgContentScore, icon: Star, color: 'text-[#d4a843]', suffix: '/10' },
          { label: 'Content Approval Rate', value: `${approvalRate}%`, icon: CheckCircle, color: 'text-emerald-600', suffix: '' },
          { label: 'Application Success', value: `${appSuccessRate}%`, icon: TrendingUp, color: 'text-blue-600', suffix: '' },
          { label: 'Content Reviewed', value: contentScores.length, icon: ShieldCheck, color: 'text-purple-600', suffix: '' },
        ].map((k) => (
          <Card key={k.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <k.icon className={`w-5 h-5 ${k.color} mb-2`} />
              <p className="text-2xl font-bold text-[#0a1628]">{k.value}{k.suffix}</p>
              <p className="text-sm text-gray-500">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Quality Score */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[#0a1628]">Overall Platform Quality</span>
            <span className="text-lg font-bold text-[#d4a843]">{Math.round((approvalRate + appSuccessRate) / 2)}%</span>
          </div>
          <Progress value={Math.round((approvalRate + appSuccessRate) / 2)} className="h-3" />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="score" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Quality Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#0a1628" strokeWidth={2} dot={{ fill: '#d4a843', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CeoQuality;
