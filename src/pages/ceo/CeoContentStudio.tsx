import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Pen, Loader2, Sparkles, FileText, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CONTENT_TYPES = ['blog', 'social', 'email', 'landing_page', 'ad_copy'];

const CeoContentStudio = () => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('blog');
  const [topic, setTopic] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from('ai_content').select('*').order('created_at', { ascending: false }).limit(20);
    setContent(data || []);
    setLoading(false);
  };

  const generateContent = async () => {
    if (!topic.trim()) { toast({ title: 'Enter a topic', variant: 'destructive' }); return; }
    setGenerating(true);
    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'generate_content', content_type: selectedType, topic },
      });
      if (res.error) throw res.error;
      toast({ title: 'Content generated successfully' });
      setTopic('');
      fetchContent();
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' });
    }
    setGenerating(false);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'published': return 'default';
      case 'approved': return 'secondary';
      case 'draft': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Pen className="w-7 h-7 text-[#d4a843]" /> Content Studio
      </h1>

      {/* AI Generator */}
      <Card className="bg-white border-0 shadow-sm border-l-4 border-l-[#d4a843]">
        <CardHeader><CardTitle className="text-lg text-[#0a1628] flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#d4a843]" /> AI Content Generator</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic or subject..." className="flex-1" />
            <Button onClick={generateContent} disabled={generating} className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628] font-semibold">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-3">
        {content.map((item) => (
          <Card key={item.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <FileText className="w-4 h-4 text-[#d4a843]" />
                    <h3 className="font-semibold text-[#0a1628] truncate">{item.title || 'Untitled'}</h3>
                    <Badge variant={statusColor(item.status)}>{item.status}</Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  {item.meta_description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.meta_description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    {item.language && <span>Lang: {item.language}</span>}
                    {item.cmo_score != null && <span>CMO Score: {item.cmo_score}/10</span>}
                  </div>
                </div>
                {item.published_url && (
                  <a href={item.published_url} target="_blank" rel="noreferrer" className="text-[#d4a843] hover:text-[#b8912e]">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {content.length === 0 && <p className="text-gray-400 text-center py-12">No content yet. Generate some!</p>}
      </div>
    </div>
  );
};

export default CeoContentStudio;
