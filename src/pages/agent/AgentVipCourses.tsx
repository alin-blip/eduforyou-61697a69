import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Unlock,
  GraduationCap,
  Star,
  Clock,
  PlayCircle,
  Trophy,
  Crown,
} from 'lucide-react';

interface VipCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  unlockAt: number;
  image: string;
}

const vipCourses: VipCourse[] = [
  {
    id: 'vip-1',
    title: 'Tehnici Avansate de Vânzare',
    description: 'Învață cele mai eficiente tehnici de vânzare consultativă pentru a crește rata de conversie.',
    category: 'Vânzări',
    duration: '4 ore',
    lessons: 12,
    unlockAt: 0,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
  },
  {
    id: 'vip-2',
    title: 'Marketing Digital pentru Agenți',
    description: 'Strategii de marketing digital și social media pentru atragerea studenților online.',
    category: 'Marketing',
    duration: '6 ore',
    lessons: 18,
    unlockAt: 5,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  },
  {
    id: 'vip-3',
    title: 'Negociere și Comunicare',
    description: 'Dezvoltă-ți abilitățile de negociere și comunicare persuasivă cu părinții și studenții.',
    category: 'Dezvoltare Personală',
    duration: '3 ore',
    lessons: 9,
    unlockAt: 10,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },
  {
    id: 'vip-4',
    title: 'Masterclass: Construirea Rețelei',
    description: 'Cum să construiești o rețea puternică de contacte și să generezi referraluri constante.',
    category: 'Networking',
    duration: '5 ore',
    lessons: 15,
    unlockAt: 15,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80',
  },
  {
    id: 'vip-5',
    title: 'Leadership și Management de Echipă',
    description: 'Pregătește-te pentru a conduce propria echipă de agenți și a scala business-ul.',
    category: 'Leadership',
    duration: '8 ore',
    lessons: 24,
    unlockAt: 25,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
  },
  {
    id: 'vip-6',
    title: 'Strategii de Franciză EduForYou',
    description: 'Curs exclusiv despre modelul de franciză și cum să deschizi propria locație.',
    category: 'Business',
    duration: '10 ore',
    lessons: 30,
    unlockAt: 50,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  },
];

const AgentVipCourses = () => {
  const { user } = useAuth();
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('referrals')
        .select('id')
        .eq('agent_id', user.id)
        .in('status', ['enrolled', 'converted']);
      setEnrolledCount(data?.length || 0);
      setLoading(false);
    };
    fetchCount();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  const unlockedCount = vipCourses.filter((c) => enrolledCount >= c.unlockAt).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Cursuri VIP
        </h1>
        <p className="text-muted-foreground mt-1">
          Cursuri premium exclusive pentru agenți. Deblochează-le prin performanța ta.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="shadow-sm border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 dark:to-[#D4AF37]/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Crown className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  {unlockedCount} / {vipCourses.length} cursuri deblocate
                </p>
                <p className="text-sm text-muted-foreground">
                  Ai {enrolledCount} studenți înscriși
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm text-muted-foreground">
                Următorul curs la{' '}
                <span className="font-semibold text-foreground">
                  {vipCourses.find((c) => enrolledCount < c.unlockAt)?.unlockAt || 'complet'}{' '}
                  studenți
                </span>
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] transition-all"
                style={{
                  width: `${(unlockedCount / vipCourses.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vipCourses.map((course) => {
          const isUnlocked = enrolledCount >= course.unlockAt;
          return (
            <Card
              key={course.id}
              className={`shadow-sm overflow-hidden transition-all ${
                isUnlocked ? 'hover:shadow-md' : 'opacity-75'
              }`}
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className={`w-full h-40 object-cover ${!isUnlocked ? 'filter grayscale' : ''}`}
                />
                <div className="absolute top-3 right-3">
                  {isUnlocked ? (
                    <Badge className="bg-emerald-500 text-white">
                      <Unlock className="w-3 h-3 mr-1" />
                      Deblocat
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-800 text-white">
                      <Lock className="w-3 h-3 mr-1" />
                      {course.unlockAt} studenți
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary">{course.category}</Badge>
                </div>
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-white/70" />
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5" />
                    {course.lessons} lecții
                  </span>
                </div>
                {isUnlocked && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progres</span>
                      <span className="font-medium text-foreground">0%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-[#D4AF37]"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                )}
                <Button
                  className={`w-full mt-4 ${
                    isUnlocked
                      ? 'bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Începe Cursul
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Blocat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AgentVipCourses;
