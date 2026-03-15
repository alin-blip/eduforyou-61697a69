import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, ClipboardCheck, ArrowRight, Loader2 } from 'lucide-react';

const EligibilityCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();

  const [form, setForm] = useState({
    qualification: '',
    age: '',
    residency_status: '',
    immigration_status: '',
    english_level: '',
    country_of_origin: '',
  });
  const [result, setResult] = useState<'eligible' | 'not_eligible' | null>(null);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<string[]>([]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const checkEligibility = async () => {
    if (!user) return;
    setSaving(true);

    const issues: string[] = [];
    const age = parseInt(form.age);

    if (!form.qualification) issues.push('Calificarea nu a fost selectată');
    if (isNaN(age) || age < 16) issues.push('Vârsta minimă este 16 ani');
    if (!form.residency_status) issues.push('Statusul de rezidență nu a fost selectat');
    if (!form.immigration_status) issues.push('Statusul de imigrare nu a fost selectat');

    const isEligible = issues.length === 0 &&
      ['eu_settled', 'eu_pre_settled', 'uk_resident', 'visa_holder'].includes(form.immigration_status);

    if (!isEligible && form.immigration_status && !['eu_settled', 'eu_pre_settled', 'uk_resident', 'visa_holder'].includes(form.immigration_status)) {
      issues.push('Statusul de imigrare nu permite accesul la finanțare SFE');
    }

    setDetails(issues);
    setResult(isEligible ? 'eligible' : 'not_eligible');

    try {
      await supabase.from('eligibility_results').upsert({
        user_id: user.id,
        qualification: form.qualification,
        age: parseInt(form.age) || 0,
        residency_status: form.residency_status,
        immigration_status: form.immigration_status,
        english_level: form.english_level,
        country_of_origin: form.country_of_origin,
        is_eligible: isEligible,
        checked_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (isEligible) {
        updateStep.mutate({ stepKey: 'eligibility', status: 'completed' });
        addPoints.mutate({ points: 20, badge: 'eligibility_done' });
      }
    } catch (err) {
      console.error('Error saving eligibility:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-blue-500" />
          Verificare Eligibilitate
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul E1 - Verifică dacă ești eligibil pentru studii în Marea Britanie
        </p>
      </div>

      {!result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completează Datele Tale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Calificare Actuală</Label>
              <Select value={form.qualification} onValueChange={v => handleChange('qualification', v)}>
                <SelectTrigger><SelectValue placeholder="Selectează calificarea" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">Liceu / Bacalaureat</SelectItem>
                  <SelectItem value="college">Colegiu / Diplomă</SelectItem>
                  <SelectItem value="bachelor">Licență</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="none">Fără calificare formală</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Vârsta</Label>
              <Input
                type="number"
                value={form.age}
                onChange={e => handleChange('age', e.target.value)}
                placeholder="Ex: 22"
                min={16}
                max={99}
              />
            </div>

            <div className="space-y-2">
              <Label>Status Rezidență</Label>
              <Select value={form.residency_status} onValueChange={v => handleChange('residency_status', v)}>
                <SelectTrigger><SelectValue placeholder="Selectează statusul" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="uk_3_years">Rezident UK 3+ ani</SelectItem>
                  <SelectItem value="uk_less_3">Rezident UK sub 3 ani</SelectItem>
                  <SelectItem value="eu_resident">Rezident EU</SelectItem>
                  <SelectItem value="international">Internațional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status Imigrare</Label>
              <Select value={form.immigration_status} onValueChange={v => handleChange('immigration_status', v)}>
                <SelectTrigger><SelectValue placeholder="Selectează statusul" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="uk_resident">Cetățean/Rezident UK</SelectItem>
                  <SelectItem value="eu_settled">EU Settled Status</SelectItem>
                  <SelectItem value="eu_pre_settled">EU Pre-Settled Status</SelectItem>
                  <SelectItem value="visa_holder">Deținător Viză</SelectItem>
                  <SelectItem value="no_status">Fără Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nivel Engleză</Label>
              <Select value={form.english_level} onValueChange={v => handleChange('english_level', v)}>
                <SelectTrigger><SelectValue placeholder="Selectează nivelul" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Nativ / Fluent</SelectItem>
                  <SelectItem value="advanced">Avansat (C1-C2)</SelectItem>
                  <SelectItem value="intermediate">Intermediar (B1-B2)</SelectItem>
                  <SelectItem value="beginner">Începător (A1-A2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Țara de Origine</Label>
              <Input
                value={form.country_of_origin}
                onChange={e => handleChange('country_of_origin', e.target.value)}
                placeholder="Ex: România"
              />
            </div>

            <Button
              className="w-full mt-4"
              onClick={checkEligibility}
              disabled={saving || !form.qualification || !form.age || !form.residency_status || !form.immigration_status}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ClipboardCheck className="w-4 h-4 mr-2" />}
              Verifică Eligibilitatea
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className={result === 'eligible' ? 'border-green-300 bg-green-50 dark:bg-green-950/20' : 'border-red-300 bg-red-50 dark:bg-red-950/20'}>
          <CardContent className="p-6 text-center space-y-4">
            {result === 'eligible' ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Ești Eligibil!</h2>
                <p className="text-sm text-muted-foreground">
                  Felicitări! Îndeplinești criteriile de eligibilitate. Continuă cu pasul următor.
                </p>
                <Badge className="bg-green-500">+20 puncte</Badge>
                <Button asChild className="w-full mt-4">
                  <a href="/student/edu/course-match">
                    Pasul Următor: Potrivire Cursuri <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Nu Ești Eligibil</h2>
                <p className="text-sm text-muted-foreground">
                  Din păcate, nu îndeplinești toate criteriile. Contactează un consilier pentru opțiuni alternative.
                </p>
                {details.length > 0 && (
                  <ul className="text-sm text-left space-y-1 mt-2">
                    {details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => { setResult(null); setDetails([]); }} className="flex-1">
                    Reîncercă
                  </Button>
                  <Button asChild className="flex-1">
                    <a href="/book-appointment">Contactează Consilier</a>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EligibilityCheck;
