import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Target, Plus, Loader2, Trash2, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QUARTERS = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
const STATUS_OPTIONS = ['on-track', 'at-risk', 'behind', 'completed'];

const statusColor = (s: string) => {
  switch (s) {
    case 'on-track': return 'default';
    case 'completed': return 'secondary';
    case 'at-risk': return 'outline';
    case 'behind': return 'destructive';
    default: return 'outline';
  }
};

const CeoOkrs = () => {
  const [okrs, setOkrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [quarterFilter, setQuarterFilter] = useState('all');
  const [form, setForm] = useState({ objective: '', quarter: 'Q1 2026', status: 'on-track', progress: 0, key_results: '' });

  useEffect(() => { fetchOkrs(); }, []);

  const fetchOkrs = async () => {
    const { data } = await supabase.from('ceo_okrs').select('*').order('created_at', { ascending: false });
    setOkrs(data || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ objective: '', quarter: 'Q1 2026', status: 'on-track', progress: 0, key_results: '' });
    setShowModal(true);
  };

  const openEdit = (okr: any) => {
    setEditing(okr);
    const krStr = Array.isArray(okr.key_results)
      ? (okr.key_results as any[]).map((kr: any) => typeof kr === 'string' ? kr : kr.title || kr.description || JSON.stringify(kr)).join('\n')
      : '';
    setForm({ objective: okr.objective, quarter: okr.quarter, status: okr.status, progress: okr.progress || 0, key_results: krStr });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.objective.trim()) { toast({ title: 'Objective is required', variant: 'destructive' }); return; }
    const krArray = form.key_results.split('\n').filter(Boolean).map((kr) => ({ title: kr.trim(), done: false }));
    const payload = { objective: form.objective, quarter: form.quarter, status: form.status, progress: form.progress, key_results: krArray };
    if (editing) {
      await supabase.from('ceo_okrs').update(payload).eq('id', editing.id);
      toast({ title: 'OKR updated' });
    } else {
      await supabase.from('ceo_okrs').insert(payload);
      toast({ title: 'OKR created' });
    }
    setShowModal(false);
    fetchOkrs();
  };

  const deleteOkr = async (id: string) => {
    await supabase.from('ceo_okrs').delete().eq('id', id);
    toast({ title: 'OKR deleted' });
    fetchOkrs();
  };

  const filtered = quarterFilter === 'all' ? okrs : okrs.filter((o) => o.quarter === quarterFilter);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <Target className="w-7 h-7 text-[#d4a843]" /> OKR Management
        </h1>
        <Button onClick={openNew} className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628] font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add OKR
        </Button>
      </div>

      {/* Quarter filter */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={quarterFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setQuarterFilter('all')}
          className={quarterFilter === 'all' ? 'bg-[#0a1628]' : ''}>All</Button>
        {QUARTERS.map((q) => (
          <Button key={q} variant={quarterFilter === q ? 'default' : 'outline'} size="sm" onClick={() => setQuarterFilter(q)}
            className={quarterFilter === q ? 'bg-[#0a1628]' : ''}>{q}</Button>
        ))}
      </div>

      {/* OKR Cards */}
      <div className="space-y-4">
        {filtered.map((okr) => (
          <Card key={okr.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-[#0a1628] text-lg">{okr.objective}</h3>
                    <Badge variant={statusColor(okr.status)}>{okr.status}</Badge>
                    <Badge variant="outline">{okr.quarter}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Progress value={okr.progress || 0} className="h-2.5 flex-1" />
                    <span className="text-sm font-bold text-[#0a1628] w-12 text-right">{okr.progress || 0}%</span>
                  </div>
                  {Array.isArray(okr.key_results) && okr.key_results.length > 0 && (
                    <div className="space-y-1.5 mt-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Results</p>
                      {(okr.key_results as any[]).map((kr: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className={`w-2 h-2 rounded-full ${kr.done ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span>{typeof kr === 'string' ? kr : kr.title || JSON.stringify(kr)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(okr)}><Edit2 className="w-4 h-4 text-gray-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteOkr(okr.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-gray-400 text-center py-12">No OKRs found</p>}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit OKR' : 'New OKR'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Objective</Label><Input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="What do you want to achieve?" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quarter</Label>
                <Select value={form.quarter} onValueChange={(v) => setForm({ ...form, quarter: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{QUARTERS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Progress ({form.progress}%)</Label>
              <Input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Key Results (one per line)</Label>
              <Textarea value={form.key_results} onChange={(e) => setForm({ ...form, key_results: e.target.value })} placeholder="e.g., Increase MRR to €50k&#10;Reach 1000 active students" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={save} className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628]">{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CeoOkrs;
