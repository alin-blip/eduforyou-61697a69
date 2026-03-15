import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  Lightbulb,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    question: 'De ce ai ales acest curs și această universitate?',
    tip: 'Menționează aspecte specifice ale cursului care te atrag și cum se potrivesc cu obiectivele tale.',
  },
  {
    id: 'q2',
    question: 'Ce te motivează să studiezi în Marea Britanie?',
    tip: 'Vorbește despre oportunitățile educaționale, culturale și profesionale.',
  },
  {
    id: 'q3',
    question: 'Care sunt punctele tale forte și cum le vei folosi în studii?',
    tip: 'Dă exemple concrete din experiența ta.',
  },
  {
    id: 'q4',
    question: 'Unde te vezi peste 5 ani după absolvire?',
    tip: 'Arată că ai un plan clar și că studiile te ajută să îl atingi.',
  },
  {
    id: 'q5',
    question: 'Povestește despre o provocare pe care ai depășit-o.',
    tip: 'Folosește metoda STAR: Situație, Task, Acțiune, Rezultat.',
  },
  {
    id: 'q6',
    question: 'Ce contribuție poți aduce comunității universitare?',
    tip: 'Gândește-te la activități extracurriculare, voluntariat sau abilități unice.',
  },
];

const InterviewPractice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addPoints } = useGamification();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);

  const currentQuestion = DEFAULT_QUESTIONS[currentIndex];
  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;
  const progressPercent = Math.round((answeredCount / DEFAULT_QUESTIONS.length) * 100);

  const requestFeedback = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer?.trim()) return;

    setLoadingFeedback(questionId);
    try {
      const { data } = await supabase.functions.invoke('generate-interview-feedback', {
        body: {
          question: DEFAULT_QUESTIONS.find(q => q.id === questionId)?.question,
          answer,
        },
      });
      if (data?.feedback) {
        setFeedback(prev => ({ ...prev, [questionId]: data.feedback }));
      }
    } catch (err) {
      setFeedback(prev => ({
        ...prev,
        [questionId]: 'Feedback-ul nu a putut fi generat. Încearcă din nou mai târziu.',
      }));
    } finally {
      setLoadingFeedback(null);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await supabase.from('test_attempts').insert({
        user_id: user.id,
        test_type: 'interview',
        answers: answers as any,
        feedback: feedback as any,
        questions_answered: answeredCount,
        total_questions: DEFAULT_QUESTIONS.length,
        submitted_at: new Date().toISOString(),
      });
      addPoints.mutate({ points: 20 });
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
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Practică Completă!</h2>
            <p className="text-sm text-muted-foreground">
              Ai completat sesiunea de practică pentru interviu. Revizuiește răspunsurile și feedback-ul.
            </p>
            <Badge className="bg-green-500">+20 puncte</Badge>
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          Practică Interviu
        </h1>
        <p className="text-muted-foreground mt-1">
          Exersează răspunsurile la întrebări frecvente de interviu. Solicită feedback AI pentru fiecare răspuns.
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <Progress value={progressPercent} className="flex-1 h-2" />
          <Badge variant="secondary">{answeredCount}/{DEFAULT_QUESTIONS.length}</Badge>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              Întrebarea {currentIndex + 1}/{DEFAULT_QUESTIONS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-foreground font-medium pt-1">{currentQuestion.question}</p>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">{currentQuestion.tip}</p>
          </div>

          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={e => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder="Scrie răspunsul tău ca și cum ai fi la interviu..."
            rows={6}
            className="resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {(answers[currentQuestion.id] || '').trim().split(/\s+/).filter(Boolean).length} cuvinte
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => requestFeedback(currentQuestion.id)}
              disabled={!answers[currentQuestion.id]?.trim() || loadingFeedback === currentQuestion.id}
            >
              {loadingFeedback === currentQuestion.id ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Feedback AI
            </Button>
          </div>

          {/* Feedback */}
          {feedback[currentQuestion.id] && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Feedback AI</p>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">{feedback[currentQuestion.id]}</p>
            </div>
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

        {currentIndex < DEFAULT_QUESTIONS.length - 1 ? (
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
            Finalizează Practica
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewPractice;
