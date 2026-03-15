import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Star,
  Shield,
  Zap,
  Lock,
  Target,
  PoundSterling,
  Award,
  Quote,
} from 'lucide-react';

const chapters = [
  'Secretele aplicării la Student Finance England',
  'Cum să alegi universitatea perfectă pentru tine',
  'Strategii de finanțare pe care nimeni nu ți le spune',
  'Ghid complet de pregătire a documentelor',
  'Cum să obții împrumutul de întreținere maxim',
  'Trucuri pentru interviul de admitere',
  'Planificare financiară pe durata studiilor',
  'De la absolvire la carieră — pașii esențiali',
];

const bonuses = [
  { title: 'Template Pack', desc: 'Scrisori de intenție, CV-uri și formulare pre-completate', value: '£47' },
  { title: 'Checklist Master', desc: 'Checklist-uri pentru fiecare etapă a procesului', value: '£27' },
  { title: 'Video Training', desc: 'Acces la 5 module video exclusive', value: '£97' },
  { title: 'Comunitate VIP', desc: 'Acces pe viață la grupul privat de studenți', value: '£67' },
];

const testimonials = [
  {
    name: 'Maria V.',
    text: 'Blackbook-ul mi-a salvat luni de cercetare. Totul este explicat clar și concis. Am aplicat cu succes la universitate în mai puțin de 2 săptămâni.',
    stars: 5,
  },
  {
    name: 'Andrei P.',
    text: 'Cel mai bun ghid pe care l-am citit despre studii în UK. Informațiile sunt practice, nu teorie goală. Merită fiecare penny.',
    stars: 5,
  },
  {
    name: 'Cristina D.',
    text: 'Am fost sceptică inițial, dar bonusurile singure valorează mai mult decât prețul. Template-urile mi-au economisit ore întregi.',
    stars: 5,
  },
];

const BlackbookSales = () => {
  const totalBonusValue = bonuses.reduce((sum, b) => sum + parseInt(b.value.replace('£', '')), 0);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">Acces Exclusiv — Ediție Limitată</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold mb-6">
            The <span className="text-orange-400">Blackbook</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Secretele Pe Care Nimeni Nu Ți Le Spune Despre Studii Gratuite în UK
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Un ghid premium care îți dezvăluie strategiile avansate, trucurile și secretele
            pe care le folosesc cei care obțin finanțare integrală din prima încercare.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />
              ))}
            </div>
            <span className="text-gray-400">4.9/5 de la 300+ cumpărători</span>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fără Blackbook...</h2>
              <div className="space-y-3">
                {[
                  'Petreci săptămâni căutând informații pe internet',
                  'Riști să ratezi deadline-uri importante',
                  'Nu știi ce documente trebuie pregătite',
                  'Aplici fără strategie și speri la noroc',
                  'Pierzi oportunitatea de finanțare maximă',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cu Blackbook...</h2>
              <div className="space-y-3">
                {[
                  'Ai totul într-un singur loc, clar și organizat',
                  'Urmezi un plan pas cu pas dovedit',
                  'Template-uri gata de folosit',
                  'Strategii avansate pentru finanțare maximă',
                  'Suport din comunitatea VIP',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce Conține Blackbook-ul
          </h2>
          <div className="space-y-3">
            {chapters.map((ch, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-gray-700 font-medium">{ch}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Bonusuri Incluse <span className="text-orange-500">(Valoare: £{totalBonusValue})</span>
          </h2>
          <p className="text-gray-500 text-center mb-12">Primești gratuit alături de Blackbook</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bonuses.map((b, i) => (
              <Card key={i} className="p-5 border-2 border-orange-100">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{b.title}</h3>
                  <span className="text-orange-600 font-bold text-sm">{b.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce Spun Cumpărătorii
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-orange-200 mb-2" />
                <p className="text-gray-600 text-sm mb-4">{t.text}</p>
                <p className="font-bold text-gray-900 text-sm">— {t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <Award className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Obține Blackbook-ul Acum</h2>
          <Card className="p-8 bg-gray-800 border-gray-700 mb-6">
            <div className="text-gray-400 line-through text-lg mb-1">£97</div>
            <div className="text-5xl font-bold text-orange-400 mb-2">£27</div>
            <p className="text-gray-400 text-sm mb-6">Ofertă limitată — preț special de lansare</p>
            <div className="space-y-2 text-sm text-gray-300 mb-6">
              {['Blackbook complet (8 capitole)', `Bonusuri în valoare de £${totalBonusValue}`, 'Actualizări gratuite pe viață', 'Garanție 30 de zile'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/ebook">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3 gap-2">
                <Zap className="w-5 h-5" /> Cumpără Acum — £27
              </Button>
            </Link>
          </Card>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>Garanție de rambursare 30 de zile — fără riscuri</span>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlackbookSales;
