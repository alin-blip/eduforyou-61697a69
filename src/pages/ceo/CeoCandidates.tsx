import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { UserSearch, Loader2, Filter, ExternalLink, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const STATUSES = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const statusColor = (s: string) => {
  switch (s) {
    case 'hired': return 'default';
    case 'offer': return 'secondary';
    case 'interview': return 'outline';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
};

const CeoCandidates = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [apps, pos] = await Promise.all([
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('job_positions').select('id, title'),
    ]);
    setCandidates(apps.data || []);
    setPositions(pos.data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('job_applications').update({ status: newStatus }).eq('id', id);
    toast({ title: `Status updated to ${newStatus}` });
    fetchData();
  };

  const getPositionTitle = (posId: string | null) => {
    if (!posId) return 'Unknown';
    return positions.find((p) => p.id === posId)?.title || 'Unknown';
  };

  const filtered = statusFilter === 'all' ? candidates : candidates.filter((c) => c.status === statusFilter);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <UserSearch className="w-7 h-7 text-[#d4a843]" /> Candidate Pipeline
      </h1>

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUSES.map((status) => (
          <Card key={status} className={`bg-white border-0 shadow-sm cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-[#d4a843]' : ''}`}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0a1628]">{candidates.filter((c) => c.status === status).length}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {filtered.map((candidate) => (
          <Card key={candidate.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#0a1628] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {candidate.full_name?.slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0a1628]">{candidate.full_name}</h3>
                    <p className="text-sm text-gray-500">{getPositionTitle(candidate.position_id)}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{candidate.email}</span>
                      {candidate.years_experience != null && <span>{candidate.years_experience} yrs experience</span>}
                      {candidate.ai_analysis_match_percent != null && (
                        <span className="text-[#d4a843] font-semibold">{candidate.ai_analysis_match_percent}% AI match</span>
                      )}
                    </div>
                    {candidate.ai_analysis_summary && (
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">{candidate.ai_analysis_summary}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={statusColor(candidate.status)}>{candidate.status}</Badge>
                  <Select value={candidate.status} onValueChange={(v) => updateStatus(candidate.id, v)}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {candidate.cv_file_url && (
                    <a href={candidate.cv_file_url} target="_blank" rel="noreferrer" className="text-xs text-[#d4a843] flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View CV
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-gray-400 text-center py-12">No candidates found</p>}
      </div>
    </div>
  );
};

export default CeoCandidates;
