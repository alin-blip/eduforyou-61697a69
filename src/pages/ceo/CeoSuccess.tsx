import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { Trophy, Loader2, GraduationCap, TrendingUp, Users, Star } from 'lucide-react';

const COLORS = ['#0a1628', '#d4a843', '#22c55e', '#2a4570', '#b8912e', '#6b7280'];

const CeoSuccess = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [apps, conts] = await Promise.all([
      supabase.from('applications').select('id, status, course_slug, created_at'),
      supabase.from('contacts').select('id, created_at'),
    ]);
    setApplications(apps.data || []);
    setContacts(conts.data || []);
    setLoading(false);
  };

  const enrolled = applications.filter((a) => a.status === 'enrolled' || a.status === 'accepted');
  const successRate = applications.length > 0 ? Math.round((enrolled.length / applications.length) * 100) : 0;

  // Status distribution
  const statusDistribution = applications.reduce((acc: Record<string, number>, app) => {
    const status = app.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusDistribution).map(([name, value]) => ({ name, value }));

  // Enrollment by course
  const courseEnrollments = enrolled.reduce((acc: Record<string, number>, app) => {
    const course = app.course_slug || 'unknown';
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});
  const courseData = Object.entries(courseEnrollments)
    .map(([course, count]) => ({ course: course.length > 20 ? course.slice(0, 20) + '...' : course, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 10);

  // Monthly enrollment trend
  const enrollmentTrend = enrolled.reduce((acc: any[], app) => {
    const month = new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.count++;
    else acc.push({ month, count: 1 });
    return acc;
  }, []).slice(-12);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Trophy className="w-7 h-7 text-[#d4a843]" /> Student Success
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: contacts.length, icon: Users, color: 'text-blue-600' },
          { label: 'Applications', value: applications.length, icon: GraduationCap, color: 'text-[#d4a843]' },
          { label: 'Enrolled', value: enrolled.length, icon: Star, color: 'text-emerald-600' },
          { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'text-purple-600' },
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

      {/* Success rate progress */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[#0a1628]">Overall Success Rate</span>
            <span className="text-lg font-bold text-[#d4a843]">{successRate}%</span>
          </div>
          <Progress value={successRate} className="h-3" />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Application Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Enrollment Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend}>
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
      </div>

      {/* Top Courses */}
      {courseData.length > 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Top Courses by Enrollment</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis dataKey="course" type="category" tick={{ fill: '#374151', fontSize: 12 }} width={95} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#0a1628" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CeoSuccess;
