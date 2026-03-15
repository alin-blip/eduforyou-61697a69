import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  PoundSterling,
  CheckCircle2,
  ArrowRight,
  FileText,
  Users,
  Shield,
  HelpCircle,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const steps = [
  {
    icon: FileText,
    title: 'Aplică',
    description:
      'Completezi formularul de eligibilitate și te ghidăm prin procesul de aplicare la Student Finance England.',
  },
  {
    icon: PoundSterling,
    title: 'Obții Finanțarea',
    description:
      'SFE acoperă integral taxele universitare. Nu plătești nimic din buzunar — totul este finanțat de guvernul britanic.',
  },
  {
    icon: GraduationCap,
    title: 'Studiezi',
    description:
      'Urmezi cursurile la una dintre universitățile noastre partenere din UK, cu suport complet din partea echipei EduForYou.',
  },
  {
    icon: Shield,
    title: 'Rambursezi doar dacă câștigi peste £25k',
    description:
      'După finalizarea studiilor, rambursarea începe doar când venitul tău anual depășește £25,000. Ratele sunt mici și proporționale cu salariul tău.',
  },
];

const benefits = [
  'Taxe universitare 100% acoperite de Student Finance England',
  'Acces la împrumut de întreținere pentru cheltuieli de trai',
  'Rambursare flexibilă – doar dacă câștigi peste £25,000/an',
  'Sold-ul rămas se șterge după 40 de ani',
  'Rata lunară mică – 9% din venitul peste £25k',
  'Disponibil pentru cetățeni UE cu statut settled/pre-settled',
  'Nu afectează scorul de credit',
  'Diplome recunoscute internațional',
];

const faqs = [
  {
    question: 'Cine poate accesa finanțarea SFE?',
    answer:
      'Cetățenii UE (inclusiv români) cu statut settled sau pre-settled în UK, care locuiesc în Anglia de cel puțin 3 ani, pot aplica pentru Student Finance England.',
  },
  {
    question: 'Cât acoperă finanțarea?',
    answer:
      'Student Finance England acoperă integral taxele universitare (până la £9,250/an) și oferă un împrumut de întreținere pentru cheltuieli de trai, în funcție de venitul gospodăriei.',
  },
  {
    question: 'Când încep să rambursez?',
    answer:
      'Rambursarea începe doar în aprilie după finalizarea studiilor, și numai dacă câștigi peste £25,000 pe an. Dacă venitul tău scade sub acest prag, plățile se opresc automat.',
  },
  {
    question: 'Este un grant sau un împrumut?',
    answer:
      'Este un împrumut studențesc cu condiții foarte avantajoase. Nu trebuie să plătești nimic înainte sau în timpul studiilor, iar dacă nu atingi pragul salarial, nu rambursezi niciodată.',
  },
  {
    question: 'Ce se întâmplă dacă nu termin studiile?',
    answer:
      'Împrumutul rămâne activ, dar condițiile de rambursare sunt aceleași – plătești doar dacă câștigi peste £25k. Recomandăm însă finalizarea studiilor pentru a beneficia de diplomă.',
  },
  {
    question: 'Pot lucra în timp ce studiez?',
    answer:
      'Da, poți lucra part-time (de obicei până la 20h/săptămână) în timpul semestrului și full-time în vacanțe.',
  },
];

const WhyFree = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            De Ce Studiile Sunt Gratuite?
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Prin Student Finance England, guvernul britanic finanțează integral taxele
            universitare. Nu plătești nimic din buzunar — rambursezi doar după ce câștigi
            peste £25,000 pe an.
          </p>
          <Link to="/eligibilitate">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6">
              Verifică Eligibilitatea
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Cum Funcționează?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Procesul este simplu și transparent. Iată pașii prin care treci pentru a
            studia gratuit în UK.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <Card key={i} className="p-6 text-center border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-sm font-semibold text-orange-500 mb-2">Pasul {i + 1}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Beneficiile Finanțării SFE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm"
              >
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <HelpCircle className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Întrebări Frecvente
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold text-gray-800">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ești Eligibil? Verifică Acum!
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Completează formularul de eligibilitate și află în câteva minute dacă poți
            studia gratuit în Regatul Unit.
          </p>
          <Link to="/eligibilitate">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
              Verifică Eligibilitatea Acum
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default WhyFree;
