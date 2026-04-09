import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, MapPin, Calendar, BookOpen, Filter, X } from 'lucide-react';
import { coursesData, categories, levels, cities, studyModes } from '@/data/courses';
import SEOHead from '@/components/SEOHead';

const CoursesPage = () => {
  const { t } = useLanguage();
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [city, setCity] = useState('All');
  const [studyMode, setStudyMode] = useState('All');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return coursesData.filter(c => {
      if (category !== 'All' && c.category !== category) return false;
      if (level !== 'All' && c.level !== level) return false;
      if (city !== 'All' && !c.campuses.some(camp => camp.toLowerCase().includes(city.toLowerCase()))) return false;
      if (studyMode !== 'All' && c.studyMode !== studyMode) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, level, city, studyMode, search]);

  const activeFilters = [category, level, city, studyMode].filter(f => f !== 'All').length;

  const clearFilters = () => {
    setCategory('All');
    setLevel('All');
    setCity('All');
    setStudyMode('All');
    setSearch('');
  };

  const getNextIntake = (intakes: { label: string; start_date: string }[]) => {
    if (!intakes || intakes.length === 0) return null;
    const now = new Date();
    const upcoming = intakes
      .filter(i => new Date(i.start_date) >= now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return upcoming.length > 0 ? upcoming[0] : intakes[intakes.length - 1];
  };

  return (
    <Layout>
      <SEOHead title="University Courses UK | 145+ Accredited Programmes" description="Browse 145+ accredited university courses across Business, Computing, Engineering, Psychology and more. Flexible study options with Student Finance available." canonical="/cursuri" />
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
          {/* Search + Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:border-primary/30'}`}
            >
              <Filter className="w-4 h-4" />
              Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-card rounded-xl border border-border p-6 space-y-5"
            >
              {/* Level Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Level</label>
                <div className="flex gap-2 flex-wrap">
                  {levels.map(l => (
                    <button key={l} onClick={() => setLevel(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${level === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">City / Campus</label>
                <div className="flex gap-2 flex-wrap">
                  {cities.map(c => (
                    <button key={c} onClick={() => setCity(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${city === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Mode Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Study Mode</label>
                <div className="flex gap-2 flex-wrap">
                  {studyModes.map(m => (
                    <button key={m} onClick={() => setStudyMode(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${studyMode === m ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">{filtered.length}</span> courses found
          </p>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => {
              const nextIntake = getNextIntake(course.intakes);
              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}>
                  <Link to={`/cursuri/${course.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary/30 h-full">
                    <div className="relative h-44 overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold">{course.level}</span>
                        <span className="px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">{course.studyMode}</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col h-[calc(100%-11rem)]">
                      <h3 className="font-display font-bold text-base text-card-foreground mb-2 line-clamp-2 leading-snug">{course.title}</h3>

                      <div className="mt-auto space-y-2 pt-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{course.campuses.slice(0, 3).join(', ')}{course.campuses.length > 3 ? ` +${course.campuses.length - 3}` : ''}</span>
                        </div>

                        {nextIntake && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>Next: {nextIntake.label}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span>Accredited UK University Partner</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          {course.fees ? (
                            <span className="text-primary font-bold text-sm">{course.fees}</span>
                          ) : (
                            <span className="text-success font-semibold text-sm">Student Finance Available</span>
                          )}
                          <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                            Details <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No courses match your filters.</p>
              <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;
