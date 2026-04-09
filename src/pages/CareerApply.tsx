import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Loader2,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';

const CareerApply = () => {
  const { slug } = useParams<{ slug: string }>();
  const jobTitle = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Poziție Deschisă';

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) return;
    setLoading(true);

    try {
      let cvUrl: string | null = null;

      // Upload CV if provided
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `career-cvs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, cvFile);

        if (uploadError) {
          console.error('CV upload error:', uploadError);
          // Continue without CV URL if upload fails
        } else {
          const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
          cvUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('career_applications').insert({
        career_id: slug || null,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        cv_url: cvUrl,
        cover_letter: form.cover_letter || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Aplicație Trimisă!',
        description: 'Vom reveni cu un răspuns în cel mai scurt timp.',
      });
    } catch (err: any) {
      toast({
        title: 'Eroare',
        description: err.message || 'A apărut o eroare la trimiterea aplicației.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/careers"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Înapoi la Cariere
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-10 h-10 text-[#D4AF37]" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{jobTitle}</h1>
              <p className="text-gray-400 text-sm">Aplică pentru această poziție</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-6 md:p-8 shadow-lg">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Aplicația Ta a Fost Trimisă!
                </h2>
                <p className="text-gray-600 mb-6">
                  Mulțumim pentru interes. Vom analiza aplicația ta și te vom contacta
                  în cel mai scurt timp posibil.
                </p>
                <Link to="/careers">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Înapoi la Cariere
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Formular de Aplicare
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Completează toate câmpurile marcate cu * și atașează CV-ul tău.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="full_name" className="flex items-center gap-1.5 mb-1.5">
                      <User className="w-4 h-4 text-gray-400" /> Nume Complet *
                    </Label>
                    <Input
                      id="full_name"
                      placeholder="Ion Popescu"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-1.5 mb-1.5">
                      <Mail className="w-4 h-4 text-gray-400" /> Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ion@exemplu.ro"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1.5 mb-1.5">
                      <Phone className="w-4 h-4 text-gray-400" /> Telefon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+44 7xxx xxx xxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  {/* CV Upload */}
                  <div>
                    <Label htmlFor="cv" className="flex items-center gap-1.5 mb-1.5">
                      <Upload className="w-4 h-4 text-gray-400" /> CV (PDF, DOC, DOCX)
                    </Label>
                    <div className="relative">
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    {cvFile && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {cvFile.name}
                      </p>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <Label htmlFor="cover_letter" className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="w-4 h-4 text-gray-400" /> Scrisoare de Intenție
                    </Label>
                    <Textarea
                      id="cover_letter"
                      placeholder="Spune-ne de ce ești potrivit pentru această poziție..."
                      value={form.cover_letter}
                      onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg py-3 gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Se trimite...</>
                    ) : (
                      'Trimite Aplicația'
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

export default CareerApply;
