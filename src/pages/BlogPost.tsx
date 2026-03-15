import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, User, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEOHead, { blogPostSchema } from '@/components/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';
import NewsletterForm from '@/components/NewsletterForm';

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  created_at: string;
  cover_image: string | null;
  content: string;
  author: string | null;
  excerpt?: string | null;
  read_time?: string | null;
}

// Schema markup for SEO articles
const BLOG_SCHEMA: Record<string, object> = {
  'cat-primesti-student-finance-uk-2026': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://www.eduforyou.co.uk/blog/cat-primesti-student-finance-uk-2026' },
    'headline': 'Cat Primesti de la Student Finance UK in 2026? Sume, Conditii si Cum Aplici',
    'description': 'Descopera exact cat poti primi de la Student Finance England in 2026: taxe de scolarizare, imprumut de intretinere si granturi speciale NHS.',
    'image': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    'author': { '@type': 'Person', 'name': 'Alin Radu' },
    'publisher': { '@type': 'Organization', 'name': 'EduForYou', 'logo': { '@type': 'ImageObject', 'url': 'https://www.eduforyou.co.uk/og-image.webp' } },
    'datePublished': '2026-03-10',
    'dateModified': '2026-03-10',
    'inLanguage': 'ro-RO',
    'keywords': 'student finance UK 2026, cat primesti student finance, imprumut intretinere UK, taxe scolarizare UK, student finance romani',
  },
  'inscriere-facultate-uk-fara-bac-ghid-2026': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://www.eduforyou.co.uk/blog/inscriere-facultate-uk-fara-bac-ghid-2026' },
    'headline': 'Inscriere Facultate UK Fara BAC -- Ghid Complet 2026 pentru Romani',
    'description': 'Poti studia la universitate in UK fara BAC romanesc. Descopera cum functioneaza recunoasterea calificarilor, ce cursuri sunt accesibile si cum aplici pas cu pas.',
    'image': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    'author': { '@type': 'Person', 'name': 'Alin Radu' },
    'publisher': { '@type': 'Organization', 'name': 'EduForYou', 'logo': { '@type': 'ImageObject', 'url': 'https://www.eduforyou.co.uk/og-image.webp' } },
    'datePublished': '2026-03-10',
    'dateModified': '2026-03-10',
    'inLanguage': 'ro-RO',
    'keywords': 'inscriere facultate UK fara bac, universitate UK romani fara bac, foundation year UK, studii UK fara diploma bacalaureat',
  },
  'health-social-care-uk-curs-finantare-cariera': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://www.eduforyou.co.uk/blog/health-social-care-uk-curs-finantare-cariera' },
    'headline': 'Health and Social Care UK -- Curs, Finantare si Cariera 2026',
    'description': 'Health and Social Care este unul din cele mai cautate domenii in UK. Descopera cursurile disponibile, finantarea de la SFE si perspectivele de cariera pentru romani.',
    'image': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    'author': { '@type': 'Person', 'name': 'Alin Radu' },
    'publisher': { '@type': 'Organization', 'name': 'EduForYou', 'logo': { '@type': 'ImageObject', 'url': 'https://www.eduforyou.co.uk/og-image.webp' } },
    'datePublished': '2026-03-10',
    'dateModified': '2026-03-10',
    'inLanguage': 'ro-RO',
    'keywords': 'health social care UK, curs health social care romani, NHS UK romani, BSc health wellbeing social care, finantare health social care UK',
  },
  'studii-gratuite-uk-cum-functioneaza-student-finance': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://www.eduforyou.co.uk/blog/studii-gratuite-uk-cum-functioneaza-student-finance' },
    'headline': 'Studii Gratuite UK -- Cum Functioneaza Student Finance England 2026',
    'description': 'Studiile universitare in UK sunt practic gratuite pentru romanii cu settled status. Descopera cum functioneaza Student Finance England si de ce nu platesti nimic din buzunar.',
    'image': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    'author': { '@type': 'Person', 'name': 'Alin Radu' },
    'publisher': { '@type': 'Organization', 'name': 'EduForYou', 'logo': { '@type': 'ImageObject', 'url': 'https://www.eduforyou.co.uk/og-image.webp' } },
    'datePublished': '2026-03-10',
    'dateModified': '2026-03-10',
    'inLanguage': 'ro-RO',
    'keywords': 'studii gratuite UK, student finance england, cum functioneaza student finance, universitate gratuita UK romani, finantare studii UK',
  },
  'top-cursuri-universitare-romani-uk-2026': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://www.eduforyou.co.uk/blog/top-cursuri-universitare-romani-uk-2026' },
    'headline': 'Top 10 Cursuri Universitare pentru Romani in UK 2026 -- Finantate de SFE',
    'description': 'Descopera cele mai populare si bine platite cursuri universitare pentru romanii din UK in 2026. Toate finantate de Student Finance England.',
    'image': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    'author': { '@type': 'Person', 'name': 'Alin Radu' },
    'publisher': { '@type': 'Organization', 'name': 'EduForYou', 'logo': { '@type': 'ImageObject', 'url': 'https://www.eduforyou.co.uk/og-image.webp' } },
    'datePublished': '2026-03-10',
    'dateModified': '2026-03-10',
    'inLanguage': 'ro-RO',
    'keywords': 'cursuri universitare romani UK, top cursuri UK, business UK romani, health social care UK, construction management UK, finantare SFE',
  },
  'ghid-complet-studii-universitare-uk-romani': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://www.eduforyou.co.uk/blog/ghid-complet-studii-universitare-uk-romani',
    },
    'headline': 'Ghid Complet Studii Universitare UK pentru Romani | Finantare si Cariera 2026',
    'description': 'Afla cum poti accesa studii universitare in UK cu finantare de la Student Finance. Ghid complet pentru romanii cu settled status: inscriere, cursuri, IKIGAI si cariera.',
    'image': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
    'author': {
      '@type': 'Person',
      'name': 'Alin Radu',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'EduForYou',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.eduforyou.co.uk/og-image.webp',
      },
    },
    'datePublished': '2026-02-24',
    'dateModified': '2026-02-24',
    'inLanguage': 'ro-RO',
    'keywords': 'student finance UK romani, universitate UK romani, studii UK finantare, IKIGAI cariera UK, cum sa te inscrii la universitate in UK, settled status studii UK, Londra, Birmingham, Leeds, Manchester',
  },
  'second-degree-finantare-integrala-uk': {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://www.eduforyou.co.uk/blog/second-degree-finantare-integrala-uk',
    },
    'headline': 'A Doua Facultate cu Finantare Integrala in UK: Ghid Complet 2026',
    'description': 'Ai deja o diploma? Poti urma o a doua facultate in UK cu finantare integrala de la SFE -- taxe de scolarizare, imprumut de intretinere si grant NHS de 5,000 GBP/an.',
    'image': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    'author': {
      '@type': 'Person',
      'name': 'Alin Radu',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'EduForYou',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.eduforyou.co.uk/og-image.webp',
      },
    },
    'datePublished': '2026-02-25',
    'dateModified': '2026-02-25',
    'inLanguage': 'ro-RO',
    'keywords': 'second degree UK, a doua facultate UK, finantare integrala second degree, NHS Learning Support Fund, nursing UK romani, midwifery UK, SFE second degree, ELQ exceptions UK',
  },
};

// Slugs that should render the newsletter/waitlist form inline
const WAITLIST_SLUGS = ['second-degree-finantare-integrala-uk'];

// Related articles mapping for internal linking
const RELATED_SLUGS: Record<string, string[]> = {
  'cat-primesti-student-finance-uk-2026': ['studii-gratuite-uk-cum-functioneaza-student-finance', 'inscriere-facultate-uk-fara-bac-ghid-2026', 'ghid-complet-studii-universitare-uk-romani'],
  'inscriere-facultate-uk-fara-bac-ghid-2026': ['cat-primesti-student-finance-uk-2026', 'top-cursuri-universitare-romani-uk-2026'],
  'health-social-care-uk-curs-finantare-cariera': ['top-cursuri-universitare-romani-uk-2026', 'cat-primesti-student-finance-uk-2026', 'second-degree-finantare-integrala-uk'],
  'studii-gratuite-uk-cum-functioneaza-student-finance': ['cat-primesti-student-finance-uk-2026', 'inscriere-facultate-uk-fara-bac-ghid-2026', 'ghid-complet-studii-universitare-uk-romani'],
  'top-cursuri-universitare-romani-uk-2026': ['health-social-care-uk-curs-finantare-cariera', 'cat-primesti-student-finance-uk-2026', 'inscriere-facultate-uk-fara-bac-ghid-2026'],
  'ghid-complet-studii-universitare-uk-romani': ['cat-primesti-student-finance-uk-2026', 'studii-gratuite-uk-cum-functioneaza-student-finance'],
  'second-degree-finantare-integrala-uk': ['health-social-care-uk-curs-finantare-cariera', 'top-cursuri-universitare-romani-uk-2026', 'cat-primesti-student-finance-uk-2026'],
};

const BlogPost = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const showWaitlist = slug ? WAITLIST_SLUGS.includes(slug) : false;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    supabase
      .from('blog_posts')
      .select('id, slug, title, category, created_at, cover_image, content, author')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data as Post | null);
        setLoading(false);
      });
  }, [slug]);

  // Fetch related articles
  useEffect(() => {
    if (!slug) return;
    const relSlugs = RELATED_SLUGS[slug];
    if (!relSlugs || relSlugs.length === 0) {
      setRelatedPosts([]);
      return;
    }

    supabase
      .from('blog_posts')
      .select('id, slug, title, category, created_at, cover_image, content, author')
      .in('slug', relSlugs)
      .eq('published', true)
      .limit(3)
      .then(({ data }) => {
        setRelatedPosts((data as Post[]) || []);
      });
  }, [slug]);

  // Get custom schema or auto-generate from post
  const schema = useMemo(() => {
    if (slug && BLOG_SCHEMA[slug]) return BLOG_SCHEMA[slug];
    if (post) {
      return blogPostSchema({
        title: post.title,
        excerpt: post.content.substring(0, 155),
        slug: slug!,
        author: post.author || 'EduForYou Team',
        created_at: post.created_at,
        cover_image: post.cover_image || undefined,
      });
    }
    return undefined;
  }, [slug, post]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-[#2C3E50] mb-4">Article not found</h1>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const readTime = (post as any).read_time || `${Math.max(3, Math.ceil(post.content.length / 1500))} min`;
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Layout>
      <SEOHead
        title={post.title}
        description={post.content.substring(0, 155)}
        canonical={`https://eduforyou.co.uk/blog/${slug}`}
        ogImage={post.cover_image || undefined}
        jsonLd={schema}
      />

      {/* Header */}
      <section className="bg-[#1a252f] py-12">
        <div className="container max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="text-white/60 hover:text-white mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('blog.backToBlog') || 'Back to Blog'}
            </Button>
          </Link>
          {post.category && (
            <Badge className="mb-3 bg-[#E67E22]/20 text-[#f0a05c] border-[#E67E22]/30">{post.category}</Badge>
          )}
          <h1 className="text-2xl lg:text-4xl font-serif text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author || 'EduForYou Team'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formattedDate}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl mb-8"
            />
          )}
          <article
            className="prose prose-lg max-w-none prose-headings:text-[#2C3E50] prose-headings:font-serif prose-a:text-[#E67E22] prose-strong:text-[#2C3E50] prose-table:border-collapse prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Waitlist / Newsletter Form — rendered after article content for waitlist posts */}
          {showWaitlist && (
            <div className="my-12">
              <NewsletterForm variant="card" />
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-[#2C3E50] to-[#5B2C6F] rounded-xl text-white text-center">
            <h3 className="text-xl font-serif mb-2">{t('home.ctaTitle') || 'Ready to Start Your Journey?'}</h3>
            <p className="text-white/80 mb-4">{t('home.ctaDesc') || 'Check your eligibility in 2 minutes -- completely free.'}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/eligibilitate">
                <Button className="bg-[#E67E22] hover:bg-[#d35400] text-white">
                  {t('home.ctaButton') || 'Check Eligibility'}
                </Button>
              </Link>
              <Link to="/ikigai">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  {t('nav.ikigaiQuiz') || 'IKIGAI Quiz'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Articles -- Internal Linking */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-serif text-[#2C3E50] mb-6">Articole Recomandate</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((rel) => (
                  <Link key={rel.slug} to={`/blog/${rel.slug}`}>
                    <div className="group border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
                      {rel.cover_image && (
                        <img src={rel.cover_image} alt={rel.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      )}
                      <div className="p-4">
                        {rel.category && (
                          <Badge className="mb-2 text-xs bg-[#E67E22]/10 text-[#E67E22] border-[#E67E22]/20">{rel.category}</Badge>
                        )}
                        <h4 className="text-sm font-serif text-[#2C3E50] group-hover:text-[#E67E22] transition-colors line-clamp-2">{rel.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{Math.max(3, Math.ceil(rel.content.length / 1500))} min
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-8 bg-[#E67E22]">
        <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-[#1a252f] text-lg font-bold">Verifica-ti eligibilitatea acum. Gratuit.</p>
            <p className="text-[#1a252f]/70 text-sm">Afla in 2 minute ce cursuri poti accesa cu finantare integrala.</p>
          </div>
          <Link to="/eligibilitate">
            <Button className="bg-[#1a252f] hover:bg-[#2C3E50] text-white shrink-0">
              Verifica Eligibilitatea <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
