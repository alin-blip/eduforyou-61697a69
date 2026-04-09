import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, PoundSterling, Filter } from 'lucide-react';

const categories = ['Toate', 'Business', 'Technology', 'Healthcare', 'Marketing', 'Finance'];

const courses = [
  {
    title: 'Project Management Professional (PMP)',
    slug: 'project-management-pmp',
    category: 'Business',
    duration: '12 săptămâni',
    price: '£1,200',
    description: 'Obține certificarea PMP recunoscută internațional și avansează în cariera de project management.',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    title: 'Digital Marketing Masterclass',
    slug: 'digital-marketing',
    category: 'Marketing',
    duration: '8 săptămâni',
    price: '£850',
    description: 'Învață SEO, PPC, Social Media Marketing și Content Strategy de la profesioniști din industrie.',
    gradient: 'from-[#EAC67E] to-[#D4AF37]',
  },
  {
    title: 'Data Analytics & Business Intelligence',
    slug: 'data-analytics',
    category: 'Technology',
    duration: '10 săptămâni',
    price: '£1,500',
    description: 'Stăpânește Power BI, SQL și Python pentru analiză de date și luarea deciziilor bazate pe date.',
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
  {
    title: 'Health & Social Care Level 5',
    slug: 'health-social-care',
    category: 'Healthcare',
    duration: '16 săptămâni',
    price: '£1,800',
    description: 'Calificare profesională în managementul serviciilor de sănătate și asistență socială.',
    gradient: 'from-[#D4AF37] to-[#C6A248]',
  },
  {
    title: 'Accounting & Bookkeeping',
    slug: 'accounting-bookkeeping',
    category: 'Finance',
    duration: '6 săptămâni',
    price: '£650',
    description: 'Fundamentele contabilității și bookkeeping-ului pentru antreprenori și profesioniști.',
    gradient: 'from-[#C6A248] to-[#0A1628]',
  },
  {
    title: 'Cyber Security Fundamentals',
    slug: 'cyber-security',
    category: 'Technology',
    duration: '10 săptămâni',
    price: '£1,350',
    description: 'Principiile securității cibernetice, ethical hacking și protecția datelor.',
    gradient: 'from-[#EAC67E] to-[#C6A248]',
  },
  {
    title: 'Leadership & Management',
    slug: 'leadership-management',
    category: 'Business',
    duration: '8 săptămâni',
    price: '£950',
    description: 'Dezvoltă abilități de leadership, comunicare și management al echipelor.',
    gradient: 'from-[#C6A248] to-[#EAC67E]',
  },
  {
    title: 'Social Media Management',
    slug: 'social-media-management',
    category: 'Marketing',
    duration: '6 săptămâni',
    price: '£550',
    description: 'Strategii avansate de social media pentru branduri și business-uri.',
    gradient: 'from-[#C6A248] to-[#D4AF37]',
  },
  {
    title: 'Web Development Bootcamp',
    slug: 'web-development',
    category: 'Technology',
    duration: '14 săptămâni',
    price: '£2,200',
    description: 'Full-stack web development cu React, Node.js și baze de date moderne.',
    gradient: 'from-[#EAC67E] to-[#C6A248]',
  },
];

const ProfessionalCourses = () => {
  const [activeCategory, setActiveCategory] = useState('Toate');

  const filtered = activeCategory === 'Toate'
    ? courses
    : courses.filter((c) => c.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <BookOpen className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cursuri Profesionale</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Cursuri scurte și intensive care îți oferă competențe practice și certificări
            recunoscute în industrie. Investește în cariera ta.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-white text-gray-600 hover:bg-[#D4AF37]/10 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className={`h-3 bg-gradient-to-r ${course.gradient}`} />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-medium text-[#C6A248] bg-[#D4AF37]/10 rounded-full px-3 py-1 self-start mb-3">
                    {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <PoundSterling className="w-4 h-4" /> {course.price}
                    </span>
                  </div>
                  <Link to={`/cursuri-profesionale/${course.slug}`}>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#C6A248] text-white font-semibold gap-2">
                      Vezi Detalii <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nu există cursuri în această categorie momentan.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProfessionalCourses;
