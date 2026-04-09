import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Briefcase, Users, Search } from 'lucide-react';

const emptyPosition = {
  title: '',
  slug: '',
  description: '',
  type: 'full-time',
  status: 'open',
  requirements: '',
};

const AdminHr = () => {
  const queryClient = useQueryClient();
  const [posOpen, setPosOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');

  const { data: positions = [] } = useQuery({
    queryKey: ['admin-job-positions'],
    queryFn: async () => {
      const { data } = await supabase.from('job_positions').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['admin-job-applications'],
    queryFn: async () => {
      const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const savePosition = useMutation({
    mutationFn: async (pos: any) => {
      const slug = pos.slug || pos.title.toLowerCase().replace(/\s+/g, '-');
      const payload = { ...pos, slug };
      if (pos.id) {
        const { id, created_at, ...rest } = payload;
        await supabase.from('job_positions').update(rest).eq('id', id);
      } else {
        delete payload.id;
        await supabase.from('job_positions').insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-positions'] });
      setPosOpen(false);
      toast({ title: editing?.id ? 'Position updated' : 'Position created' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deletePosition = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('job_positions').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-positions'] });
      toast({ title: 'Position deleted' });
    },
  });

  const updateAppStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from('job_applications').update({ status }).eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-job-applications'] });
      toast({ title: 'Status updated' });
    },
  });

  const getPositionTitle = (posId: string | null) =>
    positions.find((p: any) => p.id === posId)?.title || 'Unknown';

  const statusColor = (s: string) => {
    switch (s) {
      case 'open': return 'default';
      case 'closed': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const appStatusColor = (s: string) => {
    switch (s) {
      case 'new': return 'default';
      case 'reviewing': return 'secondary';
      case 'interview': return 'default';
      case 'hired': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a252f]">HR Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage job positions and applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{positions.length}</p>
              <p className="text-xs text-muted-foreground">Open Positions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{applications.length}</p>
              <p className="text-xs text-muted-foreground">Total Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#22c55e]" />
            <div>
              <p className="text-2xl font-bold text-[#22c55e]">
                {applications.filter((a: any) => a.status === 'hired').length}
              </p>
              <p className="text-xs text-muted-foreground">Hired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="mt-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-foreground">Job Positions</h2>
              <Button
                size="sm"
                className="bg-[#D4AF37] hover:bg-[#d35400]"
                onClick={() => { setEditing({ ...emptyPosition }); setPosOpen(true); }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Position
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos: any) => (
                  <TableRow key={pos.id}>
                    <TableCell className="font-medium">{pos.title}</TableCell>
                    <TableCell className="text-sm capitalize">{pos.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(pos.status) as any}>{pos.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {applications.filter((a: any) => a.position_id === pos.id).length}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(pos.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...pos }); setPosOpen(true); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePosition.mutate(pos.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {positions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No positions yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-foreground">Job Applications</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Match %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications
                  .filter((a: any) => !search || a.full_name.toLowerCase().includes(search.toLowerCase()))
                  .map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell className="text-sm">{app.email}</TableCell>
                      <TableCell className="text-sm">{getPositionTitle(app.position_id)}</TableCell>
                      <TableCell className="text-sm">{app.years_experience ?? '—'} yrs</TableCell>
                      <TableCell>
                        {app.ai_analysis_match_percent != null ? (
                          <Badge variant="secondary">{app.ai_analysis_match_percent}%</Badge>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        <Select value={app.status} onValueChange={v => updateAppStatus.mutate({ id: app.id, status: v })}>
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No applications yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={posOpen} onOpenChange={setPosOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Position' : 'New Position'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>Title *</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated if empty" /></div>
              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editing.description || ''}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={editing.type} onValueChange={v => setEditing({ ...editing, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Requirements</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editing.requirements || ''}
                  onChange={e => setEditing({ ...editing, requirements: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => savePosition.mutate(editing)} className="bg-[#D4AF37] hover:bg-[#d35400]">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHr;
