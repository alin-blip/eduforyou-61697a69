import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Linkedin, Mail, Users } from 'lucide-react';

const teamMembers = [
  {
    name: 'Andrei Popescu',
    role: 'CEO & Fondator',
    bio: 'Cu peste 10 ani de experiență în educația internațională, Andrei a fondat EduForYou cu misiunea de a face educația universitară accesibilă tuturor românilor din UK.',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    name: 'Maria Ionescu',
    role: 'Director Operațiuni',
    bio: 'Maria coordonează toate procesele operaționale, asigurându-se că fiecare student primește suportul necesar de la aplicare până la absolvire.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Cristian Dumitrescu',
    role: 'Director Parteneriate Universitare',
    bio: 'Cristian dezvoltă și menține relațiile cu universitățile partenere din UK, negociind cele mai bune condiții pentru studenții noștri.',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    name: 'Elena Dragomir',
    role: 'Consilier Educațional Senior',
    bio: 'Cu experiență în consilierea a peste 500 de studenți, Elena ghidează fiecare candidat prin procesul de aplicare și finanțare.',
    gradient: 'from-red-400 to-orange-500',
  },
  {
    name: 'Alexandru Munteanu',
    role: 'Manager Marketing Digital',
    bio: 'Alexandru dezvoltă strategiile de marketing care conectează EduForYou cu comunitatea românească din UK și dincolo de granițe.',
    gradient: 'from-amber-500 to-red-400',
  },
  {
    name: 'Diana Constantinescu',
    role: 'Specialist Finanțare Studențească',
    bio: 'Diana este expertul nostru în Student Finance England, ajutând studenții să navigheze procesul de aplicare pentru finanțare.',
    gradient: 'from-orange-600 to-amber-500',
  },
  {
    name: 'Mihai Georgescu',
    role: 'Manager Rețea Agenți',
    bio: 'Mihai coordonează rețeaua de agenți EduForYou din întreaga Anglie, oferind training și suport continuu.',
    gradient: 'from-red-500 to-orange-600',
  },
  {
    name: 'Ioana Stanciu',
    role: 'Specialist Suport Studenți',
    bio: 'Ioana asigură că fiecare student are o experiență pozitivă, oferind suport continuu pe parcursul studiilor.',
    gradient: 'from-amber-400 to-red-400',
  },
];

const Team = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Echipa Noastră</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Suntem o echipă dedicată de profesioniști pasionați de educație, uniți de
            misiunea de a transforma vieți prin acces la studii universitare gratuite în UK.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Photo placeholder */}
                <div
                  className={`h-48 bg-gradient-to-br ${member.gradient} flex items-center justify-center`}
                >
                  <span className="text-5xl font-bold text-white/80">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-orange-600 font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      aria-label={`LinkedIn ${member.name}`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Valorile Noastre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Transparență',
                desc: 'Comunicăm deschis și onest cu fiecare student și partener.',
              },
              {
                title: 'Dedicare',
                desc: 'Fiecare student merită atenție individuală și suport complet.',
              },
              {
                title: 'Excelență',
                desc: 'Ridicăm constant standardul serviciilor noastre educaționale.',
              },
            ].map((val, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold text-orange-600 mb-2">{val.title}</h3>
                <p className="text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
