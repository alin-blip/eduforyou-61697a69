import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { FileText, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminContracts = () => {
  const queryClient = useQueryClient();
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['admin-contracts', statusFilter],
    queryFn: async () => {
      let q = supabase.from('contracts').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      const { data } = await q;
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles-for-contracts'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('user_id, full_name');
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from('contracts').update({ status }).eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contracts'] });
      toast({ title: 'Contract status updated' });
    },
  });

  const getAgentName = (agentId: string) =>
    profiles.find((p: any) => p.user_id === agentId)?.full_name || agentId.slice(0, 8) + '...';

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'outline';
      case 'terminated': return 'destructive';
      case 'expired': return 'secondary';
      default: return 'outline';
    }
  };

  const openDetails = (contract: any) => {
    setSelectedContract(contract);
    setDetailOpen(true);
  };

  const activeCount = contracts.filter((c: any) => c.status === 'active').length;
  const draftCount = contracts.filter((c: any) => c.status === 'draft').length;

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
        <h1 className="text-2xl font-bold text-[#1a252f]">Agent Contracts</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage agent contract agreements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{contracts.length}</p>
              <p className="text-xs text-muted-foreground">Total Contracts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#22c55e]">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#f59e0b]">{draftCount}</p>
            <p className="text-xs text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-foreground">Contracts</h2>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
              <TableHead>Agent</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts
              .filter((c: any) => !search || getAgentName(c.agent_id).toLowerCase().includes(search.toLowerCase()))
              .map((contract: any) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{getAgentName(contract.agent_id)}</TableCell>
                  <TableCell className="text-sm capitalize">{contract.contract_type}</TableCell>
                  <TableCell>
                    <Select
                      value={contract.status}
                      onValueChange={v => updateStatus.mutate({ id: contract.id, status: v })}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contract.signed_at ? new Date(contract.signed_at).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(contract.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDetails(contract)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No contracts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="text-sm font-medium">{getAgentName(selectedContract.agent_id)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium capitalize">{selectedContract.contract_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusBadgeVariant(selectedContract.status) as any}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signed At</p>
                  <p className="text-sm">
                    {selectedContract.signed_at ? new Date(selectedContract.signed_at).toLocaleString() : 'Not signed'}
                  </p>
                </div>
              </div>
              {selectedContract.terms && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Terms</p>
                  <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-auto max-h-60 whitespace-pre-wrap">
                    {JSON.stringify(selectedContract.terms, null, 2)}
                  </pre>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>Created: {new Date(selectedContract.created_at).toLocaleString()}</div>
                <div>Updated: {new Date(selectedContract.updated_at).toLocaleString()}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContracts;
