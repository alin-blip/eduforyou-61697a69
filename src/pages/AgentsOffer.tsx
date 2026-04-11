import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  PoundSterling,
  Trophy,
  Users,
  Star,
  TrendingUp,
  Plane,
  Car,
  Building2,
  Gift,
  Clock,
  Shield,
  BarChart3,
  Megaphone,
  GraduationCap,
  Handshake,
  Zap,
} from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    commission: '£500',
    desc: 'Per student înscris',
    features: [
      'Comision garantat la fiecare înrolare',
      'Training introductiv complet',
      'Materiale de marketing de bază',
      'Suport prin email și chat',
    ],
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
    highlight: false,
  },
  {
    name: 'Pro',
    commission: '£750',
    desc: 'Per student înscris',
    features: [
      'Comision crescut cu 50%',
      'Training avansat și mentorat',
      'Landing page personalizat',
      'Suport prioritar dedicat',
      'Acces la baza de date de leaduri',
    ],
    gradient: 'from-[#D4AF37] to-[#C6A248]',
    highlight: true,
  },
  {
    name: 'Elite',
    commission: '£1,000',
    desc: 'Per student înscris',
    features: [
      'Cel mai mare comision disponibil',
      'Manager de cont personal',
      'Brand co-marketing',
      'Invitații la evenimente exclusive',
      'Suport dedicat 24/7',
      'Primul acces la programe noi',
    ],
    gradient: 'from-[#C6A248] to-[#0A1628]',
    highlight: false,
  },
];

const milestones = [
  {
    icon: Plane,
    students: '25 studenți',
    reward: 'Vacanță în Dubai',
    desc: 'All-inclusive, 5 zile în Dubai pentru tine și un însoțitor. Zbor, cazare și activități incluse.',
    gradient: 'from-[#D4AF37] to-[#EAC67E]',
  },
  {
    icon: Car,
    students: '100 studenți',
    reward: 'BMW Seria 3',
    desc: 'Un BMW Seria 3 nou-nouț, sau echivalentul în cash. Tu alegi.',
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
  {
    icon: Building2,
    students: '200 studenți',
    reward: 'Oportunitate de Franciză',
    desc: 'Deschide-ți propria franciză EduForYou. Devino partener și construiește-ți afacerea.',
    gradient: 'from-[#C6A248] to-[#0A1628]',
  },
];

const benefitsGrid = [
  { icon: PoundSterling, title: 'Comisioane Generoase', desc: 'Câștigă între £500 și £1,000 pentru fiecare student înrolat cu succes.' },
  { icon: GraduationCap, title: 'Training Complet', desc: 'Primești training profesional despre universități, finanțare și vânzări.' },
  { icon: Megaphone, title: 'Marketing Support', desc: 'Materiale de marketing, landing pages și suport social media.' },
  { icon: BarChart3, title: 'Dashboard Personal', desc: 'Urmărește-ți performanța, comisioanele și leadurile în timp real.' },
  { icon: Handshake, title: 'Comunitate de Agenți', desc: 'Fă parte dintr-o comunitate de agenți de succes care se ajută reciproc.' },
  { icon: Shield, title: 'Brand de Încredere', desc: 'Reprezintă un brand cu 7,000+ studenți înrolați și £138M finanțare.' },
  { icon: Clock, title: 'Flexibilitate Totală', desc: 'Lucrează când vrei, de unde vrei. Part-time sau full-time.' },
  { icon: Zap, title: 'Plată Rapidă', desc: 'Comisioanele sunt procesate rapid după confirmarea înrolării.' },
];

const AgentsOffer = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#EAC67E] text-sm font-medium">Recrutăm Agenți — Locuri Limitate</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Devino Agent <span className="text-[#D4AF37]">EduForYou</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-4">
            Câștigă comisioane de până la <strong className="text-white">£1,000 per student</strong> ajutând
            românii din UK să acceseze studii universitare gratuite.
          </p>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-8">
            Fără investiție inițială. Fără risc. Training complet oferit de noi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register?source=agents">
              <Button className="bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg px-8 py-3 gap-2">
                Înscrie-te Ca Agent <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/webinar/agents">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold text-lg px-8 py-3">
                Participă la Webinar Gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-[#D4AF37] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Agenți Activi' },
              { value: '£2M+', label: 'Comisioane Plătite' },
              { value: '£1,000', label: 'Comision Maxim/Student' },
              { value: '100%', label: 'Rată de Plată' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-[#EAC67E] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Nivele de Comision
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Cu cât înrolezi mai mulți studenți, cu atât comisionul tău crește. Avansezi automat pe măsură ce performezi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <Card
                key={i}
                className={`overflow-hidden transition-shadow hover:shadow-xl ${
                  tier.highlight ? 'ring-2 ring-[#D4AF37] shadow-lg scale-105' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${tier.gradient} p-6 text-white text-center`}>
                  {tier.highlight && (
                    <div className="text-xs font-bold uppercase tracking-wider mb-2 bg-white/20 rounded-full px-3 py-1 inline-block">
                      Cel Mai Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <div className="text-4xl font-bold my-2">{tier.commission}</div>
                  <p className="text-white/80 text-sm">{tier.desc}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/register?source=agents">
                    <Button
                      className={`w-full mt-6 font-semibold ${
                        tier.highlight
                          ? 'bg-[#D4AF37] hover:bg-[#C6A248] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      Începe Acum
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Bonuses */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bonusuri de Milestone
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Pe lângă comisioane, te premiăm cu bonusuri spectaculoase la fiecare milestone atins.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <Card key={i} className="overflow-hidden text-center hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-br ${m.gradient} p-8`}>
                  <m.icon className="w-16 h-16 text-white mx-auto mb-4" />
                  <div className="text-white/80 text-sm font-medium">{m.students}</div>
                  <h3 className="text-2xl font-bold text-white mt-1">{m.reward}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{m.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            De Ce Să Devii Agent EduForYou?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitsGrid.map((b, i) => (
              <Card key={i} className="p-5 hover:shadow-md transition-shadow">
                <b.icon className="w-8 h-8 text-[#D4AF37] mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cum Funcționează?</h2>
          <div className="space-y-6">
            {[
              { step: '1', title: 'Înscrie-te gratuit', desc: 'Creează-ți contul de agent în mai puțin de 5 minute.' },
              { step: '2', title: 'Primești training', desc: 'Parcurgi programul de training și primești materialele de marketing.' },
              { step: '3', title: 'Referi studenți', desc: 'Conectezi potențiali studenți cu EduForYou folosind link-ul tău unic.' },
              { step: '4', title: 'Câștigi comision', desc: 'Primești comisionul imediat ce studentul este înscris cu succes.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#D4AF37] to-[#C6A248] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Gift className="w-12 h-12 mx-auto mb-4 text-[#EAC67E]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Începe Să Câștigi Astăzi
          </h2>
          <p className="text-[#EAC67E] text-lg mb-8">
            Alătură-te celor peste 500 de agenți care câștigă comisioane ajutând românii să acceseze educație gratuită în UK.
          </p>
          <Link to="/auth/register?source=agents">
            <Button className="bg-white text-[#C6A248] hover:bg-[#D4AF37]/10 font-semibold text-lg px-8 py-3 gap-2">
              Înscrie-te Ca Agent <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AgentsOffer;
