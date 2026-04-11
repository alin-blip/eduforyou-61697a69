import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, TrendingUp, Users, PoundSterling } from 'lucide-react';

const testimonials = [
  {
    name: 'Marius Popescu',
    location: 'London',
    earnings: '£45,000+',
    period: 'în 12 luni',
    students: 62,
    quote:
      'Am început ca agent EduForYou în timp ce lucram full-time. După 6 luni, câștigam mai mult din comisioane decât din jobul meu. Acum sunt agent full-time și ajut zeci de studenți în fiecare lună.',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    name: 'Andreea Vasile',
    location: 'Birmingham',
    earnings: '£32,000+',
    period: 'în 8 luni',
    students: 44,
    quote:
      'Ca mamă singură, aveam nevoie de flexibilitate. EduForYou mi-a oferit exact asta. Lucrez de acasă, la orele mele, și câștig mai bine decât orice job anterior.',
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
  },
  {
    name: 'Bogdan Ilie',
    location: 'Manchester',
    earnings: '£78,000+',
    period: 'în 18 luni',
    students: 105,
    quote:
      'Am atins milestone-ul de 100 de studenți și am primit BMW-ul promis! Echipa EduForYou este incredibilă și suportul pe care îl oferă face toată diferența.',
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
  {
    name: 'Cristina Dinu',
    location: 'Leeds',
    earnings: '£28,000+',
    period: 'în 10 luni',
    students: 38,
    quote:
      'Am pornit sceptică, dar rezultatele vorbesc de la sine. Training-ul a fost excelent și comisioanele sunt exacte — fără întârzieri, fără surprize.',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    name: 'Adrian Moldovan',
    location: 'London',
    earnings: '£55,000+',
    period: 'în 14 luni',
    students: 72,
    quote:
      'Am câștigat vacanța în Dubai după doar 25 de studenți. Acum lucrez spre milestone-ul de 100 și sunt convins că voi ajunge acolo anul acesta.',
    gradient: 'from-[#C6A248] to-[#0A1628]',
  },
  {
    name: 'Simona Petrescu',
    location: 'Newcastle',
    earnings: '£19,500+',
    period: 'în 6 luni',
    students: 26,
    quote:
      'Am început part-time, doar câteva ore pe săptămână. Chiar și așa, rezultatele sunt impresionante. Recomand oricui vrea un venit extra serios.',
    gradient: 'from-[#EAC67E] to-[#C6A248]',
  },
];

const stats = [
  { icon: PoundSterling, value: '£2M+', label: 'Comisioane Plătite Total' },
  { icon: Users, value: '500+', label: 'Agenți în Rețea' },
  { icon: TrendingUp, value: '£4,200', label: 'Câștig Mediu Lunar (Top Agenți)' },
  { icon: Star, value: '4.9/5', label: 'Satisfacție Agenți' },
];

const AgentsSuccess = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Star className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Povești de Succes ale <span className="text-[#D4AF37]">Agenților</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descoperă cum agenții EduForYou și-au transformat viața financiară ajutând alți
            români să acceseze educație universitară gratuită în UK.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[#D4AF37]/10 border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="w-6 h-6 text-[#D4AF37] mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-br ${t.gradient} p-5 text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold">{t.name}</h3>
                      <p className="text-white/80 text-sm">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-xl font-bold">{t.earnings}</div>
                      <div className="text-white/70 text-xs">{t.period}</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{t.students}</div>
                      <div className="text-white/70 text-xs">studenți</div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <Quote className="w-6 h-6 text-[#EAC67E] mb-2" />
                  <p className="text-gray-600 text-sm leading-relaxed">{t.quote}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#D4AF37] to-[#C6A248] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Scrie-ți Propria Poveste de Succes
          </h2>
          <p className="text-[#EAC67E] text-lg mb-8">
            Alătură-te rețelei de agenți EduForYou și începe să câștigi comisioane generoase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register?source=agents">
              <Button className="bg-white text-[#C6A248] hover:bg-[#D4AF37]/10 font-semibold text-lg px-8 py-3 gap-2">
                Devino Agent <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/agents-offer">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 font-semibold text-lg px-8 py-3">
                Vezi Oferta Completă
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AgentsSuccess;
