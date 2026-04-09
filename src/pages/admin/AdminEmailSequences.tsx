import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Mail, Zap } from 'lucide-react';

const TRIGGER_EVENTS = [
  'contact_created',
  'eligibility_completed',
  'application_started',
  'application_submitted',
  'appointment_booked',
  'cart_abandoned',
  'quiz_completed',
];

const emptySequence = {
  name: '',
  trigger_event: 'contact_created',
  is_active: true,
  steps: [] as Array<{ delay_hours: number; subject: string; template_name: string }>,
};

const AdminEmailSequences = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [stepsJson, setStepsJson] = useState('[]');

  const { data: sequences = [], isLoading } = useQuery({
    queryKey: ['admin-email-sequences'],
    queryFn: async () => {
      const { data } = await supabase
        .from('email_sequences')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveSequence = useMutation({
    mutationFn: async (seq: any) => {
      let steps;
      try {
        steps = JSON.parse(stepsJson);
      } catch {
        throw new Error('Invalid JSON in steps');
      }

      const payload = {
        name: seq.name,
        trigger_event: seq.trigger_event,
        is_active: seq.is_active,
        steps,
      };

      if (seq.id) {
        await supabase.from('email_sequences').update(payload).eq('id', seq.id);
      } else {
        await supabase.from('email_sequences').insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-sequences'] });
      setOpen(false);
      toast({ title: editing?.id ? 'Sequence updated' : 'Sequence created' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteSequence = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('email_sequences').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-email-sequences'] });
      toast({ title: 'Sequence deleted' });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from('email_sequences').update({ is_active }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-email-sequences'] }),
  });

  const openNew = () => {
    setEditing({ ...emptySequence });
    setStepsJson(JSON.stringify(emptySequence.steps, null, 2));
    setOpen(true);
  };

  const openEdit = (seq: any) => {
    setEditing({ ...seq });
    setStepsJson(JSON.stringify(seq.steps || [], null, 2));
    setOpen(true);
  };

  const getStepCount = (steps: any) => {
    if (Array.isArray(steps)) return steps.length;
    return 0;
  };

  const activeCount = sequences.filter((s: any) => s.is_active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a252f]">Email Sequences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sequences.length} sequences, {activeCount} active
          </p>
        </div>
        <Button onClick={openNew} className="bg-[#D4AF37] hover:bg-[#d35400]">
          <Plus className="w-4 h-4 mr-1" /> New Sequence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{sequences.length}</p>
              <p className="text-xs text-muted-foreground">Total Sequences</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-[#22c55e]" />
            <div>
              <p className="text-2xl font-bold text-[#22c55e]">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#1a252f]">
              {sequences.reduce((sum: number, s: any) => sum + getStepCount(s.steps), 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Steps</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">All Sequences</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Trigger Event</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sequences.map((seq: any) => (
              <TableRow key={seq.id}>
                <TableCell className="font-medium">{seq.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs font-mono">{seq.trigger_event}</Badge>
                </TableCell>
                <TableCell className="text-sm">{getStepCount(seq.steps)} steps</TableCell>
                <TableCell>
                  <Switch
                    checked={seq.is_active}
                    onCheckedChange={v => toggleActive.mutate({ id: seq.id, is_active: v })}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(seq.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(seq)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSequence.mutate(seq.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sequences.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No email sequences yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Sequence' : 'New Sequence'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Sequence Name *</Label>
                <Input
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Welcome Sequence"
                />
              </div>
              <div>
                <Label>Trigger Event</Label>
                <Select
                  value={editing.trigger_event}
                  onValueChange={v => setEditing({ ...editing, trigger_event: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRIGGER_EVENTS.map(evt => (
                      <SelectItem key={evt} value={evt}>{evt.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={v => setEditing({ ...editing, is_active: v })}
                />
                <Label>Active</Label>
              </div>
              <div>
                <Label>Steps (JSON)</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Array of objects with delay_hours, subject, template_name
                </p>
                <textarea
                  className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={stepsJson}
                  onChange={e => setStepsJson(e.target.value)}
                  placeholder={`[\n  {\n    "delay_hours": 0,\n    "subject": "Welcome!",\n    "template_name": "welcome"\n  }\n]`}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => saveSequence.mutate(editing)}
              className="bg-[#D4AF37] hover:bg-[#d35400]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailSequences;
