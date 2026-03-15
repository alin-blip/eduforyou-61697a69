import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { UserCheck, Loader2, Briefcase, Users, Clock, TrendingUp } from 'lucide-react';

const CeoHr = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [pos, apps] = await Promise.all([
      supabase.from('job_positions').select('*').order('created_at', { ascending: false }),
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
    ]);
    setPositions(pos.data || []);
    setApplications(apps.data || []);
    setLoading(false);
  };

  const openPositions = positions.filter((p) => p.status === 'open' || p.status === 'active');
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  const applicationsByPosition = positions.map((pos) => ({
    position: pos.title.length > 15 ? pos.title.slice(0, 15) + '...' : pos.title,
    count: applications.filter((a) => a.position_id === pos.id).length,
  })).filter((p) => p.count > 0);

  const statusColor = (s: string) => {
    switch (s) {
      case 'open': case 'active': return 'default';
      case 'closed': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <UserCheck className="w-7 h-7 text-[#d4a843]" /> HR Dashboard
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open Positions', value: openPositions.length, icon: Briefcase, color: 'text-blue-600' },
          { label: 'Total Applications', value: applications.length, icon: Users, color: 'text-[#d4a843]' },
          { label: 'Hired', value: hiredCount, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Avg Time to Hire', value: '14 days', icon: Clock, color: 'text-purple-600' },
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
      {applicationsByPosition.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Applications by Position</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationsByPosition} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis dataKey="position" type="category" tick={{ fill: '#374151', fontSize: 12 }} width={75} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#d4a843" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Open Positions */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Open Positions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {positions.map((pos) => (
            <div key={pos.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#0a1628]">{pos.title}</h3>
                <p className="text-xs text-gray-500">{pos.type} | {applications.filter((a) => a.position_id === pos.id).length} applicants</p>
              </div>
              <Badge variant={statusColor(pos.status)}>{pos.status}</Badge>
            </div>
          ))}
          {positions.length === 0 && <p className="text-gray-400 text-center py-6">No positions found</p>}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Recent Applications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {applications.slice(0, 10).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0a1628]">{app.full_name}</p>
                <p className="text-xs text-gray-500">{app.email} | {app.years_experience || 0} yrs exp</p>
              </div>
              <div className="flex items-center gap-2">
                {app.ai_analysis_match_percent != null && (
                  <span className="text-xs font-semibold text-[#d4a843]">{app.ai_analysis_match_percent}% match</span>
                )}
                <Badge variant={app.status === 'hired' ? 'default' : app.status === 'rejected' ? 'destructive' : 'outline'}>
                  {app.status}
                </Badge>
              </div>
            </div>
          ))}
          {applications.length === 0 && <p className="text-gray-400 text-center py-6">No applications yet</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoHr;
