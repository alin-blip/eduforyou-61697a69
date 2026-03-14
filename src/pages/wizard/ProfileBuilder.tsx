import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Music2, Sparkles, ArrowRight, ArrowLeft, Check, Copy, Loader2, RefreshCw, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
interface SocialProfile { id?: string; platform: Platform; bio: string; headline: string; about: string; hashtags: string[]; content_pillars: string[]; cta: string; username_suggestions: string[]; }

export default function ProfileBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'loading' | 'ready' | 'results'>('loading');
  const [offer, setOffer] = useState<any>(null);
  const [ikigaiData, setIkigaiData] = useState<any>(null);
  const [profiles, setProfiles] = useState<Record<Platform, SocialProfile | null>>({ facebook: null, instagram: null, linkedin: null, tiktok: null });
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [generatingPlatform, setGeneratingPlatform] = useState<Platform | null>(null);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const platformConfig = {
    facebook: { icon: Facebook, name: 'Facebook', color: 'bg-blue-600', description: 'Business page profile' },
    instagram: { icon: Instagram, name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', description: 'Bio & content strategy' },
    linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'bg-blue-700', description: 'Professional profile' },
    tiktok: { icon: Music2, name: 'TikTok', color: 'bg-foreground', description: 'Creator profile' }
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    try {
      const [offerData, ikigaiResult, existingProfiles] = await Promise.all([
        supabase.from('offers').select('*').eq('user_id', user?.id).maybeSingle(),
        supabase.from('ikigai_results').select('*').eq('user_id', user?.id).maybeSingle(),
        supabase.from('social_profiles').select('*').eq('user_id', user?.id)
      ]);
      if (offerData.data) setOffer(offerData.data);
      if (ikigaiResult.data) setIkigaiData(ikigaiResult.data);
      if (existingProfiles.data?.length) {
        const map: Record<Platform, SocialProfile | null> = { facebook: null, instagram: null, linkedin: null, tiktok: null };
        existingProfiles.data.forEach((p: any) => { map[p.platform as Platform] = { id: p.id, platform: p.platform, bio: p.bio || '', headline: p.headline || '', about: p.about || '', hashtags: Array.isArray(p.hashtags) ? p.hashtags as string[] : [], content_pillars: Array.isArray(p.content_pillars) ? p.content_pillars as string[] : [], cta: p.cta || '', username_suggestions: Array.isArray(p.username_suggestions) ? p.username_suggestions as string[] : [] }; });
        setProfiles(map);
      }
      setStep('ready');
    } catch { setStep('ready'); }
  };

  const handleGenerate = async (platform: Platform) => {
    if (!offer || !ikigaiData) { toast.error('Complete Offer Builder and Ikigai first'); return; }
    setGeneratingPlatform(platform); setProgress(0);
    const progressInterval = setInterval(() => { setProgress(prev => Math.min(prev + Math.random() * 15, 90)); }, 500);
    try {
      const { data: profileData } = await supabase.from('profiles').select('full_name').eq('user_id', user?.id).single();
      const { data, error } = await supabase.functions.invoke('profile-builder', { body: { offer, ikigaiResult: ikigaiData, platform, userName: profileData?.full_name || '' } });
      clearInterval(progressInterval);
      if (error) throw error;
      setProgress(100);
      const generatedProfile: SocialProfile = { platform, bio: data.bio || '', headline: data.headline || '', about: data.about || '', hashtags: data.hashtags || [], content_pillars: data.content_pillars || [], cta: data.cta || '', username_suggestions: data.username_suggestions || [] };
      // Auto-save
      try {
        await supabase.from('social_profiles').upsert({ user_id: user?.id, platform, bio: generatedProfile.bio, headline: generatedProfile.headline, about: generatedProfile.about, hashtags: generatedProfile.hashtags, content_pillars: generatedProfile.content_pillars, cta: generatedProfile.cta, username_suggestions: generatedProfile.username_suggestions }, { onConflict: 'user_id,platform' });
      } catch {}
      setProfiles(prev => ({ ...prev, [platform]: generatedProfile }));
      setTimeout(() => { setGeneratingPlatform(null); setSelectedPlatform(platform); setStep('results'); }, 500);
    } catch (error: any) { clearInterval(progressInterval); toast.error(error.message || 'Generation error'); setGeneratingPlatform(null); }
  };

  const handleCopy = (content: string, id: string) => { navigator.clipboard.writeText(content); setCopiedId(id); toast.success('Copied to clipboard!'); setTimeout(() => setCopiedId(null), 2000); };
  const hasAnyProfile = Object.values(profiles).some(p => p !== null);
  const completedPlatforms = Object.values(profiles).filter(p => p !== null).length;

  const renderProfileContent = (profile: SocialProfile) => (
    <div className="space-y-6">
      {profile.headline && (<div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-medium text-sm text-muted-foreground">Headline</h4><Button variant="ghost" size="sm" onClick={() => handleCopy(profile.headline, `${profile.platform}-headline`)}>{copiedId === `${profile.platform}-headline` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div><p className="text-foreground bg-muted/50 p-3 rounded-lg">{profile.headline}</p></div>)}
      {profile.bio && (<div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-medium text-sm text-muted-foreground">Bio</h4><Button variant="ghost" size="sm" onClick={() => handleCopy(profile.bio, `${profile.platform}-bio`)}>{copiedId === `${profile.platform}-bio` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div><p className="text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{profile.bio}</p></div>)}
      {profile.about && (<div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-medium text-sm text-muted-foreground">About</h4><Button variant="ghost" size="sm" onClick={() => handleCopy(profile.about, `${profile.platform}-about`)}>{copiedId === `${profile.platform}-about` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div><p className="text-foreground bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{profile.about}</p></div>)}
      {profile.cta && (<div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-medium text-sm text-muted-foreground">Call to Action</h4><Button variant="ghost" size="sm" onClick={() => handleCopy(profile.cta, `${profile.platform}-cta`)}>{copiedId === `${profile.platform}-cta` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div><p className="text-foreground bg-muted/50 p-3 rounded-lg">{profile.cta}</p></div>)}
      {profile.hashtags?.length > 0 && (<div className="space-y-2"><div className="flex items-center justify-between"><h4 className="font-medium text-sm text-muted-foreground">Hashtags</h4><Button variant="ghost" size="sm" onClick={() => handleCopy(profile.hashtags.join(' '), `${profile.platform}-hashtags`)}>{copiedId === `${profile.platform}-hashtags` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div><div className="flex flex-wrap gap-2">{profile.hashtags.map((tag, idx) => (<Badge key={idx} variant="secondary">{tag}</Badge>))}</div></div>)}
      {profile.content_pillars?.length > 0 && (<div className="space-y-2"><h4 className="font-medium text-sm text-muted-foreground">Content Pillars</h4><div className="grid gap-2">{profile.content_pillars.map((pillar, idx) => (<div key={idx} className="bg-muted/50 p-3 rounded-lg flex items-start gap-2"><span className="text-primary font-medium">{idx + 1}.</span><span>{pillar}</span></div>))}</div></div>)}
      {profile.username_suggestions?.length > 0 && (<div className="space-y-2"><h4 className="font-medium text-sm text-muted-foreground">Username Suggestions</h4><div className="flex flex-wrap gap-2">{profile.username_suggestions.map((username, idx) => (<Badge key={idx} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => handleCopy(username, `${profile.platform}-username-${idx}`)}>@{username}{copiedId === `${profile.platform}-username-${idx}` && <Check className="h-3 w-3 ml-1" />}</Badge>))}</div></div>)}
    </div>
  );

  if (step === 'loading') return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2"><div className="flex items-center gap-2"><User className="h-8 w-8 text-primary" /><h1 className="font-display text-3xl font-bold">Profile Builder</h1></div><p className="text-muted-foreground">Generate optimized social media profiles with AI</p></div>
      <Card className="bg-muted/30"><CardContent className="py-4"><div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Completed Profiles</span><span className="font-medium">{completedPlatforms}/4</span></div><Progress value={(completedPlatforms / 4) * 100} className="h-2" /></CardContent></Card>

      {step === 'ready' && !generatingPlatform && (
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.keys(platformConfig) as Platform[]).map((platform) => {
            const config = platformConfig[platform]; const Icon = config.icon; const hasProfile = profiles[platform] !== null;
            return (
              <motion.div key={platform} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}>
                <Card className={`cursor-pointer transition-all hover:shadow-lg ${hasProfile ? 'ring-2 ring-primary' : ''}`} onClick={() => hasProfile ? (setSelectedPlatform(platform), setStep('results')) : handleGenerate(platform)}>
                  <CardContent className="p-6"><div className="flex items-start gap-4"><div className={`p-3 rounded-xl ${config.color} text-white`}><Icon className="h-6 w-6" /></div><div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-semibold text-lg">{config.name}</h3>{hasProfile && <Badge variant="secondary" className="bg-primary/10 text-primary"><Check className="h-3 w-3 mr-1" />Done</Badge>}</div><p className="text-sm text-muted-foreground mt-1">{config.description}</p></div>
                    <Button variant={hasProfile ? "outline" : "default"} size="sm" onClick={(e) => { e.stopPropagation(); handleGenerate(platform); }}>{hasProfile ? <><RefreshCw className="h-4 w-4 mr-1" />Redo</> : <><Sparkles className="h-4 w-4 mr-1" />Generate</>}</Button>
                  </div></CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {generatingPlatform && (
        <Card className="max-w-md mx-auto"><CardContent className="py-12 text-center space-y-6"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block"><Sparkles className="h-12 w-12 text-primary" /></motion.div><div className="space-y-2"><h3 className="font-semibold text-lg">Generating {platformConfig[generatingPlatform].name} profile...</h3></div><Progress value={progress} className="h-2" /></CardContent></Card>
      )}

      {step === 'results' && hasAnyProfile && !generatingPlatform && (
        <Card><CardHeader><CardTitle>Generated Profiles</CardTitle><CardDescription>Review and copy your optimized profiles</CardDescription></CardHeader>
          <CardContent>
            <Tabs value={selectedPlatform || 'facebook'} onValueChange={(v) => setSelectedPlatform(v as Platform)}>
              <TabsList className="grid w-full grid-cols-4">{(Object.keys(platformConfig) as Platform[]).map((platform) => { const config = platformConfig[platform]; const Icon = config.icon; const hasProfile = profiles[platform] !== null; return (<TabsTrigger key={platform} value={platform} disabled={!hasProfile} className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="hidden sm:inline">{config.name}</span>{hasProfile && <Check className="h-3 w-3 text-primary" />}</TabsTrigger>); })}</TabsList>
              {(Object.keys(platformConfig) as Platform[]).map((platform) => (
                <TabsContent key={platform} value={platform} className="mt-6">
                  {profiles[platform] ? (
                    <div className="space-y-6"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${platformConfig[platform].color} text-white`}>{(() => { const Icon = platformConfig[platform].icon; return <Icon className="h-5 w-5" />; })()}</div><div><h3 className="font-semibold">{platformConfig[platform].name}</h3></div></div><Button variant="outline" size="sm" onClick={() => handleGenerate(platform)}><RefreshCw className="h-4 w-4 mr-1" />Regenerate</Button></div>{renderProfileContent(profiles[platform]!)}</div>
                  ) : (<div className="text-center py-12"><Button onClick={() => handleGenerate(platform)}><Sparkles className="h-4 w-4 mr-2" />Generate</Button></div>)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/student/launchpad/offer')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Offers</Button>
        {hasAnyProfile && <Button onClick={() => navigate('/student/launchpad/outreach')}>Continue to Outreach<ArrowRight className="h-4 w-4 ml-2" /></Button>}
      </div>
    </div>
  );
}
