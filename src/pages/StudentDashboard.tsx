import { useEffect, useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Lock, BookOpen, FileText, GraduationCap, Upload, Trash2, Save, Edit2, X, PoundSterling, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const eduSteps = [
  {
    id: 'evaluate', label: 'Evaluate', icon: BookOpen,
    subSteps: ['Take eligibility quiz', 'Explore courses', 'Choose your degree'],
  },
  {
    id: 'deliver', label: 'Deliver', icon: FileText,
    subSteps: ['Upload ID document', 'Upload proof of address', 'Submit application'],
  },
  {
    id: 'unlock', label: 'Unlock', icon: GraduationCap,
    subSteps: ['Application accepted', 'Enrolment confirmed', 'Start your degree'],
  },
];

const docTypes = [
  { value: 'id', label: 'ID / Passport' },
  { value: 'address', label: 'Proof of Address' },
  { value: 'qualification', label: 'Previous Qualifications' },
  { value: 'finance', label: 'Finance Documents' },
  { value: 'other', label: 'Other' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('journey');
  const [applications, setApplications] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', nationality: '', date_of_birth: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('id');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    const [appsRes, quizRes, docsRes, profileRes] = await Promise.all([
      supabase.from('applications').select('*').eq('user_id', user.id),
      supabase.from('quiz_results').select('*').eq('user_id', user.id),
      supabase.from('student_documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ]);
    setApplications(appsRes.data || []);
    setQuizResults(quizRes.data || []);
    setDocuments(docsRes.data || []);
    if (profileRes.data) {
      setProfile(profileRes.data);
      setProfileForm({
        full_name: profileRes.data.full_name || '',
        phone: profileRes.data.phone || '',
        nationality: profileRes.data.nationality || '',
        date_of_birth: profileRes.data.date_of_birth || '',
      });
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from('profiles').update(profileForm).eq('user_id', user.id);
    setEditingProfile(false);
    fetchAll();
    toast({ title: 'Profil actualizat' });
  };

  // E.D.U. journey progress
  const hasQuiz = quizResults.length > 0;
  const hasApp = applications.length > 0;
  const hasDocuments = documents.length > 0;
  const isAccepted = applications.some(a => a.status === 'accepted' || a.status === 'enrolled');
  const isEnrolled = applications.some(a => a.status === 'enrolled');

  const completedSubSteps = [
    hasQuiz, true, hasApp, // evaluate
    documents.some(d => d.document_type === 'id'), documents.some(d => d.document_type === 'address'), hasApp, // deliver
    isAccepted, isEnrolled, isEnrolled, // unlock
  ];

  const totalComplete = completedSubSteps.filter(Boolean).length;
  const progressPercent = Math.round((totalComplete / completedSubSteps.length) * 100);

  const currentStep = isEnrolled ? 3 : isAccepted ? 2 : hasApp ? 2 : hasQuiz ? 1 : 0;

  // Upload document
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('student_documents').insert({
        user_id: user.id,
        file_name: file.name,
        file_path: path,
        document_type: uploadType,
      });
      toast({ title: 'Document uploaded!' });
      fetchAll();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteDoc = async (doc: any) => {
    await supabase.storage.from('documents').remove([doc.file_path]);
    await supabase.from('student_documents').delete().eq('id', doc.id);
    fetchAll();
    toast({ title: 'Document deleted' });
  };

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Your E.D.U. Journey</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name || user?.user_metadata?.full_name || 'Student'}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="journey">Journey</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* E.D.U. JOURNEY */}
            <TabsContent value="journey">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Overall Progress</p>
                  <p className="text-sm font-bold text-primary">{progressPercent}%</p>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eduSteps.map((step, i) => {
                  const stepOffset = i * 3;
                  const stepComplete = completedSubSteps.slice(stepOffset, stepOffset + 3).filter(Boolean).length;
                  return (
                    <div key={step.id} className={`rounded-xl p-6 border transition-all ${
                      i < currentStep ? 'border-primary bg-primary/5'
                        : i === currentStep ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border bg-card opacity-60'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        {i < currentStep ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : i === currentStep ? (
                          <Circle className="w-6 h-6 text-primary" />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                        <h3 className="font-display font-bold text-lg text-foreground">{step.label}</h3>
                        <span className="ml-auto text-xs text-muted-foreground">{stepComplete}/3</span>
                      </div>
                      <step.icon className="w-8 h-8 text-primary/30 mb-3" />
                      <ul className="space-y-2">
                        {step.subSteps.map((sub, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm">
                            {completedSubSteps[stepOffset + j] ? (
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                            <span className={completedSubSteps[stepOffset + j] ? 'text-foreground' : 'text-muted-foreground'}>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* DOCUMENTS */}
            <TabsContent value="documents">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">Upload Documents</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={uploadType} onValueChange={setUploadType}>
                      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {docTypes.map(dt => <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="flex-1">
                      <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                      <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                        <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Choose File'}
                      </Button>
                    </div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.file_name}</TableCell>
                        <TableCell><Badge variant="secondary">{docTypes.find(d => d.value === doc.document_type)?.label || doc.document_type}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>{doc.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteDoc(doc)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {documents.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No documents uploaded yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* APPLICATIONS */}
            <TabsContent value="applications">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Applications</h2>
                </div>
                <div className="divide-y divide-border">
                  {applications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No applications yet. Take the eligibility quiz to get started!
                    </div>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{app.course_slug}</p>
                          <p className="text-sm text-muted-foreground">{app.campus}</p>
                        </div>
                        <Badge variant={app.status === 'enrolled' ? 'default' : app.status === 'accepted' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* FINANCE */}
            <TabsContent value="finance">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <PoundSterling className="w-5 h-5 text-primary" /> Student Finance Tracker
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground mb-1">Tuition Fee Status</p>
                    <p className="text-lg font-bold text-foreground">
                      {applications.some(a => a.status === 'enrolled') ? 'Funded' : 'Pending Application'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground mb-1">Finance Documents</p>
                    <p className="text-lg font-bold text-foreground">
                      {documents.filter(d => d.document_type === 'finance').length} uploaded
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Checklist</h3>
                  {[
                    { label: 'Student Finance England application', done: false },
                    { label: 'Upload finance evidence', done: documents.some(d => d.document_type === 'finance') },
                    { label: 'Tuition fee confirmation', done: applications.some(a => a.status === 'enrolled') },
                    { label: 'Maintenance loan (optional)', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {item.done ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                      <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* PROFILE */}
            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border max-w-lg">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Your Profile</h2>
                  {!editingProfile && <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>Edit</Button>}
                </div>
                <div className="p-6 space-y-4">
                  {editingProfile ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Phone</label>
                        <Input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Nationality</label>
                        <Input value={profileForm.nationality} onChange={e => setProfileForm(f => ({ ...f, nationality: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Date of Birth</label>
                        <Input type="date" value={profileForm.date_of_birth} onChange={e => setProfileForm(f => ({ ...f, date_of_birth: e.target.value }))} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                        <Button onClick={saveProfile}>Save</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium text-foreground">{profile?.full_name || '—'}</p></div>
                      <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-foreground">{user?.email}</p></div>
                      <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium text-foreground">{profile?.phone || '—'}</p></div>
                      <div><p className="text-sm text-muted-foreground">Nationality</p><p className="font-medium text-foreground">{profile?.nationality || '—'}</p></div>
                      <div><p className="text-sm text-muted-foreground">Date of Birth</p><p className="font-medium text-foreground">{profile?.date_of_birth || '—'}</p></div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default StudentDashboard;
