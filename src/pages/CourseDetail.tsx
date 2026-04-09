import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { coursesData } from '@/data/courses';
import { ArrowLeft, MapPin, Clock, GraduationCap, Briefcase, CheckCircle2, ArrowRight, CalendarDays, FileText, ClipboardList, MessageSquare, Info, BookOpen } from 'lucide-react';
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

  const getNextIntake = () => {
    if (!course.intakes || course.intakes.length === 0) return null;
    const now = new Date();
    const upcoming = course.intakes
      .filter(i => new Date(i.start_date) >= now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return upcoming.length > 0 ? upcoming[0] : course.intakes[course.intakes.length - 1];
  };

  const nextIntake = getNextIntake();

  return (
    <Layout>
      <SEOHead
        title={`${course.title} - Accredited UK University Partner`}
        description={`${course.title} - ${course.level} ${course.studyMode} course. Available at ${course.campuses.slice(0, 3).join(', ')}. Apply now through EduForYou.`}
        canonical={`https://eduforyou.co.uk/cursuri/${course.slug}`}
        jsonLd={courseSchema({ title: course.title, description: course.description, slug: course.slug, university: 'Accredited UK University Partner', price: course.fees || 'Student Finance Available', duration: course.duration || course.studyMode })}
      />
      {/* Hero */}
      <section className="relative py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <Link to="/cursuri" className="inline-flex items-center gap-2 text-secondary-foreground/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">{course.level}</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">{course.studyMode}</span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">{course.category}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-secondary-foreground/60">
                {course.duration && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration} {course.duration && !course.duration.includes('year') ? 'years' : ''}</span>
                )}
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {course.campuses.length} Campus{course.campuses.length !== 1 ? 'es' : ''}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> Accredited UK University Partner</span>
              </div>
              {course.fees ? (
                <div className="text-2xl font-bold text-primary mb-4">{course.fees}</div>
              ) : (
                <div className="text-2xl font-bold text-success mb-4">Student Finance Available</div>
              )}
              {nextIntake && (
                <div className="flex items-center gap-2 text-secondary-foreground/70 mb-6">
                  <CalendarDays className="w-5 h-5" />
                  <span>Next Intake: <strong className="text-primary-foreground">{nextIntake.label}</strong></span>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Link to="/eligibilitate">
                  <Button size="lg" className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2">
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold gap-2">
                    <CalendarDays className="w-5 h-5" /> Book Appointment
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Entry Requirements */}
              {course.entryRequirements && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Entry Requirements
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.entryRequirements}</div>
                </div>
              )}

              {/* Documents Required */}
              {course.documentsRequired && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Documents Required
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.documentsRequired}</div>
                </div>
              )}

              {/* Interview Info */}
              {course.interviewInfo && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> Interview Information
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.interviewInfo}</div>
                </div>
              )}

              {/* Admission Test Info */}
              {course.admissionTestInfo && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Admission Test
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.admissionTestInfo}</div>
                </div>
              )}

              {/* Personal Statement */}
              {course.personalStatementGuidelines && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Personal Statement Guidelines
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.personalStatementGuidelines}</div>
                </div>
              )}

              {/* Additional Info */}
              {course.additionalInfo && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> Additional Information
                  </h2>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{course.additionalInfo}</div>
                </div>
              )}

              {/* Show message if no details available */}
              {!course.entryRequirements && !course.documentsRequired && !course.interviewInfo && !course.admissionTestInfo && (
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <p className="text-muted-foreground">Detailed requirements for this course will be provided during the application process. Book an appointment for personalised guidance.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Campuses */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Available Campuses
                </h2>
                <div className="space-y-2">
                  {course.campuses.map((campus, i) => (
                    <Link key={i} to={`/locatii/${campus.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block bg-muted rounded-lg p-3 hover:bg-muted/80 transition-all text-center">
                      <span className="font-medium text-foreground text-sm">{campus}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Intakes */}
              {course.intakes.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" /> Available Intakes
                  </h2>
                  <div className="space-y-2">
                    {course.intakes.map((intake, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted rounded-lg p-3">
                        <span className="font-medium text-foreground text-sm">{intake.label}</span>
                        <span className="text-xs text-muted-foreground">{intake.start_date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-primary/10 to-gold/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="font-display font-bold text-lg text-foreground mb-3">Ready to Apply?</h3>
                <p className="text-muted-foreground text-sm mb-5">Check your eligibility in 2 minutes. Our team will guide you through the entire process — completely free.</p>
                <Link to="/eligibilitate">
                  <Button className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2 w-full">
                    Check Eligibility <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Key Info Card */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Key Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium text-foreground">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study Mode</span>
                    <span className="font-medium text-foreground">{course.studyMode}</span>
                  </div>
                  {course.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{course.duration} {!course.duration.includes('year') ? 'years' : ''}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium text-foreground">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Funding</span>
                    <span className="font-medium text-success">{course.fees || 'Student Finance'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
