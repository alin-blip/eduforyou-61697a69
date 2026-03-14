import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { IkigaiCircles } from '@/components/ikigai/IkigaiCircles';
import { Target, ArrowRight, Loader2, Heart, Zap, Globe, Coins, Sparkles, CheckCircle2, AlertCircle, Quote, RefreshCw } from 'lucide-react';

interface ServiceAngle { title: string; description: string; target_audience: string; unique_value: string; }
interface IkigaiStatement { statement: string; explanation: string; }
interface IkigaiResult { what_you_love: string[]; what_youre_good_at: string[]; what_world_needs: string[]; what_you_can_be_paid_for: string[]; ikigai_statements: IkigaiStatement[]; service_angles: ServiceAngle[]; core_positioning: string; }
interface Skill { id: string; skill: string; category: string; confidence: number; }

export default function IkigaiBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'loading' | 'no-skills' | 'ready' | 'generating' | 'results'>('loading');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [result, setResult] = useState<IkigaiResult | null>(null);
  const [selectedStatement, setSelectedStatement] = useState(0);
  const [hasSavedResult, setHasSavedResult] = useState(false);

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [skillsRes, ikigaiRes] = await Promise.all([
      supabase.from('skill_entries').select('*').eq('user_id', user.id),
      supabase.from('ikigai_results').select('*').eq('user_id', user.id).maybeSingle()
    ]);
    const loadedSkills = skillsRes.data || [];
    setSkills(loadedSkills);
    if (ikigaiRes.data) {
      setResult({
        what_you_love: (ikigaiRes.data.what_you_love as unknown as string[]) || [],
        what_youre_good_at: (ikigaiRes.data.what_youre_good_at as unknown as string[]) || [],
        what_world_needs: (ikigaiRes.data.what_world_needs as unknown as string[]) || [],
        what_you_can_be_paid_for: (ikigaiRes.data.what_you_can_be_paid_for as unknown as string[]) || [],
        ikigai_statements: (ikigaiRes.data.ikigai_statements as unknown as IkigaiStatement[]) || [],
        service_angles: (ikigaiRes.data.service_angles as unknown as ServiceAngle[]) || [],
        core_positioning: (ikigaiRes.data.ikigai_statements as unknown as any)?.[0]?.statement || '',
      });
      setHasSavedResult(true); setStep('results');
    } else if (loadedSkills.length > 0) { setStep('ready'); } else { setStep('no-skills'); }
  };

  const handleGenerate = async () => {
    if (skills.length === 0) { toast.error('Complete Skill Scanner first'); navigate('/student/launchpad/skills'); return; }
    setStep('generating'); setGenerateProgress(0);
    const progressInterval = setInterval(() => { setGenerateProgress(prev => Math.min(prev + Math.random() * 12, 90)); }, 600);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ikigai-builder`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionData?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ skills, studyField: '', goals: [], values: [] }),
      });
      clearInterval(progressInterval);
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Generation error'); }
      const data: IkigaiResult = await response.json();
      setGenerateProgress(100);
      setTimeout(() => { setResult(data); setHasSavedResult(false); setStep('results'); }, 500);
    } catch (error) { clearInterval(progressInterval); toast.error(error instanceof Error ? error.message : 'Error'); setStep('ready'); }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    try {
      const { data: existing } = await supabase.from('ikigai_results').select('id').eq('user_id', user.id).maybeSingle();
      const payload = { what_you_love: result.what_you_love as unknown as null, what_youre_good_at: result.what_youre_good_at as unknown as null, what_world_needs: result.what_world_needs as unknown as null, what_you_can_be_paid_for: result.what_you_can_be_paid_for as unknown as null, ikigai_statements: result.ikigai_statements as unknown as null, service_angles: result.service_angles as unknown as null };
      if (existing) { const { error } = await supabase.from('ikigai_results').update({ ...payload, updated_at: new Date().toISOString() }).eq('user_id', user.id); if (error) throw error; }
      else { const { error } = await supabase.from('ikigai_results').insert([{ user_id: user.id, ...payload }]); if (error) throw error; }
      toast.success('Ikigai saved!'); setHasSavedResult(true);
    } catch (error) { toast.error('Save error'); }
  };

  const quadrantConfig = [
    { key: 'what_you_love', label: 'What You Love', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/20' },
    { key: 'what_youre_good_at', label: 'What You\'re Good At', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { key: 'what_world_needs', label: 'What The World Needs', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { key: 'what_you_can_be_paid_for', label: 'What You Can Be Paid For', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'loading' && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></motion.div>}

        {step === 'no-skills' && (
          <motion.div key="no-skills" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/20 mb-4"><AlertCircle className="w-8 h-8 text-destructive" /></div>
            <h1 className="text-2xl font-bold text-foreground mb-2">No Skills Found</h1>
            <p className="text-muted-foreground mb-6">Complete the Skill Scanner first to generate your Ikigai</p>
            <Button onClick={() => navigate('/student/launchpad/skills')} className="gap-2 bg-gradient-to-r from-primary to-accent"><Sparkles className="w-5 h-5" />Go to Skill Scanner</Button>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4"><Target className="w-8 h-8 text-primary" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Ikigai Builder</h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">Find your unique positioning at the intersection of passion, skill, need and income</p>
            </div>
            <Card className="border-border p-6"><h3 className="font-semibold text-foreground mb-4">Your Skills ({skills.length})</h3><div className="flex flex-wrap gap-2">{skills.map(skill => (<Badge key={skill.id} variant="outline" className={skill.category === 'technical' ? 'border-blue-500/50 text-blue-400' : skill.category === 'soft' ? 'border-purple-500/50 text-purple-400' : 'border-amber-500/50 text-amber-400'}>{skill.skill}</Badge>))}</div></Card>
            <Card className="border-primary/20 p-6 bg-gradient-to-r from-primary/5 to-accent/5"><h3 className="font-semibold text-foreground mb-3">What is Ikigai?</h3><p className="text-muted-foreground text-sm mb-4">Ikigai is a Japanese concept meaning "reason for being". It's the intersection of 4 elements that create your unique positioning.</p><div className="grid grid-cols-2 gap-3">{quadrantConfig.map(q => (<div key={q.key} className="flex items-center gap-2"><div className={`w-8 h-8 rounded-lg ${q.bg} flex items-center justify-center`}><q.icon className={`w-4 h-4 ${q.color}`} /></div><span className="text-sm text-foreground">{q.label}</span></div>))}</div></Card>
            <div className="flex justify-center"><Button onClick={handleGenerate} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg"><Target className="w-5 h-5" />Generate My Ikigai<ArrowRight className="w-5 h-5" /></Button></div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Generating your Ikigai...</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">AI is creating your unique positioning based on your skills</p>
            <div className="max-w-md mx-auto"><Progress value={generateProgress} className="h-2" /><p className="text-sm text-muted-foreground mt-2">{Math.round(generateProgress)}%</p></div>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"><CheckCircle2 className="w-8 h-8 text-accent" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{hasSavedResult ? 'Your Ikigai' : 'Ikigai Generated!'}</h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{result.core_positioning || result.ikigai_statements?.[0]?.statement || ''}</p>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}><IkigaiCircles whatYouLove={result.what_you_love} whatYoureGoodAt={result.what_youre_good_at} whatWorldNeeds={result.what_world_needs} whatYouCanBePaidFor={result.what_you_can_be_paid_for} /></motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quadrantConfig.map((q, index) => (
                <motion.div key={q.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="border-border p-5 h-full"><div className="flex items-center gap-3 mb-4"><div className={`w-10 h-10 rounded-xl ${q.bg} flex items-center justify-center`}><q.icon className={`w-5 h-5 ${q.color}`} /></div><h3 className="font-semibold text-foreground">{q.label}</h3></div>
                    <ul className="space-y-2">{(result[q.key as keyof IkigaiResult] as string[])?.map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${q.bg.replace('/20', '')}`} />{item}</li>))}</ul>
                  </Card>
                </motion.div>
              ))}
            </div>
            {result.ikigai_statements?.length > 0 && (
              <Card className="border-primary/20 p-6"><h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Quote className="w-5 h-5 text-primary" />Positioning Statements</h3>
                <div className="space-y-3">{result.ikigai_statements.map((stmt, index) => (<motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className={`p-4 rounded-lg cursor-pointer transition-all ${selectedStatement === index ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30 hover:bg-muted/50'}`} onClick={() => setSelectedStatement(index)}><p className="font-medium text-foreground">{stmt.statement}</p>{selectedStatement === index && stmt.explanation && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-2">{stmt.explanation}</motion.p>}</motion.div>))}</div>
              </Card>
            )}
            {result.service_angles?.length > 0 && (
              <Card className="border-accent/20 p-6"><h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-accent" />Service Angles</h3>
                <div className="grid gap-4 md:grid-cols-2">{result.service_angles.map((angle, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className="p-4 rounded-lg bg-accent/5 border border-accent/20"><h4 className="font-semibold text-foreground mb-2">{angle.title}</h4><p className="text-sm text-muted-foreground mb-3">{angle.description}</p><div className="space-y-1 text-xs"><p className="text-muted-foreground"><span className="text-accent">Target:</span> {angle.target_audience}</p><p className="text-muted-foreground"><span className="text-accent">USP:</span> {angle.unique_value}</p></div></motion.div>))}</div>
              </Card>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={() => { setStep('ready'); setHasSavedResult(false); }}><RefreshCw className="w-4 h-4" />Regenerate</Button>
                {!hasSavedResult && <Button variant="outline" onClick={handleSave}>Save Ikigai</Button>}
              </div>
              <Button onClick={() => navigate('/student/launchpad/offer')} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg">Continue to Offers<ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
