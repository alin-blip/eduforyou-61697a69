import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardCheck, Loader2, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CeoApprovals = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => { fetchApprovals(); }, []);

  const fetchApprovals = async () => {
    const { data } = await supabase.from('agent_approvals').select('*').order('created_at', { ascending: false });
    setApprovals(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    await supabase.from('agent_approvals').update({
      status: action,
      reviewer_notes: notes[id] || null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    toast({ title: `Approval ${action}` });
    fetchApprovals();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const filtered = filter === 'all' ? approvals : approvals.filter((a) => a.status === filter);
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <ClipboardCheck className="w-7 h-7 text-[#d4a843]" /> Approval Queue
        </h1>
        <Badge variant="outline" className="text-base px-3 py-1">{pendingCount} pending</Badge>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}
            className={filter === f ? 'bg-[#0a1628]' : ''}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Approvals */}
      {filtered.length === 0 ? (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">
              {filter === 'pending' ? 'No pending approvals' : 'No approvals found'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((approval) => (
            <Card key={approval.id} className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {approval.status === 'pending' ? (
                        <Clock className="w-4 h-4 text-amber-500" />
                      ) : approval.status === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <h3 className="font-semibold text-[#0a1628]">{approval.title || 'Approval Request'}</h3>
                      <Badge variant={statusColor(approval.status)}>{approval.status}</Badge>
                      {approval.type && <Badge variant="outline">{approval.type}</Badge>}
                      {approval.agent_type && <Badge variant="secondary">{approval.agent_type}</Badge>}
                    </div>
                    {approval.description && <p className="text-sm text-gray-600 mt-1">{approval.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(approval.created_at).toLocaleString()}
                      {approval.reviewed_at && ` | Reviewed: ${new Date(approval.reviewed_at).toLocaleString()}`}
                    </p>
                    {approval.reviewer_notes && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded italic">
                        Notes: {approval.reviewer_notes}
                      </p>
                    )}
                  </div>
                </div>

                {approval.preview_data && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(approval.preview_data, null, 2)}</pre>
                  </div>
                )}

                {approval.status === 'pending' && (
                  <div className="flex items-end gap-3 mt-4 pt-3 border-t">
                    <div className="flex-1">
                      <Textarea
                        value={notes[approval.id] || ''}
                        onChange={(e) => setNotes({ ...notes, [approval.id]: e.target.value })}
                        placeholder="Review notes (optional)..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(approval.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button onClick={() => handleAction(approval.id, 'rejected')} variant="destructive">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CeoApprovals;
