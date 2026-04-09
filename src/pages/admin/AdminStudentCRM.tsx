import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  Search, User, FileText, GitBranch, Activity,
  Phone, Mail, Calendar, ChevronRight,
} from 'lucide-react';

const DEAL_STAGES = ['lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;

const stageColor = (stage: string) => {
  switch (stage) {
    case 'won': return 'default';
    case 'lost': return 'destructive';
    case 'negotiation': return 'secondary';
    case 'proposal': return 'secondary';
    default: return 'outline';
  }
};

const docStatusColor = (status: string | null) => {
  switch (status) {
    case 'approved': return 'default';
    case 'rejected': return 'destructive';
    case 'pending': return 'secondary';
    default: return 'outline';
  }
};

const AdminStudentCRM = () => {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin-crm-contacts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: deals = [] } = useQuery({
    queryKey: ['admin-crm-deals'],
    queryFn: async () => {
      const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: touchpoints = [] } = useQuery({
    queryKey: ['admin-crm-touchpoints'],
    queryFn: async () => {
      const { data } = await supabase.from('touchpoints').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['admin-crm-documents'],
    queryFn: async () => {
      const { data } = await supabase.from('student_documents').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const getContactDeals = (contactId: string) =>
    deals.filter((d: any) => d.contact_id === contactId);

  const getContactTouchpoints = (contactId: string) =>
    touchpoints.filter((t: any) => t.contact_id === contactId);

  const getContactPhase = (contactId: string) => {
    const contactDeals = getContactDeals(contactId);
    if (contactDeals.some((d: any) => d.stage === 'won')) return 'Won';
    if (contactDeals.some((d: any) => d.stage === 'negotiation' || d.stage === 'proposal')) return 'In Progress';
    if (contactDeals.length > 0) return 'Pipeline';
    return 'New';
  };

  const filtered = contacts.filter((c: any) => {
    const matchesSearch = !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = phaseFilter === 'all' || getContactPhase(c.id) === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const openDetail = (contact: any) => {
    setSelectedContact(contact);
    setDetailOpen(true);
  };

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const wonDeals = deals.filter((d: any) => d.stage === 'won').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a252f]">Student CRM</h1>
        <p className="text-sm text-muted-foreground mt-1">Full student relationship management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <User className="w-8 h-8 text-[#3b82f6]" />
            <div>
              <p className="text-2xl font-bold text-[#1a252f]">{contacts.length}</p>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">{totalDeals}</p>
              <p className="text-xs text-muted-foreground">Total Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#22c55e]">{wonDeals}</p>
            <p className="text-xs text-muted-foreground">Won Deals</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-[#1a252f]">
              {totalValue > 0 ? `£${totalValue.toLocaleString()}` : '£0'}
            </p>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-foreground">Student Contacts</h2>
          <div className="flex gap-3">
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Pipeline">Pipeline</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Course Interest</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Touchpoints</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact: any) => {
              const phase = getContactPhase(contact.id);
              const contactDeals = getContactDeals(contact.id);
              const contactTouchpoints = getContactTouchpoints(contact.id);
              return (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.full_name}</TableCell>
                  <TableCell className="text-sm">{contact.email}</TableCell>
                  <TableCell className="text-sm">{contact.phone || '--'}</TableCell>
                  <TableCell className="text-sm">{contact.course_interest || '--'}</TableCell>
                  <TableCell>
                    <Badge variant={phase === 'Won' ? 'default' : phase === 'New' ? 'outline' : 'secondary'}>
                      {phase}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{contactDeals.length}</TableCell>
                  <TableCell className="text-sm">{contactTouchpoints.length}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDetail(contact)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No contacts found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#D4AF37]" />
              {selectedContact?.full_name}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {selectedContact.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {selectedContact.phone || '--'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {new Date(selectedContact.created_at).toLocaleDateString()}
                </div>
              </div>

              <Tabs defaultValue="deals">
                <TabsList>
                  <TabsTrigger value="deals">
                    <GitBranch className="w-3 h-3 mr-1" /> Deals
                  </TabsTrigger>
                  <TabsTrigger value="touchpoints">
                    <Activity className="w-3 h-3 mr-1" /> Touchpoints
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText className="w-3 h-3 mr-1" /> Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="deals" className="mt-4">
                  {getContactDeals(selectedContact.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No deals for this contact.</p>
                  ) : (
                    <div className="space-y-3">
                      {getContactDeals(selectedContact.id).map((deal: any) => (
                        <Card key={deal.id} className="shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#1a252f]">{deal.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {deal.course_slug || 'No course'} | Expected close:{' '}
                                  {deal.expected_close_date
                                    ? new Date(deal.expected_close_date).toLocaleDateString()
                                    : '--'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {deal.value != null && (
                                  <span className="text-sm font-semibold text-[#1a252f]">
                                    £{deal.value.toLocaleString()}
                                  </span>
                                )}
                                <Badge variant={stageColor(deal.stage) as any}>{deal.stage}</Badge>
                              </div>
                            </div>
                            {deal.probability != null && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Probability</span>
                                  <span>{deal.probability}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className="bg-[#D4AF37] h-1.5 rounded-full"
                                    style={{ width: `${deal.probability}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="touchpoints" className="mt-4">
                  {getContactTouchpoints(selectedContact.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No touchpoints recorded.</p>
                  ) : (
                    <div className="relative space-y-0">
                      {getContactTouchpoints(selectedContact.id).map((tp: any, i: number) => (
                        <div key={tp.id} className="flex gap-3 pb-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37] mt-1.5" />
                            {i < getContactTouchpoints(selectedContact.id).length - 1 && (
                              <div className="w-0.5 flex-1 bg-border" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{tp.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(tp.created_at).toLocaleString()}
                              </span>
                            </div>
                            {tp.title && <p className="text-sm font-medium mt-1">{tp.title}</p>}
                            {tp.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">{tp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  {(() => {
                    // Match documents by user_id if we can find matching contact
                    const contactDocs = documents.filter((d: any) =>
                      d.user_id === selectedContact.id
                    );
                    if (contactDocs.length === 0) {
                      return <p className="text-sm text-muted-foreground py-4">No documents found.</p>;
                    }
                    return (
                      <div className="space-y-2">
                        {contactDocs.map((doc: any) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.file_name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{doc.document_type}</p>
                              </div>
                            </div>
                            <Badge variant={docStatusColor(doc.status) as any}>
                              {doc.status || 'uploaded'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudentCRM;
