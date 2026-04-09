import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowRight, Calendar, Target, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface PlanItem {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  completed: boolean;
  category: string;
}

const DEFAULT_PLAN_ITEMS: Omit<PlanItem, 'id'>[] = [
  { title: 'Verificare Eligibilitate', description: 'Completează formularul de eligibilitate', completed: false, category: 'evaluate' },
  { title: 'Test Ikigai', description: 'Descoperă pasiunile și abilitățile tale', completed: false, category: 'evaluate' },
  { title: 'Potrivire Cursuri', description: 'Selectează cursurile potrivite', completed: false, category: 'evaluate' },
  { title: 'Pregătire Test', description: 'Pregătește-te pentru testul de admitere', completed: false, category: 'evaluate' },
  { title: 'Pregătire Documente', description: 'Adună documentele necesare', completed: false, category: 'deliver' },
  { title: 'Construire CV', description: 'Creează CV-ul și personal statement', completed: false, category: 'deliver' },
  { title: 'Trimitere Aplicație', description: 'Trimite aplicația la universitate', completed: false, category: 'deliver' },
  { title: 'Aplicare SFE', description: 'Aplică pentru finanțare Student Finance', completed: false, category: 'unlock' },
];

const EduPlan = () => {
  const { user } = useAuth();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [plan, setPlan] = useState<any>(null);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from('edu_plans').select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setPlan(data);
        setItems((data as any).plan_items || []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const generatePlan = async () => {
    if (!user) return;
    setGenerating(true);
    const planItems = DEFAULT_PLAN_ITEMS.map((item, i) => ({
      ...item,
      id: `plan_${i + 1}`,
    }));

    try {
      const { data, error } = await supabase.from('edu_plans').upsert({
        user_id: user.id,
        plan_items: planItems as any,
        status: 'active',
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }).select().single();

      if (data) {
        setPlan(data);
        setItems(planItems);
        updateStep.mutate({ stepKey: 'edu_plan', status: 'completed' });
        addPoints.mutate({ points: 25, badge: 'plan_created' });
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = async (itemId: string) => {
    const updated = items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);

    if (plan) {
      await supabase.from('edu_plans').update({ plan_items: updated as any }).eq('id', plan.id);
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          Plan E.D.U.
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul E3 - Planul tău personalizat de educație
        </p>
      </div>

      {!plan && (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-lg font-semibold">Generează Planul Tău E.D.U.</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Pe baza profilului și eligibilității tale, vom genera un plan personalizat cu pași clari spre obiectivul tău academic.
            </p>
            <Button onClick={generatePlan} disabled={generating} size="lg">
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generează Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {plan && (
        <>
          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Progres Plan</p>
                <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
                  {completedCount}/{items.length}
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{progressPercent}% completat</p>
            </CardContent>
          </Card>

          {/* Plan Items */}
          <div className="space-y-2">
            {['evaluate', 'deliver', 'unlock'].map(category => {
              const categoryItems = items.filter(i => i.category === category);
              if (categoryItems.length === 0) return null;

              const categoryLabels: Record<string, string> = {
                evaluate: 'Evaluate',
                deliver: 'Deliver',
                unlock: 'Unlock',
              };
              const categoryColors: Record<string, string> = {
                evaluate: 'text-blue-500',
                deliver: 'text-[#D4AF37]',
                unlock: 'text-green-500',
              };

              return (
                <div key={category}>
                  <h3 className={`text-sm font-semibold mb-2 ${categoryColors[category]}`}>
                    {categoryLabels[category]}
                  </h3>
                  <div className="space-y-1.5">
                    {categoryItems.map(item => (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:bg-muted/50 ${
                          item.completed ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800' : ''
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <CardContent className="p-3 flex items-center gap-3">
                          <CheckCircle2
                            className={`w-5 h-5 shrink-0 transition-colors ${
                              item.completed ? 'text-green-500' : 'text-muted-foreground/30'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          {item.deadline && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              <Calendar className="w-3 h-3 mr-1" />
                              {item.deadline}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <Button asChild className="w-full">
            <Link to="/student/edu/test-prep">
              Pasul Următor: Pregătire Test <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default EduPlan;
