import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Linkedin, Mail, MessageCircle, Sparkles, Copy, Check, Clock, Lightbulb, ArrowLeft, Save, RefreshCw, Target, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Template { name: string; type: 'connection' | 'intro' | 'follow_up' | 'value_add'; subject?: string; content: string; tips: string[]; best_time?: string; }
interface OutreachResult { platform: string; templates: Template[]; sequence_suggestion: string; response_rate_tips: string[]; }
type Platform = 'linkedin' | 'email' | 'dm';

export default function OutreachGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'loading' | 'ready' | 'generating' | 'results'>('loading');
  const [offer, setOffer] = useState<any>(null);
  const [ikigaiData, setIkigaiData] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [generateProgress, setGenerateProgress] = useState(0);
  const [results, setResults] = useState<Record<Platform, OutreachResult | null>>({ linkedin: null, email: null, dm: null });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const platformConfig = {
    linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'bg-blue-500', description: 'Professional connections & messages' },
    email: { icon: Mail, name: 'Email', color: 'bg-amber-500', description: 'Cold email outreach' },
    dm: { icon: MessageCircle, name: 'DM', color: 'bg-pink-500', description: 'Instagram/Twitter direct messages' }
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    try {
      const [offerRes, ikigaiRes] = await Promise.all([
        supabase.from('offers').select('*').eq('user_id', user!.id).maybeSingle(),
        supabase.from('ikigai_results').select('*').eq('user_id', user!.id).maybeSingle()
      ]);
      if (offerRes.data) setOffer({ smv: offerRes.data.smv || '', target_market: offerRes.data.target_market || '', starter_package: offerRes.data.starter_package });
      if (ikigaiRes.data) setIkigaiData({ service_angles: (ikigaiRes.data.service_angles as any[]) || [], core_positioning: (ikigaiRes.data.ikigai_statements as any)?.[0]?.statement || '' });
      setStep(offerRes.data ? 'ready' : 'loading');
    } catch { toast.error('Error loading data'); }
  };

  const handleGenerate = async (platform: Platform) => {
    if (!offer) { toast.error('Complete Offer Builder first'); navigate('/student/launchpad/offer'); return; }
    setSelectedPlatform(platform); setStep('generating'); setGenerateProgress(0);
    const progressInterval = setInterval(() => { setGenerateProgress(prev => Math.min(prev + Math.random() * 15, 90)); }, 500);
    try {
      const response = await supabase.functions.invoke('outreach-generator', { body: { offer, ikigaiResult: ikigaiData, platform } });
      clearInterval(progressInterval);
      if (response.error) throw new Error(response.error.message);
      setGenerateProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults(prev => ({ ...prev, [platform]: response.data }));
      setStep('results');
    } catch (error) { clearInterval(progressInterval); toast.error(error instanceof Error ? error.message : 'Error'); setStep('ready'); }
  };

  const handleCopy = (content: string, id: string) => { navigator.clipboard.writeText(content); setCopiedId(id); toast.success('Copied!'); setTimeout(() => setCopiedId(null), 2000); };

  const handleSaveTemplates = async () => {
    if (!user) return;
    try {
      await supabase.from('outreach_templates').delete().eq('user_id', user.id);
      const templatesToInsert: any[] = [];
      Object.entries(results).forEach(([platform, result]) => {
        if (result?.templates) { result.templates.forEach((template, index) => { templatesToInsert.push({ user_id: user.id, platform, template_type: template.type, subject: template.subject || null, content: template.content, sequence_order: index + 1 }); }); }
      });
      if (templatesToInsert.length > 0) { const { error } = await supabase.from('outreach_templates').insert(templatesToInsert); if (error) throw error; }
      toast.success('Templates saved!');
      navigate('/student/launchpad');
    } catch { toast.error('Save error'); }
  };

  const getTypeLabel = (type: string) => ({ connection: 'Connection', intro: 'Introduction', follow_up: 'Follow-up', value_add: 'Value Add' }[type] || type);

  if (step === 'loading' && !offer) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Target className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Create Your Offer First</h1>
          <p className="text-muted-foreground mb-8">You need to build your offer before generating outreach templates</p>
          <Button onClick={() => navigate('/student/launchpad/offer')}>Go to Offer Builder</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3"><div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5"><Zap className="w-8 h-8 text-primary" /></div></div>
              <h1 className="text-3xl font-bold">Outreach Generator</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">Generate personalized outreach messages for LinkedIn, Email and DM</p>
            </div>
            {offer && (<Card className="bg-muted/30"><CardContent className="pt-6"><div className="flex items-start gap-4"><div className="p-2 rounded-lg bg-primary/10"><Sparkles className="w-5 h-5 text-primary" /></div><div className="flex-1"><h3 className="font-semibold mb-1">Your Value Proposition</h3><p className="text-muted-foreground">{offer.smv}</p><Badge variant="outline" className="mt-2">Market: {offer.target_market}</Badge></div></div></CardContent></Card>)}
            <div className="grid md:grid-cols-3 gap-4">
              {(Object.keys(platformConfig) as Platform[]).map((platform) => {
                const config = platformConfig[platform]; const Icon = config.icon; const hasResult = results[platform] !== null;
                return (
                  <Card key={platform} className={`cursor-pointer transition-all hover:shadow-lg ${hasResult ? 'ring-2 ring-primary/50' : ''}`} onClick={() => hasResult ? setStep('results') : handleGenerate(platform)}>
                    <CardContent className="pt-6 text-center"><div className={`w-14 h-14 rounded-2xl ${config.color} mx-auto mb-4 flex items-center justify-center`}><Icon className="w-7 h-7 text-white" /></div><h3 className="font-semibold mb-2">{config.name}</h3><p className="text-sm text-muted-foreground mb-4">{config.description}</p>
                      <Button className="w-full" variant={hasResult ? "outline" : "default"}>{hasResult ? <><Check className="w-4 h-4 mr-2" />View Templates</> : <><Sparkles className="w-4 h-4 mr-2" />Generate</>}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto py-20 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 mx-auto mb-8">
              <div className={`w-full h-full rounded-2xl ${platformConfig[selectedPlatform].color} flex items-center justify-center`}>{(() => { const Icon = platformConfig[selectedPlatform].icon; return <Icon className="w-10 h-10 text-white" />; })()}</div>
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Generating {platformConfig[selectedPlatform].name} templates...</h2>
            <Progress value={generateProgress} className="mb-4" />
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Button variant="ghost" onClick={() => setStep('ready')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Platforms</Button>
            <Tabs defaultValue={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as Platform)}>
              <TabsList className="grid w-full grid-cols-3">{(Object.keys(platformConfig) as Platform[]).map((platform) => { const config = platformConfig[platform]; const Icon = config.icon; const hasResult = results[platform] !== null; return (<TabsTrigger key={platform} value={platform} disabled={!hasResult} className="gap-2"><Icon className="w-4 h-4" />{config.name}{hasResult && <Check className="w-3 h-3 text-green-500" />}</TabsTrigger>); })}</TabsList>
              {(Object.keys(platformConfig) as Platform[]).map((platform) => {
                const result = results[platform];
                if (!result) return null;
                return (
                  <TabsContent key={platform} value={platform} className="space-y-6 mt-6">
                    <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-6"><div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary mt-0.5" /><div><h4 className="font-medium mb-1">Recommended Sequence</h4><p className="text-sm text-muted-foreground">{result.sequence_suggestion}</p></div></div></CardContent></Card>
                    <div className="space-y-4">
                      {result.templates.map((template, index) => (
                        <Card key={index}><CardHeader className="pb-3"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="secondary">{getTypeLabel(template.type)}</Badge><CardTitle className="text-lg">{template.name}</CardTitle></div><Button variant="outline" size="sm" onClick={() => handleCopy(template.subject ? `Subject: ${template.subject}\n\n${template.content}` : template.content, `${platform}-${index}`)}>{copiedId === `${platform}-${index}` ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}</Button></div>{template.best_time && <CardDescription className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{template.best_time}</CardDescription>}</CardHeader>
                          <CardContent className="space-y-4">{template.subject && <div className="p-3 bg-muted rounded-lg"><span className="text-xs text-muted-foreground uppercase tracking-wide">Subject</span><p className="font-medium">{template.subject}</p></div>}<div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap font-mono text-sm">{template.content}</div>
                            {template.tips.length > 0 && <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"><Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" /><div className="text-sm"><span className="font-medium text-amber-800 dark:text-amber-200">Tips:</span><ul className="mt-1 space-y-1 text-amber-700 dark:text-amber-300">{template.tips.map((tip, i) => <li key={i}>• {tip}</li>)}</ul></div></div>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {result.response_rate_tips?.length > 0 && (<Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Response Rate Tips</CardTitle></CardHeader><CardContent><ul className="space-y-2">{result.response_rate_tips.map((tip, i) => <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />{tip}</li>)}</ul></CardContent></Card>)}
                    <div className="text-center"><Button variant="outline" onClick={() => handleGenerate(platform)}><RefreshCw className="w-4 h-4 mr-2" />Regenerate {platformConfig[platform].name}</Button></div>
                  </TabsContent>
                );
              })}
            </Tabs>
            <div className="flex justify-center gap-4 pt-6 border-t"><Button variant="outline" onClick={() => setStep('ready')}>Back to Platforms</Button><Button onClick={handleSaveTemplates}><Save className="w-4 h-4 mr-2" />Save All Templates</Button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
