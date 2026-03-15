import { Link } from 'react-router-dom';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Crown,
  Star,
  Heart,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Gift,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Users,
    title: 'Comunitate Alumni',
    description: 'Conectează-te cu alți absolvenți și studenți actuali din rețeaua EDU.',
  },
  {
    icon: Briefcase,
    title: 'Oportunități de Carieră',
    description: 'Acces exclusiv la joburi și stagii partajate de membrii comunității.',
  },
  {
    icon: MessageSquare,
    title: 'Mentorat',
    description: 'Primește ghidare de la absolvenți cu experiență în domeniul tău.',
  },
  {
    icon: GraduationCap,
    title: 'Resurse Educaționale',
    description: 'Acces la materiale de studiu, webinarii și workshop-uri exclusive.',
  },
  {
    icon: Gift,
    title: 'Beneficii Exclusive',
    description: 'Reduceri la servicii, evenimente și oportunități de networking.',
  },
  {
    icon: Globe,
    title: 'Rețea Internațională',
    description: 'Fii parte dintr-o comunitate globală de profesioniști și studenți.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Maria P.',
    course: 'Business Management',
    text: 'Freedom Circle m-a ajutat să găsesc primul meu job în UK prin networking-ul cu alți alumni.',
  },
  {
    name: 'Alexandru D.',
    course: 'Computer Science',
    text: 'Mentorii din comunitate mi-au oferit sfaturi practice care nu se găsesc în cărți.',
  },
  {
    name: 'Elena R.',
    course: 'Healthcare',
    text: 'Resursele exclusive și workshop-urile au fost incredibil de utile în primele luni de studiu.',
  },
];

const FreedomCircle = () => {
  const { updateStep, overallProgress } = useEduJourney();
  const { addPoints, level } = useGamification();
  const progress = overallProgress();
  const isUnlocked = progress >= 80;

  const handleJoin = () => {
    updateStep.mutate({ stepKey: 'freedom_circle', status: 'completed' });
    addPoints.mutate({ points: 50, badge: 'freedom_circle_joined' });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-green-500" />
          Freedom Circle
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul U3 - Comunitatea alumni EDU pentru absolvenți
        </p>
      </div>

      {/* Hero Card */}
      <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white overflow-hidden relative">
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold">Freedom Circle</h2>
          </div>
          <p className="text-green-100 text-sm max-w-md">
            Alătură-te comunității exclusive de absolvenți EDU. Networking, mentorat,
            oportunități de carieră și resurse educaționale - totul într-un singur loc.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              +50 puncte la înregistrare
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Users className="w-3 h-3 mr-1" />
              500+ membri
            </Badge>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 right-10 w-20 h-20 bg-white/5 rounded-full mb-2" />
      </Card>

      {/* Unlock Status */}
      {!isUnlocked && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Comunitate în curs de deblocare
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                Completează cel puțin 80% din parcursul E.D.U. pentru a te alătura Freedom Circle.
                Progres actual: {progress}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Beneficii</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            Ce Spun Membrii
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/30 border-l-2 border-green-400">
              <p className="text-sm text-foreground italic">"{t.text}"</p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                — {t.name}, {t.course}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Join CTA */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center space-y-3">
          <Crown className="w-10 h-10 text-green-500 mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Gata să te alături?</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {isUnlocked
              ? 'Felicitări! Ești eligibil pentru Freedom Circle. Apasă mai jos pentru a te înregistra.'
              : 'Continuă-ți parcursul E.D.U. pentru a debloca accesul la Freedom Circle.'}
          </p>
          <Button
            size="lg"
            onClick={handleJoin}
            disabled={!isUnlocked}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUnlocked ? (
              <>
                Alătură-te Freedom Circle <ArrowRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                {progress}% completat (necesar: 80%)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreedomCircle;
