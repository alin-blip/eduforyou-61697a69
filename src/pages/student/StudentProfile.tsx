import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const StudentProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ full_name: '', phone: '', nationality: '', date_of_birth: '' });

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
    if (data) {
      setProfile(data);
      setForm({ full_name: data.full_name || '', phone: data.phone || '', nationality: data.nationality || '', date_of_birth: data.date_of_birth || '' });
    }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const save = async () => {
    if (!user) return;
    await supabase.from('profiles').update(form).eq('user_id', user.id);
    setEditing(false);
    fetchProfile();
    toast({ title: 'Profile updated' });
  };

  return (
    <div className="bg-card rounded-xl border border-border max-w-lg">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Your Profile</h2>
        {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>}
      </div>
      <div className="p-6 space-y-4">
        {editing ? (
          <>
            <div><label className="text-sm font-medium text-foreground">Full Name</label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
            <div><label className="text-sm font-medium text-foreground">Phone</label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><label className="text-sm font-medium text-foreground">Nationality</label><Input value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))} /></div>
            <div><label className="text-sm font-medium text-foreground">Date of Birth</label><Input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} /></div>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium text-foreground">{profile?.full_name || '—'}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-foreground">{user?.email}</p></div>
            <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium text-foreground">{profile?.phone || '—'}</p></div>
            <div><p className="text-sm text-muted-foreground">Nationality</p><p className="font-medium text-foreground">{profile?.nationality || '—'}</p></div>
            <div><p className="text-sm text-muted-foreground">Date of Birth</p><p className="font-medium text-foreground">{profile?.date_of_birth || '—'}</p></div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
