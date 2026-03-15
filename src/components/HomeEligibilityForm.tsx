import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, CheckCircle } from 'lucide-react';

const QUALIFICATIONS = [
  { value: 'none', label: 'Fără calificări formale' },
  { value: 'gcse', label: 'GCSE / Echivalent' },
  { value: 'alevel', label: 'A-Level / Bacalaureat' },
  { value: 'diploma', label: 'Diplomă / HND' },
  { value: 'degree', label: 'Licență (Bachelor)' },
  { value: 'masters', label: 'Master sau superior' },
];

const AGE_RANGES = [
  { value: '18-24', label: '18-24 ani' },
  { value: '25-34', label: '25-34 ani' },
  { value: '35-44', label: '35-44 ani' },
  { value: '45-54', label: '45-54 ani' },
  { value: '55+', label: '55+ ani' },
];

const RESIDENCY_OPTIONS = [
  { value: 'uk-3plus', label: 'Rezident UK 3+ ani' },
  { value: 'uk-under3', label: 'Rezident UK sub 3 ani' },
  { value: 'eu-settled', label: 'EU Settled Status' },
  { value: 'eu-pre-settled', label: 'EU Pre-Settled Status' },
  { value: 'other', label: 'Alt statut' },
];

const HomeEligibilityForm = () => {
  const [qualification, setQualification] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [residency, setResidency] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (qualification) params.set('qualification', qualification);
    if (ageRange) params.set('age', ageRange);
    if (residency) params.set('residency', residency);
    navigate(`/eligibilitate?${params.toString()}`);
  };

  const isComplete = qualification && ageRange && residency;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 shadow-lg md:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <GraduationCap className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Verifică Eligibilitatea Ta
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Află în 30 de secunde dacă poți studia gratuit în UK
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Nivel de calificare
          </label>
          <Select value={qualification} onValueChange={setQualification}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează nivelul" />
            </SelectTrigger>
            <SelectContent>
              {QUALIFICATIONS.map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Categoria de vârstă
          </label>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează vârsta" />
            </SelectTrigger>
            <SelectContent>
              {AGE_RANGES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Statut de rezidență
          </label>
          <Select value={residency} onValueChange={setResidency}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează statutul" />
            </SelectTrigger>
            <SelectContent>
              {RESIDENCY_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-6 text-base font-semibold text-white hover:from-blue-700 hover:to-blue-800"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Verifică Eligibilitatea
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        100% gratuit. Fără obligații. Rezultat instant.
      </p>
    </div>
  );
};

export default HomeEligibilityForm;
