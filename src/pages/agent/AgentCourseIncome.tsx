import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, BarChart3, PoundSterling, GraduationCap } from 'lucide-react';

interface Referral {
  id: string;
  referred_name: string;
  course_interest: string | null;
  commission_amount: number | null;
  status: string;
  created_at: string;
}

interface CourseIncome {
  course: string;
  totalEarnings: number;
  studentCount: number;
  avgCommission: number;
}

interface MonthlyData {
  month: string;
  earnings: number;
  students: number;
}

const AgentCourseIncome = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      setReferrals((data as Referral[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Group by course
  const courseIncomeMap = new Map<string, CourseIncome>();
  referrals.forEach((r) => {
    const course = r.course_interest || 'Nespecificat';
    const existing = courseIncomeMap.get(course) || {
      course,
      totalEarnings: 0,
      studentCount: 0,
      avgCommission: 0,
    };
    existing.totalEarnings += Number(r.commission_amount) || 0;
    existing.studentCount += 1;
    courseIncomeMap.set(course, existing);
  });
  const courseIncomeData: CourseIncome[] = Array.from(courseIncomeMap.values()).map((c) => ({
    ...c,
    avgCommission: c.studentCount > 0 ? Math.round(c.totalEarnings / c.studentCount) : 0,
  }));
  courseIncomeData.sort((a, b) => b.totalEarnings - a.totalEarnings);

  // Bar chart data
  const barChartData = courseIncomeData.map((c) => ({
    name: c.course.length > 15 ? c.course.substring(0, 15) + '...' : c.course,
    Câștiguri: c.totalEarnings,
    Studenți: c.studentCount,
  }));

  // Monthly trend
  const monthlyMap = new Map<string, MonthlyData>();
  referrals.forEach((r) => {
    const date = new Date(r.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('ro-RO', { month: 'short', year: '2-digit' });
    const existing = monthlyMap.get(key) || { month: label, earnings: 0, students: 0 };
    existing.earnings += Number(r.commission_amount) || 0;
    existing.students += 1;
    monthlyMap.set(key, existing);
  });
  const monthlyData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  const totalEarnings = referrals.reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const totalStudents = referrals.length;
  const topCourse = courseIncomeData.length > 0 ? courseIncomeData[0] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Venituri per Curs
        </h1>
        <p className="text-muted-foreground mt-1">
          Analizează câștigurile tale detaliate pe fiecare curs și tendințele lunare.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-3">
              <PoundSterling className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              £{totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Câștiguri Totale</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Studenți</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {topCourse?.course || '-'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Cursul cu Cele Mai Mari Venituri</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Earnings per Course */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
            Câștiguri per Curs
          </CardTitle>
          <CardDescription>
            Distribuția veniturilor tale pe fiecare curs recomandat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barChartData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nu sunt date disponibile încă.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'Câștiguri' ? `£${value}` : value,
                    name,
                  ]}
                />
                <Bar dataKey="Câștiguri" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            Tendință Lunară
          </CardTitle>
          <CardDescription>
            Evoluția veniturilor și studenților pe luni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nu sunt date disponibile încă.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'Câștiguri' ? `£${value}` : value,
                    name,
                  ]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="earnings"
                  name="Câștiguri"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dot={{ fill: '#D4AF37' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="students"
                  name="Studenți"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Detalii per Curs</CardTitle>
          <CardDescription>
            Tabel detaliat cu veniturile generate de fiecare curs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {courseIncomeData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nu sunt date disponibile.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curs</TableHead>
                    <TableHead className="text-right">Studenți</TableHead>
                    <TableHead className="text-right">Câștiguri Totale</TableHead>
                    <TableHead className="text-right">Comision Mediu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseIncomeData.map((row) => (
                    <TableRow key={row.course}>
                      <TableCell className="font-medium">{row.course}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{row.studentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        £{row.totalEarnings.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        £{row.avgCommission.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      <Badge>{totalStudents}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-emerald-600">
                      £{totalEarnings.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      £{totalStudents > 0 ? Math.round(totalEarnings / totalStudents).toLocaleString() : 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCourseIncome;
