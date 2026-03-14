import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminQuizzes = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('quiz_results').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setResults(data || []));
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold text-foreground">Quiz Results</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Answers</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map(qr => (
            <TableRow key={qr.id}>
              <TableCell className="font-medium capitalize">{qr.quiz_type}</TableCell>
              <TableCell className="text-sm max-w-xs truncate">{JSON.stringify(qr.answers).slice(0, 80)}...</TableCell>
              <TableCell className="text-sm max-w-xs truncate">{qr.result ? JSON.stringify(qr.result).slice(0, 80) : '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{new Date(qr.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
          {results.length === 0 && (
            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No quiz results yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminQuizzes;
