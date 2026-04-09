import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, Calendar, Users, GraduationCap, Briefcase, Lightbulb } from 'lucide-react';

const webinars = [
  {
    title: 'Webinar Universitar — Cum Să Studiezi Gratuit în UK',
    description:
      'Descoperă cum poți accesa studii universitare gratuite prin Student Finance England. Prezentăm universitățile partenere, programele disponibile și procesul complet de aplicare.',
    icon: GraduationCap,
    link: '/webinar/university',
    schedule: 'În fiecare miercuri, ora 19:00',
    spots: '50 locuri',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
    tag: 'Pentru Studenți',
  },
  {
    title: 'Webinar Agenți — Devino Agent EduForYou',
    description:
      'Află cum poți câștiga comisioane de până la £1,000 per student ajutând românii din UK să acceseze educație universitară. Prezentăm modelul de business, comisioanele și bonusurile.',
    icon: Briefcase,
    link: '/webinar/agents',
    schedule: 'Prima luni din fiecare lună, ora 20:00',
    spots: '30 locuri',
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
    tag: 'Pentru Agenți',
  },
  {
    title: 'Webinar Ikigai — Descoperă-ți Vocația',
    description:
      'Un workshop interactiv bazat pe metoda japoneză Ikigai care te ajută să descoperi ce îți place, la ce ești bun, ce are nevoie lumea și pentru ce poți fi plătit.',
    icon: Lightbulb,
    link: '/webinar/ikigai',
    schedule: 'Acces limitat — vezi countdown',
    spots: '20 locuri',
    gradient: 'from-[#C6A248] to-[#0A1628]',
    tag: 'Workshop',
  },
];

const WebinarList = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Play className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Webinarii Gratuite</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Participă la webinariile noastre gratuite și află totul despre studii universitare
            gratuite în UK, oportunități de carieră și dezvoltare personală.
          </p>
        </div>
      </section>

      {/* Webinar Cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webinars.map((w, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <div className={`bg-gradient-to-br ${w.gradient} p-8 text-white text-center`}>
                  <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                    {w.tag}
                  </div>
                  <w.icon className="w-14 h-14 mx-auto mb-3 text-white" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{w.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{w.description}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span>{w.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      <span>{w.spots}</span>
                    </div>
                  </div>
                  <Link to={w.link}>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold">
                      Înscrie-te Gratuit
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebinarList;
