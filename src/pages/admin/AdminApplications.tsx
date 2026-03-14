import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    setApplications(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    fetchApplications();
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold text-foreground">All Applications</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Campus</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map(app => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.course_slug}</TableCell>
              <TableCell>{app.campus || '—'}</TableCell>
              <TableCell>
                <Select value={app.status || 'submitted'} onValueChange={v => updateStatus(app.id, v)}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</TableCell>
              <TableCell><span className="text-xs text-muted-foreground">{app.notes || 'No notes'}</span></TableCell>
            </TableRow>
          ))}
          {applications.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No applications yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminApplications;
