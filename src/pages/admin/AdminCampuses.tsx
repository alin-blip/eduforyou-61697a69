import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit2, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const emptyCampus = {
  name: '',
  slug: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  phone: '',
  email: '',
  google_maps_url: '',
  is_active: true,
};

const AdminCampuses = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data: campuses = [], isLoading } = useQuery({
    queryKey: ['admin-campuses'],
    queryFn: async () => {
      const { data } = await supabase.from('campuses').select('*').order('name');
      return data || [];
    },
  });

  const saveCampus = useMutation({
    mutationFn: async (campus: any) => {
      const slug = campus.slug || campus.name.toLowerCase().replace(/\s+/g, '-');
      const { id, created_at, updated_at, ...payload } = campus;
      payload.slug = slug;
      if (id) {
        await supabase.from('campuses').update(payload).eq('id', id);
      } else {
        await supabase.from('campuses').insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campuses'] });
      setOpen(false);
      toast({ title: editing?.id ? 'Campus updated' : 'Campus created' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from('campuses').update({ is_active }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-campuses'] }),
  });

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
          <h1 className="text-2xl font-bold text-[#1a252f]">Campus Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{campuses.length} campuses</p>
        </div>
        <Button
          className="bg-[#D4AF37] hover:bg-[#d35400]"
          onClick={() => { setEditing({ ...emptyCampus }); setOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Campus
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campuses.map((campus: any) => (
          <Card key={campus.id} className="shadow-sm overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#1a252f]">{campus.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={campus.is_active ? 'default' : 'secondary'}>
                    {campus.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...campus }); setOpen(true); }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>{campus.address_line1}{campus.address_line2 ? `, ${campus.address_line2}` : ''}</p>
                <p>{campus.city}{campus.postcode ? `, ${campus.postcode}` : ''}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {campus.phone && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" /> {campus.phone}
                  </span>
                )}
                {campus.email && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" /> {campus.email}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={campus.is_active}
                    onCheckedChange={v => toggleActive.mutate({ id: campus.id, is_active: v })}
                  />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
                {campus.google_maps_url && (
                  <a href={campus.google_maps_url} target="_blank" rel="noreferrer" className="text-xs text-[#D4AF37] flex items-center gap-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> View on Map
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campuses.length === 0 && (
        <div className="text-center text-muted-foreground py-12">No campuses yet. Add your first campus.</div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Campus' : 'New Campus'}</DialogTitle>
          </DialogHeader>
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
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active} onCheckedChange={v => setEditing({ ...editing, is_active: v })} />
                <Label>Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => saveCampus.mutate(editing)} className="bg-[#D4AF37] hover:bg-[#d35400]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampuses;
