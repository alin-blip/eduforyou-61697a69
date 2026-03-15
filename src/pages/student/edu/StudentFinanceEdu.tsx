import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PoundSterling,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Calculator,
  FileText,
  Clock,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

const SFE_STEPS = [
  {
    step: 1,
    title: 'Creează Cont SFE',
    description: 'Înregistrează-te pe site-ul Student Finance England (SFE) cu datele tale personale.',
    link: 'https://www.gov.uk/student-finance-register-login',
  },
  {
    step: 2,
    title: 'Completează Aplicația',
    description: 'Completează formularul de aplicare online cu detaliile cursului și universității.',
  },
  {
    step: 3,
    title: 'Încarcă Documente',
    description: 'Încarcă dovada identității, adresa și statusul de rezidență.',
  },
  {
    step: 4,
    title: 'Confirmă Detalii Curs',
    description: 'Asigură-te că detaliile cursului corespund cu oferta de la universitate.',
  },
  {
    step: 5,
    title: 'Trimite Aplicația',
    description: 'Verifică toate datele și trimite aplicația pentru procesare.',
  },
  {
    step: 6,
    title: 'Așteaptă Aprobarea',
    description: 'SFE va procesa aplicația ta. Vei primi o notificare prin email.',
  },
];

const StudentFinanceEdu = () => {
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setCompletedSteps(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );

    if (completedSteps.length + 1 === SFE_STEPS.length) {
      updateStep.mutate({ stepKey: 'finance', status: 'completed' });
      addPoints.mutate({ points: 30, badge: 'finance_started' });
    }
  };

  const progressPercent = Math.round((completedSteps.length / SFE_STEPS.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <PoundSterling className="w-6 h-6 text-green-500" />
          Finanțare SFE
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul U1 - Ghid pas cu pas pentru aplicarea la Student Finance England
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Finanțare disponibilă pentru studenți eligibili
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Student Finance England (SFE) oferă împrumuturi pentru taxe de școlarizare și costuri de trai.
                Rambursarea începe doar după ce câștigi peste £25,000/an.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1" asChild>
              <a href="https://www.gov.uk/student-finance" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
                <span className="text-xs">Site SFE Oficial</span>
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1" asChild>
              <Link to="/student/finance">
                <Calculator className="w-5 h-5" />
                <span className="text-xs">Calculator Finanțare</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SFE Steps Guide */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Ghid Aplicare SFE</CardTitle>
            <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
              {completedSteps.length}/{SFE_STEPS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {SFE_STEPS.map(step => {
            const isCompleted = completedSteps.includes(step.step);
            return (
              <div
                key={step.step}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                  isCompleted ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800' : ''
                }`}
                onClick={() => toggleStep(step.step)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Deschide Link
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Important Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Informații Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Taxe de școlarizare: până la £9,250/an - plătite direct universității
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Împrumut de întreținere: până la £13,022/an (Londra) sau £9,978/an (în afara Londrei)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Rambursare: 9% din venituri peste £25,000/an
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Datoria se șterge după 40 de ani
            </li>
          </ul>
        </CardContent>
      </Card>

      <Button asChild className="w-full">
        <Link to="/student/edu/bonuses">
          Pasul Următor: Bonusuri <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
};

export default StudentFinanceEdu;
