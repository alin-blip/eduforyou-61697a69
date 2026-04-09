import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Star,
  Download,
  Shield,
} from 'lucide-react';

const benefits = [
  'Ghid complet Student Finance England pas cu pas',
  'Lista universităților partenere și programelor disponibile',
  'Strategii dovedite de aplicare cu succes',
  'Checklist-uri practice pentru fiecare etapă',
  'Template-uri de scrisori și documente',
  'Acces la comunitatea exclusivă de studenți',
  'Bonus: Calendar de deadline-uri important',
  'Actualizări gratuite pe viață',
];

const BookLanding = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#EAC67E] text-sm font-medium">Ebook Exclusiv</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Ghidul Complet pentru Studii Gratuite în UK
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Tot ce trebuie să știi despre cum să accesezi studii universitare finanțate
                integral prin Student Finance England — într-un singur ghid complet.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">4.9/5 — 500+ cititori</span>
              </div>
              <Link to="/ebook">
                <Button className="bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg px-8 py-3 gap-2">
                  Descarcă Ebook-ul <Download className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right — Book Cover Placeholder */}
            <div className="flex justify-center">
              <div className="w-72 md:w-80 aspect-[3/4] bg-gradient-to-br from-[#D4AF37] to-[#C6A248] rounded-xl shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <BookOpen className="w-16 h-16 text-white/90 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Ghidul Complet</h3>
                  <p className="text-white/80 text-sm mb-4">Studii Gratuite în UK</p>
                  <div className="w-16 h-0.5 bg-white/40 mx-auto mb-4" />
                  <p className="text-white/60 text-xs">EduForYou</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce Găsești în Acest Ghid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '500+', label: 'Cititori' },
              { value: '4.9/5', label: 'Rating Mediu' },
              { value: '120+', label: 'Pagini' },
            ].map((s, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="text-3xl font-bold text-[#C6A248]">{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#D4AF37] to-[#C6A248] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Shield className="w-10 h-10 mx-auto mb-4 text-[#EAC67E]" />
          <h2 className="text-3xl font-bold mb-4">Descarcă Ghidul Gratuit Acum</h2>
          <p className="text-[#EAC67E] text-lg mb-8">
            Fă primul pas spre studii universitare gratuite în UK.
          </p>
          <Link to="/ebook">
            <Button className="bg-white text-[#C6A248] hover:bg-[#D4AF37]/10 font-semibold text-lg px-8 py-3 gap-2">
              Descarcă Acum <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BookLanding;
