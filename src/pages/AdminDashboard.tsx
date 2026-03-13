import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, FileText, BookOpen, TrendingUp, Mail, Phone, Shield, Search, Plus, Trash2, Eye, Edit2, Save, X, Calendar, MapPin, MessageSquare, ShoppingCart } from 'lucide-react';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import CampusesTab from '@/components/admin/CampusesTab';
import SmsLogsTab from '@/components/admin/SmsLogsTab';
import AbandonedCartsTab from '@/components/admin/AbandonedCartsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

type AppRole = 'admin' | 'agent' | 'student';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [stats, setStats] = useState({ contacts: 0, applications: 0, quizzes: 0 });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Overview
  const [recentContacts, setRecentContacts] = useState<any[]>([]);

  // Users
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, AppRole[]>>({});
  const [userSearch, setUserSearch] = useState('');

  // Contacts
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');

  // Blog
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  // Applications
  const [applications, setApplications] = useState<any[]>([]);

  // Quiz Results
  const [quizResults, setQuizResults] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'contacts') fetchContacts();
    if (activeTab === 'blog') fetchBlog();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'quizzes') fetchQuizzes();
  }, [activeTab]);

  const fetchStats = async () => {
    const [contactsRes, appsRes, quizzesRes, recentRes] = await Promise.all([
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
      supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
    ]);
    setStats({ contacts: contactsRes.count || 0, applications: appsRes.count || 0, quizzes: quizzesRes.count || 0 });
    setRecentContacts(recentRes.data || []);
  };

  const fetchUsers = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
    ]);
    setProfiles(profilesRes.data || []);
    const rolesMap: Record<string, AppRole[]> = {};
    (rolesRes.data || []).forEach((r: any) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });
    setUserRoles(rolesMap);
  };

  const toggleRole = async (userId: string, role: AppRole) => {
    const hasIt = userRoles[userId]?.includes(role);
    if (hasIt) {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
    } else {
      await supabase.from('user_roles').insert({ user_id: userId, role });
    }
    fetchUsers();
    toast({ title: hasIt ? `Rol ${role} eliminat` : `Rol ${role} adăugat` });
  };

  const fetchContacts = async () => {
    let q = supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (contactFilter !== 'all') q = q.eq('status', contactFilter);
    const { data } = await q;
    setContacts(data || []);
  };

  const updateContactStatus = async (id: string, status: string) => {
    await supabase.from('contacts').update({ status }).eq('id', id);
    fetchContacts();
  };

  const fetchBlog = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setBlogPosts(data || []);
  };

  const savePost = async () => {};

  const deletePost = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchBlog();
    toast({ title: 'Post șters' });
  };

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from('blog_posts').update({ published: !published }).eq('id', id);
    fetchBlog();
    toast({ title: published ? 'Post retras din publicare' : 'Post publicat' });
  };

  const fetchApplications = async () => {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    setApplications(data || []);
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    fetchApplications();
  };

  const fetchQuizzes = async () => {
    const { data } = await supabase.from('quiz_results').select('*').order('created_at', { ascending: false });
    setQuizResults(data || []);
  };

  const statCards = [
    { label: 'Total Leads', value: stats.contacts, icon: Users, color: 'text-blue-500' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: 'text-green-500' },
    { label: 'Quiz Completions', value: stats.quizzes, icon: BookOpen, color: 'text-purple-500' },
  ];

  const filteredProfiles = profiles.filter(p =>
    !userSearch || (p.full_name || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    !contactSearch || c.full_name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <Layout>
      <section className="py-8 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || 'Admin'}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="contacts">Leads</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="campuses">Campuses</TabsTrigger>
              <TabsTrigger value="sms">SMS Logs</TabsTrigger>
              <TabsTrigger value="carts">Abandoned Carts</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map(card => (
                  <div key={card.label} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <card.icon className={`w-8 h-8 ${card.color}`} />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground">Recent Leads</h2>
                </div>
                <div className="divide-y divide-border">
                  {recentContacts.map(contact => (
                    <div key={contact.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{contact.full_name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                          {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                        </div>
                      </div>
                      <Badge variant={contact.status === 'new' ? 'default' : 'secondary'}>{contact.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* USERS */}
            <TabsContent value="users">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">User Management</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-center">Admin</TableHead>
                      <TableHead className="text-center">Agent</TableHead>
                      <TableHead className="text-center">Student</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || 'No name'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        {(['admin', 'agent', 'student'] as AppRole[]).map(role => (
                          <TableCell key={role} className="text-center">
                            <Switch
                              checked={userRoles[p.user_id]?.includes(role) || false}
                              onCheckedChange={() => toggleRole(p.user_id, role)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* CONTACTS / LEADS */}
            <TabsContent value="contacts">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="font-display text-xl font-bold text-foreground">Lead Pipeline</h2>
                  <div className="flex gap-3">
                    <Select value={contactFilter} onValueChange={v => { setContactFilter(v); }}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} className="pl-9 w-48" />
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
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.full_name}</TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm">{c.phone || '—'}</TableCell>
                        <TableCell className="text-sm">{c.course_interest || '—'}</TableCell>
                        <TableCell>
                          <Select value={c.status || 'new'} onValueChange={v => updateContactStatus(c.id, v)}>
                            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* APPLICATIONS */}
            <TabsContent value="applications">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground">All Applications</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Campus</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.course_slug}</TableCell>
                        <TableCell>{app.campus || '—'}</TableCell>
                        <TableCell>
                          <Select value={app.status || 'submitted'} onValueChange={v => updateAppStatus(app.id, v)}>
                            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="enrolled">Enrolled</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{app.notes || 'No notes'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {applications.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No applications yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* BLOG */}
            <TabsContent value="blog">
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Blog Posts</h2>
                  <Button size="sm" onClick={() => navigate('/admin/blog/new')}>
                    <Plus className="w-4 h-4 mr-1" /> New Post
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell className="text-sm">{post.category || '—'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(post.tags || []).slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={post.published ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => togglePublished(post.id, post.published)}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blog/${post.id}`)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {blogPosts.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No blog posts yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* QUIZZES */}
            <TabsContent value="quizzes">
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
                    {quizResults.map(qr => (
                      <TableRow key={qr.id}>
                        <TableCell className="font-medium capitalize">{qr.quiz_type}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{JSON.stringify(qr.answers).slice(0, 80)}...</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{qr.result ? JSON.stringify(qr.result).slice(0, 80) : '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(qr.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                    {quizResults.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No quiz results yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
