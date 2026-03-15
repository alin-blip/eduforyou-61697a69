import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, XCircle, Users, GraduationCap } from 'lucide-react';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#E67E22', '#06b6d4'];

const AdminEligibilityStats = () => {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['admin-eligibility-stats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('eligibility_results')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const eligibleCount = results.filter(r => r.eligible === true).length;
  const notEligibleCount = results.filter(r => r.eligible === false).length;
  const unknownCount = results.filter(r => r.eligible === null).length;

  const eligibilityPieData = [
    { name: 'Eligible', value: eligibleCount, color: '#22c55e' },
    { name: 'Not Eligible', value: notEligibleCount, color: '#ef4444' },
    ...(unknownCount > 0 ? [{ name: 'Pending', value: unknownCount, color: '#f59e0b' }] : []),
  ];

  const qualificationCounts: Record<string, number> = {};
  results.forEach(r => {
    const q = r.qualification || 'Unknown';
    qualificationCounts[q] = (qualificationCounts[q] || 0) + 1;
  });
  const qualificationData = Object.entries(qualificationCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const ageBuckets: Record<string, number> = { '16-20': 0, '21-25': 0, '26-30': 0, '31-35': 0, '36-40': 0, '41+': 0 };
  results.forEach(r => {
    const age = r.age;
    if (age === null || age === undefined) return;
    if (age <= 20) ageBuckets['16-20']++;
    else if (age <= 25) ageBuckets['21-25']++;
    else if (age <= 30) ageBuckets['26-30']++;
    else if (age <= 35) ageBuckets['31-35']++;
    else if (age <= 40) ageBuckets['36-40']++;
    else ageBuckets['41+']++;
  });
  const ageData = Object.entries(ageBuckets).map(([name, value]) => ({ name, value }));

  const emailSentCount = results.filter(r => r.email_sent).length;
  const ikigaiCount = results.filter(r => r.ikigai_completed).length;
  const appStartedCount = results.filter(r => r.application_started).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a252f]">Eligibility Quiz Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights from eligibility assessment results</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{results.length}</p>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-[#22c55e]" />
            <div>
              <p className="text-2xl font-bold text-[#22c55e]">{eligibleCount}</p>
              <p className="text-xs text-muted-foreground">Eligible</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-[#ef4444]" />
            <div>
              <p className="text-2xl font-bold text-[#ef4444]">{notEligibleCount}</p>
              <p className="text-xs text-muted-foreground">Not Eligible</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#E67E22]" />
            <div>
              <p className="text-2xl font-bold text-[#E67E22]">{appStartedCount}</p>
              <p className="text-xs text-muted-foreground">Apps Started</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a252f]">Eligible vs Not Eligible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eligibilityPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {eligibilityPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1a252f]">By Qualification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#E67E22" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#1a252f]">By Age Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {ageData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#1a252f]">Engagement Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-[#1a252f]">{emailSentCount}</p>
              <p className="text-sm text-muted-foreground">Emails Sent</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {results.length > 0 ? ((emailSentCount / results.length) * 100).toFixed(0) : 0}%
              </Badge>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-[#1a252f]">{ikigaiCount}</p>
              <p className="text-sm text-muted-foreground">Ikigai Completed</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {results.length > 0 ? ((ikigaiCount / results.length) * 100).toFixed(0) : 0}%
              </Badge>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-[#1a252f]">{appStartedCount}</p>
              <p className="text-sm text-muted-foreground">Applications Started</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {results.length > 0 ? ((appStartedCount / results.length) * 100).toFixed(0) : 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEligibilityStats;
