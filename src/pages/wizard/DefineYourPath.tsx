import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, Package, User, MessageSquare, FileDown, ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const pathSteps = [
  { key: 'skillScanner', title: 'Skill Scanner', description: 'AI identifies your monetizable skills', icon: Sparkles, url: '/student/launchpad/skills', table: 'skill_entries' },
  { key: 'ikigaiBuilder', title: 'Ikigai Builder', description: 'Find your unique positioning', icon: Target, url: '/student/launchpad/ikigai', table: 'ikigai_results' },
  { key: 'offerBuilder', title: 'Offer Builder', description: 'Create service packages with pricing', icon: Package, url: '/student/launchpad/offer', table: 'offers' },
  { key: 'profileBuilder', title: 'Profile Builder', description: 'Optimized social media profiles', icon: User, url: '/student/launchpad/profile', table: 'social_profiles' },
  { key: 'outreachGenerator', title: 'Outreach Generator', description: 'Message templates for clients', icon: MessageSquare, url: '/student/launchpad/outreach', table: 'outreach_templates' },
  { key: 'freedomPlanExport', title: 'Freedom Plan Export', description: 'Download your complete plan', icon: FileDown, url: '/student/launchpad/export', table: null as string | null },
];

export default function DefineYourPath() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: completionData } = useQuery({
    queryKey: ['path-completion-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { status: {} as Record<string, boolean>, counts: {} as Record<string, number> };
      const [skills, ikigai, offers, profiles, outreach] = await Promise.all([
        supabase.from('skill_entries').select('id').eq('user_id', user.id),
        supabase.from('ikigai_results').select('id').eq('user_id', user.id),
        supabase.from('offers').select('id').eq('user_id', user.id),
        supabase.from('social_profiles').select('id').eq('user_id', user.id),
        supabase.from('outreach_templates').select('id').eq('user_id', user.id),
      ]);
      const status: Record<string, boolean> = {
        skillScanner: (skills.data?.length || 0) > 0,
        ikigaiBuilder: (ikigai.data?.length || 0) > 0,
        offerBuilder: (offers.data?.length || 0) > 0,
        profileBuilder: (profiles.data?.length || 0) > 0,
        outreachGenerator: (outreach.data?.length || 0) > 0,
      };
      const counts: Record<string, number> = {
        skillScanner: skills.data?.length || 0,
        ikigaiBuilder: ikigai.data?.length || 0,
        offerBuilder: offers.data?.length || 0,
        profileBuilder: profiles.data?.length || 0,
        outreachGenerator: outreach.data?.length || 0,
      };
      status.freedomPlanExport = Object.values(status).every(Boolean);
      return { status, counts };
    },
    enabled: !!user?.id,
  });

  const completionStatus = completionData?.status || {};
  const itemCounts = completionData?.counts || {};
  const allCompleted = Object.values(completionStatus).length > 0 && Object.values(completionStatus).every(Boolean);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {allCompleted && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-primary/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20"><CheckCircle2 className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="text-sm text-primary font-medium">🎉 All Complete!</p>
                  <p className="font-semibold text-foreground">You've completed all modules. Export your Freedom Plan!</p>
                </div>
              </div>
              <Button onClick={() => navigate('/student/launchpad/export')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shrink-0">
                <Download className="h-4 w-4 mr-2" />Export PDF<ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div><h1 className="text-2xl font-bold text-foreground">Freedom Launchpad</h1><p className="text-muted-foreground mt-1">Build your freelance career step by step</p></div>

      <div className="flex flex-col gap-3">
        {pathSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completionStatus?.[step.key] || false;
          const count = itemCounts?.[step.key] || 0;

          return (
            <motion.div key={step.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className={cn("p-4 cursor-pointer transition-all hover:border-primary/50 bg-card border-border/50", isCompleted && "border-l-4 border-l-primary")} onClick={() => navigate(step.url)}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{step.title}</span>
                        {isCompleted && count > 0 && <Badge variant="secondary" className="text-xs">{count} items</Badge>}
                        {isCompleted && count === 0 && <Badge className="bg-primary/20 text-primary border-0 text-xs">Complete</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    {isCompleted ? 'Review' : 'Start'}<ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
