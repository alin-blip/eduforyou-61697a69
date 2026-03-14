import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => { fetchBlog(); }, []);

  const fetchBlog = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

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

  return (
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
          {posts.map(post => (
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
          {posts.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No blog posts yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminBlog;
