import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  PoundSterling,
  Shield,
  Users,
  Star,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const benefits = [
  {
    icon: PoundSterling,
    title: 'Studii 100% Finanțate',
    desc: 'Taxa de școlarizare este acoperită integral de Student Finance England. Zero costuri din buzunarul tău.',
  },
  {
    icon: GraduationCap,
    title: 'Diplome Recunoscute',
    desc: 'Studiezi la universități acreditate din UK și obții o diplomă recunoscută internațional.',
  },
  {
    icon: Shield,
    title: 'Serviciu 100% Gratuit',
    desc: 'EduForYou nu îți percepe niciodată nicio taxă. Suntem plătiți de universități.',
  },
  {
    icon: Users,
    title: 'Suport Complet în Română',
    desc: 'Echipa noastră vorbește româna și te ghidează la fiecare pas al procesului.',
  },
  {
    icon: MapPin,
    title: 'Campusuri în Toată Anglia',
    desc: 'London, Birmingham, Manchester, Leeds — alegi orașul care ți se potrivește.',
  },
  {
    icon: TrendingUp,
    title: 'Carieră Mai Bună',
    desc: 'Absolvenții noștri câștigă în medie cu 50% mai mult decât înainte de studii.',
  },
];

const eligibilityChecks = [
  'Ai cetățenie română sau alt stat UE/EEA',
  'Ai settled sau pre-settled status în UK',
  'Locuiești în Anglia de cel puțin 3 ani',
  'Nu ai studiat anterior la o universitate din UK (cu unele excepții)',
];

const RoLanding = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm font-medium">🇷🇴 Special pentru Comunitatea Românească din UK</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold mb-6">
            Studiază La Universitate în UK — Gratuit
          </h1>
          <p className="text-orange-100 text-lg md:text-xl max-w-3xl mx-auto mb-4">
            Peste <strong className="text-white">7,000 de români</strong> au accesat deja studii
            universitare gratuite prin EduForYou și Student Finance England.
          </p>
          <p className="text-orange-200 mb-8">
            Nu plătești nimic din buzunar. Rambursezi doar după ce câștigi peste £25,000/an.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eligibilitate">
              <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-lg px-8 py-3 gap-2">
                Verifică Eligibilitatea <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/webinar/university">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 font-semibold text-lg px-8 py-3">
                Webinar Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '7,000+', label: 'Studenți Români Înscriși' },
              { value: '£138M+', label: 'Finanțare Securizată' },
              { value: '10+', label: 'Universități Partenere' },
              { value: '100%', label: 'Gratuit' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold text-orange-400">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            De Ce Să Alegi EduForYou?
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Suntem liderul în educație universitară gratuită pentru comunitatea românească din UK.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow border-t-4 border-t-orange-400">
                <b.icon className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="font-bold text-gray-900 text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Check */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ești Eligibil?</h2>
          <Card className="p-8 text-left mb-8">
            <p className="text-gray-600 mb-6">
              Verifică dacă îndeplinești condițiile de bază pentru finanțare SFE:
            </p>
            <div className="space-y-4">
              {eligibilityChecks.map((check, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{check}</span>
                </div>
              ))}
            </div>
          </Card>
          <Link to="/eligibilitate">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-3 gap-2">
              Verifică Eligibilitatea Completă <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Silviu S.', text: 'Prin EduForYou am reușit să îmi schimb complet cariera.', course: 'Business & Tourism' },
              { name: 'Ana I.', text: 'Cel mai bun lucru pe care l-am făcut pentru viitorul meu.', course: 'Business Management' },
              { name: 'David M.', text: 'Nu credeam că este posibil. EduForYou mi-a demonstrat contrariul.', course: 'Global Business' },
            ].map((t, i) => (
              <Card key={i} className="p-5">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3 italic">"{t.text}"</p>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-orange-600 text-xs">{t.course}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fă Primul Pas Spre O Viață Mai Bună
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Verifică eligibilitatea în mai puțin de 2 minute. Gratuit și fără obligații.
          </p>
          <Link to="/eligibilitate">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-3 gap-2">
              Începe Acum — Este Gratuit <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default RoLanding;
