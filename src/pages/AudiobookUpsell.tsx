import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Clock,
  Gift,
  Zap,
  Volume2,
} from 'lucide-react';

const features = [
  'Narrat profesional în limba română',
  'Peste 3 ore de conținut audio',
  'Ascultă oriunde — la drum, la sală, acasă',
  'Acces instant și descărcare offline',
  'Toate capitolele din ebook + bonus exclusiv',
  'Actualizări gratuite incluse',
];

const AudiobookUpsell = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <Gift className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Ofertă Specială — Doar Acum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Adaugă <span className="text-orange-400">Audiobook-ul</span> la Comanda Ta
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Ai obținut ebook-ul — acum primește și versiunea audio la un preț special disponibil
            doar în acest moment.
          </p>

          {/* Price card */}
          <Card className="max-w-md mx-auto p-8 bg-gray-800 border-gray-700 text-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Audiobook</h3>
                <p className="text-gray-400 text-sm">Ghidul Complet — Versiunea Audio</p>
              </div>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-orange-400">£7.99</span>
              <span className="text-gray-500 line-through text-lg">£19.99</span>
              <span className="bg-red-500/20 text-red-400 text-xs font-bold rounded-full px-2 py-0.5">-60%</span>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3 gap-2 mb-3">
              <Zap className="w-5 h-5" /> Adaugă Audiobook-ul — £7.99
            </Button>
            <Link to="/thank-you-ebook">
              <Button variant="ghost" className="w-full text-gray-400 hover:text-gray-300 text-sm">
                Nu, mulțumesc — continuă fără audiobook
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            De Ce Audiobook-ul?
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Nu ai timp să citești? Ascultă ghidul complet în timp ce faci altceva.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Player Placeholder */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="p-6 text-center">
            <Volume2 className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Ascultă un Fragment</h3>
            <p className="text-gray-500 text-sm mb-4">Previzualizare din primul capitol</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-orange-500 rounded-full h-2 w-1/3" />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>1:24</span>
              <span>4:30</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Clock className="w-10 h-10 mx-auto mb-4 text-orange-200" />
          <h2 className="text-2xl font-bold mb-4">Această Ofertă Este Disponibilă Doar Acum</h2>
          <p className="text-orange-100 mb-6">
            Prețul special de £7.99 este valabil doar pe această pagină. Nu vei mai vedea această ofertă.
          </p>
          <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-lg px-8 py-3 gap-2">
            Da, Vreau Audiobook-ul — £7.99 <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default AudiobookUpsell;
