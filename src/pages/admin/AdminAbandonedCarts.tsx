import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const AdminAbandonedCarts = () => {
  const queryClient = useQueryClient();

  const { data: carts = [], isLoading } = useQuery({
    queryKey: ['admin-abandoned-carts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('abandoned_carts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      return data || [];
    },
  });

  const sendRecoveryEmail = useMutation({
    mutationFn: async (cart: any) => {
      // Mark as recovered for now (in production, this would trigger an email edge function)
      await supabase.from('abandoned_carts').update({ recovered: true }).eq('id', cart.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-abandoned-carts'] });
      toast({ title: 'Recovery email queued' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const totalCarts = carts.length;
  const recoveredCount = carts.filter((c: any) => c.recovered).length;
  const notRecoveredCount = totalCarts - recoveredCount;
  const recoveryRate = totalCarts > 0 ? ((recoveredCount / totalCarts) * 100).toFixed(1) : '0';

  const stepCounts: Record<string, number> = {};
  carts.forEach((c: any) => {
    const step = c.step_reached || 'Unknown';
    stepCounts[step] = (stepCounts[step] || 0) + 1;
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
      <div>
        <h1 className="text-2xl font-bold text-[#1a252f]">Abandoned Cart Recovery</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and recover abandoned application carts</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{totalCarts}</p>
              <p className="text-xs text-muted-foreground">Total Abandoned</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
            <div>
              <p className="text-2xl font-bold text-[#ef4444]">{notRecoveredCount}</p>
              <p className="text-xs text-muted-foreground">Not Recovered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#22c55e]" />
            <div>
              <p className="text-2xl font-bold text-[#22c55e]">{recoveredCount}</p>
              <p className="text-xs text-muted-foreground">Recovered</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#3b82f6]">{recoveryRate}%</p>
              <p className="text-xs text-muted-foreground">Recovery Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(stepCounts).length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-[#1a252f] mb-4">Drop-off by Step</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stepCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([step, count]) => (
                  <div key={step} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl font-bold text-[#1a252f]">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{step}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Abandoned Carts
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Step Reached</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Recovered</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carts.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="text-sm">{c.email || '--'}</TableCell>
                <TableCell className="font-medium">{c.full_name || '--'}</TableCell>
                <TableCell className="text-sm">{c.product_type || '--'}</TableCell>
                <TableCell className="text-sm">{c.step_reached || '--'}</TableCell>
                <TableCell className="text-sm">{c.utm_source || '--'}</TableCell>
                <TableCell>
                  <Badge variant={c.recovered ? 'default' : 'secondary'}>
                    {c.recovered ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(c.created_at), 'dd MMM yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {!c.recovered && c.email && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendRecoveryEmail.mutate(c)}
                      title="Send recovery email"
                    >
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {carts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No abandoned carts yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAbandonedCarts;
