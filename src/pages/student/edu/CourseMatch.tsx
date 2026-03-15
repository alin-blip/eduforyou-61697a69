import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, Star, MapPin, GraduationCap, Loader2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  university?: string;
  location?: string;
  duration?: string;
  level?: string;
  category?: string;
  description?: string;
  slug?: string;
}

const CourseMatch = () => {
  const { user } = useAuth();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [courses, setCourses] = useState<Course[]>([]);
  const [ikigaiResults, setIkigaiResults] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const [ikigai, elig, coursesRes] = await Promise.all([
        supabase.from('ikigai_results').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('eligibility_results').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('courses').select('*').limit(20),
      ]);
      setIkigaiResults(ikigai.data);
      setEligibility(elig.data);
      setCourses((coursesRes.data as Course[]) || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const confirmSelection = async () => {
    updateStep.mutate({ stepKey: 'course_match', status: 'completed' });
    addPoints.mutate({ points: 15 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Potrivire Cursuri
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul E2 - Cursuri recomandate pe baza eligibilității și profilului tău
        </p>
      </div>

      {/* Ikigai Summary */}
      {ikigaiResults && (
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Rezultate Ikigai</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ikigaiResults.passions && (
                <Badge variant="outline" className="border-purple-300 text-purple-600">
                  Pasiuni: {Array.isArray(ikigaiResults.passions) ? ikigaiResults.passions.join(', ') : ikigaiResults.passions}
                </Badge>
              )}
              {ikigaiResults.skills && (
                <Badge variant="outline" className="border-blue-300 text-blue-600">
                  Abilități: {Array.isArray(ikigaiResults.skills) ? ikigaiResults.skills.join(', ') : ikigaiResults.skills}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!ikigaiResults && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Completează testul Ikigai pentru recomandări personalizate.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/student/launchpad/ikigai">Ikigai Test</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => {
          const isSelected = selectedCourses.includes(course.id);
          return (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => toggleCourse(course.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{course.title}</h3>
                    {course.university && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
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
                  </div>
                  {isSelected && (
                    <Badge className="shrink-0 bg-primary">Selectat</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {course.level && <Badge variant="secondary" className="text-xs">{course.level}</Badge>}
                  {course.duration && <Badge variant="outline" className="text-xs">{course.duration}</Badge>}
                  {course.category && <Badge variant="outline" className="text-xs">{course.category}</Badge>}
                </div>
                {course.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nu au fost găsite cursuri. Contactează un consilier.</p>
          </CardContent>
        </Card>
      )}

      {selectedCourses.length > 0 && (
        <div className="sticky bottom-4 z-10">
          <Card className="border-primary bg-primary/5 shadow-lg">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedCourses.length} {selectedCourses.length === 1 ? 'curs selectat' : 'cursuri selectate'}
              </p>
              <Button onClick={confirmSelection}>
                Confirmă Selecția <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseMatch;
