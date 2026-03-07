import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const blogContent: Record<string, { title: string; category: string; date: string; image: string; content: string }> = {
  'how-student-finance-works': {
    title: 'How Student Finance Works in the UK',
    category: 'Student Finance',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    content: `Student Finance England (SFE) provides financial support to eligible students studying at UK universities. Here's everything you need to know:\n\n## Tuition Fee Loan\nCovers up to £9,535 per year, paid directly to your university. You don't need to pay this upfront.\n\n## Maintenance Loan\nHelps with living costs — up to £14,000/year in London, up to £10,500/year outside London.\n\n## Repayment\nYou only start repaying after you graduate AND earn above £25,000/year. The repayment is 9% of income above that threshold. After 40 years, any remaining balance is written off.\n\n## Who is eligible?\n- UK/Irish citizens\n- EU citizens with settled or pre-settled status\n- Those with indefinite leave to remain\n- Refugees\n\nYou must have been living in the UK for at least 3 years before the start of your course.\n\n## How to apply\nEduForYou guides you through the entire Student Finance application process — completely free. Check your eligibility today!`,
  },
  'choosing-right-university-course': {
    title: 'How to Choose the Right University Course',
    category: 'Career Advice',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
    content: `Choosing the right university course is one of the most important decisions you'll make. Here's how to make the right choice:\n\n## Consider Your Interests\nThink about what subjects you enjoy and what topics you could study for 3-4 years without losing interest.\n\n## Research Career Outcomes\nLook at graduate employment rates and typical salaries for different courses.\n\n## Use the Ikigai Method\nOur Ikigai Quiz helps you find the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.\n\n## Talk to Current Students\nReach out to students currently studying the courses you're considering.\n\n## Consider the University\nLook at teaching quality, facilities, location, and student satisfaction ratings.\n\nNot sure where to start? Take our free Ikigai Quiz for personalised course recommendations!`,
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug] : null;

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
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">{post.category}</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl">{post.title}</h1>
          <p className="text-secondary-foreground/60">{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10" />
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
