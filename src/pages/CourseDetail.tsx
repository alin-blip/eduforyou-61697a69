import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { coursesData } from '@/data/courses';
import { ArrowLeft, MapPin, Clock, GraduationCap, Briefcase, CheckCircle2, ArrowRight, CalendarDays } from 'lucide-react';
import SEOHead, { courseSchema } from '@/components/SEOHead';

const CourseDetail = () => {
  const { slug } = useParams();
  const course = coursesData.find(c => c.slug === slug);

  if (!course) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Course not found</h1>
          <Link to="/cursuri"><Button>Back to Courses</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${course.title} - ${course.university}`}
        description={course.description}
        canonical={`https://eduforyou.co.uk/cursuri/${course.slug}`}
        jsonLd={courseSchema({ title: course.title, description: course.description, slug: course.slug, university: course.university, price: course.price, duration: course.duration })}
      />
      {/* Hero */}
      <section className="relative py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <Link to="/cursuri" className="inline-flex items-center gap-2 text-secondary-foreground/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">{course.category}</span>
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">{course.level}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{course.title}</h1>
              <p className="text-secondary-foreground/70 text-lg mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-8 text-sm text-secondary-foreground/60">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {course.campuses.length} Campuses</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {course.university}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-6">{course.price}</div>
              <div className="flex gap-4">
                <Link to="/eligibilitate">
                  <Button size="lg" className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2">
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-navy-light/30">
                    Ask a Question
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <img src={course.image} alt={course.title} className="w-full h-80 object-cover rounded-2xl border border-navy-light/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Modules */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" /> Course Modules
              </h2>
              <div className="space-y-3">
                {course.modules.map((mod, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-4 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <span className="text-foreground">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Careers + Campuses */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" /> Career Paths
                </h2>
                <div className="flex flex-wrap gap-2">
                  {course.careers.map((career, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">{career}</span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" /> Available Campuses
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {course.campuses.map((campus, i) => (
                    <Link key={i} to={`/locatii/${campus.toLowerCase().replace(' ', '-')}`}
                      className="bg-card rounded-lg p-4 border border-border hover:border-primary/30 transition-all text-center">
                      <span className="font-semibold text-foreground">{campus}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-primary/10 to-gold/10 rounded-2xl p-8 border border-primary/20">
                <h3 className="font-display font-bold text-xl text-foreground mb-3">Ready to Apply?</h3>
                <p className="text-muted-foreground mb-6">Check your eligibility in 2 minutes. Our team will guide you through the entire process — completely free.</p>
                <Link to="/eligibilitate">
                  <Button className="bg-primary hover:bg-orange-dark text-primary-foreground font-semibold gap-2 w-full">
                    Check Eligibility <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
