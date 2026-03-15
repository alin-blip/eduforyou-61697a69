import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Star,
  User,
} from 'lucide-react';

interface CVData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  personal_statement: string;
  hobbies: string;
}

const INITIAL_CV: CVData = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  experience: '',
  skills: '',
  languages: '',
  personal_statement: '',
  hobbies: '',
};

const CVBuilder = () => {
  const { user } = useAuth();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [cv, setCv] = useState<CVData>(INITIAL_CV);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [cvRes, profileRes] = await Promise.all([
        supabase.from('student_cv').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      if (cvRes.data) {
        setCv({
          full_name: (cvRes.data as any).full_name || '',
          email: (cvRes.data as any).email || '',
          phone: (cvRes.data as any).phone || '',
          address: (cvRes.data as any).address || '',
          education: (cvRes.data as any).education || '',
          experience: (cvRes.data as any).experience || '',
          skills: (cvRes.data as any).skills || '',
          languages: (cvRes.data as any).languages || '',
          personal_statement: (cvRes.data as any).personal_statement || '',
          hobbies: (cvRes.data as any).hobbies || '',
        });
      } else if (profileRes.data) {
        setCv(prev => ({
          ...prev,
          full_name: (profileRes.data as any).full_name || '',
          email: user.email || '',
          phone: (profileRes.data as any).phone || '',
        }));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleChange = (key: keyof CVData, value: string) => {
    setCv(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveCv = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('student_cv').upsert({
        user_id: user.id,
        ...cv,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      setSaved(true);
      updateStep.mutate({ stepKey: 'cv_builder', status: 'completed' });
      addPoints.mutate({ points: 20, badge: 'cv_ready' });
    } catch (err) {
      console.error('Error saving CV:', err);
    } finally {
      setSaving(false);
    }
  };

  const generatePersonalStatement = async () => {
    setGenerating(true);
    try {
      const { data } = await supabase.functions.invoke('generate-personal-statement', {
        body: {
          name: cv.full_name,
          education: cv.education,
          experience: cv.experience,
          skills: cv.skills,
        },
      });
      if (data?.statement) {
        setCv(prev => ({ ...prev, personal_statement: data.statement }));
        setSaved(false);
      }
    } catch (err) {
      console.error('Error generating statement:', err);
    } finally {
      setGenerating(false);
    }
  };

  const wordCount = cv.personal_statement.trim().split(/\s+/).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500" />
          CV & Personal Statement
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul D2 - Construiește-ți CV-ul și scrisoarea de motivație
        </p>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Informații Personale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nume Complet</Label>
              <Input value={cv.full_name} onChange={e => handleChange('full_name', e.target.value)} placeholder="Ion Popescu" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={cv.email} onChange={e => handleChange('email', e.target.value)} placeholder="ion@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefon</Label>
              <Input value={cv.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+44 7XXX XXXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Adresă</Label>
              <Input value={cv.address} onChange={e => handleChange('address', e.target.value)} placeholder="Orașul, Țara" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Educație
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={cv.education}
            onChange={e => handleChange('education', e.target.value)}
            placeholder="Liceu / Universitate, Ani, Specializare..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Experiență
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={cv.experience}
            onChange={e => handleChange('experience', e.target.value)}
            placeholder="Locuri de muncă, voluntariat, proiecte..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Skills & Languages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-4 h-4" />
            Abilități & Limbi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Abilități</Label>
            <Textarea
              value={cv.skills}
              onChange={e => handleChange('skills', e.target.value)}
              placeholder="Comunicare, leadership, IT, ..."
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Limbi Străine</Label>
            <Input
              value={cv.languages}
              onChange={e => handleChange('languages', e.target.value)}
              placeholder="Română (nativ), Engleză (avansat), ..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Hobby-uri</Label>
            <Input
              value={cv.hobbies}
              onChange={e => handleChange('hobbies', e.target.value)}
              placeholder="Sport, citit, călătorit, ..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Statement */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Personal Statement
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePersonalStatement}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Generează cu AI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            value={cv.personal_statement}
            onChange={e => handleChange('personal_statement', e.target.value)}
            placeholder="Scrie despre motivația ta, obiectivele tale academice și de ce ai ales acest curs..."
            rows={8}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {wordCount} cuvinte {wordCount < 250 && '(recomandat: 250-500)'}
            </p>
            {wordCount >= 250 && wordCount <= 500 && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                Lungime bună
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex gap-3">
        <Button onClick={saveCv} disabled={saving} className="flex-1">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saved ? 'Salvat!' : 'Salvează CV'}
        </Button>
      </div>
    </div>
  );
};

export default CVBuilder;
