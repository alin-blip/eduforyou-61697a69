import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEduJourney } from '@/hooks/useEduJourney';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  File,
  Trash2,
  Eye,
} from 'lucide-react';

interface DocItem {
  key: string;
  label: string;
  description: string;
  required: boolean;
}

const REQUIRED_DOCS: DocItem[] = [
  { key: 'id', label: 'Document de Identitate', description: 'Pașaport sau carte de identitate', required: true },
  { key: 'address', label: 'Dovada Adresei', description: 'Factură utilități sau extras bancar', required: true },
  { key: 'qualification', label: 'Certificate Studii', description: 'Diplomă de bacalaureat sau echivalent', required: true },
  { key: 'english_cert', label: 'Certificat Limba Engleză', description: 'IELTS, TOEFL sau echivalent (dacă aplicabil)', required: false },
  { key: 'reference', label: 'Scrisoare de Recomandare', description: 'De la un profesor sau angajator', required: false },
  { key: 'photo', label: 'Fotografie', description: 'Fotografie tip pașaport recentă', required: true },
];

const Documents = () => {
  const { user } = useAuth();
  const { updateStep } = useEduJourney();
  const { addPoints } = useGamification();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    const { data } = await supabase.from('student_documents').select('*').eq('user_id', user.id);
    setDocuments(data || []);
    setLoading(false);

    const requiredKeys = REQUIRED_DOCS.filter(d => d.required).map(d => d.key);
    const uploadedKeys = (data || []).map((d: any) => d.document_type);
    const allUploaded = requiredKeys.every(k => uploadedKeys.includes(k));
    if (allUploaded && data && data.length > 0) {
      updateStep.mutate({ stepKey: 'documents', status: 'completed' });
    }
  };

  const handleUploadClick = (docKey: string) => {
    setActiveDocKey(docKey);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !activeDocKey) return;

    setUploading(activeDocKey);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${activeDocKey}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('student-documents')
        .getPublicUrl(filePath);

      await supabase.from('student_documents').upsert({
        user_id: user.id,
        document_type: activeDocKey,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_path: filePath,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      }, { onConflict: 'user_id,document_type' });

      addPoints.mutate({ points: 10, badge: 'documents_uploaded' });
      await loadDocuments();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(null);
      setActiveDocKey(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteDocument = async (docType: string) => {
    if (!user) return;
    const doc = documents.find(d => d.document_type === docType);
    if (!doc) return;

    if (doc.file_path) {
      await supabase.storage.from('student-documents').remove([doc.file_path]);
    }
    await supabase.from('student_documents').delete().eq('user_id', user.id).eq('document_type', docType);
    await loadDocuments();
  };

  const getDocStatus = (docKey: string) => {
    const doc = documents.find(d => d.document_type === docKey);
    if (!doc) return null;
    return doc;
  };

  const uploadedCount = REQUIRED_DOCS.filter(d => getDocStatus(d.key)).length;
  const requiredCount = REQUIRED_DOCS.filter(d => d.required).length;
  const requiredUploaded = REQUIRED_DOCS.filter(d => d.required && getDocStatus(d.key)).length;
  const progressPercent = Math.round((requiredUploaded / requiredCount) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />

      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500" />
          Documente
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasul D1 - Încarcă documentele necesare pentru aplicație
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Documente Obligatorii</p>
            <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
              {requiredUploaded}/{requiredCount}
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {uploadedCount} din {REQUIRED_DOCS.length} documente încărcate ({progressPercent}% obligatorii)
          </p>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="space-y-3">
        {REQUIRED_DOCS.map(doc => {
          const uploaded = getDocStatus(doc.key);
          const isUploading = uploading === doc.key;

          return (
            <Card
              key={doc.key}
              className={`transition-all ${
                uploaded ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    uploaded ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                  }`}>
                    {uploaded ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <File className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{doc.label}</p>
                      {doc.required && <Badge variant="outline" className="text-[10px]">Obligatoriu</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                    {uploaded && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-xs">
                          {uploaded.file_name}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            uploaded.status === 'approved' ? 'border-green-300 text-green-600' :
                            uploaded.status === 'rejected' ? 'border-red-300 text-red-600' :
                            'border-yellow-300 text-yellow-600'
                          }`}
                        >
                          {uploaded.status === 'approved' ? 'Aprobat' :
                           uploaded.status === 'rejected' ? 'Respins' : 'În așteptare'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {uploaded ? (
                      <>
                        {uploaded.file_url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={uploaded.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => deleteDocument(doc.key)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUploadClick(doc.key)}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Încarcă
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Documents;
