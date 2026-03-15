import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { Megaphone, Loader2, TrendingUp, Eye, FileText, Target } from 'lucide-react';

const COLORS = ['#0a1628', '#d4a843', '#2a4570', '#b8912e', '#22c55e', '#6b7280'];

const CeoCmo = () => {
  const [content, setContent] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [c, conts, blogs] = await Promise.all([
      supabase.from('ai_content').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('id, source, created_at'),
      supabase.from('blog_posts').select('id, title, status, created_at, views'),
    ]);
    setContent(c.data || []);
    setContacts(conts.data || []);
    setBlogPosts(blogs.data || []);
    setLoading(false);
  };

  const publishedContent = content.filter((c) => c.status === 'published');
  const avgScore = content.filter((c) => c.cmo_score != null).length > 0
    ? (content.filter((c) => c.cmo_score != null).reduce((s, c) => s + (c.cmo_score || 0), 0) / content.filter((c) => c.cmo_score != null).length).toFixed(1)
    : 'N/A';

  // Content by type
  const contentByType = content.reduce((acc: Record<string, number>, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(contentByType).map(([name, value]) => ({ name, value }));

  // Lead sources
  const sourceData = contacts.reduce((acc: Record<string, number>, c) => {
    const src = c.source || 'direct';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourcePie = Object.entries(sourceData).map(([name, value]) => ({ name, value }));

  // Content production trend
  const contentTrend = content.reduce((acc: any[], item) => {
    const month = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.count++;
    else acc.push({ month, count: 1 });
    return acc;
  }, []).slice(-8);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
        <Megaphone className="w-7 h-7 text-[#d4a843]" /> CMO / Marketing Overview
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Content', value: content.length, icon: FileText, color: 'text-blue-600' },
          { label: 'Published', value: publishedContent.length, icon: Eye, color: 'text-emerald-600' },
          { label: 'Avg CMO Score', value: `${avgScore}/10`, icon: Target, color: 'text-[#d4a843]' },
          { label: 'Total Leads', value: contacts.length, icon: TrendingUp, color: 'text-purple-600' },
        ].map((k) => (
          <Card key={k.label} className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <k.icon className={`w-5 h-5 ${k.color} mb-2`} />
              <p className="text-2xl font-bold text-[#0a1628]">{k.value}</p>
              <p className="text-sm text-gray-500">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Content by Type</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#d4a843" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-[#0a1628]">Lead Sources</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourcePie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sourcePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Production Trend */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Content Production Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#0a1628" strokeWidth={2} dot={{ fill: '#d4a843', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Blog Posts */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#0a1628]">Blog Posts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {blogPosts.slice(0, 8).map((post) => (
            <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0a1628] truncate">{post.title}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {post.views != null && <span className="text-xs text-gray-500">{post.views} views</span>}
                <Badge variant={post.status === 'published' ? 'default' : 'outline'}>{post.status}</Badge>
              </div>
            </div>
          ))}
          {blogPosts.length === 0 && <p className="text-gray-400 text-center py-6">No blog posts</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CeoCmo;
