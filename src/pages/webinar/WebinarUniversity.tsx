import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  User,
  Loader2,
} from 'lucide-react';

const speaker = {
  name: 'Andrei Popescu',
  role: 'CEO EduForYou',
  bio: 'Cu peste 10 ani de experiență în educația internațională, Andrei a ghidat mii de studenți români spre studii universitare gratuite în UK.',
};

const topics = [
  'Cum funcționează Student Finance England',
  'Universitățile partenere și programele disponibile',
  'Procesul complet de aplicare pas cu pas',
  'Cum obții finanțare integrală pentru taxe',
  'Sesiune de întrebări și răspunsuri live',
];

const WebinarUniversity = () => {
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
        source: 'webinar-university',
        notes: 'Registered for University Webinar',
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Înregistrare reușită!', description: 'Te-ai înscris la webinar cu succes.' });
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
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#EAC67E] text-sm font-medium">Webinar Gratuit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Cum Să Studiezi <span className="text-[#D4AF37]">Gratuit</span> în UK
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Află totul despre Student Finance England, universitățile partenere și cum poți
            accesa studii universitare finanțate integral.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> În fiecare miercuri</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Ora 19:00 (UK)</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 50 locuri disponibile</span>
          </div>
        </div>
      </section>

      {/* Content + Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ce Vei Învăța</h2>
              <div className="space-y-4 mb-10">
                {topics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>

              {/* Speaker */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Speaker</h2>
              <Card className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C6A248] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {speaker.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{speaker.name}</h3>
                  <p className="text-[#C6A248] text-sm font-medium">{speaker.role}</p>
                  <p className="text-gray-600 text-sm mt-1">{speaker.bio}</p>
                </div>
              </Card>
            </div>

            {/* Right — Form */}
            <div>
              <Card className="p-6 md:p-8 shadow-lg">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Te-ai Înscris!</h3>
                    <p className="text-gray-600">
                      Vei primi un email de confirmare cu linkul de acces la webinar.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Înscrie-te Gratuit la Webinar
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Completează formularul și primești linkul de acces pe email.
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
                          'Înscrie-te Gratuit'
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

export default WebinarUniversity;
