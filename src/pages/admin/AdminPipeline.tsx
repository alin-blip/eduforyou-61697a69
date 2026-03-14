import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'converted'] as const;

const stageLabels: Record<string, string> = {
  new: '🟢 New',
  contacted: '🟡 Contacted',
  qualified: '🟠 Qualified',
  converted: '🔵 Converted',
};

const stageColors: Record<string, string> = {
  new: 'bg-green-500/10 border-green-500/30',
  contacted: 'bg-yellow-500/10 border-yellow-500/30',
  qualified: 'bg-orange-500/10 border-orange-500/30',
  converted: 'bg-blue-500/10 border-blue-500/30',
};

const AdminPipeline = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const moveContact = async (contactId: string, newStatus: string) => {
    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', contactId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
    }
  };

  if (loading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Sales Pipeline</h1>
        <Badge variant="secondary">{contacts.length} contacts</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STAGES.map(stage => {
          const stageContacts = contacts.filter(c => (c.status || 'new') === stage);
          return (
            <div key={stage} className="space-y-3">
              <div className={`rounded-lg border p-3 ${stageColors[stage]}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{stageLabels[stage]}</h3>
                  <Badge variant="outline" className="text-xs">{stageContacts.length}</Badge>
                </div>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {stageContacts.map(contact => (
                  <Card key={contact.id} className="shadow-sm">
                    <CardContent className="p-3 space-y-2">
                      <p className="font-medium text-sm text-foreground">{contact.full_name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                      {contact.course_interest && (
                        <p className="text-xs text-muted-foreground">📚 {contact.course_interest}</p>
                      )}
                      <Select value={stage} onValueChange={val => moveContact(contact.id, val)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PIPELINE_STAGES.map(s => (
                            <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPipeline;
