import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

const CATEGORIES = ['welcome', 'eligibility', 'ikigai', 'application', 'abandoned_cart', 'appointment', 'custom'];

const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', subject: '', html_content: '', category: 'custom' });

  const fetchTemplates = async () => {
    const { data } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.subject || !form.html_content) {
      toast({ title: 'Error', description: 'Fill all fields', variant: 'destructive' });
      return;
    }
    if (editing) {
      const { error } = await supabase.from('email_templates').update({
        name: form.name, subject: form.subject, html_content: form.html_content, category: form.category, updated_at: new Date().toISOString(),
      }).eq('id', editing.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('email_templates').insert(form);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }
    toast({ title: editing ? 'Template Updated' : 'Template Created' });
    setDialogOpen(false);
    setEditing(null);
    setForm({ name: '', subject: '', html_content: '', category: 'custom' });
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await supabase.from('email_templates').delete().eq('id', id);
    fetchTemplates();
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, subject: t.subject, html_content: t.html_content, category: t.category || 'custom' });
    setDialogOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
        <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setEditing(null); setForm({ name: '', subject: '', html_content: '', category: 'custom' }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1" />New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Template' : 'Create Template'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
              <div>
                <Label>HTML Content</Label>
                <Textarea rows={12} value={form.html_content} onChange={e => setForm(p => ({ ...p, html_content: e.target.value }))} className="font-mono text-xs" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setPreviewHtml(form.html_content); setPreviewOpen(true); }}>
                  <Eye className="w-4 h-4 mr-1" />Preview
                </Button>
                <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <Card key={t.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <Badge variant="secondary">{t.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t.subject}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                  <Pencil className="w-3 h-3 mr-1" />Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setPreviewHtml(t.html_content); setPreviewOpen(true); }}>
                  <Eye className="w-3 h-3 mr-1" />Preview
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {templates.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No templates yet.</p>}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader><DialogTitle>Email Preview</DialogTitle></DialogHeader>
          <div className="border rounded-lg overflow-auto max-h-[60vh]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailTemplates;
