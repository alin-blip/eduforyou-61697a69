import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, FileText, BookOpen, TrendingUp, Mail, Phone, PoundSterling, UserCheck, ArrowRight, ShoppingCart } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({ contacts: 0, applications: 0, quizzes: 0, students: 0, revenue: 0, orders: 0 });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [pipelineCounts, setPipelineCounts] = useState<Record<string, number>>({});
  const [todayLeads, setTodayLeads] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [contactsRes, appsRes, quizzesRes, recentRes, profilesRes, ordersRes, todayRes] = await Promise.all([
        supabase.from('contacts').select('id, status', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('amount_total, status').eq('status', 'completed'),
        supabase.from('contacts').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      ]);

      const totalRevenue = (ordersRes.data || []).reduce((sum, o) => sum + (o.amount_total || 0), 0);

      setStats({
        contacts: contactsRes.count || 0,
        applications: appsRes.count || 0,
        quizzes: quizzesRes.count || 0,
        students: profilesRes.count || 0,
        revenue: totalRevenue,
        orders: (ordersRes.data || []).length,
      });
      setRecentContacts(recentRes.data || []);
      setTodayLeads(todayRes.count || 0);

      // Pipeline counts
      const counts: Record<string, number> = {};
      (contactsRes.data || []).forEach(c => {
        const s = c.status || 'new';
        counts[s] = (counts[s] || 0) + 1;
      });
      setPipelineCounts(counts);
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Leads', value: stats.contacts, icon: Users, sublabel: `${todayLeads} today` },
    { label: 'Students', value: stats.students, icon: UserCheck, sublabel: '' },
    { label: 'Applications', value: stats.applications, icon: FileText, sublabel: '' },
    { label: 'Revenue', value: `£${(stats.revenue / 100).toFixed(0)}`, icon: PoundSterling, sublabel: `${stats.orders} orders` },
    { label: 'Quiz Completions', value: stats.quizzes, icon: BookOpen, sublabel: '' },
  ];

  const pipelineStages = [
    { key: 'new', label: 'New', color: 'bg-green-500' },
    { key: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
    { key: 'qualified', label: 'Qualified', color: 'bg-[#D4AF37]' },
    { key: 'converted', label: 'Converted', color: 'bg-blue-500' },
  ];

  const totalPipeline = Object.values(pipelineCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className="w-5 h-5 text-primary" />
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              {card.sublabel && <p className="text-xs text-primary mt-1">{card.sublabel}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sales Pipeline</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/pipeline">View Full <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pipeline Bar */}
            <div className="flex rounded-full overflow-hidden h-6 mb-4">
              {pipelineStages.map(stage => {
                const count = pipelineCounts[stage.key] || 0;
                const pct = (count / totalPipeline) * 100;
                if (pct === 0) return null;
                return (
                  <div key={stage.key} className={`${stage.color} flex items-center justify-center text-xs font-medium text-white`} style={{ width: `${pct}%` }}>
                    {count}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 flex-wrap">
              {pipelineStages.map(stage => (
                <div key={stage.key} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="text-muted-foreground">{stage.label}: {pipelineCounts[stage.key] || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/students"><UserCheck className="w-4 h-4 mr-2" />View Students CRM</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/pipeline"><ShoppingCart className="w-4 h-4 mr-2" />Sales Pipeline</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/email-templates"><Mail className="w-4 h-4 mr-2" />Email Templates</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/contacts"><Users className="w-4 h-4 mr-2" />Manage Leads</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recentContacts.map(contact => (
              <div key={contact.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{contact.full_name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                  </div>
                </div>
                <Badge variant={contact.status === 'new' ? 'default' : 'secondary'}>{contact.status}</Badge>
              </div>
            ))}
            {recentContacts.length === 0 && <p className="py-4 text-center text-muted-foreground">No leads yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
