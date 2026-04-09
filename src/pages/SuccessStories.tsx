import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, GraduationCap } from 'lucide-react';

const stories = [
  {
    name: 'Silviu Stefan Haba',
    course: 'Business & Tourism Management',
    university: 'Global Banking School',
    before: 'Lucra ca ospătar într-un restaurant din Londra, fără perspective de avansare.',
    after: 'Acum este Business Development Manager la o companie de turism internațională, cu un salariu de £42,000/an.',
    quote: 'EduForYou mi-a deschis uși pe care nici nu știam că existau. Investiția în educație a fost cea mai bună decizie din viața mea.',
    funding: '£18,397/an',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    name: 'David Munteanu',
    course: 'Global Business Management',
    university: 'QA Higher Education',
    before: 'Lucra în construcții, 12 ore pe zi, cu un salariu de £1,800/lună.',
    after: 'Manager de proiect la o firmă de consultanță, câștigând £38,000/an cu program flexibil.',
    quote: 'Nu credeam că pot schimba ceva la 28 de ani. EduForYou mi-a demonstrat că niciodată nu e prea târziu.',
    funding: '£13,000/an',
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
  },
  {
    name: 'Ana Ignat',
    course: 'Business Management',
    university: 'Global Banking School — Manchester',
    before: 'Casieră la supermarket, câștigând minimum wage, fără calificări recunoscute.',
    after: 'Coordonatoare marketing pentru o agenție din Manchester, cu un salariu de £35,000/an.',
    quote: 'Povestea mea cu EduForYou este una de curaj. Am făcut un pas care mi-a schimbat viața complet.',
    funding: '£9,700/an',
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
  {
    name: 'Mihai Radu',
    course: 'Computing (BSc)',
    university: 'Regent College London',
    before: 'Lucrător într-un depozit Amazon, cu ture de noapte și fără satisfacție profesională.',
    after: 'Junior Software Developer la o companie tech din Londra, cu un salariu de £45,000/an.',
    quote: 'De la cutii în depozit la cod pe ecran. EduForYou m-a ajutat să îmi urmez pasiunea.',
    funding: '£9,535/an',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    name: 'Ioana Dumitrescu',
    course: 'Psychology & Counselling',
    university: 'Global Banking School — Birmingham',
    before: 'Îngrijitoare la domiciliu, cu salariu minim și program imprevizibil.',
    after: 'Consilier psihologic într-o clinică privată, câștigând £34,000/an.',
    quote: 'Am visat să ajut oamenii toată viața. Acum o fac profesional, datorită EduForYou.',
    funding: '£9,535/an',
    gradient: 'from-[#C6A248] to-[#0A1628]',
  },
  {
    name: 'Alexandru Neagu',
    course: 'Accounting & Finance',
    university: 'London Metropolitan University',
    before: 'Șofer Uber, lucrând 60+ ore pe săptămână pentru a-și întreține familia.',
    after: 'Contabil la o firmă Big Four, cu salariu de £40,000/an și beneficii complete.',
    quote: 'Contabilitatea era pasiunea mea ascunsă. EduForYou mi-a dat curajul să o transform în carieră.',
    funding: '£9,250/an',
    gradient: 'from-[#EAC67E] to-[#C6A248]',
  },
];

const SuccessStories = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <TrendingUp className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Povești de <span className="text-[#D4AF37]">Succes</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descoperă cum studenții EduForYou și-au transformat complet viața profesională
            prin studii universitare gratuite în UK.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">
          {stories.map((story, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-r ${story.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {story.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{story.name}</h3>
                    <p className="text-white/80 text-sm">{story.course} — {story.university}</p>
                    <p className="text-white/60 text-xs">Finanțare: {story.funding}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                      Înainte
                    </div>
                    <p className="text-gray-600 text-sm">{story.before}</p>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">
                      După
                    </div>
                    <p className="text-gray-600 text-sm">{story.after}</p>
                  </div>
                </div>
                <div className="bg-[#D4AF37]/10 rounded-lg p-4 border-l-4 border-[#D4AF37]">
                  <p className="text-gray-700 text-sm italic">"{story.quote}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#D4AF37] to-[#C6A248] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[#EAC67E]" />
          <h2 className="text-3xl font-bold mb-4">Următoarea Poveste de Succes Poate Fi a Ta</h2>
          <p className="text-[#EAC67E] text-lg mb-8">
            Verifică eligibilitatea acum și fă primul pas spre o carieră mai bună.
          </p>
          <Link to="/eligibilitate">
            <Button className="bg-white text-[#C6A248] hover:bg-[#D4AF37]/10 font-semibold text-lg px-8 py-3 gap-2">
              Verifică Eligibilitatea <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default SuccessStories;
