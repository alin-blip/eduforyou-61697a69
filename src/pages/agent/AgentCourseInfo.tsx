import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Copy,
  Check,
  Search,
  GraduationCap,
  Clock,
  MapPin,
  PoundSterling,
  Target,
  Briefcase,
  BookOpen,
  Star,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { coursesData } from '@/data/courses';

const AgentCourseInfo = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Toate', ...new Set(coursesData.map((c) => c.category))];

  const filtered = coursesData.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Toate' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generatePitchScript = (course: typeof coursesData[0]) => {
    return `🎓 ${course.title} (${course.level})
📍 ${course.university}

📋 DESPRE CURS:
${course.description}

⏰ Durată: ${course.duration}
💰 Preț: ${course.price}
📍 Campus-uri: ${course.campuses.join(', ')}

📚 MODULE PRINCIPALE:
${course.modules.map((m) => `• ${m}`).join('\n')}

💼 CARIERE DUPĂ ABSOLVIRE:
${course.careers.map((c) => `• ${c}`).join('\n')}

✅ DE CE SĂ ALEGI ACEST CURS:
• Diplomă acreditată în UK
• Profesori din industrie
• Suport complet pentru viză și cazare
• Oportunități de internship în UK
• Posibilitate de lucru part-time în timpul studiilor

📩 Contactează-mă pentru mai multe detalii și pentru a începe procesul de aplicare!`;
  };

  const handleCopy = (courseId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(courseId);
    toast({ title: 'Script copiat în clipboard!' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const keySellingPoints = [
    {
      icon: GraduationCap,
      title: 'Diplome Acreditate',
      description: 'Toate cursurile sunt acreditate și recunoscute internațional.',
    },
    {
      icon: MapPin,
      title: '4 Campus-uri în UK',
      description: 'Londra, Birmingham, Manchester și Leeds.',
    },
    {
      icon: Briefcase,
      title: 'Oportunități de Carieră',
      description: 'Acces la internshipuri și joburi în UK și internațional.',
    },
    {
      icon: Star,
      title: 'Suport Complet',
      description: 'Asistență pentru viză, cazare și integrare.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Informații Cursuri
        </h1>
        <p className="text-muted-foreground mt-1">
          Detalii complete despre cursuri pentru prezentări către studenți potențiali.
        </p>
      </div>

      {/* Key Selling Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keySellingPoints.map((point) => (
          <Card key={point.title} className="shadow-sm">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-[#E67E22]/10 flex items-center justify-center mb-3">
                <point.icon className="w-5 h-5 text-[#E67E22]" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{point.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Caută cursuri..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className={
                    selectedCategory === cat
                      ? 'bg-[#E67E22] hover:bg-[#E67E22]/90 text-white'
                      : ''
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Cards */}
      <div className="space-y-6">
        {filtered.map((course) => {
          const pitchScript = generatePitchScript(course);
          return (
            <Card key={course.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full sm:w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="mt-1">{course.university}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#E67E22] text-white">{course.level}</Badge>
                        <Badge variant="secondary">{course.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{course.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Course Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Durată</p>
                      <p className="text-sm font-medium text-foreground">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PoundSterling className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Preț</p>
                      <p className="text-sm font-medium text-foreground">{course.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Campus-uri</p>
                      <p className="text-sm font-medium text-foreground">
                        {course.campuses.length} locații
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Module</p>
                      <p className="text-sm font-medium text-foreground">
                        {course.modules.length} module
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#E67E22]" />
                    Module Principale
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.modules.map((mod) => (
                      <Badge key={mod} variant="secondary" className="text-xs">
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Careers */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#E67E22]" />
                    Cariere după Absolvire
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.careers.map((career) => (
                      <Badge key={career} variant="outline" className="text-xs border-emerald-300 text-emerald-700 dark:text-emerald-400">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Campuses */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E67E22]" />
                    Campus-uri Disponibile
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.campuses.map((campus) => (
                      <Badge key={campus} variant="outline" className="text-xs">
                        📍 {campus}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pitch Script */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#E67E22]" />
                      Script de Prezentare
                    </h4>
                    <Button
                      size="sm"
                      className={
                        copiedId === course.id
                          ? 'bg-emerald-500 hover:bg-emerald-500 text-white'
                          : 'bg-[#E67E22] hover:bg-[#E67E22]/90 text-white'
                      }
                      onClick={() => handleCopy(course.id, pitchScript)}
                    >
                      {copiedId === course.id ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copiat!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copiază Script
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-sans max-h-48 overflow-y-auto border border-border">
                    {pitchScript}
                  </pre>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nu s-au găsit cursuri pentru căutarea ta.</p>
        </div>
      )}
    </div>
  );
};

export default AgentCourseInfo;
