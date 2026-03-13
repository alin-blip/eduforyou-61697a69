import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CVEntry {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

const emptyCVEntry = (): CVEntry => ({ title: '', organization: '', startDate: '', endDate: '', description: '' });

const CVBuilder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cv, setCv] = useState({
    personal_statement: '',
    education: [] as CVEntry[],
    experience: [] as CVEntry[],
    skills: [] as string[],
    languages: [] as string[],
    certifications: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newCert, setNewCert] = useState('');

  useEffect(() => {
    if (user) fetchCV();
  }, [user]);

  const fetchCV = async () => {
    if (!user) return;
    const { data } = await supabase.from('student_cv').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      setCv({
        personal_statement: data.personal_statement || '',
        education: (data.education as unknown as CVEntry[]) || [],
        experience: (data.experience as unknown as CVEntry[]) || [],
        skills: (data.skills as unknown as string[]) || [],
        languages: (data.languages as unknown as string[]) || [],
        certifications: (data.certifications as unknown as string[]) || [],
      });
    }
    setLoading(false);
  };

  const saveCV = async () => {
    if (!user) return;
    setSaving(true);
    const { data: existing } = await supabase.from('student_cv').select('id').eq('user_id', user.id).maybeSingle();
    if (existing) {
      await supabase.from('student_cv').update({ ...cv }).eq('user_id', user.id);
    } else {
      await supabase.from('student_cv').insert({ user_id: user.id, ...cv });
    }
    setSaving(false);
    toast({ title: 'CV saved!' });
  };

  const addEntry = (field: 'education' | 'experience') => {
    setCv(prev => ({ ...prev, [field]: [...prev[field], emptyCVEntry()] }));
  };

  const updateEntry = (field: 'education' | 'experience', index: number, key: keyof CVEntry, value: string) => {
    setCv(prev => ({
      ...prev,
      [field]: prev[field].map((e, i) => i === index ? { ...e, [key]: value } : e),
    }));
  };

  const removeEntry = (field: 'education' | 'experience', index: number) => {
    setCv(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addTag = (field: 'skills' | 'languages' | 'certifications', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setCv(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const removeTag = (field: 'skills' | 'languages' | 'certifications', index: number) => {
    setCv(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const renderEntries = (field: 'education' | 'experience', label: string) => (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground">{label}</h2>
        <Button variant="outline" size="sm" onClick={() => addEntry(field)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {cv[field].length === 0 && <p className="text-sm text-muted-foreground">No entries yet. Click Add to start.</p>}
      {cv[field].map((entry, i) => (
        <div key={i} className="border border-border rounded-lg p-4 mb-3 space-y-3">
          <div className="flex justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div><Label>{field === 'education' ? 'Degree/Course' : 'Job Title'}</Label><Input value={entry.title} onChange={e => updateEntry(field, i, 'title', e.target.value)} /></div>
              <div><Label>{field === 'education' ? 'Institution' : 'Company'}</Label><Input value={entry.organization} onChange={e => updateEntry(field, i, 'organization', e.target.value)} /></div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeEntry(field, i)} className="ml-2 mt-5">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="month" value={entry.startDate} onChange={e => updateEntry(field, i, 'startDate', e.target.value)} /></div>
            <div><Label>End Date</Label><Input type="month" value={entry.endDate} onChange={e => updateEntry(field, i, 'endDate', e.target.value)} placeholder="Present" /></div>
          </div>
          <div><Label>Description</Label><Textarea value={entry.description} onChange={e => updateEntry(field, i, 'description', e.target.value)} rows={2} /></div>
        </div>
      ))}
    </div>
  );

  const renderTags = (field: 'skills' | 'languages' | 'certifications', label: string, value: string, setter: (v: string) => void) => (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="font-display text-lg font-bold text-foreground mb-3">{label}</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {cv[field].map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {tag}
            <button onClick={() => removeTag(field, i)} className="hover:text-destructive">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={value} onChange={e => setter(e.target.value)} placeholder={`Add ${label.toLowerCase()}...`}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(field, value, setter))} />
        <Button variant="outline" size="sm" onClick={() => addTag(field, value, setter)}>Add</Button>
      </div>
    </div>
  );

  if (loading) return <Layout><div className="py-20 text-center text-muted-foreground">Loading...</div></Layout>;

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-8 h-8 text-primary" /> CV Builder
              </h1>
              <p className="text-muted-foreground">Build your professional CV step by step</p>
            </div>
            <Button onClick={saveCV} disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save CV'}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Personal Statement */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-3">Personal Statement</h2>
              <Textarea value={cv.personal_statement} onChange={e => setCv(prev => ({ ...prev, personal_statement: e.target.value }))}
                placeholder="Write a brief summary about yourself, your goals, and what you bring to the table..."
                rows={4} />
            </div>

            {renderEntries('education', 'Education')}
            {renderEntries('experience', 'Work Experience')}
            {renderTags('skills', 'Skills', newSkill, setNewSkill)}
            {renderTags('languages', 'Languages', newLang, setNewLang)}
            {renderTags('certifications', 'Certifications', newCert, setNewCert)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CVBuilder;
