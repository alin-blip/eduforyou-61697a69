export interface ProfessionalCourse {
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  description: string;
  modules: string[];
  outcomes: string[];
}

export const professionalCourses: ProfessionalCourse[] = [
  {
    slug: 'digital-marketing-professional',
    title: 'Digital Marketing Professional',
    category: 'Marketing',
    duration: '12 săptămâni',
    level: 'Intermediar',
    price: '£1,200',
    description: 'Curs complet de marketing digital acoperind SEO, PPC, Social Media, Email Marketing și Analytics.',
    modules: ['Fundamentele Marketing Digital', 'SEO & Content Marketing', 'Google Ads & PPC', 'Social Media Marketing', 'Email Marketing & Automation', 'Analytics & Raportare'],
    outcomes: ['Certificare profesională în marketing digital', 'Portfolio de proiecte reale', 'Acces la comunitatea alumni'],
  },
  {
    slug: 'project-management-agile',
    title: 'Project Management & Agile',
    category: 'Management',
    duration: '8 săptămâni',
    level: 'Începător',
    price: '£950',
    description: 'Învață metodologii Agile, Scrum și managementul proiectelor pentru cariere în tech și business.',
    modules: ['Introducere în Project Management', 'Metodologia Agile', 'Scrum Framework', 'Kanban & Lean', 'Tools & Software', 'Proiect Final'],
    outcomes: ['Certificare Agile/Scrum', 'Cunoștințe practice PM', 'Pregătire pentru PMP'],
  },
  {
    slug: 'web-development-fullstack',
    title: 'Full-Stack Web Development',
    category: 'Technology',
    duration: '16 săptămâni',
    level: 'Începător',
    price: '£2,500',
    description: 'De la zero la dezvoltator full-stack: HTML, CSS, JavaScript, React, Node.js și baze de date.',
    modules: ['HTML & CSS', 'JavaScript Fundamentals', 'React.js', 'Node.js & Express', 'Baze de Date SQL & NoSQL', 'DevOps & Deployment', 'Proiect Final'],
    outcomes: ['Portfolio cu 5+ proiecte', 'Certificare full-stack', 'Suport pentru angajare'],
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics & Visualization',
    category: 'Technology',
    duration: '10 săptămâni',
    level: 'Intermediar',
    price: '£1,400',
    description: 'Analiză de date cu Python, SQL, Tableau și Power BI pentru decizii bazate pe date.',
    modules: ['Python pentru Analiză', 'SQL & Database Queries', 'Tableau', 'Power BI', 'Statistică Aplicată', 'Proiecte Reale'],
    outcomes: ['Certificare Data Analytics', 'Competențe Python & SQL', 'Portfolio analitic'],
  },
  {
    slug: 'business-administration',
    title: 'Business Administration Certificate',
    category: 'Business',
    duration: '6 săptămâni',
    level: 'Începător',
    price: '£750',
    description: 'Fundamentele administrării afacerilor: management, finanțe, HR și strategii de business.',
    modules: ['Management & Leadership', 'Finanțe pentru Non-Financiari', 'Resurse Umane', 'Marketing Strategic', 'Planificare de Afaceri'],
    outcomes: ['Certificat Business Administration', 'Plan de afaceri complet', 'Networking profesional'],
  },
  {
    slug: 'healthcare-management',
    title: 'Healthcare Management',
    category: 'Health',
    duration: '10 săptămâni',
    level: 'Intermediar',
    price: '£1,300',
    description: 'Management în sectorul sănătății: NHS, clinici private, și organizații de sănătate.',
    modules: ['Sistemul NHS', 'Management Clinic', 'Calitate în Sănătate', 'Legislație Medicală', 'Leadership în Sănătate', 'Proiect Final'],
    outcomes: ['Certificare Healthcare Management', 'Cunoștințe NHS', 'Oportunități de carieră'],
  },
  {
    slug: 'construction-management',
    title: 'Construction Site Management',
    category: 'Construction',
    duration: '8 săptămâni',
    level: 'Intermediar',
    price: '£1,100',
    description: 'Managementul șantierelor de construcții: CSCS, Health & Safety, și project management.',
    modules: ['CSCS Preparation', 'Health & Safety', 'Site Management', 'Building Regulations', 'Project Planning', 'Quality Control'],
    outcomes: ['Pregătire CSCS', 'Certificare Site Management', 'Competențe H&S'],
  },
  {
    slug: 'accounting-bookkeeping',
    title: 'Accounting & Bookkeeping',
    category: 'Business',
    duration: '12 săptămâni',
    level: 'Începător',
    price: '£1,200',
    description: 'Contabilitate și evidență financiară: de la baze la software specializat (Xero, QuickBooks).',
    modules: ['Principii Contabile', 'Evidență Financiară', 'TVA & Taxe UK', 'Xero', 'QuickBooks', 'Raportare Financiară'],
    outcomes: ['Certificare AAT Level 2', 'Competențe software contabil', 'Pregătire pentru angajare'],
  },
];

export const professionalCourseCategories = ['Toate', 'Technology', 'Business', 'Marketing', 'Management', 'Health', 'Construction'];

export function getProfessionalCourseBySlug(slug: string): ProfessionalCourse | undefined {
  return professionalCourses.find(c => c.slug === slug);
}
