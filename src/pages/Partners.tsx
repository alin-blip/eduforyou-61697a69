import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, BookOpen, GraduationCap } from 'lucide-react';

const universities = [
  {
    name: 'Global Banking School',
    location: 'London, Birmingham, Manchester, Leeds',
    programs: ['Business Management', 'Computing', 'Healthcare', 'Accounting & Finance'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'QA Higher Education',
    location: 'London, Birmingham, Manchester',
    programs: ['Digital Technology', 'Cyber Security', 'Data Analytics', 'Cloud Computing'],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Regent College London',
    location: 'London (Wembley)',
    programs: ['Business & Management', 'Health & Social Care', 'Computing', 'Tourism'],
    gradient: 'from-red-500 to-rose-500',
  },
  {
    name: 'Solent University',
    location: 'Southampton',
    programs: ['Engineering', 'Business', 'Media', 'Sport Science'],
    gradient: 'from-orange-600 to-amber-500',
  },
  {
    name: 'London Metropolitan University',
    location: 'London',
    programs: ['Architecture', 'Computing', 'Business', 'Law'],
    gradient: 'from-red-400 to-orange-500',
  },
  {
    name: 'Northumbria University',
    location: 'Newcastle, London',
    programs: ['Business', 'Engineering', 'Health Sciences', 'Design'],
    gradient: 'from-amber-400 to-red-400',
  },
  {
    name: 'Ulster University',
    location: 'Belfast, Birmingham, London',
    programs: ['Business', 'Computing', 'Engineering', 'Health'],
    gradient: 'from-orange-400 to-amber-600',
  },
  {
    name: 'University of Bolton',
    location: 'Bolton, Manchester',
    programs: ['Engineering', 'Business', 'Creative Technologies', 'Health'],
    gradient: 'from-red-500 to-orange-600',
  },
  {
    name: 'LSST (London School of Science & Technology)',
    location: 'London, Birmingham',
    programs: ['Business Management', 'Health & Social Care', 'Computing', 'Accounting'],
    gradient: 'from-amber-500 to-red-500',
  },
  {
    name: 'University of Bedfordshire',
    location: 'Luton, Bedford, London',
    programs: ['Business', 'Computing', 'Media', 'Psychology'],
    gradient: 'from-orange-500 to-rose-400',
  },
];

const Partners = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <GraduationCap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Universitățile Noastre Partenere
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Colaborăm cu universități de top din UK pentru a-ți oferi acces la programe
            acreditate, finanțate integral prin Student Finance England.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-orange-50 border-b border-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10+', label: 'Universități Partenere' },
              { value: '50+', label: 'Programe Disponibile' },
              { value: '15+', label: 'Campusuri în UK' },
              { value: '7,000+', label: 'Studenți Înscriși' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Logo Placeholder */}
                <div
                  className={`h-32 bg-gradient-to-br ${uni.gradient} flex items-center justify-center`}
                >
                  <span className="text-3xl font-bold text-white/90">
                    {uni.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{uni.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{uni.location}</span>
                  </div>
                  <div className="space-y-1.5">
                    {uni.programs.map((prog, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span>{prog}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Găsește Programul Potrivit Pentru Tine</h2>
          <p className="text-orange-100 text-lg mb-8">
            Verifică eligibilitatea și descoperă ce programe sunt disponibile pentru tine — totul gratuit.
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

export default Partners;
