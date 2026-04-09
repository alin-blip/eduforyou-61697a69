import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  PoundSterling,
  Users,
  Award,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface CourseData {
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  longDescription: string;
  modules: string[];
  outcomes: string[];
  gradient: string;
}

const coursesData: Record<string, CourseData> = {
  'project-management-pmp': {
    title: 'Project Management Professional (PMP)',
    category: 'Business',
    duration: '12 săptămâni',
    price: '£1,200',
    description: 'Obține certificarea PMP recunoscută internațional.',
    longDescription:
      'Acest curs intensiv te pregătește pentru examenul PMP, cea mai recunoscută certificare în project management la nivel mondial. Vei învăța metodologii Agile și Waterfall, managementul riscurilor, planificarea resurselor și comunicarea cu stakeholderii.',
    modules: [
      'Introducere în Project Management',
      'Planificarea și Definirea Scopului',
      'Managementul Timpului și Resurselor',
      'Managementul Riscurilor',
      'Metodologii Agile & Scrum',
      'Comunicare și Leadership',
      'Managementul Calității',
      'Pregătire Examen PMP',
    ],
    outcomes: [
      'Certificare PMP recunoscută internațional',
      'Competențe practice de project management',
      'Acces la comunitatea globală PMI',
      'Creștere salarială medie de 20%',
    ],
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  'digital-marketing': {
    title: 'Digital Marketing Masterclass',
    category: 'Marketing',
    duration: '8 săptămâni',
    price: '£850',
    description: 'Stăpânește marketingul digital de la A la Z.',
    longDescription:
      'Un curs complet care acoperă toate aspectele marketingului digital modern. De la SEO și Google Ads la Social Media Marketing și Content Strategy, vei dobândi competențe practice cerute de angajatori.',
    modules: [
      'Fundamentele Marketing-ului Digital',
      'SEO & Optimizare pentru Motoare de Căutare',
      'Google Ads & PPC',
      'Social Media Marketing',
      'Email Marketing & Automation',
      'Content Strategy & Copywriting',
      'Analytics & Raportare',
      'Proiect Final & Portofoliu',
    ],
    outcomes: [
      'Certificare Google Ads & Analytics',
      'Portofoliu de campanii reale',
      'Competențe SEO, PPC și SMM',
      'Pregătire pentru roluri de marketing digital',
    ],
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
  },
  'data-analytics': {
    title: 'Data Analytics & Business Intelligence',
    category: 'Technology',
    duration: '10 săptămâni',
    price: '£1,500',
    description: 'Transformă datele în decizii de business.',
    longDescription:
      'Învață să colectezi, analizezi și vizualizezi date pentru a lua decizii informate de business. Cursul acoperă Power BI, SQL, Python și tehnici statistice esențiale.',
    modules: [
      'Introducere în Data Analytics',
      'SQL pentru Analiza Datelor',
      'Python pentru Data Science',
      'Power BI & Vizualizare Date',
      'Statistică pentru Business',
      'ETL & Data Pipelines',
      'Machine Learning Basics',
      'Proiect Capstone',
    ],
    outcomes: [
      'Competențe SQL, Python și Power BI',
      'Certificare Microsoft Power BI',
      'Proiect real în portofoliu',
      'Pregătire pentru roluri de Data Analyst',
    ],
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
};

const defaultCourse: CourseData = {
  title: 'Curs Profesional',
  category: 'General',
  duration: '8 săptămâni',
  price: 'Contactează-ne',
  description: 'Curs profesional intensiv.',
  longDescription:
    'Acest curs profesional intensiv îți oferă competențe practice și certificări recunoscute în industrie. Contactează-ne pentru detalii complete.',
  modules: [
    'Modul 1 — Fundamentele',
    'Modul 2 — Concepte Intermediare',
    'Modul 3 — Practică Avansată',
    'Modul 4 — Proiect Final',
  ],
  outcomes: [
    'Certificare profesională',
    'Competențe practice dovedite',
    'Suport pentru carieră',
  ],
  gradient: 'from-[#D4AF37] to-[#EAC67E]',
};

const ProfessionalCourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = (slug && coursesData[slug]) || defaultCourse;

  return (
    <Layout>
      {/* Hero */}
      <section className={`bg-gradient-to-br ${course.gradient} text-white py-16 md:py-24`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/cursuri-profesionale"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Înapoi la Cursuri
          </Link>
          <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
            {course.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-white/90 text-lg max-w-2xl mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><PoundSterling className="w-4 h-4" /> {course.price}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Locuri limitate</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Certificare inclusă</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Despre Curs</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">{course.longDescription}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                <BookOpen className="w-6 h-6 inline mr-2 text-[#D4AF37]" />
                Module
              </h2>
              <div className="space-y-3 mb-10">
                {course.modules.map((mod, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#C6A248] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{mod}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce Vei Obține</h2>
              <div className="space-y-3">
                {course.outcomes.map((out, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{out}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="p-6 shadow-lg sticky top-24">
                <div className="text-3xl font-bold text-gray-900 mb-1">{course.price}</div>
                <p className="text-gray-500 text-sm mb-6">Plată integrală sau în rate</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-[#D4AF37]" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" /> Următoarea serie: TBD
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-[#D4AF37]" /> Certificare inclusă
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-[#D4AF37]" /> Max 25 participanți
                  </div>
                </div>
                <Link to="/contact">
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold text-lg py-3 gap-2">
                    Înscrie-te Acum <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Garanție de satisfacție 14 zile
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalCourseDetail;
