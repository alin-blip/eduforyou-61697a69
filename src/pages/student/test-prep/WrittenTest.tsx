import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  PenTool,
  Clock,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  word_limit?: number;
  category?: string;
  points?: number;
}

const WrittenTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const loadQuestions = async () => {
      const { data } = await supabase
        .from('written_questions')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(10);
      setQuestions((data as Question[]) || []);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  const wordCount = (answers[currentQuestion?.id] || '').trim().split(/\s+/).filter(Boolean).length;
  const wordLimit = currentQuestion?.word_limit || 300;
  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const totalWords = Object.values(answers).reduce((sum, a) => sum + a.trim().split(/\s+/).filter(Boolean).length, 0);

      await supabase.from('test_attempts').insert({
        user_id: user.id,
        test_type: 'written',
        answers: answers as any,
        score: null,
        duration_seconds: duration,
        total_words: totalWords,
        questions_answered: answeredCount,
        total_questions: questions.length,
        submitted_at: new Date().toISOString(),
      });

      updateStep.mutate({ stepKey: 'test_prep', status: 'in_progress' });
      addPoints.mutate({ points: 25, badge: 'test_completed' });
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-10">
        <Card className="border-green-300 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Test Trimis!</h2>
            <p className="text-sm text-muted-foreground">
              Răspunsurile tale au fost trimise. Vei primi rezultatele în curând.
            </p>
            <Badge className="bg-green-500">+25 puncte</Badge>
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
      <div className="max-w-lg mx-auto py-10">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nu sunt întrebări disponibile momentan.</p>
            <Button variant="outline" onClick={() => navigate('/student/edu/test-prep')}>
              Înapoi
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
          <PenTool className="w-6 h-6 text-blue-500" />
          Test Scris
        </h1>
        <p className="text-muted-foreground mt-1">
          Răspunde la întrebări cu atenție. Limita de cuvinte este indicată pentru fiecare întrebare.
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <Badge variant="secondary" className="shrink-0">
            {answeredCount}/{questions.length}
          </Badge>
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
            {currentQuestion.category && (
              <Badge variant="secondary" className="text-xs">{currentQuestion.category}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground font-medium">{currentQuestion.question_text}</p>
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder="Scrie răspunsul tău aici..."
            rows={8}
            className="resize-none"
          />
          <div className="flex items-center justify-between text-xs">
            <span className={`${wordCount > wordLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              {wordCount}/{wordLimit} cuvinte
            </span>
            {currentQuestion.points && (
              <span className="text-muted-foreground">{currentQuestion.points} puncte</span>
            )}
          </div>
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
            className="bg-green-600 hover:bg-green-700"
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

export default WrittenTest;
