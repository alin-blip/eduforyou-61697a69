import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Heart,
  Star,
  Briefcase,
  Globe,
  ArrowRight,
  Loader2,
  GraduationCap,
  MapPin,
  Sparkles,
  BookOpen,
  Target,
} from 'lucide-react';

interface IkigaiData {
  passions: string[];
  skills: string[];
  world_needs: string[];
  paid_for: string[];
  ikigai_result?: string;
}

interface RecommendedCourse {
  id: string;
  title: string;
  university?: string;
  location?: string;
  level?: string;
  category?: string;
  description?: string;
  slug?: string;
}

const IkigaiApply = () => {
  const { user } = useAuth();
  const [ikigai, setIkigai] = useState<IkigaiData | null>(null);
  const [courses, setCourses] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [ikigaiRes, coursesRes] = await Promise.all([
        supabase.from('ikigai_results').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('courses').select('*').limit(12),
      ]);

      if (ikigaiRes.data) {
        setIkigai({
          passions: (ikigaiRes.data as any).passions || [],
          skills: (ikigaiRes.data as any).skills || [],
          world_needs: (ikigaiRes.data as any).world_needs || [],
          paid_for: (ikigaiRes.data as any).paid_for || [],
          ikigai_result: (ikigaiRes.data as any).ikigai_result,
        });
      }
      setCourses((coursesRes.data as RecommendedCourse[]) || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ikigai) {
    return (
      <div className="max-w-lg mx-auto py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Aplică pe Baza Ikigai
          </h1>
          <p className="text-muted-foreground mt-1">
            Completează mai întâi testul Ikigai pentru a primi recomandări personalizate.
          </p>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <Brain className="w-16 h-16 text-purple-300 mx-auto" />
            <h2 className="text-lg font-semibold">Testul Ikigai Nu Este Completat</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Testul Ikigai te ajută să descoperi intersecția dintre pasiunile tale,
              abilitățile tale, ce are nevoie lumea și pentru ce poți fi plătit.
            </p>
            <Button asChild size="lg">
              <Link to="/student/launchpad/ikigai">
                <Sparkles className="w-4 h-4 mr-2" />
                Începe Testul Ikigai
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IKIGAI_SECTIONS = [
    { key: 'passions', label: 'Ce Iubești', icon: Heart, color: 'text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200', data: ikigai.passions },
    { key: 'skills', label: 'În Ce Ești Bun/ă', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200', data: ikigai.skills },
    { key: 'world_needs', label: 'Ce Are Nevoie Lumea', icon: Globe, color: 'text-green-500 bg-green-50 dark:bg-green-950/20 border-green-200', data: ikigai.world_needs },
    { key: 'paid_for', label: 'Pentru Ce Poți Fi Plătit/ă', icon: Briefcase, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200', data: ikigai.paid_for },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Aplică pe Baza Ikigai
        </h1>
        <p className="text-muted-foreground mt-1">
          Cursuri recomandate pe baza rezultatelor tale Ikigai
        </p>
      </div>

      {/* Ikigai Result */}
      {ikigai.ikigai_result && (
        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Ikigai-ul Tău</h3>
            </div>
            <p className="text-sm text-foreground">{ikigai.ikigai_result}</p>
          </CardContent>
        </Card>
      )}

      {/* Ikigai Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {IKIGAI_SECTIONS.map(section => {
          const Icon = section.icon;
          const items = Array.isArray(section.data) ? section.data : typeof section.data === 'string' ? [section.data] : [];
          return (
            <Card key={section.key} className={`${section.color}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <p className="text-sm font-medium">{section.label}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.length > 0 ? items.map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  )) : (
                    <p className="text-xs text-muted-foreground italic">Nu a fost completat</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommended Courses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Cursuri Recomandate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-6">
              <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nu sunt cursuri disponibile momentan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <h4 className="text-sm font-medium text-foreground truncate">{course.title}</h4>
                  {course.university && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3 h-3" />
                      {course.university}
                    </p>
                  )}
                  {course.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {course.location}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.level && <Badge variant="secondary" className="text-[10px]">{course.level}</Badge>}
                    {course.category && <Badge variant="outline" className="text-[10px]">{course.category}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="text-lg font-bold text-foreground">Pregătit/ă să Aplici?</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Continuă parcursul E.D.U. pentru a-ți pregăti documentele și aplicația.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link to="/student/edu/course-match">
                <BookOpen className="w-4 h-4 mr-2" />
                Potrivire Cursuri
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/student/dashboard">
                Dashboard E.D.U. <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiApply;
