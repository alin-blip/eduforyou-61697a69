import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Briefcase,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  PoundSterling,
  Trophy,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const topics = [
  'Modelul de business EduForYou — cum funcționează',
  'Structura comisioanelor: £500 — £1,000 per student',
  'Bonusuri milestone: Dubai, BMW, Franciză',
  'Training și materiale de marketing incluse',
  'Dashboard personal și tracking în timp real',
  'Sesiune Q&A cu agenți de top',
];

const stats = [
  { icon: PoundSterling, value: '£1,000', label: 'Comision Maxim/Student' },
  { icon: TrendingUp, value: '£4,200', label: 'Câștig Mediu Lunar (Top)' },
  { icon: Trophy, value: '3', label: 'Bonusuri Milestone' },
  { icon: Users, value: '500+', label: 'Agenți Activi' },
];

const WebinarAgents = () => {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contacts').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        source: 'webinar-agents',
        notes: 'Registered for Agents Webinar',
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Înregistrare reușită!', description: 'Te-ai înscris la webinarul pentru agenți.' });
    } catch (err: any) {
      toast({ title: 'Eroare', description: err.message || 'A apărut o eroare.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
            <Briefcase className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">Webinar Pentru Agenți</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Devino Agent <span className="text-orange-400">EduForYou</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Descoperă cum poți câștiga comisioane de până la £1,000 per student, cu training complet
            și suport dedicat din partea echipei EduForYou.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Prima luni din lună</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Ora 20:00 (UK)</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 30 locuri disponibile</span>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Content + Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce Vei Descoperi</h2>
              <div className="space-y-4 mb-10">
                {topics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>

              <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <h3 className="font-bold text-gray-900 mb-2">Cine Prezintă?</h3>
                <p className="text-gray-600 text-sm">
                  Webinarul este prezentat de Mihai Georgescu, Manager Rețea Agenți, alături
                  de agenți de top care își împărtășesc experiența și strategiile de succes.
                </p>
              </Card>
            </div>

            {/* Right — Form */}
            <div>
              <Card className="p-6 md:p-8 shadow-lg">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ești Înscris!</h3>
                    <p className="text-gray-600">
                      Vei primi detaliile de acces pe email înainte de webinar.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Rezervă-ți Locul</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Locurile sunt limitate. Înscrie-te acum și primești confirmarea pe email.
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
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg py-3"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Se procesează...</>
                        ) : (
                          'Înscrie-te la Webinar'
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebinarAgents;
