import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface AIQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple_choice';
  options?: string[];
  points: number;
}

const AIPersonalizedTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addPoints } = useGamification();
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime, setStartTime] = useState(0);

  const generateTest = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const { data } = await supabase.functions.invoke('generate-personalized-test', {
        body: { user_id: user.id },
      });

      if (data?.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setStartTime(Date.now());
      } else {
        // Fallback questions
        setQuestions([
          { id: 'ai_1', question: 'Descrie motivația ta principală pentru a studia în Marea Britanie.', type: 'text', points: 10 },
          { id: 'ai_2', question: 'Care sunt cele mai importante 3 abilități pe care le aduci ca student?', type: 'text', points: 10 },
          { id: 'ai_3', question: 'Cum crezi că studiile te vor ajuta să îți atingi obiectivele de carieră?', type: 'text', points: 10 },
          { id: 'ai_4', question: 'Ce te diferențiază de alți candidați?', type: 'text', points: 10 },
          { id: 'ai_5', question: 'Descrie un proiect sau o realizare de care ești mândru/ă.', type: 'text', points: 10 },
        ]);
        setStartTime(Date.now());
      }
    } catch (err) {
      console.error('Error generating test:', err);
      // Use fallback
      setQuestions([
        { id: 'ai_1', question: 'Descrie motivația ta principală pentru a studia în Marea Britanie.', type: 'text', points: 10 },
        { id: 'ai_2', question: 'Care sunt cele mai importante 3 abilități pe care le aduci ca student?', type: 'text', points: 10 },
        { id: 'ai_3', question: 'Cum crezi că studiile te vor ajuta să îți atingi obiectivele de carieră?', type: 'text', points: 10 },
      ]);
      setStartTime(Date.now());
    } finally {
      setGenerating(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const duration = Math.round((Date.now() - startTime) / 1000);

      const { data } = await supabase.from('test_attempts').insert({
        user_id: user.id,
        test_type: 'ai_personalized',
        answers: answers as any,
        questions_answered: answeredCount,
        total_questions: questions.length,
        duration_seconds: duration,
        submitted_at: new Date().toISOString(),
      }).select().single();

      setResult(data);
      addPoints.mutate({ points: 30 });
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-10">
        <Card className="border-green-300 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Test AI Completat!</h2>
            <p className="text-sm text-muted-foreground">
              Testul personalizat a fost trimis. Rezultatele vor fi disponibile în curând.
            </p>
            <Badge className="bg-green-500">+30 puncte</Badge>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => navigate('/student/edu/test-prep')} className="flex-1">
                Înapoi la Teste
              </Button>
              <Button onClick={() => navigate('/student/test-prep/results')} className="flex-1">
                Vezi Rezultate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Test AI Personalizat
          </h1>
          <p className="text-muted-foreground mt-1">
            Test generat de AI adaptat profilului și obiectivelor tale.
          </p>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="w-12 h-12 text-purple-500 mx-auto" />
            <h2 className="text-lg font-semibold">Generează Testul Tău</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              AI-ul va genera întrebări personalizate bazate pe profilul tău,
              eligibilitatea și cursul ales.
            </p>
            <Button onClick={generateTest} disabled={generating} size="lg">
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generează Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Test AI Personalizat
        </h1>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <Badge variant="secondary">{answeredCount}/{questions.length}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {Math.round((Date.now() - startTime) / 60000)} min
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Întrebarea {currentIndex + 1}/{questions.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {currentQuestion.points} puncte
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground font-medium">{currentQuestion.question}</p>

          {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                    answers[currentQuestion.id] === option
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : ''
                  }`}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))}
                >
                  <p className="text-sm">{option}</p>
                </div>
              ))}
            </div>
          ) : (
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              placeholder="Scrie răspunsul tău..."
              rows={6}
              className="resize-none"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Înapoi
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex(i => i + 1)}>
            Următoarea <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            Trimite Testul
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIPersonalizedTest;
