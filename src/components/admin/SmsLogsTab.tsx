import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const SmsLogsTab = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('sms_logs').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setLogs(data || []));
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> SMS Logs
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map(l => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.recipient_name || '—'}</TableCell>
              <TableCell className="text-sm">{l.recipient_phone}</TableCell>
              <TableCell className="text-sm max-w-xs truncate">{l.message}</TableCell>
              <TableCell>
                <Badge variant={l.status === 'sent' ? 'default' : l.status === 'failed' ? 'destructive' : 'secondary'}>
                  {l.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(l.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No SMS logs yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SmsLogsTab;
