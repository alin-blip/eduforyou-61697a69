import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  BarChart3, Brain, CheckSquare, Plus, Target, TrendingUp, Users, Loader2, Sparkles, Trash2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CeoDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ contacts: 0, applications: 0, appointments: 0, agents: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [okrs, setOkrs] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [taskDialog, setTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', category: 'general', due_date: '' });
  const [okrDialog, setOkrDialog] = useState(false);
  const [newOkr, setNewOkr] = useState({ objective: '', quarter: 'Q1 2026', key_results: '' });

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (activeTab === 'tasks') fetchTasks();
    if (activeTab === 'okrs') fetchOkrs();
  }, [activeTab]);

  const fetchStats = async () => {
    const [c, a, ap, ag] = await Promise.all([
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
      supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'agent'),
    ]);
    setStats({ contacts: c.count || 0, applications: a.count || 0, appointments: ap.count || 0, agents: ag.count || 0 });
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from('ceo_tasks').select('*').order('created_at', { ascending: false });
    setTasks(data || []);
  };

  const fetchOkrs = async () => {
    const { data } = await supabase.from('ceo_okrs').select('*').order('created_at', { ascending: false });
    setOkrs(data || []);
  };

  const generateAISummary = async () => {
    setAiLoading(true);
    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'summary', stats },
      });
      if (res.error) throw res.error;
      setAiSummary(res.data?.summary || 'No summary generated.');
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message || 'Failed to generate summary', variant: 'destructive' });
    }
    setAiLoading(false);
  };

  const generateAITasks = async () => {
    setAiLoading(true);
    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'suggest', stats },
      });
      if (res.error) throw res.error;
      const suggestions = res.data?.suggestions || [];
      for (const s of suggestions) {
        await supabase.from('ceo_tasks').insert({
          title: s.title, priority: s.priority, category: s.category,
          ai_generated: true, created_by: user?.id,
        });
      }
      fetchTasks();
      toast({ title: `${suggestions.length} AI tasks generated` });
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message || 'Failed to generate tasks', variant: 'destructive' });
    }
    setAiLoading(false);
  };

  const createTask = async () => {
    await supabase.from('ceo_tasks').insert({ ...newTask, created_by: user?.id });
    setTaskDialog(false);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'general', due_date: '' });
    fetchTasks();
    toast({ title: 'Task created' });
  };

  const updateTaskStatus = async (id: string, status: string) => {
    await supabase.from('ceo_tasks').update({ status }).eq('id', id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('ceo_tasks').delete().eq('id', id);
    fetchTasks();
  };

  const createOkr = async () => {
    const keyResults = newOkr.key_results.split('\n').filter(Boolean).map(kr => ({ text: kr, done: false }));
    await supabase.from('ceo_okrs').insert({ objective: newOkr.objective, quarter: newOkr.quarter, key_results: keyResults });
    setOkrDialog(false);
    setNewOkr({ objective: '', quarter: 'Q1 2026', key_results: '' });
    fetchOkrs();
    toast({ title: 'OKR created' });
  };

  const updateOkrProgress = async (id: string, progress: number) => {
    const status = progress >= 100 ? 'completed' : progress >= 70 ? 'on-track' : progress >= 30 ? 'at-risk' : 'behind';
    await supabase.from('ceo_okrs').update({ progress, status }).eq('id', id);
    fetchOkrs();
  };

  const statCards = [
    { label: 'Total Leads', value: stats.contacts, icon: Users, color: 'text-blue-500' },
    { label: 'Applications', value: stats.applications, icon: CheckSquare, color: 'text-green-500' },
    { label: 'Appointments', value: stats.appointments, icon: Target, color: 'text-purple-500' },
    { label: 'Active Agents', value: stats.agents, icon: TrendingUp, color: 'text-primary' },
  ];

  const priorityColor = (p: string) => p === 'high' ? 'destructive' : p === 'medium' ? 'default' : 'secondary';
  const statusColor = (s: string) => s === 'completed' ? 'on-track' : s === 'on-track' ? 'default' : s === 'at-risk' ? 'secondary' : 'destructive';

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-8 h-8 text-primary" /> CEO Dashboard
              </h1>
              <p className="text-muted-foreground">AI-powered business intelligence</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="okrs">OKRs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {statCards.map(card => (
                  <div key={card.label} className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> AI Daily Summary
                  </h2>
                  <Button onClick={generateAISummary} disabled={aiLoading} size="sm">
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Brain className="w-4 h-4 mr-1" />}
                    Generate
                  </Button>
                </div>
                {aiSummary ? (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{aiSummary}</div>
                ) : (
                  <p className="text-muted-foreground">Click "Generate" to get an AI-powered summary of your business metrics.</p>
                )}
              </div>
            </TabsContent>

            {/* TASKS */}
            <TabsContent value="tasks">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-bold text-foreground">Tasks</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={generateAITasks} disabled={aiLoading}>
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                      AI Suggest
                    </Button>
                    <Button size="sm" onClick={() => setTaskDialog(true)}>
                      <Plus className="w-4 h-4 mr-1" /> New Task
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{t.title}</p>
                            {t.ai_generated && <Badge variant="outline" className="text-xs mt-1">AI</Badge>}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={priorityColor(t.priority)}>{t.priority}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.category || '—'}</TableCell>
                        <TableCell>
                          <Select value={t.status} onValueChange={v => updateTaskStatus(t.id, v)}>
                            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">Todo</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteTask(t.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tasks.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No tasks yet. Create one or let AI suggest some!</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* OKRs */}
            <TabsContent value="okrs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">OKRs</h2>
                  <Button size="sm" onClick={() => setOkrDialog(true)}>
                    <Plus className="w-4 h-4 mr-1" /> New OKR
                  </Button>
                </div>
                {okrs.map(okr => (
                  <div key={okr.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{okr.objective}</h3>
                        <span className="text-xs text-muted-foreground">{okr.quarter}</span>
                      </div>
                      <Badge variant={okr.status === 'on-track' ? 'default' : okr.status === 'completed' ? 'secondary' : 'destructive'}>{okr.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Progress value={okr.progress} className="h-2 flex-1" />
                      <span className="text-sm font-bold text-foreground">{okr.progress}%</span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 25, 50, 75, 100].map(v => (
                        <Button key={v} variant={okr.progress === v ? 'default' : 'outline'} size="sm"
                          onClick={() => updateOkrProgress(okr.id, v)}>{v}%</Button>
                      ))}
                    </div>
                    {Array.isArray(okr.key_results) && okr.key_results.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {(okr.key_results as any[]).map((kr, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className={kr.done ? 'line-through' : ''}>• {kr.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {okrs.length === 0 && <p className="text-center text-muted-foreground py-8">No OKRs defined yet.</p>}
              </div>
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Conversion Funnel</h3>
                  {[
                    { label: 'Leads', value: stats.contacts, pct: 100 },
                    { label: 'Appointments', value: stats.appointments, pct: stats.contacts ? Math.round(stats.appointments / stats.contacts * 100) : 0 },
                    { label: 'Applications', value: stats.applications, pct: stats.contacts ? Math.round(stats.applications / stats.contacts * 100) : 0 },
                  ].map(item => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{item.label}</span>
                        <span className="text-muted-foreground">{item.value} ({item.pct}%)</span>
                      </div>
                      <Progress value={item.pct} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-bold text-foreground">{stats.contacts ? Math.round(stats.applications / stats.contacts * 100) : 0}%</span>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg. per Agent</span>
                      <span className="font-bold text-foreground">{stats.agents ? Math.round(stats.contacts / stats.agents) : 0} leads</span>
                    </div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Task Completion</span>
                      <span className="font-bold text-foreground">{tasks.length ? Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Task Dialog */}
          <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
            <DialogContent>
              <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title *</Label><Input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>Description</Label><Textarea value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newTask.category} onValueChange={v => setNewTask(p => ({ ...p, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Due Date</Label><Input type="date" value={newTask.due_date} onChange={e => setNewTask(p => ({ ...p, due_date: e.target.value }))} /></div>
              </div>
              <DialogFooter><Button onClick={createTask} disabled={!newTask.title}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          {/* OKR Dialog */}
          <Dialog open={okrDialog} onOpenChange={setOkrDialog}>
            <DialogContent>
              <DialogHeader><DialogTitle>New OKR</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Objective *</Label><Input value={newOkr.objective} onChange={e => setNewOkr(p => ({ ...p, objective: e.target.value }))} /></div>
                <div><Label>Quarter</Label><Input value={newOkr.quarter} onChange={e => setNewOkr(p => ({ ...p, quarter: e.target.value }))} /></div>
                <div><Label>Key Results (one per line)</Label><Textarea value={newOkr.key_results} onChange={e => setNewOkr(p => ({ ...p, key_results: e.target.value }))} rows={4} placeholder="Increase leads to 500&#10;Close 50 applications&#10;Onboard 10 agents" /></div>
              </div>
              <DialogFooter><Button onClick={createOkr} disabled={!newOkr.objective}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
};

export default CeoDashboard;
