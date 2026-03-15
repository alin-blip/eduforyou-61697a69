import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Server, Loader2, Users, CreditCard, Activity, Shield } from 'lucide-react';

const COLORS = ['#0a1628', '#d4a843', '#22c55e', '#2a4570', '#b8912e'];

const CeoAgentPlatform = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [mem, ag, wf] = await Promise.all([
      supabase.from('agent_memberships').select('*'),
      supabase.from('user_roles').select('user_id').eq('role', 'agent'),
      supabase.from('agent_workflow_runs').select('id, status, created_at'),
    ]);
    setMemberships(mem.data || []);
    setAgents(ag.data || []);
    setWorkflows(wf.data || []);
    setLoading(false);
  };

  const activeMemberships = memberships.filter((m) => m.status === 'active');
  const planDistribution = memberships.reduce((acc: Record<string, number>, m) => {
    acc[m.plan_type] = (acc[m.plan_type] || 0) + 1;
    return acc;
  }, {});
  const planPie = Object.entries(planDistribution).map(([name, value]) => ({ name, value }));

  const membershipStatus = memberships.reduce((acc: Record<string, number>, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusBar = Object.entries(membershipStatus).map(([status, count]) => ({ status, count }));

  // Workflow activity by month
  const workflowActivity = workflows.reduce((acc: any[], wf) => {
    const month = new Date(wf.created_at).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.runs++;
    else acc.push({ month, runs: 1 });
    return acc;
  }, []).slice(-6);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Server className="w-7 h-7 text-[#d4a843]" /> Agent Platform
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Users, color: 'text-blue-600' },
          { label: 'Active Memberships', value: activeMemberships.length, icon: CreditCard, color: 'text-[#d4a843]' },
          { label: 'Workflow Runs', value: workflows.length, icon: Activity, color: 'text-emerald-600' },
          { label: 'Platform Health', value: '98%', icon: Shield, color: 'text-purple-600' },
        ].map((k) => (
          <Card key={k.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <k.icon className={`w-5 h-5 ${k.color} mb-2`} />
              <p className="text-2xl font-bold text-[#0a1628]">{k.value}</p>
              <p className="text-sm text-gray-500">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Plan Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planPie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {planPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Membership Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusBar}>
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

      {/* Workflow Activity */}
      {workflowActivity.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Workflow Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="runs" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memberships List */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Recent Memberships</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {memberships.slice(0, 10).map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-[#0a1628]">Agent {m.user_id.slice(0, 8)}</p>
                <p className="text-xs text-gray-500">Since {new Date(m.started_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{m.plan_type}</Badge>
                <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge>
              </div>
            </div>
          ))}
          {memberships.length === 0 && <p className="text-gray-400 text-center py-6">No memberships</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoAgentPlatform;
