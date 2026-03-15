import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, Play, Users, PoundSterling, GraduationCap } from 'lucide-react';

const videoTestimonials = [
  {
    name: 'Silviu Stefan Haba',
    course: 'Business & Tourism',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'EduForYou mi-a schimbat complet traiectoria profesională.',
  },
  {
    name: 'David Munteanu',
    course: 'Global Business',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Am reușit să îmi schimb complet viața financiară.',
  },
  {
    name: 'Ana Ignat',
    course: 'Business Management',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'O experiență transformatoare pe care o recomand tuturor.',
  },
  {
    name: 'Mihai Stanciu',
    course: 'Computing',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'De la un job fără perspectivă la o carieră în IT.',
  },
];

const writtenTestimonials = [
  {
    name: 'Elena Voicu',
    course: 'Psychology & Counselling',
    funding: '£9,535/an',
    stars: 5,
    text: 'Am visat mereu să studiez psihologie dar nu îmi permiteam. Prin EduForYou am descoperit că pot studia gratuit și acum sunt în anul 2. Cel mai bun lucru pe care l-am făcut!',
  },
  {
    name: 'Cristian Barbu',
    course: 'Accounting & Finance',
    funding: '£9,535/an',
    stars: 5,
    text: 'Echipa EduForYou m-a ghidat prin tot procesul. De la aplicare la finanțare, totul a fost simplu și transparent. Recomand cu încredere!',
  },
  {
    name: 'Alina Dobre',
    course: 'Health & Social Care',
    funding: '£6,355/an',
    stars: 5,
    text: 'Nu credeam că este posibil să studiezi gratuit la universitate în UK. EduForYou mi-a demonstrat contrariul. Sunt recunoscătoare!',
  },
  {
    name: 'Florin Iancu',
    course: 'HND Cyber Security',
    funding: '£6,355/an',
    stars: 4,
    text: 'Procesul a fost rapid și eficient. Am primit suport la fiecare pas și acum lucrez în cyber security cu un salariu mult mai bun.',
  },
  {
    name: 'Roxana Popa',
    course: 'Global Business Management',
    funding: '£9,535/an',
    stars: 5,
    text: 'Sunt în anul 3 și pot spune cu mână pe inimă că a fost cea mai bună decizie din viața mea. EduForYou face educația accesibilă.',
  },
  {
    name: 'Bogdan Enescu',
    course: 'Computing',
    funding: '£9,535/an',
    stars: 5,
    text: 'De la curier la student în Computing la Londra. Povestea mea pare un film dar este cât se poate de reală. Mulțumesc EduForYou!',
  },
];

const stats = [
  { icon: Users, value: '7,000+', label: 'Studenți Înscriși' },
  { icon: PoundSterling, value: '£138M+', label: 'Finanțare Securizată' },
  { icon: Star, value: '4.9/5', label: 'Rating Mediu' },
  { icon: GraduationCap, value: '94%', label: 'Rată de Succes' },
];

const TestimonialsHub = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Star className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ce Spun <span className="text-orange-400">Studenții</span> Noștri
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Peste 7,000 de studenți și-au transformat viața prin EduForYou. Citește și privește
            poveștile lor de succes.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <s.icon className="w-6 h-6 mb-1" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-orange-100 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Testimoniale Video
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTestimonials.map((v, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtubeId}`}
                    title={`Testimonial ${v.name}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900">{v.name}</h3>
                  <p className="text-orange-600 text-sm">{v.course}</p>
                  <p className="text-gray-600 text-sm mt-2 italic">"{v.quote}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Written Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Testimoniale Scrise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writtenTestimonials.map((t, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${j < t.stars ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-orange-200 mb-2" />
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{t.text}</p>
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-orange-600 text-xs">{t.course}</p>
                  <p className="text-gray-400 text-xs">Finanțare: {t.funding}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Scrie-ți Propria Poveste de Succes</h2>
          <p className="text-orange-100 text-lg mb-8">
            Verifică eligibilitatea și fă primul pas spre studii universitare gratuite în UK.
          </p>
          <Link to="/eligibilitate">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-lg px-8 py-3 gap-2">
              Verifică Eligibilitatea <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsHub;
