import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Clock,
  FileText,
  MessageSquare,
  Brain,
  PenTool,
  BarChart3,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react';

const TEST_TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  written: { label: 'Test Scris', icon: PenTool, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200' },
  interview: { label: 'Practică Interviu', icon: MessageSquare, color: 'text-[#D4AF37] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10 border-[#D4AF37]/30' },
  ai_personalized: { label: 'Test AI Personalizat', icon: Brain, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200' },
};

const TestResults = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      setAttempts(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const totalAttempts = attempts.length;
  const writtenCount = attempts.filter(a => a.test_type === 'written').length;
  const interviewCount = attempts.filter(a => a.test_type === 'interview').length;
  const aiCount = attempts.filter(a => a.test_type === 'ai_personalized').length;

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Rezultate Teste
          </h1>
          <p className="text-muted-foreground mt-1">
            Istoricul și rezultatele testelor tale
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/student/edu/test-prep">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Înapoi
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Total Teste</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <PenTool className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{writtenCount}</p>
            <p className="text-xs text-muted-foreground">Scrise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <MessageSquare className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <p className="text-xl font-bold">{interviewCount}</p>
            <p className="text-xs text-muted-foreground">Interviuri</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Brain className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{aiCount}</p>
            <p className="text-xs text-muted-foreground">AI Teste</p>
          </CardContent>
        </Card>
      </div>

      {/* Attempts List */}
      {attempts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Nu ai completat niciun test încă.</p>
            <Button asChild>
              <Link to="/student/edu/test-prep">Începe un Test</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map(attempt => {
            const config = TEST_TYPE_CONFIG[attempt.test_type] || TEST_TYPE_CONFIG.written;
            const Icon = config.icon;
            const isExpanded = selectedAttempt?.id === attempt.id;

            return (
              <Card
                key={attempt.id}
                className={`cursor-pointer transition-all hover:shadow-md ${config.color}`}
                onClick={() => setSelectedAttempt(isExpanded ? null : attempt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/50 dark:bg-black/20 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{config.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(attempt.submitted_at).toLocaleDateString('ro-RO')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(attempt.duration_seconds)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary">
                        {attempt.questions_answered || 0}/{attempt.total_questions || 0}
                      </Badge>
                      {attempt.score !== null && attempt.score !== undefined && (
                        <p className="text-xs font-bold text-foreground mt-0.5">
                          Scor: {attempt.score}%
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && attempt.answers && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <h4 className="text-sm font-medium text-foreground">Răspunsuri</h4>
                      {Object.entries(attempt.answers as Record<string, string>).map(([key, value]) => (
                        <div key={key} className="bg-white/50 dark:bg-black/10 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Întrebarea: {key}</p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      ))}
                      {attempt.feedback && Object.keys(attempt.feedback).length > 0 && (
                        <>
                          <h4 className="text-sm font-medium text-foreground mt-3">Feedback</h4>
                          {Object.entries(attempt.feedback as Record<string, string>).map(([key, value]) => (
                            <div key={key} className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Feedback pentru: {key}</p>
                              <p className="text-sm text-foreground">{value}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestResults;
