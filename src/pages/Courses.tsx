import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search } from 'lucide-react';
import { coursesData, categories, levels } from '@/data/courses';
import SEOHead from '@/components/SEOHead';

const CoursesPage = () => {
  const { t } = useLanguage();
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = coursesData.filter(c => {
    if (category !== 'All' && c.category !== category) return false;
    if (level !== 'All' && c.level !== level) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout>
      <SEOHead title="Free University Courses UK" description="Browse 50+ free university courses across Business, Computing, Psychology and more. 100% funded through Student Finance." canonical="/cursuri" />
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('courses.title')}
          </h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">{t('courses.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:border-primary/30'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${level === l ? 'bg-secondary text-secondary-foreground' : 'bg-card border border-border text-foreground hover:border-primary/30'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} courses found</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/cursuri/${course.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">{course.category}</span>
                      <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold">{course.level}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-card-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <div className="text-sm text-muted-foreground mb-3">{course.duration} · {course.campuses.length} Campuses</div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">{course.price}</span>
                      <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;
