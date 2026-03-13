import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

const AbandonedCartsTab = () => {
  const [carts, setCarts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('abandoned_carts').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setCarts(data || []));
  }, []);

  return (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map(c => (
            <TableRow key={c.id}>
              <TableCell className="text-sm">{c.email || '—'}</TableCell>
              <TableCell className="font-medium">{c.full_name || '—'}</TableCell>
              <TableCell className="text-sm">{c.product_type || '—'}</TableCell>
              <TableCell className="text-sm">{c.step_reached || '—'}</TableCell>
              <TableCell className="text-sm">{c.utm_source || '—'}</TableCell>
              <TableCell>
                <Badge variant={c.recovered ? 'default' : 'secondary'}>{c.recovered ? 'Yes' : 'No'}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(c.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
            </TableRow>
          ))}
          {carts.length === 0 && (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No abandoned carts yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AbandonedCartsTab;
