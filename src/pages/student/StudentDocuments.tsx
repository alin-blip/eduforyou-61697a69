import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const docTypes = [
  { value: 'id', label: 'ID / Passport' },
  { value: 'address', label: 'Proof of Address' },
  { value: 'qualification', label: 'Previous Qualifications' },
  { value: 'finance', label: 'Finance Documents' },
  { value: 'other', label: 'Other' },
];

const StudentDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('id');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    if (!user) return;
    const { data } = await supabase.from('student_documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setDocuments(data || []);
  };

  useEffect(() => { fetchDocs(); }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      await supabase.from('student_documents').insert({ user_id: user.id, file_name: file.name, file_path: path, document_type: uploadType });
      toast({ title: 'Document uploaded!' });
      fetchDocs();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const deleteDoc = async (doc: any) => {
    await supabase.storage.from('documents').remove([doc.file_path]);
    await supabase.from('student_documents').delete().eq('id', doc.id);
    fetchDocs();
    toast({ title: 'Document deleted' });
  };

  return (
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
              <TableCell><Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>{doc.status}</Badge></TableCell>
              <TableCell className="text-sm text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => deleteDoc(doc)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
          {documents.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No documents uploaded yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentDocuments;
