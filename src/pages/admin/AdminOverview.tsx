import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, BookOpen, TrendingUp, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ contacts: 0, applications: 0, quizzes: 0 });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [contactsRes, appsRes, quizzesRes, recentRes] = await Promise.all([
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({ contacts: contactsRes.count || 0, applications: appsRes.count || 0, quizzes: quizzesRes.count || 0 });
      setRecentContacts(recentRes.data || []);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Leads', value: stats.contacts, icon: Users, color: 'text-blue-500' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: 'text-green-500' },
    { label: 'Quiz Completions', value: stats.quizzes, icon: BookOpen, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.color}`} />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Recent Leads</h2>
        </div>
        <div className="divide-y divide-border">
          {recentContacts.map(contact => (
            <div key={contact.id} className="p-4 flex items-center justify-between">
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
          {recentContacts.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">No leads yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
