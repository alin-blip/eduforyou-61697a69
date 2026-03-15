import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, Loader2, DollarSign, Award, TrendingUp } from 'lucide-react';

const CeoAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [agentRes, commRes, appRes] = await Promise.all([
      supabase.from('user_roles').select('user_id').eq('role', 'agent'),
      supabase.from('commissions').select('*'),
      supabase.from('applications').select('id, agent_id, status'),
    ]);
    setAgents(agentRes.data || []);
    setCommissions(commRes.data || []);
    setApplications(appRes.data || []);
    setLoading(false);
  };

  const totalCommissions = commissions.reduce((s, c) => s + (c.amount || 0), 0);
  const paidCommissions = commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + (c.amount || 0), 0);

  // Agent performance data
  const agentPerformance = agents.map((agent) => {
    const agentApps = applications.filter((a) => a.agent_id === agent.user_id);
    const agentComm = commissions.filter((c) => c.agent_id === agent.user_id);
    return {
      id: agent.user_id,
      name: agent.user_id.slice(0, 8),
      applications: agentApps.length,
      enrolled: agentApps.filter((a) => a.status === 'enrolled').length,
      commission: agentComm.reduce((s: number, c: any) => s + (c.amount || 0), 0),
    };
  }).sort((a, b) => b.applications - a.applications);

  const chartData = agentPerformance.slice(0, 10).map((a) => ({
    agent: a.name,
    apps: a.applications,
    enrolled: a.enrolled,
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Users className="w-7 h-7 text-[#d4a843]" /> Agent Roster
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Users, color: 'text-blue-600' },
          { label: 'Total Commission', value: `€${totalCommissions.toLocaleString()}`, icon: DollarSign, color: 'text-[#d4a843]' },
          { label: 'Paid Out', value: `€${paidCommissions.toLocaleString()}`, icon: Award, color: 'text-emerald-600' },
          { label: 'Avg Apps/Agent', value: agents.length > 0 ? Math.round(applications.length / agents.length) : 0, icon: TrendingUp, color: 'text-purple-600' },
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

      {/* Chart */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Agent Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="agent" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="apps" fill="#0a1628" radius={[6, 6, 0, 0]} barSize={20} name="Applications" />
                <Bar dataKey="enrolled" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={20} name="Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Agent List */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Agent Details</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentPerformance.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0a1628] flex items-center justify-center text-white text-sm font-bold">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#0a1628]">Agent {agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.applications} applications, {agent.enrolled} enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#d4a843]">€{agent.commission.toLocaleString()}</span>
                  <Badge variant={agent.applications > 5 ? 'default' : 'outline'}>
                    {agent.applications > 5 ? 'Active' : 'New'}
                  </Badge>
                </div>
              </div>
            ))}
            {agents.length === 0 && <p className="text-gray-400 text-center py-6">No agents found</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoAgents;
