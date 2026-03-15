// ============================================================
// E.D.U. Method Platform - Centralized Data Store
// Design: "Institutional Prestige" - Navy + Gold Academic Theme
// ============================================================

export const BRAND = {
  name: "EduForYou",
  tagline: "You dream. We deliver.",
  fullName: "EduForYou - You dream. We deliver.",
  description: "AI-powered university consultancy helping you access UK higher education and Student Finance.",
  address: "59 Union Street, Dunstable, Luton, LU6 1EX",
  email: "contact@eduforyou.co.uk",
  whatsapp: "+44 7305 043658",
  phone: "+44 7305 043658",
  companyNumber: "13861059",
  stats: {
    studentsHelped: 6000,
    financingSecured: 138000000,
    googleRating: 5.0,
    successRate: 94,
    reviewCount: 100,
  },
};

export interface Course {
  id: string;
  slug: string;
  name: string;
  nameShort: string;
  domain: string;
  level: "undergraduate" | "postgraduate" | "hnd" | "top-up";
  duration: string;
  feesAnnual: string;
  campuses: string[];
  description: string;
  highlights: string[];
  image: string;
}

export const COURSES: Course[] = [
  // ===== UNDERGRADUATE (BSc/BA with Foundation Year) =====
  {
    id: "1", slug: "psychology-counselling",
    name: "BSc (Hons) Psychology with Counselling with Foundation Year", nameShort: "Psychology & Counselling",
    domain: "Psychology", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Combining psychology and counselling, this course focuses on the study of human behaviour theory through the lens of diversity, characteristic and cultural context. Prepare for careers in mental health, HR, and social services.",
    highlights: ["Foundations in Psychology", "Fundamentals of Counselling", "Forensic Psychology and Criminology", "Biopsychology", "Cognitive Psychology", "Psychopathology", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80"
  },
  {
    id: "2", slug: "applied-business-psychology",
    name: "BSc (Hons) Applied Business Psychology with Foundation Year", nameShort: "Business Psychology",
    domain: "Psychology", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "An interdisciplinary degree that combines the study of human behaviour with core business principles. Explore how psychological theories can be applied to marketing, management, human resources and consumer behaviour.",
    highlights: ["Consumer Behaviour", "Digital Marketing", "Human Resource Management", "Psychology of Leadership", "Cyberpsychology", "Strategic Management", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
  },
  {
    id: "3", slug: "computing",
    name: "BSc (Hons) Computing with Foundation Year", nameShort: "Computing",
    domain: "Technology", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed to provide a strong grounding in computing and IT to solve real-world problems. Based around 3 themes: Technology, Software, and Data — covering database systems, internet technologies, cyber security, networking, and business information systems.",
    highlights: ["Introduction to Programming", "Web Development", "Cloud Technologies", "Data Science", "Cyber Security", "Machine Learning", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"
  },
  {
    id: "4", slug: "global-business-management",
    name: "BA (Hons) Global Business (Business Management) with Foundation Year", nameShort: "Global Business",
    domain: "Business", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed for those seeking a career in management and budding business owners. This business management degree provides the knowledge and skills that will give you a competitive edge in the global marketplace.",
    highlights: ["Delivered in major financial hubs", "Final year internship/dissertation options", "Economics, marketing, management modules", "International business law", "Strategic management focus", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
  },
  {
    id: "5", slug: "project-management",
    name: "BSc (Hons) Project Management with Foundation Year", nameShort: "Project Management",
    domain: "Project Management", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed to prepare you for a broad range of careers in project management. Enhance your career with high-level project management knowledge and take on roles such as project planner, risk manager, estimator and managing director.",
    highlights: ["Project Planning and Control", "Risk Management in Projects", "Global Project Management", "Financial Management for Projects", "Digital Skills for Project Managers", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
  },
  {
    id: "6", slug: "accounting-financial-management",
    name: "BSc (Hons) Accounting & Financial Management with Foundation Year", nameShort: "Accounting & Finance",
    domain: "Business", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Build expertise in accounting, auditing, and financial management. This degree provides exemptions from major professional accounting bodies (IFA, ACCA, CIMA) and opens doors to lucrative finance careers.",
    highlights: ["ACCA & CIMA exemptions", "Financial reporting", "Managerial accounting", "Corporate finance", "Industry-focused programme", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80"
  },
  {
    id: "7", slug: "business-tourism-management",
    name: "BSc (Hons) Business & Tourism Management with Foundation Year", nameShort: "Tourism Management",
    domain: "Business", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Tourism continues to be an important part of the service sector generating significant income globally. This course provides the essential skills and knowledge to create a successful career in business and tourism management.",
    highlights: ["Tourism Marketing Principles", "Destination Management", "Entrepreneurship in Tourism", "Sustainable Development", "Global Strategic Management", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80"
  },
  {
    id: "8", slug: "global-business-entrepreneurship",
    name: "BA (Hons) Global Business and Entrepreneurship with Foundation Year", nameShort: "Entrepreneurship",
    domain: "Business", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed to infuse you with the essential elements to maximise your entrepreneurial potential. Combine entrepreneurship theory with practical startup skills to launch and grow your own venture.",
    highlights: ["Business Planning and Pitching", "Financing a Business Venture", "Digital Marketing and Social Media", "Social Entrepreneurship", "Global Strategies", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80"
  },
  {
    id: "9", slug: "construction-management",
    name: "BSc (Hons) Construction Management with Foundation Year", nameShort: "Construction Management",
    domain: "Construction", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Develop specialist skills and knowledge of today's construction industry — the legal, environmental and technological context in which it operates. Lead major construction projects from concept to completion.",
    highlights: ["Building Design and Building Science", "Construction Methods and Materials", "Estimating and Cost Control", "Health and Safety in Construction", "Project Management", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
  },
  {
    id: "10", slug: "health-wellbeing-social-care",
    name: "BSc (Hons) Health, Wellbeing and Social Care with Foundation Year", nameShort: "Health & Social Care",
    domain: "Health", level: "undergraduate", duration: "4 years", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "A comprehensive understanding of the healthcare sector, preparing students for impactful careers. Study health promotion, social policy, and care management for rewarding careers in the NHS and social care sector.",
    highlights: ["NHS placement opportunities", "Social policy focus", "Care management skills", "Public health", "Evidence-based practice", "Foundation year included"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
  },
  // ===== POSTGRADUATE (MSc) =====
  {
    id: "11", slug: "msc-global-business",
    name: "MSc Global Business", nameShort: "MSc Global Business",
    domain: "Business", level: "postgraduate", duration: "1 year", feesAnnual: "£8,595",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "A career-enhancing postgraduate qualification designed to prepare you for leadership roles in a global business environment. Develop your abilities to make tactical and strategic decisions in today's economy and thrive in multicultural settings.",
    highlights: ["Change Management and Leadership", "Digital Marketing and Branding", "Global Entrepreneurship and Innovation", "Global Supply Chain Management", "Research Project"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"
  },
  {
    id: "12", slug: "msc-project-management",
    name: "MSc Project Management", nameShort: "MSc Project Management",
    domain: "Project Management", level: "postgraduate", duration: "1 year", feesAnnual: "£8,595",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "A dynamic postgraduate programme designed to develop the expertise needed to lead, plan, and execute projects effectively across diverse industries.",
    highlights: ["Innovation and Technology in Project Management", "Leadership and Professional Development", "Project Management Principles and Methodologies", "Strategy Risk and Uncertainty", "Research Project"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
  },
  {
    id: "13", slug: "msc-counselling-psychotherapy",
    name: "MSc Counselling and Psychotherapy", nameShort: "MSc Counselling",
    domain: "Psychology", level: "postgraduate", duration: "1 year", feesAnnual: "£8,595",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed to allow you to make clear links between academic theoretical input and current or future practice, offering a mix of taught sessions in class and a practice placement opportunity in a relevant therapeutic setting.",
    highlights: ["Advanced Counselling Skills", "Clinical Placement and Supervised Practice", "Comprehensive Approaches to Psychological Therapies", "Ethics and Professional Practice", "Mental Health, Diversity and Inclusion"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80"
  },
  // ===== HND (2 years) =====
  {
    id: "14", slug: "hnd-business",
    name: "HND in Business", nameShort: "HND Business",
    domain: "Business", level: "hnd", duration: "2 years", feesAnnual: "£6,355",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Turn your dreams into reality with this widely-recognised and highly-valued HND in Business. Develop a range of key skills essential for a successful corporate career at the leadership level, or build the foundations for your entrepreneurial journey.",
    highlights: ["Accounting Principles", "Leadership and Management", "Marketing Processes and Planning", "Business Strategy", "Digital Marketing", "Top-up to BA (Hons) available"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
  },
  {
    id: "15", slug: "hnd-cyber-security",
    name: "HND in Digital Technologies (Cyber Security)", nameShort: "HND Cyber Security",
    domain: "Technology", level: "hnd", duration: "2 years", feesAnnual: "£6,355",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Develop a range of key skills essential for entry into the exciting and ever-evolving digital technology sector. Build transferable skills in communication, teamwork, research and analysis highly valued in higher education and the workplace.",
    highlights: ["Cyber Security", "Networking", "Programming", "Cloud Computing", "Applied Cryptography", "Internet of Things", "Top-up to BSc available"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"
  },
  {
    id: "16", slug: "hnd-construction-management",
    name: "HND in Construction Management", nameShort: "HND Construction",
    domain: "Construction", level: "hnd", duration: "2 years", feesAnnual: "£6,355",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Specialist knowledge and practical skills through hands-on learning, site visits, and live projects. Fast-track your construction career with the option to progress to a full degree.",
    highlights: ["Building Information Modelling", "Construction Technology", "Financial Management in Construction", "Project Management", "Sustainable Methods of Construction", "Top-up to BSc available"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80"
  },
  {
    id: "17", slug: "hnd-health-social-care",
    name: "HND in Health and Social Care Practice", nameShort: "HND Health & Social Care",
    domain: "Health", level: "hnd", duration: "2 years", feesAnnual: "£6,355",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "The fast-paced and changing healthcare sector is one of the largest employment sectors in the UK. This HND gives you the platform to pursue a rewarding career, with 450 hours of work placement built-in giving you real-world experience.",
    highlights: ["450 hours work placement", "Compassionate Care and Values-based Practice", "Developing Leadership Skills", "Evidence Based Practice", "Quality Care", "Top-up to BSc available"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
  },
  // ===== TOP-UP (Level 6 - 1 year) =====
  {
    id: "18", slug: "topup-business-management",
    name: "BA (Hons) Business and Management (Level 6 Top-Up)", nameShort: "Top-Up Business",
    domain: "Business", level: "top-up", duration: "1 year", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Extend your business knowledge and practical business skills and convert your HND into a full Bachelor's degree in just one additional year of study.",
    highlights: ["Business and Management Project", "Leadership and Management", "Managing Sustainability", "New Trends in Management", "Organisational Strategy"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
  },
  {
    id: "19", slug: "topup-health-social-care",
    name: "BSc (Hons) Health, Wellbeing and Social Care (Level 6 Direct Entry)", nameShort: "Top-Up Health & Social Care",
    domain: "Health", level: "top-up", duration: "1 year", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "As healthcare continues to evolve, so must your skills. This Level 6 direct entry route provides a specialised pathway towards gaining a full BSc (Hons) qualification — broadening your personal and professional horizons in just one year.",
    highlights: ["Challenging Evidence in Health and Social Care", "Evaluating and Managing Quality", "Leadership and Management", "Social Justice, Equality and Vulnerability", "Capstone Project"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80"
  },
  {
    id: "20", slug: "topup-construction-management",
    name: "BSc (Hons) Construction Management (Level 6 Top-Up)", nameShort: "Top-Up Construction",
    domain: "Construction", level: "top-up", duration: "1 year", feesAnnual: "£9,535",
    campuses: ["London", "Birmingham", "Manchester", "Leeds"],
    description: "Designed to meet the needs of the construction industry, connecting you to your future career to manage construction projects from inception and design through to occupation. Deliver projects safely, on time, on budget and to the highest quality.",
    highlights: ["Dispute Resolution", "Modern Methods of Construction", "Project Management", "Site Practice", "Industry Project"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
  },
];

export interface Campus {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  ranking: string;
  courseCount: number;
  description: string;
  image: string;
  address?: string;
  postcode?: string;
  phone?: string;
  googleMapsUrl?: string;
}

export const CAMPUSES: Campus[] = [
  { id: "1", slug: "london", name: "London Campus", city: "London", region: "Greater London", ranking: "Top UK University Partner", courseCount: 20, description: "Study in the heart of one of the world's greatest cities. London offers unparalleled networking, cultural experiences, and career opportunities across all our programmes.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", address: "Stratford, East London", postcode: "E15 1XQ", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Stratford+London+E15" },
  { id: "2", slug: "birmingham", name: "Birmingham Campus", city: "Birmingham", region: "West Midlands", ranking: "Top UK University Partner", courseCount: 20, description: "The UK's most diverse city with excellent transport links. Birmingham is a hub for business, engineering, and creative industries.", image: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=600&q=80", address: "Birmingham City Centre", postcode: "B1 1BB", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Birmingham+City+Centre+B1" },
  { id: "3", slug: "manchester", name: "Manchester Campus", city: "Manchester", region: "Greater Manchester", ranking: "Top UK University Partner", courseCount: 20, description: "The UK's second city offers world-class culture, sport, and business opportunities. A dynamic student community in a rapidly growing economy.", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", address: "Manchester City Centre", postcode: "M1 1AE", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Manchester+City+Centre+M1" },
  { id: "4", slug: "leeds", name: "Leeds Campus", city: "Leeds", region: "West Yorkshire", ranking: "Top UK University Partner", courseCount: 20, description: "A vibrant student city with a thriving economy. Leeds combines affordable living with excellent career prospects in finance and digital sectors.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", address: "Leeds City Centre", postcode: "LS1 1BA", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Leeds+City+Centre+LS1" },
  { id: "5", slug: "east-london", name: "East London Campus", city: "East London", region: "Greater London", ranking: "Top UK University Partner", courseCount: 20, description: "Located in one of London's most dynamic and culturally diverse areas. East London offers excellent connections to the City, Canary Wharf, and the thriving Tech City ecosystem.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", address: "Stratford, East London", postcode: "E15 1XQ", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Stratford+East+London+E15" },
  { id: "6", slug: "greenford", name: "Greenford Campus", city: "Greenford", region: "Greater London", ranking: "Top UK University Partner", courseCount: 20, description: "A welcoming campus in West London with excellent transport links. Greenford provides a supportive learning environment with easy access to central London and Heathrow.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", address: "Greenford, West London", postcode: "UB6 0PA", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Greenford+London+UB6" },
  { id: "7", slug: "london-stratford", name: "London Stratford Campus", city: "Stratford", region: "East London", ranking: "Top UK University Partner", courseCount: 20, description: "Located in the heart of East London near the Queen Elizabeth Olympic Park. Stratford offers excellent transport links and a vibrant, diverse community.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", address: "Stratford, East London", postcode: "E15 1XQ", phone: "+44 7305 043658", googleMapsUrl: "https://maps.google.com/?q=Stratford+London+E15+1XQ" },
];

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  campus: string;
  quote: string;
  achievement: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { id: "1", name: "Silviu Stefan Haba", course: "Tourism Management", campus: "London", quote: "EduForYou m-a ajutat să-mi transform complet viața. De la un job necalificat, acum am o carieră în turism în Londra.", achievement: "£18,397/year income", avatar: "SH" },
  { id: "2", name: "David M.", course: "Business Management", campus: "Manchester", quote: "Procesul a fost simplu și echipa m-a ghidat la fiecare pas. Recomand cu încredere!", achievement: "£13,000/year secured", avatar: "DM" },
  { id: "3", name: "Ana Ignat", course: "Global Business", campus: "Manchester", quote: "Am primit suport complet, de la alegerea cursului până la obținerea finanțării. O experiență extraordinară!", achievement: "£9,700/year at GBS", avatar: "AI" },
  { id: "4", name: "Cristian D.", course: "Accounting & Finance", campus: "London", quote: "După absolvire, mi-am deschis propriul birou de contabilitate. EduForYou mi-a deschis o cale pe care nu credeam că e posibilă.", achievement: "Own accounting firm", avatar: "CD" },
  { id: "5", name: "Maria P.", course: "Psychology & Counselling", campus: "Birmingham", quote: "Echipa EduForYou a fost alături de mine în fiecare moment. Acum lucrez în domeniul pe care mi-l doream.", achievement: "NHS career started", avatar: "MP" },
  { id: "6", name: "Alexandru R.", course: "Computing", campus: "Leeds", quote: "De la depozit la IT. Finanțarea a acoperit totul, iar acum am un job în tech cu un salariu pe care nu-l visam.", achievement: "Tech career launched", avatar: "AR" },
];

export const FINANCE_INFO = {
  tuitionFeeLoan: { max: 9535, description: "Paid directly to the university" },
  maintenanceLoan: {
    london: { max: 14000, label: "Studying in London" },
    outsideLondon: { max: 10500, label: "Studying outside London" },
    withParents: { max: 9097, label: "Living with parents" },
  },
  repayment: {
    threshold: 25000,
    rate: 9,
    cancelAfterYears: 40,
    plan: "Plan 5",
  },
  eligibility: [
    "Lived in the UK for at least 3 years",
    "UK/Irish citizen, Settled/Pre-settled status, ILR, or Refugee status",
    "Not previously funded for a degree at the same level or higher",
  ],
};

export const AGENT_TIERS = [
  { name: "Starter", students: "0-9", commission: "£500", bonus: "" },
  { name: "Growth", students: "10-49", commission: "£600", bonus: "Dubai holiday at 25 students" },
  { name: "Gold", students: "50-99", commission: "£700", bonus: "" },
  { name: "Platinum", students: "100-149", commission: "£800", bonus: "BMW Series 3 at 100 students" },
  { name: "Diamond", students: "150-199", commission: "£900", bonus: "" },
  { name: "Elite", students: "200+", commission: "£1,000-£2,000", bonus: "EduForYou Franchise" },
];

export const LEAD_STAGES = [
  { name: "Visitor", color: "#94a3b8", description: "Anonymous site visitor" },
  { name: "Lead", color: "#60a5fa", description: "Completed a form" },
  { name: "MQL", color: "#f59e0b", description: "Score >= 30 points" },
  { name: "SQL", color: "#f97316", description: "Score >= 60 points" },
  { name: "Opportunity", color: "#8b5cf6", description: "Qualified after call" },
  { name: "Student", color: "#10b981", description: "Admitted by university" },
  { name: "Enrolled", color: "#059669", description: "Finance approved" },
  { name: "Alumni", color: "#1e3a5f", description: "Graduated / Freedom Circle" },
];

export const DEAL_STAGES = [
  { id: "qualification", name: "Qualification", color: "#60a5fa" },
  { id: "documents", name: "Awaiting Documents", color: "#f59e0b" },
  { id: "enrolled", name: "Enrolled", color: "#10b981" },
  { id: "won", name: "Won", color: "#059669" },
  { id: "lost", name: "Lost", color: "#ef4444" },
];

export const NAV_LINKS = {
  public: [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/cursuri" },
    { label: "Locations", href: "/locatii" },
    { label: "Eligibility", href: "/eligibilitate" },
    { label: "Finance Calculator", href: "/calculator-finantare" },
    { label: "Ikigai Quiz", href: "/ikigai" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Contacts", href: "/admin/crm/contacte" },
    { label: "Pipeline", href: "/admin/crm/pipeline" },
    { label: "Courses", href: "/admin/cursuri" },
    { label: "Analytics", href: "/admin/analiza/funnel" },
  ],
  agent: [
    { label: "Dashboard", href: "/agent/dashboard" },
    { label: "Students", href: "/agent/studenti" },
    { label: "Commissions", href: "/agent/comisioane" },
    { label: "Leaderboard", href: "/agent/clasament" },
    { label: "Materials", href: "/agent/materiale" },
  ],
};

export const DOMAINS = ["Business", "Technology", "Psychology", "Health", "Construction", "Project Management"] as const;
export const LEVELS = ["undergraduate", "postgraduate", "hnd", "top-up"] as const;

export type UserRole = "student" | "agent" | "admin" | "consultant";

// Legacy compatibility exports
export const coursesData = COURSES.map(c => ({
  id: c.id,
  title: c.nameShort,
  slug: c.slug,
  category: c.domain,
  level: c.level === "undergraduate" ? "BSc" as const : c.level === "postgraduate" ? "MSc" as const : c.level === "hnd" ? "HND" as const : "Foundation" as const,
  duration: c.duration,
  campuses: c.campuses,
  price: c.feesAnnual + "/year",
  image: c.image,
  description: c.description,
  modules: c.highlights,
  careers: [],
  university: "Global Banking School",
}));

export const categories = ['All', ...DOMAINS] as const;
export const levels = ['All', 'BSc', 'MSc', 'HND', 'Foundation'] as const;
