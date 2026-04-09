import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileSearch,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Building2,
  Loader2,
  RefreshCw,
  Mail,
  ExternalLink,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  uploaded: { label: 'Încărcat', color: 'text-blue-500 border-blue-300 bg-blue-50', icon: Clock },
  under_review: { label: 'În Verificare', color: 'text-yellow-600 border-yellow-300 bg-yellow-50', icon: Clock },
  approved: { label: 'Aprobat', color: 'text-green-600 border-green-300 bg-green-50', icon: CheckCircle2 },
  rejected: { label: 'Respins', color: 'text-red-600 border-red-300 bg-red-50', icon: XCircle },
  resubmit: { label: 'De Retrimis', color: 'text-[#C6A248] border-[#D4AF37]/40 bg-[#D4AF37]/10', icon: AlertCircle },
};

const DocumentChecks = () => {
  const { user } = useAuth();
  const { getStepStatus } = useEduJourney();
  const [documents, setDocuments] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [docs, apps] = await Promise.all([
      supabase.from('student_documents').select('*').eq('user_id', user.id),
      supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    setDocuments(docs.data || []);
    setApplications(apps.data || []);
    setLoading(false);
  };

  const approvedCount = documents.filter(d => d.status === 'approved').length;
  const totalDocs = documents.length;
  const progressPercent = totalDocs > 0 ? Math.round((approvedCount / totalDocs) * 100) : 0;

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
          <FileSearch className="w-6 h-6 text-[#D4AF37]" />
          Verificare Documente & Răspuns Universitate
        </h1>
        <p className="text-muted-foreground mt-1">
          Pașii D3-D4 - Statusul documentelor și răspunsul universității
        </p>
      </div>

      {/* Document Verification Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Verificare Documente</CardTitle>
            <Button variant="ghost" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Actualizează
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-muted-foreground">Documente Aprobate</p>
            <Badge variant="secondary">{approvedCount}/{totalDocs}</Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />

          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Niciun document încărcat. Mergi la pagina de documente pentru a începe.
            </p>
          ) : (
            <div className="space-y-2 mt-3">
              {documents.map(doc => {
                const statusConfig = STATUS_CONFIG[doc.status] || STATUS_CONFIG.uploaded;
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <StatusIcon className={`w-5 h-5 shrink-0 ${statusConfig.color.split(' ')[0]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.file_name || doc.document_type}</p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.document_type?.replace('_', ' ')}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${statusConfig.color}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* University Response */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Răspuns Universitate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Nicio aplicație trimisă încă. Completează pașii anteriori pentru a aplica.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/student/applications">Vezi Aplicații</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => {
                const statusMap: Record<string, { label: string; color: string }> = {
                  submitted: { label: 'Trimis', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  under_review: { label: 'În Evaluare', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
                  accepted: { label: 'Acceptat', color: 'text-green-600 bg-green-50 border-green-200' },
                  rejected: { label: 'Respins', color: 'text-red-600 bg-red-50 border-red-200' },
                  enrolled: { label: 'Înscris', color: 'text-primary bg-primary/10 border-primary/30' },
                  conditional: { label: 'Acceptare Condiționată', color: 'text-[#C6A248] bg-[#D4AF37]/10 border-[#D4AF37]/30' },
                };

                const status = statusMap[app.status] || statusMap.submitted;

                return (
                  <Card key={app.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{app.course_slug || 'Aplicație'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Trimis: {new Date(app.created_at).toLocaleDateString('ro-RO')}
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${status.color}`}>
                          {status.label}
                        </Badge>
                      </div>
                      {app.status === 'accepted' && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Felicitări! Ai fost acceptat!
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Continuă cu pasul următor pentru finanțare SFE.
                          </p>
                        </div>
                      )}
                      {app.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          "{app.notes}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Ai întrebări? Contactează consilierul tău EDU.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/student/messages">Mesaje</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentChecks;
