import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const blogPosts = [
  { id: '1', slug: 'how-student-finance-works', title: 'How Student Finance Works in the UK', excerpt: 'A complete guide to understanding Student Finance England, from eligibility to repayment.', category: 'Student Finance', date: '2024-01-15', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
  { id: '2', slug: 'choosing-right-university-course', title: 'How to Choose the Right University Course', excerpt: 'Discover how to find the perfect course that aligns with your career goals and passions.', category: 'Career Advice', date: '2024-01-10', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80' },
  { id: '3', slug: 'student-life-in-london', title: 'Student Life in London: What to Expect', excerpt: 'Everything you need to know about studying and living in London as a university student.', category: 'Student Life', date: '2024-01-05', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: '4', slug: 'settled-status-university-education', title: 'EU Settled Status and University Education', excerpt: 'How EU citizens with settled or pre-settled status can access UK university education.', category: 'Eligibility', date: '2023-12-20', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80' },
  { id: '5', slug: 'top-careers-2024', title: 'Top In-Demand Careers for 2024 Graduates', excerpt: 'Explore the most sought-after careers and how a UK degree can help you get there.', category: 'Career Advice', date: '2023-12-15', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80' },
  { id: '6', slug: 'ikigai-find-purpose', title: 'Using Ikigai to Find Your Career Purpose', excerpt: 'Learn how the Japanese concept of Ikigai can help you discover your perfect career path.', category: 'Personal Development', date: '2023-12-10', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
];

const BlogPage = () => (
  <Layout>
    <section className="py-20 bg-navy-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Blog</h1>
        <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Guides, tips, and insights to help you navigate your UK education journey.</p>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/blog/${post.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                  <h3 className="font-display font-bold text-lg text-card-foreground mt-3 mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="text-sm text-muted-foreground mt-3">{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default BlogPage;
