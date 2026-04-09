import { Link } from 'react-router-dom';
import { useEduJourney } from '@/hooks/useEduJourney';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileSearch,
  PenTool,
  MessageSquare,
  Brain,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trophy,
} from 'lucide-react';

const testTypes = [
  {
    key: 'written',
    title: 'Test Scris',
    description: 'Test de admitere cu întrebări scrise. Evaluează cunoștințele și abilitățile de scriere.',
    icon: PenTool,
    route: '/student/test-prep/written',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    duration: '60 min',
  },
  {
    key: 'interview',
    title: 'Practică Interviu',
    description: 'Simulare de interviu cu întrebări frecvente. Pregătește-te pentru interviul real.',
    icon: MessageSquare,
    route: '/student/test-prep/interview',
    color: 'text-[#D4AF37]',
    bgColor: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10',
    borderColor: 'border-[#D4AF37]/30 dark:border-[#C6A248]',
    duration: '30 min',
  },
  {
    key: 'ai_test',
    title: 'Test AI Personalizat',
    description: 'Test generat de AI bazat pe profilul tău. Întrebări adaptate nivelului și obiectivelor tale.',
    icon: Brain,
    route: '/student/test-prep/ai-test',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    duration: '45 min',
  },
];

const TestPrep = () => {
  const { getStepStatus, updateStep } = useEduJourney();
  const stepStatus = getStepStatus('test_prep');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-blue-500" />
          Pregătire Test
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul E4 - Pregătește-te pentru testele de admitere
        </p>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {stepStatus === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Clock className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              Status: {stepStatus === 'completed' ? 'Completat' : stepStatus === 'in_progress' ? 'În progres' : 'Neînceput'}
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/student/test-prep/results">
              <Trophy className="w-4 h-4 mr-1" />
              Vezi Rezultate
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Test Types */}
      <div className="space-y-4">
        {testTypes.map(test => {
          const Icon = test.icon;
          return (
            <Card
              key={test.key}
              className={`${test.borderColor} ${test.bgColor} transition-all hover:shadow-md`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${test.bgColor} shrink-0`}>
                    <Icon className={`w-6 h-6 ${test.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{test.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {test.duration}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild className="shrink-0 self-end sm:self-center">
                    <Link to={test.route}>
                      Începe <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sfaturi pentru Pregătire</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Exersează regulat - chiar și 15 minute pe zi fac diferența
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Citește cu atenție fiecare întrebare înainte de a răspunde
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Folosește testul AI pentru practică personalizată
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Revizuiește rezultatele și învață din greșeli
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPrep;
