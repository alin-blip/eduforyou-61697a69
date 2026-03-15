import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminSMS = () => {
  const queryClient = useQueryClient();
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [message, setMessage] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-sms-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    },
  });

  const sendSms = useMutation({
    mutationFn: async () => {
      if (!recipientPhone || !message) {
        throw new Error('Phone and message are required');
      }
      await supabase.from('sms_logs').insert({
        recipient_name: recipientName || null,
        recipient_phone: recipientPhone,
        message,
        status: 'pending',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sms-logs'] });
      setRecipientName('');
      setRecipientPhone('');
      setMessage('');
      toast({ title: 'SMS queued for sending' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const sentCount = logs.filter((l: any) => l.status === 'sent').length;
  const failedCount = logs.filter((l: any) => l.status === 'failed').length;
  const pendingCount = logs.filter((l: any) => l.status === 'pending').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a252f]">SMS Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Send messages and view SMS logs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{logs.length}</p>
              <p className="text-xs text-muted-foreground">Total SMS</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-[#22c55e]" />
            <div>
              <p className="text-2xl font-bold text-[#22c55e]">{sentCount}</p>
              <p className="text-xs text-muted-foreground">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#f59e0b]">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-[#ef4444]" />
            <div>
              <p className="text-2xl font-bold text-[#ef4444]">{failedCount}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-[#1a252f] mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" /> Send SMS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label>Recipient Name</Label>
                <Input
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                  placeholder="+44 7xxx xxx xxx"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Message *</Label>
                <textarea
                  className="w-full min-h-[104px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">{message.length}/160 characters</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => sendSms.mutate()}
              disabled={!recipientPhone || !message}
              className="bg-[#E67E22] hover:bg-[#d35400]"
            >
              <Send className="w-4 h-4 mr-1" /> Send SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> SMS Log
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
            {logs.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.recipient_name || '--'}</TableCell>
                <TableCell className="text-sm">{l.recipient_phone}</TableCell>
                <TableCell className="text-sm max-w-xs truncate">{l.message}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      l.status === 'sent' ? 'default' :
                      l.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(l.created_at), 'dd MMM yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No SMS logs yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSMS;
