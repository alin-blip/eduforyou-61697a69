import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Lightbulb,
  Clock,
  CheckCircle2,
  Heart,
  Target,
  Briefcase,
  Star,
  Loader2,
} from 'lucide-react';

const STORAGE_KEY = 'eduforyou_ikigai_anchor';
const COUNTDOWN_HOURS = 48;

function getTimeLeft(): { hours: number; minutes: number; seconds: number; expired: boolean } {
  const anchor = localStorage.getItem(STORAGE_KEY);
  let anchorDate: number;
  if (anchor) {
    anchorDate = parseInt(anchor, 10);
  } else {
    anchorDate = Date.now();
    localStorage.setItem(STORAGE_KEY, String(anchorDate));
  }
  const deadline = anchorDate + COUNTDOWN_HOURS * 60 * 60 * 1000;
  const diff = deadline - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, expired: false };
}

const pillars = [
  { icon: Heart, title: 'Ce Iubești', desc: 'Descoperă pasiunile și interesele tale profunde.' },
  { icon: Star, title: 'La Ce Ești Bun', desc: 'Identifică talentele și abilitățile tale naturale.' },
  { icon: Target, title: 'Ce Are Nevoie Lumea', desc: 'Găsește problemele pe care le poți rezolva.' },
  { icon: Briefcase, title: 'Pentru Ce Poți Fi Plătit', desc: 'Conectează-ți vocația cu piața muncii.' },
];

const WebinarIkigai = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contacts').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        source: 'webinar-ikigai',
        notes: 'Registered for Ikigai Webinar',
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Înregistrare reușită!', description: 'Te-ai înscris la workshopul Ikigai.' });
    } catch (err: any) {
      toast({ title: 'Eroare', description: err.message || 'A apărut o eroare.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Lightbulb className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Descoperă-ți <span className="text-[#D4AF37]">Ikigai</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Un workshop interactiv bazat pe metoda japoneză Ikigai care te ajută să îți
            descoperi vocația și să alegi cariera potrivită.
          </p>

          {/* Countdown */}
          {!timeLeft.expired && (
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-xl px-6 py-4">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm font-medium mr-2">Oferta expiră în:</span>
              <div className="flex items-center gap-1 text-white font-mono text-2xl font-bold">
                <span className="bg-gray-700 rounded px-2 py-1">{pad(timeLeft.hours)}</span>
                <span className="text-[#D4AF37]">:</span>
                <span className="bg-gray-700 rounded px-2 py-1">{pad(timeLeft.minutes)}</span>
                <span className="text-[#D4AF37]">:</span>
                <span className="bg-gray-700 rounded px-2 py-1">{pad(timeLeft.seconds)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ikigai Pillars */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Cele 4 Piloni ai Ikigai
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Ikigai este intersecția perfectă dintre cele 4 dimensiuni ale vieții tale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-md transition-shadow border-t-4 border-t-[#D4AF37]">
                <p.icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="p-6 md:p-8 shadow-lg">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ești Înscris!</h3>
                <p className="text-gray-600">
                  Vei primi detaliile de acces pe email în curând.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Înscrie-te la Workshop
                </h3>
                <p className="text-gray-600 text-sm text-center mb-6">
                  Locurile sunt limitate. Rezervă-ți locul acum.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Nume Complet *</Label>
                    <Input
                      id="full_name"
                      placeholder="Ion Popescu"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ion@exemplu.ro"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon (opțional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+44 7xxx xxx xxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg py-3"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Se procesează...</>
                    ) : (
                      'Rezervă Locul Gratuit'
                    )}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default WebinarIkigai;
