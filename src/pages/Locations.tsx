import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';
import { locationsData } from '@/data/locations';
import { MapPin, Users, BookOpen } from 'lucide-react';

const LocationsPage = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('locations.title')}
          </h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Study at one of our 6 campuses across the United Kingdom. Each location offers excellent facilities and a supportive learning environment.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationsData.map((loc, i) => (
              <motion.div key={loc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/locatii/${loc.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="relative h-52 overflow-hidden">
                    <img src={loc.image} alt={`${loc.name} Campus`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-display text-2xl font-bold text-primary-foreground">{loc.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{loc.description}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-primary" /> {loc.courses} courses</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4 text-primary" /> {loc.students} students</span>
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

export default LocationsPage;
