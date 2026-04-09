import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Users, Eye, Mail, Phone, BookOpen } from 'lucide-react';

interface Referral {
  id: string;
  referred_name: string;
  referred_email: string;
  referred_phone: string | null;
  status: string;
  commission_amount: number | null;
  course_interest: string | null;
  created_at: string;
  notes: string | null;
}

const statusLabels: Record<string, string> = {
  pending: 'În așteptare',
  contacted: 'Contactat',
  enrolled: 'Înscris',
  converted: 'Convertit',
  rejected: 'Respins',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  enrolled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const AgentStudents = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Referral | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchStudents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      setReferrals((data as Referral[]) || []);
      setLoading(false);
    };
    fetchStudents();
  }, [user]);

  const filtered = referrals.filter((r) => {
    const matchesSearch =
      r.referred_name.toLowerCase().includes(search.toLowerCase()) ||
      r.referred_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: referrals.length,
    pending: referrals.filter((r) => r.status === 'pending').length,
    contacted: referrals.filter((r) => r.status === 'contacted').length,
    enrolled: referrals.filter((r) => r.status === 'enrolled' || r.status === 'converted').length,
    rejected: referrals.filter((r) => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Studenții Recomandați
        </h1>
        <p className="text-muted-foreground mt-1">
          Vizualizează și gestionează toți studenții pe care i-ai recomandat.
        </p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: 'all', label: 'Total', color: 'text-foreground', bg: 'bg-muted/50' },
          { key: 'pending', label: 'În Așteptare', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
          { key: 'contacted', label: 'Contactați', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { key: 'enrolled', label: 'Înscriși', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
        ].map((s) => (
          <Card
            key={s.key}
            className={`shadow-sm cursor-pointer transition-shadow hover:shadow-md ${
              statusFilter === s.key ? 'ring-2 ring-[#D4AF37]' : ''
            }`}
            onClick={() => setStatusFilter(s.key)}
          >
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>
                {statusCounts[s.key as keyof typeof statusCounts]}
              </p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Caută după nume sau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrează după status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate statusurile</SelectItem>
                <SelectItem value="pending">În așteptare</SelectItem>
                <SelectItem value="contacted">Contactat</SelectItem>
                <SelectItem value="enrolled">Înscris</SelectItem>
                <SelectItem value="rejected">Respins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            Lista Studenților ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nu s-au găsit studenți.</p>
              <p className="text-sm mt-1">Modifică filtrele sau adaugă un referral nou.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Curs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{r.referred_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.referred_email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.course_interest || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[r.status] || 'bg-gray-100 text-gray-800'}>
                          {statusLabels[r.status] || r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString('ro-RO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(r)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detalii
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              Detalii Student
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {selectedStudent.referred_name}
                  </p>
                  <Badge className={statusColors[selectedStudent.status] || ''}>
                    {statusLabels[selectedStudent.status] || selectedStudent.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.referred_email}</span>
                </div>
                {selectedStudent.referred_phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedStudent.referred_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {selectedStudent.course_interest || 'Niciun curs specificat'}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comision</span>
                  <span className="font-semibold text-foreground">
                    {selectedStudent.commission_amount
                      ? `£${selectedStudent.commission_amount}`
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data recomandării</span>
                  <span className="text-foreground">
                    {new Date(selectedStudent.created_at).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentStudents;
