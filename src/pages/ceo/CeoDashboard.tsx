import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, FileText, DollarSign, TrendingUp, Cpu, Brain, Loader2, Sparkles,
  AlertTriangle, Activity, Clock,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KpiCard {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
}

const CeoDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    applications: 0,
    revenue: 0,
    conversionRate: 0,
    agentPerformance: 0,
  });
  const [okrs, setOkrs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const pipelineData = [
    { stage: 'Lead', count: stats.students, fill: '#0a1628' },
    { stage: 'MQL', count: Math.round(stats.students * 0.6), fill: '#1a2d4a' },
    { stage: 'SQL', count: Math.round(stats.students * 0.35), fill: '#2a4570' },
    { stage: 'Applicant', count: stats.applications, fill: '#d4a843' },
    { stage: 'Enrolled', count: Math.round(stats.applications * 0.4), fill: '#b8912e' },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [contacts, apps, agents, okrData, alertData, activityData] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'agent'),
        supabase.from('ceo_okrs').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('ai_alerts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('applications').select('id, course_slug, status, created_at').order('created_at', { ascending: false }).limit(8),
      ]);

      const totalStudents = contacts.count || 0;
      const totalApps = apps.count || 0;
      const totalAgents = agents.count || 0;
      const convRate = totalStudents > 0 ? Math.round((totalApps / totalStudents) * 100) : 0;

      setStats({
        students: totalStudents,
        applications: totalApps,
        revenue: totalApps * 2500,
        conversionRate: convRate,
        agentPerformance: totalAgents > 0 ? Math.round(totalApps / totalAgents) : 0,
      });
      setOkrs(okrData.data || []);
      setAlerts(alertData.data || []);
      setRecentActivity(activityData.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
    setLoading(false);
  };

  const generateMorningReport = async () => {
    setAiLoading(true);
    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'morning_report', stats },
      });
      if (res.error) throw res.error;
      setAiReport(res.data?.summary || res.data?.report || 'Report generated successfully.');
      toast({ title: 'AI Morning Report ready' });
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message || 'Failed to generate report', variant: 'destructive' });
    }
    setAiLoading(false);
  };

  const kpiCards: KpiCard[] = [
    { label: 'Total Students', value: stats.students.toLocaleString(), change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Applications', value: stats.applications.toLocaleString(), change: '+8%', icon: FileText, color: 'text-emerald-600' },
    { label: 'Revenue', value: `€${(stats.revenue).toLocaleString()}`, change: '+15%', icon: DollarSign, color: 'text-[#d4a843]' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: '+3%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Agent Performance', value: `${stats.agentPerformance} apps/agent`, change: '+5%', icon: Cpu, color: 'text-orange-600' },
  ];

  const alertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
            <Brain className="w-7 h-7 text-[#d4a843]" />
            Executive Command Center
          </h1>
          <p className="text-gray-500 mt-1">Real-time business intelligence overview</p>
        </div>
        <Button
          onClick={generateMorningReport}
          disabled={aiLoading}
          className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628] font-semibold"
        >
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          AI Morning Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#0a1628]">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Morning Report */}
      {aiReport && (
        <Card className="bg-white border-0 shadow-sm border-l-4 border-l-[#d4a843]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4a843]" />
              AI Morning Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{aiReport}</div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline + OKRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Lifecycle Pipeline */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0a1628]">Student Lifecycle Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis dataKey="stage" type="category" tick={{ fill: '#374151', fontSize: 13 }} width={70} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
                    {pipelineData.map((entry, index) => (
                      <rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* OKR Progress */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0a1628]">OKR Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {okrs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No OKRs defined yet</p>
            ) : (
              okrs.slice(0, 4).map((okr) => (
                <div key={okr.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0a1628] truncate max-w-[200px]">{okr.objective}</span>
                    <Badge variant={okr.status === 'on-track' ? 'default' : okr.status === 'completed' ? 'secondary' : 'destructive'}>
                      {okr.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={okr.progress || 0} className="h-2 flex-1" />
                    <span className="text-xs font-bold text-[#0a1628] w-10 text-right">{okr.progress || 0}%</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0a1628] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No active alerts</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0a1628]">{alert.title || alert.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.type || 'system'}</p>
                  </div>
                  <Badge variant={alertSeverityColor(alert.severity)}>{alert.severity || 'info'}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0a1628] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#d4a843]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No recent activity</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#d4a843]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#d4a843]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0a1628] truncate">
                      Application: {item.course_slug}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{item.status || 'pending'}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CeoDashboard;
