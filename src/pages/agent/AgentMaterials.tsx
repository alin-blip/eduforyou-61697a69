import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  DollarSign,
  Presentation,
  Share2,
  Download,
  BookOpen,
  Image,
  Video,
  FileSpreadsheet,
} from 'lucide-react';

interface MaterialCategory {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  items: MaterialItem[];
}

interface MaterialItem {
  name: string;
  description: string;
  format: string;
  size: string;
}

const materialCategories: MaterialCategory[] = [
  {
    title: 'Broșuri',
    description: 'Broșuri profesionale pentru prezentări și distribuire către studenți potențiali.',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    items: [
      {
        name: 'Broșura Generală EduForYou',
        description: 'Prezentare generală a tuturor programelor și beneficiilor.',
        format: 'PDF',
        size: '4.2 MB',
      },
      {
        name: 'Broșura Cursuri Tehnologie',
        description: 'Computing, Cyber Security și Data Analytics.',
        format: 'PDF',
        size: '3.1 MB',
      },
      {
        name: 'Broșura Cursuri Business',
        description: 'Global Business, Accounting și Digital Marketing.',
        format: 'PDF',
        size: '3.5 MB',
      },
      {
        name: 'Ghidul Studentului Internațional',
        description: 'Informații despre viză, cazare și viața în UK.',
        format: 'PDF',
        size: '2.8 MB',
      },
    ],
  },
  {
    title: 'Liste de Prețuri',
    description: 'Documente actualizate cu prețurile și opțiunile de finanțare disponibile.',
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    items: [
      {
        name: 'Lista Prețuri 2024-2025',
        description: 'Toate cursurile cu prețuri și opțiuni de plată.',
        format: 'PDF',
        size: '1.2 MB',
      },
      {
        name: 'Opțiuni de Finanțare',
        description: 'Burse, rate și finanțare studentească.',
        format: 'PDF',
        size: '890 KB',
      },
      {
        name: 'Comparație Pachete',
        description: 'Tabel comparativ între pachete și niveluri.',
        format: 'XLSX',
        size: '340 KB',
      },
    ],
  },
  {
    title: 'Prezentări',
    description: 'Slide-uri profesionale gata de utilizare în întâlniri și prezentări.',
    icon: Presentation,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    items: [
      {
        name: 'Prezentare EduForYou - Completă',
        description: 'Prezentare completă de 30 slide-uri pentru întâlniri.',
        format: 'PPTX',
        size: '15.4 MB',
      },
      {
        name: 'Prezentare Scurtă - 10 Slide-uri',
        description: 'Versiune condensată pentru prezentări rapide.',
        format: 'PPTX',
        size: '8.2 MB',
      },
      {
        name: 'Prezentare pentru Părinți',
        description: 'Focusată pe siguranță, calitate și perspective de carieră.',
        format: 'PPTX',
        size: '10.1 MB',
      },
    ],
  },
  {
    title: 'Materiale Social Media',
    description: 'Conținut vizual optimizat pentru toate platformele de social media.',
    icon: Share2,
    color: 'text-[#D4AF37]',
    bg: 'bg-[#D4AF37]/10 dark:bg-[#D4AF37]/10',
    items: [
      {
        name: 'Kit Instagram - Postări',
        description: '20 template-uri pentru postări Instagram.',
        format: 'ZIP',
        size: '45.2 MB',
      },
      {
        name: 'Kit Facebook - Cover & Postări',
        description: 'Cover-uri și postări optimizate pentru Facebook.',
        format: 'ZIP',
        size: '38.7 MB',
      },
      {
        name: 'Stories Templates',
        description: 'Template-uri animate pentru Instagram și Facebook Stories.',
        format: 'ZIP',
        size: '22.3 MB',
      },
      {
        name: 'LinkedIn - Articole & Postări',
        description: 'Conținut profesional pentru LinkedIn.',
        format: 'ZIP',
        size: '12.1 MB',
      },
      {
        name: 'WhatsApp - Materiale Partajare',
        description: 'Imagini și texte optimizate pentru WhatsApp.',
        format: 'ZIP',
        size: '8.5 MB',
      },
    ],
  },
];

const formatIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  PPTX: Presentation,
  XLSX: FileSpreadsheet,
  ZIP: Image,
  MP4: Video,
};

const AgentMaterials = () => {
  const handleDownload = (itemName: string) => {
    // In production, this would trigger a real download
    const link = document.createElement('a');
    link.href = '#';
    link.download = itemName;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Centrul de Materiale
        </h1>
        <p className="text-muted-foreground mt-1">
          Descarcă materialele de vânzare pentru a-ți promova cursurile eficient.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {materialCategories.map((cat) => (
          <Card key={cat.title} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div>
                <p className="font-bold text-foreground">{cat.items.length}</p>
                <p className="text-xs text-muted-foreground">{cat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Material Categories */}
      {materialCategories.map((category) => (
        <Card key={category.title} className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${category.bg} flex items-center justify-center`}>
                <category.icon className={`w-5 h-5 ${category.color}`} />
              </div>
              <div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => {
                const FormatIcon = formatIcons[item.format] || FileText;
                return (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FormatIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.format}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.size}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                      onClick={() => handleDownload(item.name)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Help Section */}
      <Card className="shadow-sm border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 dark:to-[#D4AF37]/10">
        <CardContent className="p-6 flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Ai nevoie de materiale personalizate?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contactează echipa de suport pentru materiale personalizate cu logo-ul și informațiile tale.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentMaterials;
