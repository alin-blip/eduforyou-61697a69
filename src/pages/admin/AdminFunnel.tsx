import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { TrendingDown, Filter } from 'lucide-react';

const STAGE_ORDER = ['new', 'contacted', 'qualified', 'converted'] as const;
const STAGE_LABELS: Record<string, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
};
const STAGE_COLORS = ['#3b82f6', '#f59e0b', '#E67E22', '#22c55e'];

const AdminFunnel = () => {
  const [dateRange, setDateRange] = useState('30');

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-funnel-contacts', dateRange],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - Number(dateRange));
      const { data } = await supabase
        .from('contacts')
        .select('id, status, created_at')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const funnelData = useMemo(() => {
    const counts: Record<string, number> = { new: 0, contacted: 0, qualified: 0, converted: 0 };
    contacts.forEach(c => {
      const status = (c.status as string) || 'new';
      const idx = STAGE_ORDER.indexOf(status as typeof STAGE_ORDER[number]);
      if (idx >= 0) {
        for (let i = 0; i <= idx; i++) {
          counts[STAGE_ORDER[i]]++;
        }
      } else {
        counts['new']++;
      }
    });
    return STAGE_ORDER.map((stage, i) => ({
      name: STAGE_LABELS[stage],
      value: counts[stage],
      fill: STAGE_COLORS[i],
    }));
  }, [contacts]);

  const dropOffData = useMemo(() => {
    return funnelData.slice(0, -1).map((stage, i) => {
      const next = funnelData[i + 1];
      const dropOff = stage.value > 0 ? ((stage.value - next.value) / stage.value * 100) : 0;
      return {
        name: `${stage.name} → ${next.name}`,
        dropOff: Math.round(dropOff),
        conversion: Math.round(100 - dropOff),
      };
    });
  }, [funnelData]);

  const totalLeads = funnelData[0]?.value || 0;
  const totalConverted = funnelData[funnelData.length - 1]?.value || 0;
  const overallConversion = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a252f]">Funnel Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track conversion rates through your sales pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <p className="text-3xl font-bold text-[#1a252f]">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Converted</p>
            <p className="text-3xl font-bold text-[#22c55e]">{totalConverted}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overall Conversion</p>
            <p className="text-3xl font-bold text-[#E67E22]">{overallConversion}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#1a252f]">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-[#1a252f]">
            <TrendingDown className="w-5 h-5" /> Stage Drop-off Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dropOffData.map((stage, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1a252f]">{stage.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">{stage.conversion}% pass</Badge>
                    <Badge variant="destructive" className="text-xs">{stage.dropOff}% drop</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-[#E67E22] h-2.5 rounded-full transition-all"
                    style={{ width: `${stage.conversion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFunnel;
