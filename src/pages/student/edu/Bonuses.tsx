import { Link } from 'react-router-dom';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Gift,
  Star,
  Trophy,
  Zap,
  Users,
  ArrowRight,
  Lock,
  CheckCircle2,
  Flame,
  Crown,
} from 'lucide-react';

interface Bonus {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ElementType;
  unlockCondition: string;
  category: 'progress' | 'engagement' | 'referral' | 'special';
}

const BONUSES: Bonus[] = [
  {
    id: 'first_steps',
    title: 'Primii Pași',
    description: 'Completează verificarea eligibilității',
    points: 20,
    icon: Star,
    unlockCondition: 'eligibility_done',
    category: 'progress',
  },
  {
    id: 'document_master',
    title: 'Maestru Documente',
    description: 'Încarcă toate documentele obligatorii',
    points: 30,
    icon: CheckCircle2,
    unlockCondition: 'documents_uploaded',
    category: 'progress',
  },
  {
    id: 'test_hero',
    title: 'Erou la Test',
    description: 'Completează un test de admitere',
    points: 25,
    icon: Trophy,
    unlockCondition: 'test_completed',
    category: 'progress',
  },
  {
    id: 'cv_pro',
    title: 'CV Profesional',
    description: 'Creează și salvează CV-ul complet',
    points: 20,
    icon: Zap,
    unlockCondition: 'cv_ready',
    category: 'progress',
  },
  {
    id: 'streak_week',
    title: 'Serie de 7 Zile',
    description: 'Conectează-te 7 zile consecutiv',
    points: 50,
    icon: Flame,
    unlockCondition: 'streak_7',
    category: 'engagement',
  },
  {
    id: 'streak_month',
    title: 'Serie de 30 Zile',
    description: 'Conectează-te 30 de zile consecutiv',
    points: 150,
    icon: Crown,
    unlockCondition: 'streak_30',
    category: 'engagement',
  },
  {
    id: 'referral_first',
    title: 'Primul Referral',
    description: 'Invită un prieten pe platformă',
    points: 100,
    icon: Users,
    unlockCondition: 'first_referral',
    category: 'referral',
  },
  {
    id: 'finance_ready',
    title: 'Pregătit Financiar',
    description: 'Completează ghidul SFE',
    points: 30,
    icon: Star,
    unlockCondition: 'finance_started',
    category: 'progress',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  progress: 'Progres',
  engagement: 'Angajament',
  referral: 'Referral',
  special: 'Special',
};

const Bonuses = () => {
  const { updateStep } = useEduJourney();
  const { badges, points, level, addPoints } = useGamification();

  const unlockedBonuses = BONUSES.filter(b => badges.includes(b.unlockCondition));
  const lockedBonuses = BONUSES.filter(b => !badges.includes(b.unlockCondition));
  const totalAvailablePoints = BONUSES.reduce((sum, b) => sum + b.points, 0);
  const earnedPoints = unlockedBonuses.reduce((sum, b) => sum + b.points, 0);

  const categories = ['progress', 'engagement', 'referral', 'special'];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gift className="w-6 h-6 text-green-500" />
          Bonusuri
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul U2 - Recompense bazate pe progresul tău
        </p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{level}</p>
              <p className="text-xs text-muted-foreground">Nivel</p>
            </div>
            <div>
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{points}</p>
              <p className="text-xs text-muted-foreground">Puncte</p>
            </div>
            <div>
              <Gift className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{unlockedBonuses.length}/{BONUSES.length}</p>
              <p className="text-xs text-muted-foreground">Deblocate</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Puncte din bonusuri</p>
              <p className="text-xs font-medium">{earnedPoints}/{totalAvailablePoints}</p>
            </div>
            <Progress value={(earnedPoints / totalAvailablePoints) * 100} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Bonuses by Category */}
      {categories.map(category => {
        const categoryBonuses = BONUSES.filter(b => b.category === category);
        if (categoryBonuses.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="space-y-2">
              {categoryBonuses.map(bonus => {
                const isUnlocked = badges.includes(bonus.unlockCondition);
                const Icon = bonus.icon;

                return (
                  <Card
                    key={bonus.id}
                    className={`transition-all ${
                      isUnlocked
                        ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10'
                        : 'opacity-75'
                    }`}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isUnlocked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                      }`}>
                        {isUnlocked ? (
                          <Icon className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {bonus.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{bonus.description}</p>
                      </div>
                      <Badge
                        variant={isUnlocked ? 'default' : 'outline'}
                        className={`shrink-0 ${isUnlocked ? 'bg-green-500' : ''}`}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        +{bonus.points}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      <Button asChild className="w-full">
        <Link to="/student/edu/freedom-circle">
          Pasul Următor: Freedom Circle <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
};

export default Bonuses;
