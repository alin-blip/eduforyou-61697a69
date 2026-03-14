import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AgentCommissions = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('referrals').select('*').eq('agent_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setReferrals(data || []));
  }, [user]);

  const totalCommission = referrals.reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const paidCommission = referrals.filter(r => r.commission_paid).reduce((s, r) => s + (Number(r.commission_amount) || 0), 0);
  const withCommission = referrals.filter(r => Number(r.commission_amount) > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-foreground">£{totalCommission}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Paid Out</p>
          <p className="text-3xl font-bold text-primary">£{paidCommission}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">Commission History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withCommission.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.referred_name}</TableCell>
                <TableCell>£{r.commission_amount}</TableCell>
                <TableCell>
                  <Badge variant={r.commission_paid ? 'default' : 'secondary'}>
                    {r.commission_paid ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.converted_at ? new Date(r.converted_at).toLocaleDateString() : '—'}</TableCell>
              </TableRow>
            ))}
            {withCommission.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No commissions yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AgentCommissions;
