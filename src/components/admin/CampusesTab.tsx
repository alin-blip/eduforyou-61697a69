import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const emptyCampus = { name: '', slug: '', address_line1: '', address_line2: '', city: '', postcode: '', country: 'United Kingdom', phone: '', email: '', google_maps_url: '', is_active: true };

const CampusesTab = () => {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchCampuses(); }, []);

  const fetchCampuses = async () => {
    const { data } = await supabase.from('campuses').select('*').order('name');
    setCampuses(data || []);
  };

  const openNew = () => { setEditing({ ...emptyCampus }); setOpen(true); };
  const openEdit = (c: any) => { setEditing({ ...c }); setOpen(true); };

  const save = async () => {
    if (!editing.name || !editing.city) { toast({ title: 'Name and city are required', variant: 'destructive' }); return; }
    const slug = editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...editing, slug };
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    if (editing.id) {
      await supabase.from('campuses').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('campuses').insert(payload);
    }
    setOpen(false);
    fetchCampuses();
    toast({ title: editing.id ? 'Campus updated' : 'Campus created' });
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><MapPin className="w-5 h-5" /> Campuses</h2>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Campus</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campuses.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-sm">{c.address_line1}{c.address_line2 ? `, ${c.address_line2}` : ''}</TableCell>
              <TableCell className="text-sm">{c.city}</TableCell>
              <TableCell className="text-sm">{c.postcode}</TableCell>
              <TableCell className="text-sm">{c.phone || '—'}</TableCell>
              <TableCell><Switch checked={c.is_active} onCheckedChange={async v => { await supabase.from('campuses').update({ is_active: v }).eq('id', c.id); fetchCampuses(); }} /></TableCell>
              <TableCell><Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit2 className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit Campus' : 'New Campus'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>Name *</Label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Address Line 1</Label><Input value={editing.address_line1} onChange={e => setEditing({ ...editing, address_line1: e.target.value })} /></div>
              <div><Label>Address Line 2</Label><Input value={editing.address_line2} onChange={e => setEditing({ ...editing, address_line2: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>City *</Label><Input value={editing.city} onChange={e => setEditing({ ...editing, city: e.target.value })} /></div>
                <div><Label>Postcode</Label><Input value={editing.postcode} onChange={e => setEditing({ ...editing, postcode: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
              </div>
              <div><Label>Google Maps URL</Label><Input value={editing.google_maps_url} onChange={e => setEditing({ ...editing, google_maps_url: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={v => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampusesTab;
