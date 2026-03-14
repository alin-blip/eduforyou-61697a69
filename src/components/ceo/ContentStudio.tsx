import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Copy, FileText, Loader2, Mail, MessageSquare, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const contentTypes = [
  { value: 'blog', label: 'Blog Article', icon: FileText },
  { value: 'social', label: 'Social Media Post', icon: MessageSquare },
  { value: 'email', label: 'Email Campaign', icon: Mail },
];

const toneOptions = ['Professional', 'Friendly', 'Persuasive', 'Inspirational', 'Casual'];

const ContentStudio = () => {
  const [contentType, setContentType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'content', contentType, topic, tone },
      });
      if (res.error) throw res.error;
      setResult(res.data?.content || 'No content generated.');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Content Generator
        </h2>

        <div className="space-y-4">
          <div>
            <Label>Content Type</Label>
            <div className="flex gap-2 mt-1">
              {contentTypes.map(ct => (
                <button key={ct.value} onClick={() => setContentType(ct.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    contentType === ct.value ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}>
                  <ct.icon className="w-4 h-4" />
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Topic / Brief *</Label>
            <Textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4}
              placeholder="e.g. Benefits of free UK university education for EU citizens with settled status" />
          </div>

          <div>
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {toneOptions.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    tone === t ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generate} disabled={loading || !topic.trim()} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Content
          </Button>
        </div>
      </div>

      {/* Output */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">Generated Content</h2>
          {result && (
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-1" /> Copy
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : result ? (
          <div className="prose prose-sm max-w-none text-foreground overflow-auto max-h-[500px]">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Your generated content will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStudio;
