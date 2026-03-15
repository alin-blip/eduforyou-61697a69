import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Video,
  Copy,
  Check,
  Search,
  Sparkles,
  MessageSquare,
  Instagram,
  Film,
  Megaphone,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  duration: string;
  script: string;
  icon: React.ElementType;
}

const videoTemplates: VideoTemplate[] = [
  {
    id: 'v1',
    title: 'Prezentare EduForYou - Script Scurt',
    description: 'Script de 30 secunde pentru prezentarea generală a EduForYou pe social media.',
    category: 'Prezentare',
    platform: 'Instagram Reels',
    duration: '30 sec',
    icon: Instagram,
    script: `🎓 Visezi la o carieră de succes în UK?

EduForYou îți deschide ușile spre cele mai bune universități din Marea Britanie!

✅ Cursuri acreditate în Business, Tehnologie, Psihologie și multe altele
✅ Campus-uri în Londra, Birmingham, Manchester și Leeds
✅ Suport complet pentru viză și cazare
✅ Burse disponibile

Nu rata această oportunitate! Contactează-ne acum pentru o consultație gratuită.

📩 Link în bio
#EduForYou #StudiiUK #CarieraDeSucres #UniversitatiUK`,
  },
  {
    id: 'v2',
    title: 'Testimonial Student - Format',
    description: 'Template pentru video testimonial cu studenți actuali sau absolvenți.',
    category: 'Testimonial',
    platform: 'YouTube / TikTok',
    duration: '60 sec',
    icon: Film,
    script: `[INTRO - 5 sec]
"Bună, sunt [NUME] și studiez [CURS] la [UNIVERSITATE] prin EduForYou."

[PROBLEMA - 10 sec]
"Când am decis să studiez în UK, nu știam de unde să încep. Procesul părea complicat și copleșitor."

[SOLUȚIA - 15 sec]
"EduForYou m-a ghidat pas cu pas: de la alegerea cursului potrivit, la aplicarea pentru viză și găsirea cazării. Totul a fost simplu și transparent."

[REZULTATUL - 15 sec]
"Acum sunt în anul [X], am prieteni din toată lumea și am deja un internship la [COMPANIE]. Cea mai bună decizie din viața mea!"

[CTA - 15 sec]
"Dacă și tu visezi la o carieră internațională, contactează EduForYou. Ei te ajută să faci primul pas. Link în descriere!"`,
  },
  {
    id: 'v3',
    title: 'Comparație Cursuri - Carusel Video',
    description: 'Script pentru video carusel comparând diferite cursuri disponibile.',
    category: 'Educativ',
    platform: 'Instagram / Facebook',
    duration: '45 sec',
    icon: Sparkles,
    script: `[SLIDE 1]
"Care curs e potrivit pentru tine? Hai să vedem!"

[SLIDE 2 - Business]
📊 Global Business Management
• Durată: 4 ani
• Preț: £9,535/an
• Cariere: Manager, Antreprenor, Consultant
• Campus-uri: Londra, Birmingham, Manchester, Leeds

[SLIDE 3 - Tehnologie]
💻 Computing (BSc)
• Durată: 4 ani
• Preț: £9,535/an
• Cariere: Developer, Data Analyst, Cyber Security
• Campus-uri: Londra, Birmingham, Manchester, Leeds

[SLIDE 4 - Psihologie]
🧠 Psychology & Counselling
• Durată: 4 ani
• Preț: £9,535/an
• Cariere: Psiholog, HR, Asistent Social
• Campus-uri: Londra, Birmingham, Manchester, Leeds

[SLIDE 5]
"Vrei să afli mai multe? Scrie-ne un mesaj! 📩"`,
  },
  {
    id: 'v4',
    title: 'Răspuns la Obiecții - FAQ Video',
    description: 'Script pentru video care răspunde la cele mai frecvente întrebări și obiecții.',
    category: 'FAQ',
    platform: 'TikTok / Reels',
    duration: '60 sec',
    icon: MessageSquare,
    script: `"Top 3 întrebări pe care le primesc despre studiile în UK"

❓ "E prea scump să studiezi în UK?"
✅ "Prețurile încep de la £6,355/an și există opțiuni de finanțare, burse și plata în rate. Plus, diploma britanică îți deschide uși în toată lumea."

❓ "Pot lucra în timpul studiilor?"
✅ "Da! Cu viza de student poți lucra până la 20 ore/săptămână în timpul semestrului și full-time în vacanțe."

❓ "Cum mă ajută EduForYou?"
✅ "EduForYou te ghidează de la A la Z: alegerea cursului, aplicația, viza, cazarea și suportul pe toată durata studiilor. Totul gratuit pentru tine!"

📩 Ai alte întrebări? Scrie-mi un mesaj!`,
  },
  {
    id: 'v5',
    title: 'Urgență / Ofertă Limitată',
    description: 'Script pentru promovarea unei oferte cu termen limitat.',
    category: 'Promoție',
    platform: 'Stories / Reels',
    duration: '15 sec',
    icon: Megaphone,
    script: `⚡ ULTIMELE LOCURI pentru sesiunea din septembrie!

🎓 Cursuri acreditate în UK
💰 Burse de până la 30%
📋 Aplicație gratuită prin EduForYou

⏰ Deadline: [DATA]

Nu rata această oportunitate!
Contactează-mă ACUM pentru detalii.

📩 Link în bio | Mesaj direct`,
  },
  {
    id: 'v6',
    title: 'Viața de Student în UK - Vlog Script',
    description: 'Script pentru un vlog despre experiența de student în Marea Britanie.',
    category: 'Lifestyle',
    platform: 'YouTube',
    duration: '3-5 min',
    icon: Film,
    script: `[INTRO - Campus exterior]
"Bună! Astăzi vă arăt cum arată o zi obișnuită ca student în [ORAȘ], UK."

[DIMINEAȚA - 30 sec]
"Ziua începe la 8. Campus-ul e la 15 minute de cămin. Iau micul dejun la cantina universității - super accesibil."

[CURSURI - 45 sec]
"Cursurile sunt interactive, cu mulți profesori din industrie. Grupurile sunt mici, deci primești atenție personalizată."

[PAUZA - 30 sec]
"La prânz, biblioteca e locul meu preferat. Are toate resursele de care ai nevoie."

[DUPĂ CURSURI - 45 sec]
"După-amiaza lucrez part-time la [LOC]. Cu viza de student, poți lucra 20 ore/săptămână."

[SEARA - 30 sec]
"Seara mă întâlnesc cu colegii. Am prieteni din peste 30 de țări - experiența e incredibilă!"

[OUTRO]
"Dacă vrei să trăiești și tu această experiență, contactează EduForYou. Ei m-au ajutat pe mine și te pot ajuta și pe tine! Link în descriere."`,
  },
];

const categories = ['Toate', 'Prezentare', 'Testimonial', 'Educativ', 'FAQ', 'Promoție', 'Lifestyle'];

const AgentCourseVideouriAI = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = videoTemplates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Toate' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: string, script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedId(id);
    toast({ title: 'Script copiat!' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Videouri AI - Scripturi Marketing
        </h1>
        <p className="text-muted-foreground mt-1">
          Scripturi și template-uri generate cu AI pentru conținut video de marketing.
        </p>
      </div>

      {/* Info Card */}
      <Card className="shadow-sm border-[#E67E22]/20 bg-gradient-to-r from-[#E67E22]/5 to-orange-50 dark:to-orange-950/20">
        <CardContent className="p-6 flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-[#E67E22] flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Scripturi generate cu AI</p>
            <p className="text-sm text-muted-foreground mt-1">
              Copiază și personalizează aceste scripturi pentru a crea conținut video atractiv pe orice platformă.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Caută scripturi..."
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

      {/* Template Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((template) => (
          <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/10 flex items-center justify-center">
                    <template.icon className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{template.category}</Badge>
                <Badge variant="outline">{template.platform}</Badge>
                <Badge variant="outline" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  {template.duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-sans max-h-60 overflow-y-auto border border-border">
                  {template.script}
                </pre>
                <Button
                  size="sm"
                  className={`absolute top-2 right-2 ${
                    copiedId === template.id
                      ? 'bg-emerald-500 hover:bg-emerald-500 text-white'
                      : 'bg-[#E67E22] hover:bg-[#E67E22]/90 text-white'
                  }`}
                  onClick={() => handleCopy(template.id, template.script)}
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copiat!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiază
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nu s-au găsit scripturi pentru căutarea ta.</p>
        </div>
      )}
    </div>
  );
};

export default AgentCourseVideouriAI;
