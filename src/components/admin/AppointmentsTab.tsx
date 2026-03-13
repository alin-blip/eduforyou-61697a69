import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'default',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  'no-show': 'outline',
};

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    const [appsRes, campusRes] = await Promise.all([
      (() => {
        let q = supabase.from('appointments').select('*').order('created_at', { ascending: false });
        if (statusFilter !== 'all') q = q.eq('status', statusFilter);
        return q;
      })(),
      supabase.from('campuses').select('id, name'),
    ]);
    setAppointments(appsRes.data || []);
    setCampuses(campusRes.data || []);
  };

  const getCampusName = (id: string) => campuses.find(c => c.id === id)?.name || '—';

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchData();
  };

  const filtered = appointments.filter(a =>
    !search || a.full_name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Appointments
        </h2>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Campus</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(a => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.full_name}</TableCell>
              <TableCell className="text-sm">{a.email}</TableCell>
              <TableCell className="text-sm">{getCampusName(a.campus_id)}</TableCell>
              <TableCell className="text-sm">{a.course_interest || '—'}</TableCell>
              <TableCell className="text-sm">
                {a.preferred_date ? format(new Date(a.preferred_date), 'dd MMM yyyy') : '—'} {a.preferred_time || ''}
              </TableCell>
              <TableCell>
                <Select value={a.status} onValueChange={v => updateStatus(a.id, v)}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No appointments yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTab;
