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
import { Package, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles, Star, Clock, Users, Zap, Crown, Target, TrendingUp, RefreshCw } from 'lucide-react';

interface PackageData { name: string; tagline: string; price: number; currency: string; delivery_time: string; deliverables: string[]; ideal_for: string; popular?: boolean; includes_support?: boolean; }
interface OfferResult { smv: string; target_market: string; pricing_justification: string; starter_package: PackageData; standard_package: PackageData; premium_package: PackageData; }

export default function OfferBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'loading' | 'missing-data' | 'ready' | 'generating' | 'results'>('loading');
  const [skills, setSkills] = useState<any[]>([]);
  const [ikigaiData, setIkigaiData] = useState<any>(null);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [result, setResult] = useState<OfferResult | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'standard' | 'premium'>('standard');
  const [hasSavedResult, setHasSavedResult] = useState(false);

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [skillsRes, ikigaiRes, offerRes] = await Promise.all([
      supabase.from('skill_entries').select('*').eq('user_id', user.id),
      supabase.from('ikigai_results').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('offers').select('*').eq('user_id', user.id).maybeSingle()
    ]);
    const loadedSkills = skillsRes.data || [];
    setSkills(loadedSkills);
    if (ikigaiRes.data) { setIkigaiData({ service_angles: (ikigaiRes.data.service_angles as any) || [], core_positioning: (ikigaiRes.data.ikigai_statements as any)?.[0]?.statement || '', what_you_can_be_paid_for: (ikigaiRes.data.what_you_can_be_paid_for as any) || [] }); }
    if (offerRes.data) {
      setResult({ smv: offerRes.data.smv || '', target_market: offerRes.data.target_market || '', pricing_justification: offerRes.data.pricing_justification || '', starter_package: (offerRes.data.starter_package as unknown as PackageData) || {} as PackageData, standard_package: (offerRes.data.standard_package as unknown as PackageData) || {} as PackageData, premium_package: (offerRes.data.premium_package as unknown as PackageData) || {} as PackageData });
      setHasSavedResult(true); setStep('results');
    } else if (loadedSkills.length > 0 && ikigaiRes.data) { setStep('ready'); } else { setStep('missing-data'); }
  };

  const handleGenerate = async () => {
    if (skills.length === 0) { navigate('/student/launchpad/skills'); return; }
    if (!ikigaiData) { navigate('/student/launchpad/ikigai'); return; }
    setStep('generating'); setGenerateProgress(0);
    const progressInterval = setInterval(() => { setGenerateProgress(prev => Math.min(prev + Math.random() * 10, 90)); }, 500);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/offer-builder`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionData?.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ skills, ikigaiResult: ikigaiData, studyField: '' }),
      });
      clearInterval(progressInterval);
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Generation error'); }
      const data: OfferResult = await response.json();
      setGenerateProgress(100);
      setTimeout(() => { setResult(data); setHasSavedResult(false); setStep('results'); }, 500);
    } catch (error) { clearInterval(progressInterval); toast.error(error instanceof Error ? error.message : 'Error'); setStep('ready'); }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    try {
      const { data: existing } = await supabase.from('offers').select('id').eq('user_id', user.id).maybeSingle();
      const payload = { smv: result.smv, target_market: result.target_market, pricing_justification: result.pricing_justification, starter_package: result.starter_package as unknown as null, standard_package: result.standard_package as unknown as null, premium_package: result.premium_package as unknown as null };
      if (existing) { const { error } = await supabase.from('offers').update({ ...payload, updated_at: new Date().toISOString() }).eq('user_id', user.id); if (error) throw error; }
      else { const { error } = await supabase.from('offers').insert([{ user_id: user.id, ...payload }]); if (error) throw error; }
      toast.success('Offer saved!'); setHasSavedResult(true);
    } catch { toast.error('Save error'); }
  };

  const packageConfig = [
    { key: 'starter', icon: Zap, label: 'Starter', color: 'from-blue-500 to-cyan-500' },
    { key: 'standard', icon: Star, label: 'Standard', color: 'from-primary to-accent', popular: true },
    { key: 'premium', icon: Crown, label: 'Premium', color: 'from-amber-500 to-orange-500' },
  ];

  const getPackageData = (key: string): PackageData | null => { if (!result) return null; return result[`${key}_package` as keyof OfferResult] as unknown as PackageData; };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'loading' && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></motion.div>}

        {step === 'missing-data' && (
          <motion.div key="missing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/20 mb-4"><AlertCircle className="w-8 h-8 text-destructive" /></div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Prerequisites Needed</h1>
            <p className="text-muted-foreground mb-6">Complete Skill Scanner and Ikigai Builder first</p>
            <div className="flex gap-3 justify-center">
              {skills.length === 0 && <Button onClick={() => navigate('/student/launchpad/skills')} variant="outline" className="gap-2"><Sparkles className="w-5 h-5" />Skill Scanner</Button>}
              {skills.length > 0 && !ikigaiData && <Button onClick={() => navigate('/student/launchpad/ikigai')} className="gap-2 bg-gradient-to-r from-primary to-accent"><Target className="w-5 h-5" />Ikigai Builder</Button>}
            </div>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"><Package className="w-8 h-8 text-accent" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Offer Builder</h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">AI will create 3 service packages with strategic pricing</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border p-5"><h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Skills ({skills.length})</h3><div className="flex flex-wrap gap-2">{skills.slice(0, 6).map(s => (<Badge key={s.id} variant="outline" className="border-primary/30 text-primary">{s.skill}</Badge>))}{skills.length > 6 && <Badge variant="secondary">+{skills.length - 6} more</Badge>}</div></Card>
              <Card className="border-border p-5"><h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-accent" />Ikigai Position</h3><p className="text-sm text-muted-foreground line-clamp-3">{ikigaiData?.core_positioning || 'Position generated from your Ikigai'}</p></Card>
            </div>
            <div className="flex justify-center"><Button onClick={handleGenerate} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg"><Package className="w-5 h-5" />Generate Offer<ArrowRight className="w-5 h-5" /></Button></div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6 animate-pulse"><Loader2 className="w-10 h-10 text-accent animate-spin" /></div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Creating your offer...</h2>
            <div className="max-w-md mx-auto"><Progress value={generateProgress} className="h-2" /><p className="text-sm text-muted-foreground mt-2">{Math.round(generateProgress)}%</p></div>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4"><CheckCircle2 className="w-8 h-8 text-accent" /></div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{hasSavedResult ? 'Your Offer' : 'Offer Generated!'}</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{result.smv}</p>
              <Button onClick={() => { setResult(null); setHasSavedResult(false); setStep('ready'); }} variant="outline" className="mt-4 gap-2"><RefreshCw className="w-4 h-4" />Regenerate</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border p-5"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Target Market</h3><p className="text-sm text-muted-foreground">{result.target_market}</p></Card>
              <Card className="border-border p-5"><h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" />Pricing Justification</h3><p className="text-sm text-muted-foreground">{result.pricing_justification}</p></Card>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {packageConfig.map((config, index) => {
                const pkg = getPackageData(config.key);
                if (!pkg) return null;
                const isSelected = selectedPackage === config.key;
                return (
                  <motion.div key={config.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className={`relative overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border hover:border-primary/20'}`} onClick={() => setSelectedPackage(config.key as any)}>
                      {config.popular && <div className="absolute top-0 right-0"><Badge className="rounded-none rounded-bl-lg bg-primary">Popular</Badge></div>}
                      <div className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-4`}><config.icon className="w-6 h-6 text-white" /></div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name || config.label}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{pkg.tagline}</p>
                        <div className="mb-6"><span className="text-3xl font-bold text-foreground">{pkg.currency || '£'}{pkg.price}</span></div>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4" /><span>Delivery: {pkg.delivery_time}</span></div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4" /><span>Ideal for: {pkg.ideal_for}</span></div>
                        </div>
                        <div className="space-y-2"><p className="text-sm font-medium text-foreground">Deliverables:</p><ul className="space-y-1">{pkg.deliverables?.map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />{item}</li>))}</ul></div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="flex gap-2">
                {!hasSavedResult && <Button variant="outline" onClick={handleSave}>Save Offer</Button>}
              </div>
              <Button onClick={() => navigate('/student/launchpad/profile')} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90" size="lg">Continue to Profiles<ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
