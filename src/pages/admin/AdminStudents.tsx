import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Search, User, FileText, Mail, Activity } from 'lucide-react';

interface StudentData {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  applications: any[];
  documents: any[];
  messages: any[];
  quizResults: any[];
}

const AdminStudents = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get all profiles (students)
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!profiles) { setLoading(false); return; }

      // Get all related data
      const [appsRes, docsRes, msgsRes, quizRes] = await Promise.all([
        supabase.from('applications').select('*'),
        supabase.from('student_documents').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('quiz_results').select('*'),
      ]);

      const apps = appsRes.data || [];
      const docs = docsRes.data || [];
      const msgs = msgsRes.data || [];
      const quizzes = quizRes.data || [];

      const studentList: StudentData[] = profiles.map(p => ({
        user_id: p.user_id,
        full_name: p.full_name,
        phone: p.phone,
        created_at: p.created_at,
        applications: apps.filter(a => a.user_id === p.user_id),
        documents: docs.filter(d => d.user_id === p.user_id),
        messages: msgs.filter(m => m.sender_id === p.user_id || m.receiver_id === p.user_id),
        quizResults: quizzes.filter(q => q.user_id === p.user_id),
      }));

      setStudents(studentList);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = students.filter(s =>
    (s.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStudentPhase = (s: StudentData) => {
    if (s.applications.some(a => a.status === 'enrolled')) return 'Enrolled';
    if (s.applications.some(a => a.status === 'accepted')) return 'Accepted';
    if (s.applications.length > 0) return 'Applied';
    if (s.quizResults.length > 0) return 'Evaluating';
    return 'New';
  };

  const phaseColor = (phase: string) => {
    switch (phase) {
      case 'Enrolled': return 'default';
      case 'Accepted': return 'default';
      case 'Applied': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Students CRM</h1>
        <Badge variant="secondary">{students.length} students</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.map(student => {
          const isExpanded = expandedId === student.user_id;
          const phase = getStudentPhase(student);
          return (
            <Card key={student.user_id} className="overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : student.user_id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.full_name || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(student.created_at).toLocaleDateString()} · {student.applications.length} apps · {student.documents.length} docs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={phaseColor(phase) as any}>{phase}</Badge>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border">
                  <Tabs defaultValue="overview" className="p-4">
                    <TabsList>
                      <TabsTrigger value="overview"><User className="w-3 h-3 mr-1" />Overview</TabsTrigger>
                      <TabsTrigger value="documents"><FileText className="w-3 h-3 mr-1" />Documents</TabsTrigger>
                      <TabsTrigger value="messages"><Mail className="w-3 h-3 mr-1" />Messages</TabsTrigger>
                      <TabsTrigger value="activity"><Activity className="w-3 h-3 mr-1" />Activity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{student.applications.length}</p>
                          <p className="text-xs text-muted-foreground">Applications</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{student.documents.length}</p>
                          <p className="text-xs text-muted-foreground">Documents</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{student.quizResults.length}</p>
                          <p className="text-xs text-muted-foreground">Quizzes</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-foreground">{student.messages.length}</p>
                          <p className="text-xs text-muted-foreground">Messages</p>
                        </div>
                      </div>
                      {student.applications.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Applications</h4>
                          <div className="space-y-2">
                            {student.applications.map(app => (
                              <div key={app.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <span className="text-sm">{app.course_slug}</span>
                                <Badge variant="secondary">{app.status}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="documents" className="mt-4">
                      {student.documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                      ) : (
                        <div className="space-y-2">
                          {student.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{doc.file_name}</span>
                              </div>
                              <Badge variant="secondary">{doc.document_type}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="messages" className="mt-4">
                      {student.messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No messages.</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {student.messages.slice(0, 10).map(msg => (
                            <div key={msg.id} className="p-2 bg-muted/30 rounded">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{msg.subject || 'No subject'}</span>
                                <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm mt-1 line-clamp-2">{msg.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <p>• Joined: {new Date(student.created_at).toLocaleDateString()}</p>
                          {student.quizResults.length > 0 && <p>• Quiz completed: {new Date(student.quizResults[0].created_at).toLocaleDateString()}</p>}
                          {student.documents.length > 0 && <p>• Last document: {new Date(student.documents[student.documents.length - 1].created_at).toLocaleDateString()}</p>}
                          {student.applications.length > 0 && <p>• Last application: {new Date(student.applications[student.applications.length - 1].created_at).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No students found.</p>}
      </div>
    </div>
  );
};

export default AdminStudents;
