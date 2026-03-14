import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Brain, Zap, Star, TrendingUp, CheckCircle2, Lightbulb, RefreshCw, Trash2 } from 'lucide-react';

interface Skill { name: string; category: 'technical' | 'soft' | 'hidden'; confidence: number; description: string; monetization_potential: 'low' | 'medium' | 'high'; }
interface SavedSkill { id: string; skill: string; category: string; confidence: number; description: string | null; }
interface ScanResult { skills: Skill[]; summary: string; top_recommendation: string; }

export default function SkillScanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'loading' | 'saved' | 'input' | 'scanning' | 'results'>('loading');
  const [experiences, setExperiences] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([]);

  useEffect(() => { loadSavedSkills(); }, [user]);

  const loadSavedSkills = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('skill_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) { setStep('input'); return; }
    if (data && data.length > 0) { setSavedSkills(data); setStep('saved'); } else { setStep('input'); }
  };

  const handleScan = async () => {
    if (!experiences.trim()) { toast.error('Please add your experiences'); return; }
    setStep('scanning'); setScanProgress(0);
    const progressInterval = setInterval(() => { setScanProgress(prev => Math.min(prev + Math.random() * 15, 90)); }, 500);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skill-scanner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ experiences, interests: [], studyField: '' }),
      });
      clearInterval(progressInterval);
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Scan error'); }
      const data: ScanResult = await response.json();
      setScanProgress(100);
      setTimeout(() => { setResult(data); setSelectedSkills(data.skills.map(s => s.name)); setStep('results'); }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(error instanceof Error ? error.message : 'Scan error');
      setStep('input');
    }
  };

  const toggleSkill = (skillName: string) => { setSelectedSkills(prev => prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]); };

  const handleSave = async () => {
    if (!result || !user) return;
    const skillsToSave = result.skills.filter(s => selectedSkills.includes(s.name));
    try {
      const { error } = await supabase.from('skill_entries').insert(skillsToSave.map(skill => ({ user_id: user.id, skill: skill.name, category: skill.category, confidence: skill.confidence, description: skill.description })));
      if (error) throw error;
      toast.success('Skills saved successfully!');
      await loadSavedSkills();
    } catch (error: any) { toast.error(error?.message || 'Save error'); }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try { const { error } = await supabase.from('skill_entries').delete().eq('id', skillId); if (error) throw error; toast.success('Skill deleted'); await loadSavedSkills(); } catch { toast.error('Delete error'); }
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    try { const { error } = await supabase.from('skill_entries').delete().eq('user_id', user.id); if (error) throw error; toast.success('All skills deleted'); setSavedSkills([]); setStep('input'); } catch { toast.error('Delete error'); }
  };

  const getCategoryIcon = (category: string) => { switch (category) { case 'technical': return <Zap className="w-4 h-4" />; case 'soft': return <Brain className="w-4 h-4" />; case 'hidden': return <Lightbulb className="w-4 h-4" />; default: return <Star className="w-4 h-4" />; } };
  const getCategoryLabel = (category: string) => { switch (category) { case 'technical': return 'Technical'; case 'soft': return 'Soft Skill'; case 'hidden': return 'Hidden'; default: return category; } };
  const getCategoryColor = (category: string) => { switch (category) { case 'technical': return 'bg-blue-500/20 text-blue-400'; case 'soft': return 'bg-purple-500/20 text-purple-400'; case 'hidden': return 'bg-amber-500/20 text-amber-400'; default: return 'bg-muted'; } };
  const getPotentialColor = (potential: string) => { switch (potential) { case 'high': return 'bg-accent text-accent-foreground'; case 'medium': return 'bg-primary text-primary-foreground'; default: return 'bg-muted text-muted-foreground'; } };
  const getPotentialLabel = (potential: string) => { switch (potential) { case 'high': return '🔥 High'; case 'medium': return 'Medium'; case 'low': return 'Low'; default: return potential; } };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'loading' && (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /><p className="text-muted-foreground mt-4">Loading...</p></motion.div>)}

        {step === 'saved' && savedSkills.length > 0 && (
          <motion.div key="saved" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"><CheckCircle2 className="w-8 h-8 text-accent" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Saved Skills</h1>
              <p className="text-muted-foreground text-lg">{savedSkills.length} skills identified</p>
            </div>
            <div className="grid gap-3">
              {savedSkills.map((skill, index) => (
                <motion.div key={skill.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="border-border p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(skill.category)}`}>{getCategoryIcon(skill.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold text-foreground">{skill.skill}</h4><Badge variant="outline" className="text-xs">{getCategoryLabel(skill.category)}</Badge></div>
                        {skill.description && <p className="text-sm text-muted-foreground">{skill.description}</p>}
                        <div className="flex items-center gap-1 mt-2">{[1,2,3,4,5].map(level => (<Star key={level} className={`w-3 h-3 ${level <= skill.confidence ? 'text-primary fill-primary' : 'text-muted'}`} />))}<span className="text-xs text-muted-foreground ml-1">{skill.confidence}/5</span></div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSkill(skill.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={() => setStep('input')}><RefreshCw className="w-4 h-4" />Scan Again</Button>
                <Button variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleDeleteAll}><Trash2 className="w-4 h-4" />Delete All</Button>
              </div>
              <Button onClick={() => navigate('/student/launchpad/ikigai')} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg">Continue to Ikigai<ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4"><Sparkles className="w-8 h-8 text-primary" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Skill Scanner</h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">AI will analyze your experiences and identify your monetizable skills</p>
            </div>
            {savedSkills.length > 0 && (<Card className="border-primary/20 p-4 bg-primary/5"><p className="text-sm text-muted-foreground">You already have {savedSkills.length} saved skills.</p><Button variant="link" className="p-0 h-auto text-primary" onClick={() => setStep('saved')}>View saved skills</Button></Card>)}
            <Card className="border-border p-6">
              <label className="block text-sm font-medium text-foreground mb-2">Your experiences, projects & hobbies</label>
              <Textarea value={experiences} onChange={(e) => setExperiences(e.target.value)} placeholder="E.g. I've built websites with WordPress, managed social media for a local business, tutored maths, organized events at university..." className="min-h-[200px] bg-background/50 resize-none" />
              <p className="text-sm text-muted-foreground mt-2">Include jobs, projects, volunteer work, hobbies — anything you've done</p>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleScan} disabled={!experiences.trim()} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg"><Sparkles className="w-5 h-5" />Analyze Skills<ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div key="scanning" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Scanning your skills...</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">AI is analyzing your experiences to identify monetizable skills</p>
            <div className="max-w-md mx-auto"><Progress value={scanProgress} className="h-2" /><p className="text-sm text-muted-foreground mt-2">{Math.round(scanProgress)}%</p></div>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"><CheckCircle2 className="w-8 h-8 text-accent" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Skills Identified!</h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">Select the skills you want to save</p>
            </div>
            <Card className="border-primary/20 p-6 bg-gradient-to-r from-primary/5 to-accent/5">
              <h3 className="font-semibold text-foreground mb-2">Summary</h3>
              <p className="text-muted-foreground">{result.summary}</p>
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-accent mt-0.5" /><div><p className="font-medium text-foreground">Top Recommendation</p><p className="text-sm text-muted-foreground">{result.top_recommendation}</p></div></div>
              </div>
            </Card>
            <div className="grid gap-3">
              {result.skills.map((skill, index) => (
                <motion.div key={skill.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className={`p-4 cursor-pointer transition-all ${selectedSkills.includes(skill.name) ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/20'}`} onClick={() => toggleSkill(skill.name)}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(skill.category)}`}>{getCategoryIcon(skill.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap"><h4 className="font-semibold text-foreground">{skill.name}</h4><Badge variant="outline" className="text-xs">{getCategoryLabel(skill.category)}</Badge><Badge className={`text-xs ${getPotentialColor(skill.monetization_potential)}`}>{getPotentialLabel(skill.monetization_potential)}</Badge></div>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                        <div className="flex items-center gap-1 mt-2">{[1,2,3,4,5].map(level => (<Star key={level} className={`w-3 h-3 ${level <= skill.confidence ? 'text-primary fill-primary' : 'text-muted'}`} />))}<span className="text-xs text-muted-foreground ml-1">{skill.confidence}/5</span></div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedSkills.includes(skill.name) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>{selectedSkills.includes(skill.name) && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => { setStep('input'); setResult(null); setScanProgress(0); }}>Scan Again</Button>
              <Button onClick={handleSave} disabled={selectedSkills.length === 0} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg">Save {selectedSkills.length} Skills<ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
