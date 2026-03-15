import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CeoCmoReview = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('ai_content').select('*').in('status', ['draft', 'pending', 'review']).order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    await supabase.from('ai_content').update({ status: action }).eq('id', id);
    toast({ title: `Content ${action}` });
    fetchItems();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <Eye className="w-7 h-7 text-[#d4a843]" /> CMO Review Queue
        </h1>
        <Badge variant="outline" className="text-base px-3 py-1">{items.length} pending</Badge>
      </div>

      {items.length === 0 ? (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">All caught up! No content pending review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-5 h-5 text-[#d4a843] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-[#0a1628] text-lg">{item.title || 'Untitled'}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="secondary">{item.status}</Badge>
                    </div>
                    {item.meta_description && <p className="text-sm text-gray-600 mb-2">{item.meta_description}</p>}
                    {item.content && (
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {item.content.slice(0, 800)}{item.content.length > 800 ? '...' : ''}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      {item.tone && <span>Tone: {item.tone}</span>}
                      {item.cmo_score != null && <span>Score: {item.cmo_score}/10</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-3 mt-4">
                  <div className="flex-1">
                    <Textarea
                      value={reviewNotes[item.id] || ''}
                      onChange={(e) => setReviewNotes({ ...reviewNotes, [item.id]: e.target.value })}
                      placeholder="Review notes (optional)..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleAction(item.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button onClick={() => handleAction(item.id, 'rejected')} variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CeoCmoReview;
