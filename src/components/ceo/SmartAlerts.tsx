import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Bell, Users, Target, Calendar } from 'lucide-react';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  icon: any;
}

const SmartAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [kpis, setKpis] = useState({
    leadsThisWeek: 0,
    leadsLastWeek: 0,
    appsThisWeek: 0,
    appsLastWeek: 0,
    appointmentsThisWeek: 0,
    conversionRate: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    setLoading(true);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000).toISOString();

    const [contactsAll, appsAll, appsThisWeek, appsLastWeek, appointmentsThisWeek, pendingAppts] = await Promise.all([
      supabase.from('contacts').select('created_at', { count: 'exact' }),
      supabase.from('applications').select('created_at', { count: 'exact' }),
      supabase.from('applications').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('applications').select('id', { count: 'exact', head: true }).gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const contacts = contactsAll.data || [];
    const leadsThisWeek = contacts.filter(c => c.created_at >= weekAgo).length;
    const leadsLastWeek = contacts.filter(c => c.created_at >= twoWeeksAgo && c.created_at < weekAgo).length;
    const totalContacts = contactsAll.count || 0;
    const totalApps = appsAll.count || 0;
    const conversionRate = totalContacts > 0 ? Math.round((totalApps / totalContacts) * 100) : 0;

    const data = {
      leadsThisWeek,
      leadsLastWeek,
      appsThisWeek: appsThisWeek.count || 0,
      appsLastWeek: appsLastWeek.count || 0,
      appointmentsThisWeek: appointmentsThisWeek.count || 0,
      conversionRate,
      pendingAppointments: pendingAppts.count || 0,
    };
    setKpis(data);

    // Generate alerts
    const newAlerts: Alert[] = [];

    // Lead trend
    if (data.leadsThisWeek < data.leadsLastWeek * 0.7 && data.leadsLastWeek > 0) {
      newAlerts.push({ id: '1', severity: 'critical', title: 'Lead Volume Dropping', description: `Leads down ${Math.round((1 - data.leadsThisWeek / data.leadsLastWeek) * 100)}% vs last week (${data.leadsThisWeek} vs ${data.leadsLastWeek})`, icon: TrendingDown });
    } else if (data.leadsThisWeek > data.leadsLastWeek * 1.2 && data.leadsLastWeek > 0) {
      newAlerts.push({ id: '1', severity: 'success', title: 'Lead Volume Growing', description: `Leads up ${Math.round((data.leadsThisWeek / data.leadsLastWeek - 1) * 100)}% vs last week!`, icon: TrendingUp });
    }

    // Conversion rate
    if (data.conversionRate < 5) {
      newAlerts.push({ id: '2', severity: 'critical', title: 'Low Conversion Rate', description: `Only ${data.conversionRate}% of leads convert to applications. Consider reviewing your funnel.`, icon: Target });
    } else if (data.conversionRate < 15) {
      newAlerts.push({ id: '2', severity: 'warning', title: 'Conversion Rate Below Target', description: `Conversion rate at ${data.conversionRate}%. Target is 15%+.`, icon: Target });
    } else {
      newAlerts.push({ id: '2', severity: 'success', title: 'Healthy Conversion Rate', description: `${data.conversionRate}% conversion rate — above target!`, icon: Target });
    }

    // Pending appointments
    if (data.pendingAppointments > 10) {
      newAlerts.push({ id: '3', severity: 'warning', title: 'Pending Appointments Backlog', description: `${data.pendingAppointments} appointments waiting to be confirmed.`, icon: Calendar });
    }

    // No leads this week
    if (data.leadsThisWeek === 0) {
      newAlerts.push({ id: '4', severity: 'critical', title: 'No Leads This Week', description: 'Zero new leads recorded. Check your marketing channels.', icon: Users });
    }

    // No applications this week
    if (data.appsThisWeek === 0 && data.leadsThisWeek > 5) {
      newAlerts.push({ id: '5', severity: 'warning', title: 'No Applications Despite Leads', description: `${data.leadsThisWeek} leads but 0 applications this week. Follow up needed.`, icon: AlertTriangle });
    }

    if (newAlerts.length === 0) {
      newAlerts.push({ id: '0', severity: 'success', title: 'All Systems Nominal', description: 'No issues detected. KPIs are within target ranges.', icon: CheckCircle2 });
    }

    setAlerts(newAlerts);
    setLoading(false);
  };

  const severityStyles = {
    critical: 'border-red-500/30 bg-red-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
    success: 'border-green-500/30 bg-green-500/5',
  };

  const severityBadge = {
    critical: 'destructive' as const,
    warning: 'secondary' as const,
    info: 'default' as const,
    success: 'outline' as const,
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Leads This Week', value: kpis.leadsThisWeek, prev: kpis.leadsLastWeek },
          { label: 'Apps This Week', value: kpis.appsThisWeek, prev: kpis.appsLastWeek },
          { label: 'Conversion Rate', value: `${kpis.conversionRate}%`, prev: null },
          { label: 'Pending Appts', value: kpis.pendingAppointments, prev: null },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            {kpi.prev !== null && kpi.prev > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {Number(kpi.value) >= kpi.prev ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${Number(kpi.value) >= kpi.prev ? 'text-green-500' : 'text-red-500'}`}>
                  vs {kpi.prev} last week
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Smart Alerts
        </h2>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`rounded-lg border p-4 flex items-start gap-3 ${severityStyles[alert.severity]}`}>
              <alert.icon className={`w-5 h-5 mt-0.5 shrink-0 ${
                alert.severity === 'critical' ? 'text-red-500' :
                alert.severity === 'warning' ? 'text-yellow-500' :
                alert.severity === 'success' ? 'text-green-500' : 'text-blue-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground text-sm">{alert.title}</span>
                  <Badge variant={severityBadge[alert.severity]} className="text-[10px]">{alert.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartAlerts;
