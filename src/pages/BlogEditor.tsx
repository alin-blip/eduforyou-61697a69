import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, EyeOff, X, Plus, Image as ImageIcon } from 'lucide-react';

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    cover_image: '',
    tags: [] as string[],
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      supabase.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt || '',
            category: data.category || '',
            cover_image: data.cover_image || '',
            tags: data.tags || [],
            published: data.published || false,
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: isEditing && f.slug ? f.slug : title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) {
      toast({ title: 'Completează titlul, slug-ul și conținutul', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      excerpt: form.excerpt || null,
      category: form.category || null,
      cover_image: form.cover_image || null,
      tags: form.tags,
      published: form.published,
    };

    if (isEditing) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', id);
      if (error) toast({ title: 'Eroare la salvare', description: error.message, variant: 'destructive' });
      else toast({ title: 'Articol actualizat cu succes' });
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) toast({ title: 'Eroare la creare', description: error.message, variant: 'destructive' });
      else {
        toast({ title: 'Articol creat cu succes' });
        navigate('/admin?tab=blog');
      }
    }
    setSaving(false);
  };

  // Simple markdown to HTML renderer
  const renderedContent = useMemo(() => {
    if (!form.content) return '<p class="text-muted-foreground italic">Previzualizare conținut...</p>';
    return form.content
      .split('\n\n')
      .map(block => {
        if (block.startsWith('## ')) return `<h2 class="text-xl font-bold mt-6 mb-2">${block.slice(3)}</h2>`;
        if (block.startsWith('### ')) return `<h3 class="text-lg font-semibold mt-4 mb-2">${block.slice(4)}</h3>`;
        if (block.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-6 mb-3">${block.slice(2)}</h1>`;
        if (block.includes('\n- ') || block.startsWith('- ')) {
          const items = block.split('\n').filter(l => l.startsWith('- ')).map(l => `<li class="ml-4">${l.slice(2)}</li>`).join('');
          return `<ul class="list-disc pl-4 space-y-1 my-3">${items}</ul>`;
        }
        // Bold and italic
        let html = block
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline">$1</a>');
        return `<p class="my-2 leading-relaxed">${html}</p>`;
      })
      .join('');
  }, [form.content]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-6 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin?tab=blog')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Înapoi
              </Button>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isEditing ? 'Editează articol' : 'Articol nou'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} />
                {form.published ? 'Published' : 'Draft'}
              </label>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showPreview ? 'Ascunde preview' : 'Arată preview'}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> {saving ? 'Se salvează...' : 'Salvează'}
              </Button>
            </div>
          </div>

          <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
            {/* Editor */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Titlu</label>
                  <Input
                    placeholder="Titlul articolului"
                    value={form.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Slug (URL)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/blog/</span>
                    <Input
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Excerpt</label>
                  <Textarea
                    placeholder="Scurtă descriere a articolului..."
                    value={form.excerpt}
                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Categorie</label>
                    <Input
                      placeholder="ex: Student Visa"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      <ImageIcon className="w-3 h-3 inline mr-1" />Cover Image URL
                    </label>
                    <Input
                      placeholder="https://..."
                      value={form.cover_image}
                      onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                    />
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Taguri</label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Adaugă tag..."
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={addTag} type="button">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {form.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Conținut (Markdown)</label>
                <Textarea
                  placeholder="Scrie conținutul articolului folosind Markdown..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-6">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Previzualizare
                  </div>
                  {form.cover_image && (
                    <img
                      src={form.cover_image}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                  {form.category && (
                    <Badge variant="secondary" className="mb-2">{form.category}</Badge>
                  )}
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {form.title || 'Titlul articolului'}
                  </h1>
                  {form.excerpt && (
                    <p className="text-muted-foreground italic mb-4 border-l-2 border-primary pl-3">
                      {form.excerpt}
                    </p>
                  )}
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {form.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogEditor;
