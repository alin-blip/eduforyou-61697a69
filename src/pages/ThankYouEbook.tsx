import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Users,
  MessageSquare,
} from 'lucide-react';

const nextSteps = [
  {
    icon: Download,
    title: 'Descarcă Ebook-ul',
    desc: 'Apasă butonul de mai jos pentru a descărca ghidul în format PDF.',
  },
  {
    icon: BookOpen,
    title: 'Citește Ghidul',
    desc: 'Parcurge ghidul și notează întrebările pe care le ai.',
  },
  {
    icon: CalendarCheck,
    title: 'Programează o Consultație',
    desc: 'Rezervă o consultație gratuită cu un consilier EduForYou.',
  },
  {
    icon: Users,
    title: 'Alătură-te Comunității',
    desc: 'Intră în grupul nostru de Facebook pentru suport și informații.',
  },
];

const ThankYouEbook = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <CheckCircle2 className="w-20 h-20 text-green-200 mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Mulțumim pentru Achiziție!</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto mb-8">
            Ebook-ul tău este pregătit pentru descărcare. Verifică și email-ul pentru linkul de descărcare.
          </p>
          <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold text-lg px-8 py-3 gap-2">
            <Download className="w-5 h-5" /> Descarcă Ebook-ul (PDF)
          </Button>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pașii Următori
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nextSteps.map((step, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-orange-500 mb-1">Pasul {i + 1}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <MessageSquare className="w-10 h-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ai Întrebări?</h2>
          <p className="text-gray-600 mb-8">
            Echipa noastră este aici să te ajute. Programează o consultație gratuită sau contactează-ne direct.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-appointment">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 gap-2">
                Programează Consultație <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-6 py-3">
                Contactează-ne
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ThankYouEbook;
