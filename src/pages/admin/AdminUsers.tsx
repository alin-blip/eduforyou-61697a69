import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type AppRole = 'admin' | 'agent' | 'student';

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, AppRole[]>>({});
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
    ]);
    setProfiles(profilesRes.data || []);
    const rolesMap: Record<string, AppRole[]> = {};
    (rolesRes.data || []).forEach((r: any) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });
    setUserRoles(rolesMap);
  };

  const toggleRole = async (userId: string, role: AppRole) => {
    const hasIt = userRoles[userId]?.includes(role);
    if (hasIt) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role });
    }
    fetchUsers();
    toast({ title: hasIt ? `Rol ${role} eliminat` : `Rol ${role} adăugat` });
  };

  const filtered = profiles.filter(p =>
    !search || (p.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">User Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-center">Admin</TableHead>
            <TableHead className="text-center">Agent</TableHead>
            <TableHead className="text-center">Student</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.full_name || 'No name'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
              {(['admin', 'agent', 'student'] as AppRole[]).map(role => (
                <TableCell key={role} className="text-center">
                  <Switch
                    checked={userRoles[p.user_id]?.includes(role) || false}
                    onCheckedChange={() => toggleRole(p.user_id, role)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsers;
