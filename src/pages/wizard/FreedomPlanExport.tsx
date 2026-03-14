import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileDown, Loader2, Check, Sparkles, Target, Package, User, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ModuleStatus { name: string; icon: React.ElementType; completed: boolean; route: string; }

export default function FreedomPlanExport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([
    { name: 'Skill Scanner', icon: Sparkles, completed: false, route: '/student/launchpad/skills' },
    { name: 'Ikigai Builder', icon: Target, completed: false, route: '/student/launchpad/ikigai' },
    { name: 'Offer Builder', icon: Package, completed: false, route: '/student/launchpad/offer' },
    { name: 'Profile Builder', icon: User, completed: false, route: '/student/launchpad/profile' },
    { name: 'Outreach Generator', icon: MessageSquare, completed: false, route: '/student/launchpad/outreach' },
  ]);

  useEffect(() => { if (user) loadAllData(); }, [user]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const userId = user?.id;
      if (!userId) return;
      const [skills, ikigai, offer, socialProfiles, outreachTemplates] = await Promise.all([
        supabase.from('skill_entries').select('id').eq('user_id', userId),
        supabase.from('ikigai_results').select('id').eq('user_id', userId),
        supabase.from('offers').select('id').eq('user_id', userId),
        supabase.from('social_profiles').select('id').eq('user_id', userId),
        supabase.from('outreach_templates').select('id').eq('user_id', userId),
      ]);
      setModuleStatuses(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], completed: !!(skills.data?.length) };
        updated[1] = { ...updated[1], completed: !!(ikigai.data?.length) };
        updated[2] = { ...updated[2], completed: !!(offer.data?.length) };
        updated[3] = { ...updated[3], completed: !!(socialProfiles.data?.length) };
        updated[4] = { ...updated[4], completed: !!(outreachTemplates.data?.length) };
        return updated;
      });
    } catch { toast.error('Error loading data'); } finally { setIsLoading(false); }
  };

  const completedCount = moduleStatuses.filter(m => m.completed).length;
  const allCompleted = completedCount === moduleStatuses.length;
  const progressPercentage = (completedCount / moduleStatuses.length) * 100;

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2"><div className="flex items-center gap-2"><FileDown className="h-8 w-8 text-primary" /><h1 className="font-display text-3xl font-bold">Freedom Plan Export</h1></div><p className="text-muted-foreground">Export your complete Freedom Plan as a document</p></div>

      <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Module Progress</span><Badge variant={allCompleted ? 'default' : 'secondary'}>{completedCount}/{moduleStatuses.length} completed</Badge></CardTitle><CardDescription>{allCompleted ? 'All modules completed! Your Freedom Plan is ready.' : 'Complete all modules to generate your Freedom Plan.'}</CardDescription></CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-3 mb-6" />
          <div className="grid gap-3">
            {moduleStatuses.map((module, index) => (
              <motion.div key={module.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${module.completed ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border hover:bg-muted/50 cursor-pointer'}`} onClick={() => !module.completed && navigate(module.route)}>
                  <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${module.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><module.icon className="h-4 w-4" /></div><span className={module.completed ? 'font-medium' : 'text-muted-foreground'}>{module.name}</span></div>
                  {module.completed ? <Check className="h-5 w-5 text-primary" /> : <AlertCircle className="h-5 w-5 text-muted-foreground" />}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={!allCompleted ? 'opacity-60' : ''}>
        <CardHeader><CardTitle>Export Your Plan</CardTitle><CardDescription>{allCompleted ? 'Your Freedom Plan is ready for export!' : 'Complete all modules above to unlock export.'}</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-6 py-6">
            <motion.div animate={allCompleted ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} className={`p-6 rounded-full ${allCompleted ? 'bg-primary/10' : 'bg-muted'}`}><FileDown className={`h-12 w-12 ${allCompleted ? 'text-primary' : 'text-muted-foreground'}`} /></motion.div>
            {allCompleted ? (
              <div className="space-y-4"><h3 className="font-semibold text-lg">Your Freedom Plan is Ready!</h3><p className="text-sm text-muted-foreground max-w-md">Your plan includes all skills, Ikigai positioning, service packages, social profiles and outreach templates.</p>
                <p className="text-xs text-muted-foreground">(PDF export coming soon — all data is saved in your dashboard)</p>
              </div>
            ) : (
              <div className="space-y-4"><h3 className="font-semibold text-lg text-muted-foreground">{moduleStatuses.length - completedCount} modules remaining</h3><p className="text-sm text-muted-foreground max-w-md">Click on incomplete modules above to complete them</p></div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/student/launchpad/outreach')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Outreach</Button>
        <Button variant="outline" onClick={() => navigate('/student/launchpad')}>Back to Launchpad</Button>
      </div>
    </div>
  );
}
