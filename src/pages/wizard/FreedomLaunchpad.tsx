import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Rocket,
  Brain,
  Target,
  Briefcase,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Star,
  Compass,
} from 'lucide-react';

const LAUNCHPAD_STEPS = [
  {
    key: 'ikigai',
    title: 'Ikigai Builder',
    description: 'Descoperă-ți pasiunile, abilitățile, misiunea și vocația prin metoda japoneză Ikigai.',
    icon: Brain,
    route: '/student/launchpad/ikigai',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    key: 'skill_scanner',
    title: 'Skill Scanner',
    description: 'Evaluează-ți abilitățile și identifică domeniile în care poți crește.',
    icon: Target,
    route: '/student/launchpad/skill-scanner',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    key: 'profile_builder',
    title: 'Profile Builder',
    description: 'Construiește-ți profilul profesional complet pentru universități și angajatori.',
    icon: Users,
    route: '/student/launchpad/profile-builder',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    key: 'define_path',
    title: 'Define Your Path',
    description: 'Definește-ți traseul de carieră și creează un plan de acțiune concret.',
    icon: Compass,
    route: '/student/launchpad/define-path',
    color: 'text-[#D4AF37]',
    bgColor: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10',
    borderColor: 'border-[#D4AF37]/30 dark:border-[#C6A248]',
  },
  {
    key: 'offer_builder',
    title: 'Offer Builder',
    description: 'Creează oferta ta unică de valoare pentru piața muncii.',
    icon: Briefcase,
    route: '/student/launchpad/offer-builder',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  {
    key: 'outreach',
    title: 'Outreach Generator',
    description: 'Generează mesaje profesionale de networking și aplicare.',
    icon: FileText,
    route: '/student/launchpad/outreach',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    key: 'freedom_plan',
    title: 'Freedom Plan Export',
    description: 'Exportă planul tău complet de libertate cu toate rezultatele.',
    icon: Star,
    route: '/student/launchpad/freedom-plan',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
];

const FreedomLaunchpad = () => {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white overflow-hidden relative">
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Freedom Launchpad</h1>
          </div>
          <p className="text-white/80 max-w-lg text-sm md:text-base">
            Platforma ta de lansare spre libertate. Parcurge fiecare pas pentru a-ți descoperi
            potențialul, a-ți defini calea și a te pregăti pentru succes.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              7 Module
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Target className="w-3 h-3 mr-1" />
              Parcurs Ghidat
            </Badge>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/5 rounded-full mb-4" />
      </Card>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LAUNCHPAD_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.key}
              className={`${step.borderColor} ${step.bgColor} transition-all hover:shadow-md`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 dark:bg-black/20 shrink-0`}>
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {index + 1}/{LAUNCHPAD_STEPS.length}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link to={step.route}>
                        Începe <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center space-y-3">
          <Rocket className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Pregătit pentru Lansare?</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Completează toate modulele pentru a genera Planul tău de Libertate complet.
          </p>
          <Button asChild size="lg">
            <Link to="/student/launchpad/ikigai">
              <Sparkles className="w-4 h-4 mr-2" />
              Începe cu Ikigai
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreedomLaunchpad;
