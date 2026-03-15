import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Workflow, Loader2, Play, Pause, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusIcon = (s: string) => {
  switch (s) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'running': return <Play className="w-4 h-4 text-blue-500" />;
    case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    case 'paused': return <Pause className="w-4 h-4 text-amber-500" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const statusColor = (s: string) => {
  switch (s) {
    case 'completed': return 'default';
    case 'running': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
};

const CeoWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [wf, wr] = await Promise.all([
      supabase.from('agent_workflows').select('*').order('created_at', { ascending: false }),
      supabase.from('agent_workflow_runs').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setWorkflows(wf.data || []);
    setRuns(wr.data || []);
    setLoading(false);
  };

  const activeWorkflows = workflows.filter((w) => w.is_active);
  const completedRuns = runs.filter((r) => r.status === 'completed');
  const failedRuns = runs.filter((r) => r.status === 'failed');

  // Run status distribution
  const runStatusDist = runs.reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const statusChart = Object.entries(runStatusDist).map(([status, count]) => ({ status, count }));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Workflow className="w-7 h-7 text-[#d4a843]" /> Workflow Management
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: workflows.length, color: 'text-blue-600' },
          { label: 'Active', value: activeWorkflows.length, color: 'text-emerald-600' },
          { label: 'Completed Runs', value: completedRuns.length, color: 'text-[#d4a843]' },
          { label: 'Failed Runs', value: failedRuns.length, color: 'text-red-500' },
        ].map((k) => (
          <Card key={k.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-sm text-gray-500">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Chart */}
      {statusChart.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Run Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="status" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Workflows</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {workflows.map((wf) => {
            const wfRuns = runs.filter((r) => r.workflow_id === wf.id);
            return (
              <div key={wf.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#0a1628]">{wf.name}</h3>
                    <Badge variant={wf.is_active ? 'default' : 'secondary'}>{wf.is_active ? 'Active' : 'Inactive'}</Badge>
                    {wf.department && <Badge variant="outline">{wf.department}</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">{wfRuns.length} runs</span>
                </div>
                {wf.description && <p className="text-sm text-gray-600 mb-2">{wf.description}</p>}
                {Array.isArray(wf.steps) && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{(wf.steps as any[]).length} steps</span>
                  </div>
                )}
              </div>
            );
          })}
          {workflows.length === 0 && <p className="text-gray-400 text-center py-6">No workflows defined</p>}
        </CardContent>
      </Card>

      {/* Recent Runs */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Recent Workflow Runs</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {runs.slice(0, 15).map((run) => (
            <div key={run.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {statusIcon(run.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0a1628] text-sm truncate">{run.workflow_name || 'Workflow Run'}</p>
                  <p className="text-xs text-gray-500">
                    Step {run.current_step}/{run.total_steps || '?'} | {new Date(run.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {run.total_steps && (
                  <div className="w-20">
                    <Progress value={(run.current_step / run.total_steps) * 100} className="h-1.5" />
                  </div>
                )}
                <Badge variant={statusColor(run.status)}>{run.status}</Badge>
              </div>
            </div>
          ))}
          {runs.length === 0 && <p className="text-gray-400 text-center py-6">No workflow runs yet</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoWorkflows;
