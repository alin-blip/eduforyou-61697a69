import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { locationsData } from '@/data/locations';
import { coursesData } from '@/data/courses';
import { ArrowLeft, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

const LocationDetail = () => {
  const { slug } = useParams();
  const location = locationsData.find(l => l.slug === slug);

  if (!location) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Location not found</h1>
          <Link to="/locatii"><Button>Back to Locations</Button></Link>
        </div>
      </Layout>
    );
  }

  const locationCourses = coursesData.filter(c => c.campuses.some(campus => campus.toLowerCase().replace(' ', '-') === slug));

  return (
    <Layout>
      <section className="relative py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <Link to="/locatii" className="inline-flex items-center gap-2 text-secondary-foreground/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Locations
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 text-primary mb-4"><MapPin className="w-5 h-5" /><span className="font-medium">{location.address}</span></div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{location.name} Campus</h1>
              <p className="text-secondary-foreground/70 text-lg mb-8">{location.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-navy-light/30 rounded-xl p-4 border border-navy-light/20 text-center">
                  <div className="font-display text-2xl font-bold text-primary">{location.courses}</div>
                  <div className="text-sm text-secondary-foreground/60">Courses</div>
                </div>
                <div className="bg-navy-light/30 rounded-xl p-4 border border-navy-light/20 text-center">
                  <div className="font-display text-2xl font-bold text-primary">{location.students}</div>
                  <div className="text-sm text-secondary-foreground/60">Students</div>
                </div>
              </div>
              <Link to="/eligibilitate">
                <Button size="lg" className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2">
                  Apply to {location.name} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <img src={location.image} alt={location.name} className="w-full h-80 object-cover rounded-2xl border border-navy-light/20" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Campus Features</h2>
              <div className="space-y-3">
                {location.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-success" /><span className="text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Available Courses</h2>
              <div className="space-y-3">
                {locationCourses.map(course => (
                  <Link key={course.id} to={`/cursuri/${course.slug}`} className="flex items-center justify-between bg-card rounded-lg p-4 border border-border hover:border-primary/30 transition-all">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2">{course.level}</span>
                      <span className="font-medium text-foreground">{course.title}</span>
                    </div>
                    <span className="text-primary font-bold text-sm">{course.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LocationDetail;
