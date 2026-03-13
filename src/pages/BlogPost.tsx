import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  title: string;
  category: string | null;
  created_at: string;
  cover_image: string | null;
  content: string;
  author: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('blog_posts')
      .select('title, category, created_at, cover_image, content, author')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/blog"><Button>Back to Blog</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-secondary-foreground/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          {post.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">{post.category}</span>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl">{post.title}</h1>
          <p className="text-secondary-foreground/60">
            {post.author && <span>{post.author} · </span>}
            {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10" />
          )}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">{block.replace('## ', '')}</h2>;
              if (block.startsWith('- ')) return <ul key={i} className="space-y-2 my-4">{block.split('\n').map((li, j) => <li key={j} className="flex items-start gap-2 text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />{li.replace('- ', '')}</li>)}</ul>;
              return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{block}</p>;
            })}
          </div>
          <div className="mt-12 bg-gradient-to-br from-primary/5 to-gold/5 rounded-2xl p-8 border border-primary/10 text-center">
            <h3 className="font-display text-xl font-bold text-foreground mb-3">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-6">Check your eligibility in 2 minutes — completely free.</p>
            <Link to="/eligibilitate">
              <Button className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                Check Eligibility <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
