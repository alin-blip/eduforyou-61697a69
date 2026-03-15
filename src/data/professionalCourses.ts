// ============================================================
// ROCBC Professional Courses - Paid Qualifications
// These are NOT funded through Student Finance
// Delivered online through our partner training centre
// ============================================================

export interface ProfessionalCourse {
  id: string;
  slug: string;
  title: string;
  titleShort: string;
  type: "HND" | "HNC" | "BTEC" | "NVQ" | "Functional Skills";
  level: string;
  pathway: string;
  duration: string;
  mode: string;
  tagline: string;
  description: string;
  fullDescription: string;
  outcomes: string[];
  whoIsFor: string[];
  careers: string[];
  modules: { title: string; description: string; credits: number; mandatory: boolean }[];
  tiers: { name: string; priceEur: number; priceGbp: number; includes: string[] }[];
  faqs: { question: string; answer: string }[];
  entryRequirements: string[];
  assessmentMethods: string[];
  totalCredits: number;
  popular: boolean;
  image: string;
}

export const PROFESSIONAL_COURSES: ProfessionalCourse[] = [
  // ===== HNC/HND Computing =====
  {
    id: "pro-1", slug: "hnd-computing-cyber-security",
    title: "HND in Computing (Cyber Security)", titleShort: "HND Cyber Security",
    type: "HND", level: "5", pathway: "Technology", duration: "2 years", mode: "Online",
    tagline: "Defend the digital world",
    description: "Master the art of digital defence. Learn to protect organisations from cyber threats while building a career in one of the fastest-growing fields in technology.",
    fullDescription: "This HND programme provides comprehensive training in cyber security, covering network defence, ethical hacking, digital forensics, and security management. With 240 credits of carefully crafted learning, you'll gain both the technical skills and strategic thinking that employers demand.\n\nFrom penetration testing to incident response, you'll develop practical skills that translate directly to the workplace.",
    outcomes: ["Master network security and defence strategies", "Conduct ethical hacking and penetration testing", "Perform digital forensics investigations", "Implement security policies and frameworks", "Manage cyber security incidents", "Build secure systems and applications"],
    whoIsFor: ["IT professionals seeking cyber security specialisation", "Career changers entering the security field", "Graduates wanting practical security skills", "Anyone passionate about digital protection"],
    careers: ["Cyber Security Analyst", "Penetration Tester", "Security Operations Centre (SOC) Analyst", "Information Security Officer", "Digital Forensics Investigator", "Security Consultant"],
    modules: [
      { title: "Programming", description: "Master programming fundamentals for security applications.", credits: 15, mandatory: true },
      { title: "Networking", description: "Understand network protocols and architecture.", credits: 15, mandatory: true },
      { title: "Professional Practice", description: "Develop workplace and project management skills.", credits: 15, mandatory: true },
      { title: "Database Design", description: "Learn secure database design and management.", credits: 15, mandatory: true },
      { title: "Security", description: "Master information security principles.", credits: 15, mandatory: true },
      { title: "Cyber Security", description: "Advanced cyber defence and threat analysis.", credits: 15, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 4000, priceGbp: 3400, includes: ["Full course materials", "Online learning platform access", "Peer community access", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 5600, priceGbp: 4760, includes: ["Everything in Essentials", "2 live tutor sessions per month", "Assignment feedback within 48 hours", "Career guidance session", "LinkedIn profile review"] },
      { name: "Premium", priceEur: 8000, priceGbp: 6800, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Priority assignment feedback", "Dedicated success coach", "Job placement assistance", "Industry networking events"] }
    ],
    faqs: [
      { question: "Is this qualification recognised by employers?", answer: "Yes! This HND is awarded by Pearson and is widely recognised across the cyber security industry." },
      { question: "Do I need prior IT experience?", answer: "Basic IT knowledge helps, but the programme starts from fundamentals and builds up." },
      { question: "Can I progress to a degree?", answer: "Yes! Many universities accept HND for direct entry to the final year of a related degree." },
      { question: "What tools will I use?", answer: "You'll work with industry-standard tools including Kali Linux, Wireshark, and security frameworks." }
    ],
    entryRequirements: ["A-levels or equivalent Level 3 qualification", "GCSE Maths and English at grade C/4 or above", "Interest in technology and security"],
    assessmentMethods: ["Coursework assignments", "Practical security labs", "Case study analysis", "Portfolio building"],
    totalCredits: 240, popular: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80"
  },
  {
    id: "pro-2", slug: "hnd-computing-software-engineering",
    title: "HND in Computing (Software Engineering)", titleShort: "HND Software Engineering",
    type: "HND", level: "5", pathway: "Technology", duration: "2 years", mode: "Online",
    tagline: "Code your future",
    description: "Build the software that powers the world. Develop professional programming skills and software engineering practices that employers are desperately seeking.",
    fullDescription: "This HND programme provides comprehensive training in software engineering, covering full-stack development, agile methodologies, and professional software practices. With 240 credits of carefully crafted learning, you'll gain the skills to design, develop, and deploy professional software solutions.",
    outcomes: ["Master full-stack software development", "Apply agile and DevOps methodologies", "Design and implement database solutions", "Build web and mobile applications", "Write clean, maintainable code", "Manage software projects professionally"],
    whoIsFor: ["Aspiring software developers", "Career changers entering tech", "IT professionals wanting development skills", "Anyone passionate about building software"],
    careers: ["Software Developer", "Full-Stack Engineer", "Web Developer", "Mobile App Developer", "DevOps Engineer", "Software Tester"],
    modules: [
      { title: "Programming", description: "Master programming fundamentals and OOP.", credits: 15, mandatory: true },
      { title: "Networking", description: "Understand network infrastructure.", credits: 15, mandatory: true },
      { title: "Professional Practice", description: "Develop workplace and project skills.", credits: 15, mandatory: true },
      { title: "Database Design", description: "Learn to structure and query databases.", credits: 15, mandatory: true },
      { title: "Software Development", description: "Build professional software applications.", credits: 15, mandatory: true },
      { title: "Agile Development", description: "Apply agile methodologies to projects.", credits: 15, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 4000, priceGbp: 3400, includes: ["Full course materials", "Online learning platform access", "Peer community access", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 5600, priceGbp: 4760, includes: ["Everything in Essentials", "2 live tutor sessions per month", "Assignment feedback within 48 hours", "Career guidance session", "LinkedIn profile review"] },
      { name: "Premium", priceEur: 8000, priceGbp: 6800, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Priority assignment feedback", "Dedicated success coach", "Job placement assistance", "Industry networking events"] }
    ],
    faqs: [
      { question: "What programming languages will I learn?", answer: "You'll work with Python, JavaScript, and other industry-standard languages." },
      { question: "Do I need coding experience?", answer: "No! We start from the basics and build your skills progressively." },
      { question: "Can I progress to a degree?", answer: "Yes! Many universities accept HND for direct entry to the final year of a Computing degree." }
    ],
    entryRequirements: ["A-levels or equivalent Level 3 qualification", "GCSE Maths and English at grade C/4 or above", "Enthusiasm for technology"],
    assessmentMethods: ["Coding projects", "Software development assignments", "Group projects", "Portfolio building"],
    totalCredits: 240, popular: true,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80"
  },
  {
    id: "pro-3", slug: "hnc-computing-ai-data-science",
    title: "HNC in Computing (AI & Data Science)", titleShort: "HNC AI & Data Science",
    type: "HNC", level: "4", pathway: "Technology", duration: "1 year", mode: "Online",
    tagline: "Discover the magic of artificial intelligence",
    description: "Begin your journey into the future of technology. Master AI fundamentals and data science to unlock exciting opportunities in this revolutionary field.",
    fullDescription: "This HNC programme provides foundational training in AI and data science. With 120 credits of carefully crafted learning, you'll gain skills in programming, data analysis, and machine learning that employers are desperately seeking.",
    outcomes: ["Master Python programming for AI applications", "Unlock data analysis and visualisation techniques", "Discover machine learning fundamentals", "Apply statistical methods to real-world problems", "Build AI project portfolios"],
    whoIsFor: ["Tech enthusiasts curious about AI", "Career changers entering the data field", "Graduates wanting practical AI skills", "Professionals seeking to understand AI"],
    careers: ["Junior Data Analyst", "AI Research Assistant", "Machine Learning Engineer (entry level)", "Data Science Trainee", "Business Intelligence Analyst"],
    modules: [
      { title: "Programming", description: "Master Python and programming fundamentals.", credits: 15, mandatory: true },
      { title: "Networking", description: "Understand data communication principles.", credits: 15, mandatory: true },
      { title: "Professional Practice", description: "Develop workplace and project skills.", credits: 15, mandatory: true },
      { title: "Database Design", description: "Learn to structure and query data.", credits: 15, mandatory: true },
      { title: "Data Analytics", description: "Transform raw data into insights.", credits: 15, mandatory: true },
      { title: "Artificial Intelligence", description: "Explore AI concepts and applications.", credits: 15, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 2500, priceGbp: 2125, includes: ["Full course materials", "Online learning platform access", "Peer community access", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 3500, priceGbp: 2975, includes: ["Everything in Essentials", "2 live tutor sessions per month", "Assignment feedback within 48 hours", "Career guidance session", "LinkedIn profile review"] },
      { name: "Premium", priceEur: 5000, priceGbp: 4250, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Priority assignment feedback", "Dedicated success coach", "Job placement assistance", "Industry networking events"] }
    ],
    faqs: [
      { question: "Do I need maths skills?", answer: "Basic maths helps, but we teach you the statistics you need." },
      { question: "Can I progress to an HND?", answer: "Yes! You can continue to the HND in Computing to deepen your expertise." },
      { question: "What software will I use?", answer: "Python, Jupyter notebooks, and popular data science libraries — all free and industry-standard." }
    ],
    entryRequirements: ["A-levels or equivalent Level 3 qualification", "GCSE Maths at grade C/4 or above preferred", "Enthusiasm for technology"],
    assessmentMethods: ["Coding projects", "Data analysis assignments", "AI application development", "Portfolio building"],
    totalCredits: 120, popular: false,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
  },
  // ===== HND Construction =====
  {
    id: "pro-4", slug: "hnd-construction-management-pro",
    title: "HND in Construction Management", titleShort: "HND Construction Management",
    type: "HND", level: "5", pathway: "Construction", duration: "2 years", mode: "Online",
    tagline: "Build your path to success",
    description: "Lead construction projects with confidence. Transform yourself into a construction management professional ready to shape the built environment.",
    fullDescription: "This HND programme provides comprehensive training in construction management, covering technology, project management, health & safety, and building regulations. With 240 credits, you'll gain both technical knowledge and management skills.",
    outcomes: ["Master construction technology and processes", "Unlock project management methodologies", "Discover health and safety management", "Apply building regulations and compliance", "Build sustainable construction knowledge", "Develop site management skills"],
    whoIsFor: ["Construction workers seeking management roles", "Career changers entering the built environment sector", "Graduates wanting construction expertise", "Professionals advancing their construction career"],
    careers: ["Construction Manager", "Site Manager", "Project Coordinator", "Quantity Surveyor Assistant", "Building Control Officer", "Health and Safety Manager"],
    modules: [
      { title: "Construction Technology", description: "Master building techniques and materials.", credits: 15, mandatory: true },
      { title: "Construction Practice and Management", description: "Learn project delivery methods.", credits: 15, mandatory: true },
      { title: "Science and Materials", description: "Understand the science behind construction.", credits: 15, mandatory: true },
      { title: "Legal and Statutory Requirements", description: "Navigate building regulations.", credits: 15, mandatory: true },
      { title: "Project Management", description: "Deliver projects on time and budget.", credits: 15, mandatory: true },
      { title: "Health, Safety and Welfare", description: "Ensure safe working environments.", credits: 15, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 4000, priceGbp: 3400, includes: ["Full course materials", "Online learning platform access", "Peer community access", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 5600, priceGbp: 4760, includes: ["Everything in Essentials", "2 live tutor sessions per month", "Assignment feedback within 48 hours", "Career guidance session", "LinkedIn profile review"] },
      { name: "Premium", priceEur: 8000, priceGbp: 6800, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Priority assignment feedback", "Dedicated success coach", "Job placement assistance", "Industry networking events"] }
    ],
    faqs: [
      { question: "Can I study while working on site?", answer: "Yes! Our flexible online learning fits around shift patterns and site schedules." },
      { question: "Can I progress to a degree?", answer: "Yes! Many universities accept this HND for entry to construction management degree programmes." }
    ],
    entryRequirements: ["A-levels or equivalent Level 3 qualification", "GCSE English and Maths at grade C/4 or above", "Construction experience is advantageous"],
    assessmentMethods: ["Coursework assignments", "Case studies", "Project-based assessments"],
    totalCredits: 240, popular: false,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
  },
  // ===== BTEC Level 3 =====
  {
    id: "pro-5", slug: "btec-level-3-it",
    title: "BTEC Level 3 in Information Technology", titleShort: "BTEC Level 3 IT",
    type: "BTEC", level: "3", pathway: "Technology", duration: "1 year", mode: "Online",
    tagline: "Transform your future in the digital world",
    description: "Build your IT foundation and unlock doors to university or your first tech role. This qualification is your stepping stone to an exciting career in technology.",
    fullDescription: "This BTEC provides practical, hands-on learning to develop the IT skills that universities and employers value most. It carries UCAS points equivalent to A-levels, making it a valid pathway to university degrees.",
    outcomes: ["Master IT fundamentals and systems", "Unlock web development basics", "Discover database concepts", "Apply project management skills", "Build your first IT projects"],
    whoIsFor: ["School leavers passionate about technology", "Career changers entering IT", "Those preparing for university", "Anyone wanting practical IT skills"],
    careers: ["IT Support Technician", "Junior Web Developer", "Help Desk Analyst", "IT Administrator", "Progress to HNC/HND or university"],
    modules: [
      { title: "Information Technology Systems", description: "Explore hardware, software, and IT infrastructure.", credits: 10, mandatory: true },
      { title: "Creating Systems to Manage Information", description: "Learn database design and management.", credits: 10, mandatory: true },
      { title: "Using Social Media in Business", description: "Apply digital marketing principles.", credits: 10, mandatory: true },
      { title: "Programming", description: "Write your first programs and applications.", credits: 10, mandatory: true },
      { title: "Website Development", description: "Create responsive websites.", credits: 10, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1800, priceGbp: 1530, includes: ["Full course materials", "Online learning platform access", "Peer community access", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 2520, priceGbp: 2142, includes: ["Everything in Essentials", "2 live tutor sessions per month", "Assignment feedback within 48 hours", "Career guidance session", "LinkedIn profile review"] },
      { name: "Premium", priceEur: 3600, priceGbp: 3060, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Priority assignment feedback", "Dedicated success coach", "Job placement assistance", "Industry networking events"] }
    ],
    faqs: [
      { question: "Can this get me into university?", answer: "Yes! BTEC Level 3 carries UCAS points equivalent to A-levels." },
      { question: "Do I need prior IT experience?", answer: "No! This qualification is designed for beginners." }
    ],
    entryRequirements: ["4 GCSEs at grade C/4 or above", "Interest in technology", "Basic computer literacy"],
    assessmentMethods: ["Coursework assignments", "Practical projects", "Portfolio building"],
    totalCredits: 90, popular: false,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"
  },
  // ===== Functional Skills =====
  {
    id: "pro-6", slug: "functional-skills-english-level-2",
    title: "Functional Skills English Level 2", titleShort: "English Level 2",
    type: "Functional Skills", level: "2", pathway: "English", duration: "12 weeks", mode: "Online",
    tagline: "Unlock your communication potential",
    description: "Master essential English skills recognised across industries. Equivalent to GCSE grade C/4, this is your gateway to further education and better employment.",
    fullDescription: "Functional Skills English Level 2 is equivalent to a GCSE grade C/4 and is accepted by employers and universities across the UK. In just 12 weeks, you'll develop the reading, writing, and communication skills that open doors to your future.",
    outcomes: ["Master reading comprehension techniques", "Unlock professional writing skills", "Discover effective communication strategies", "Apply grammar and punctuation correctly", "Build confidence in English usage"],
    whoIsFor: ["Adults returning to education", "Those who missed out on GCSE English", "Learners needing English for further study", "Anyone wanting to improve their English skills"],
    careers: ["Required for many apprenticeships", "Gateway to further education", "Improves job application success", "Opens doors to training programmes", "Enhances professional communication"],
    modules: [
      { title: "Reading", description: "Develop skills to read and understand complex texts.", credits: 0, mandatory: true },
      { title: "Writing", description: "Master structured and accurate writing.", credits: 0, mandatory: true },
      { title: "Speaking, Listening and Communicating", description: "Build confident communication skills.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 500, priceGbp: 425, includes: ["Full course materials", "Online learning platform access", "Practice tests", "Email support", "Certificate upon completion"] },
      { name: "Plus", priceEur: 700, priceGbp: 595, includes: ["Everything in Essentials", "Weekly tutor sessions", "Exam preparation support", "Feedback on practice work"] },
      { name: "Premium", priceEur: 1000, priceGbp: 850, includes: ["Everything in Plus", "Unlimited 1-on-1 tutor sessions", "Fast-track completion option", "Resit support included"] }
    ],
    faqs: [
      { question: "Is this equivalent to a GCSE?", answer: "Yes! Functional Skills Level 2 is officially recognised as equivalent to GCSE grade C/4." },
      { question: "How is it assessed?", answer: "You'll complete a reading exam and a writing exam, both taken online." }
    ],
    entryRequirements: ["No formal qualifications required", "Basic literacy recommended", "Motivation to improve your English"],
    assessmentMethods: ["Online reading exam", "Online writing exam"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80"
  },
  // ===== NVQ Construction Management =====
  {
    id: "pro-7", slug: "nvq-level-2-construction-operations",
    title: "NVQ Level 2 Construction Operations", titleShort: "NVQ L2 Construction",
    type: "NVQ", level: "2", pathway: "Construction", duration: "6 months", mode: "Work-based + Online",
    tagline: "Prove your skills on site",
    description: "Turn your construction experience into a recognised qualification. This NVQ validates your practical skills and opens doors to career progression and your blue CSCS card.",
    fullDescription: "Work-based assessment means you demonstrate your skills in real working conditions. Whether you're a bricklayer, carpenter, or general operative, this qualification shows employers you can do the job.",
    outcomes: ["Demonstrate competence in your trade", "Prove health and safety knowledge", "Show understanding of construction processes", "Apply sustainable working practices", "Build evidence of workplace skills"],
    whoIsFor: ["Site operatives wanting formal recognition", "Apprentices completing their programme", "Workers seeking CSCS card eligibility", "Career changers entering construction"],
    careers: ["Skilled Construction Operative", "Site Labourer (qualified)", "Trade Assistant", "Plant Operative", "Progress to NVQ Level 3"],
    modules: [
      { title: "Health, Safety and Welfare", description: "Essential site safety knowledge and practice.", credits: 0, mandatory: true },
      { title: "Productive Working Relationships", description: "Communicate and work effectively with others.", credits: 0, mandatory: true },
      { title: "Moving, Handling and Storing Resources", description: "Safe materials handling and storage.", credits: 0, mandatory: true },
      { title: "Conforming to General Health, Safety and Welfare", description: "Apply health and safety in daily work.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1200, priceGbp: 999, includes: ["Full assessment support", "Portfolio development guidance", "Assessor visits", "Certificate upon completion", "CSCS card eligibility"] },
      { name: "Plus", priceEur: 1680, priceGbp: 1399, includes: ["Everything in Essentials", "Additional assessment sessions", "Fast-track completion", "Career guidance", "Employer liaison"] },
      { name: "Premium", priceEur: 2400, priceGbp: 1999, includes: ["Everything in Plus", "Unlimited assessor support", "On-site assessment flexibility", "CSCS application support", "Progression planning"] }
    ],
    faqs: [
      { question: "Will this help me get a CSCS card?", answer: "Yes! NVQ Level 2 makes you eligible for a blue CSCS Skilled Worker card." },
      { question: "Do I need to be working?", answer: "Yes, NVQs are work-based qualifications." }
    ],
    entryRequirements: ["Currently working in construction", "Basic literacy and numeracy", "Commitment to completing workplace assessments"],
    assessmentMethods: ["Workplace observation", "Witness testimonies", "Portfolio of evidence", "Professional discussion"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
  },
  {
    id: "pro-8", slug: "nvq-level-3-construction-contracting",
    title: "NVQ Level 3 Construction Contracting Operations", titleShort: "NVQ L3 Construction",
    type: "NVQ", level: "3", pathway: "Construction", duration: "6-9 months", mode: "Work-based + Online",
    tagline: "Lead from the front on site",
    description: "Step up to supervisory roles with this advanced construction NVQ. Perfect for experienced workers ready to lead teams and manage site operations. Eligible for gold CSCS card.",
    fullDescription: "This Level 3 NVQ demonstrates you're ready for leadership. You'll prove your ability to coordinate work, manage teams, and ensure quality and safety standards.",
    outcomes: ["Lead and coordinate construction activities", "Manage health and safety on site", "Allocate work and supervise teams", "Ensure quality control standards", "Communicate with clients and contractors"],
    whoIsFor: ["Experienced site workers seeking promotion", "Team leaders wanting formal recognition", "Tradespeople moving into supervision", "Aspirant site supervisors and foremen"],
    careers: ["Site Supervisor", "Working Foreman", "Team Leader", "Trade Supervisor", "Progress to NVQ Level 6"],
    modules: [
      { title: "Coordinating and Organising Work Operations", description: "Plan and coordinate construction activities.", credits: 0, mandatory: true },
      { title: "Allocating Work and Checking People's Performance", description: "Manage team performance effectively.", credits: 0, mandatory: true },
      { title: "Establishing and Maintaining Effective Working Relationships", description: "Build productive working relationships.", credits: 0, mandatory: true },
      { title: "Maintaining Supplies of Materials", description: "Ensure efficient materials management.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1800, priceGbp: 1499, includes: ["Full assessment support", "Portfolio development", "Assessor visits", "Certificate upon completion", "Gold CSCS card eligibility"] },
      { name: "Plus", priceEur: 2520, priceGbp: 2099, includes: ["Everything in Essentials", "Additional assessment sessions", "Fast-track completion", "Management coaching", "Career pathway planning"] },
      { name: "Premium", priceEur: 3600, priceGbp: 2999, includes: ["Everything in Plus", "Unlimited assessor support", "Leadership development", "CSCS application support", "Industry networking"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "NVQ Level 3 makes you eligible for a gold CSCS Supervisory card." },
      { question: "Do I need NVQ Level 2 first?", answer: "Not necessarily, but you need significant construction experience." }
    ],
    entryRequirements: ["Experience in construction", "Some supervisory responsibility", "Commitment to assessment process"],
    assessmentMethods: ["Workplace observation", "Professional discussion", "Portfolio evidence", "Witness testimonies"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80"
  },
  {
    id: "pro-9", slug: "nvq-level-4-construction-site-supervision",
    title: "NVQ Level 4 Construction Site Supervision", titleShort: "NVQ L4 Site Supervision",
    type: "NVQ", level: "4", pathway: "Construction", duration: "9-12 months", mode: "Work-based + Online",
    tagline: "Bridge the gap to management",
    description: "The perfect stepping stone between supervision and management. Develop higher-level skills while proving your readiness for site management roles.",
    fullDescription: "Level 4 NVQ bridges the gap between site supervision and full site management. You'll demonstrate advanced planning, quality control, and team leadership skills.",
    outcomes: ["Plan and organise site activities", "Manage quality control processes", "Lead larger construction teams", "Coordinate with contractors and clients", "Ensure health and safety compliance"],
    whoIsFor: ["Site supervisors ready for advancement", "Experienced foremen seeking recognition", "Those preparing for site management", "Trade supervisors expanding their scope"],
    careers: ["Senior Site Supervisor", "Assistant Site Manager", "Works Foreman", "Section Leader", "Progress to NVQ Level 6"],
    modules: [
      { title: "Developing and Maintaining Good Occupational Working Relationships", description: "Build effective working relationships.", credits: 0, mandatory: true },
      { title: "Confirming Work Meets Specification", description: "Ensure quality standards are met.", credits: 0, mandatory: true },
      { title: "Coordinating and Controlling Operations", description: "Manage day-to-day site operations.", credits: 0, mandatory: true },
      { title: "Planning Work Activities and Resources", description: "Plan and allocate work effectively.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 2200, priceGbp: 1799, includes: ["Full assessment support", "Portfolio development", "Assessor visits", "Certificate upon completion", "Gold CSCS card eligibility"] },
      { name: "Plus", priceEur: 3080, priceGbp: 2519, includes: ["Everything in Essentials", "Additional assessment sessions", "Management coaching", "Career pathway planning", "Industry mentoring"] },
      { name: "Premium", priceEur: 4400, priceGbp: 3599, includes: ["Everything in Plus", "Unlimited assessor support", "Leadership development", "Professional body guidance", "Senior management preparation"] }
    ],
    faqs: [
      { question: "Is Level 4 necessary for Level 6?", answer: "Not essential, but it provides a structured progression path." },
      { question: "Will I get a CSCS card?", answer: "Yes! Level 4 qualifies you for a gold CSCS Supervisory card." }
    ],
    entryRequirements: ["Supervisory experience in construction", "Currently in a supervisory role", "Commitment to development"],
    assessmentMethods: ["Workplace observation", "Professional discussion", "Portfolio evidence", "Quality records"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80"
  },
  {
    id: "pro-10", slug: "nvq-level-6-construction-site-management",
    title: "NVQ Level 6 Construction Site Management", titleShort: "NVQ L6 Site Management",
    type: "NVQ", level: "6", pathway: "Construction", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Master the art of site leadership",
    description: "The pinnacle of construction site management qualifications. Demonstrate your ability to manage complex construction projects and lead large teams. Eligible for black CSCS Manager card.",
    fullDescription: "This NVQ Level 6 is the gold standard for construction site managers. Equivalent to a degree level qualification, it proves you can manage entire construction projects.",
    outcomes: ["Manage complex construction projects", "Lead and develop site teams", "Ensure regulatory compliance", "Control costs and resources", "Maintain quality standards", "Manage stakeholder relationships"],
    whoIsFor: ["Site supervisors ready for management", "Experienced construction managers seeking recognition", "Professionals wanting degree-level qualification", "Those aiming for senior construction roles"],
    careers: ["Site Manager", "Construction Manager", "Project Manager", "Contracts Manager", "Operations Director"],
    modules: [
      { title: "Developing and Maintaining Good Working Relationships", description: "Build effective stakeholder relationships.", credits: 0, mandatory: true },
      { title: "Allocating Work and Checking People's Performance", description: "Lead teams to achieve project goals.", credits: 0, mandatory: true },
      { title: "Controlling Project Progress Against Agreed Quality Standards", description: "Ensure quality throughout the project.", credits: 0, mandatory: true },
      { title: "Managing the Project Process", description: "Oversee complete project delivery.", credits: 0, mandatory: true },
      { title: "Contributing to the Control of Work Progress and Costs", description: "Manage budgets and schedules.", credits: 0, mandatory: true },
      { title: "Evaluating and Confirming Work Methods and Programme", description: "Plan and optimize construction methods.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 3000, priceGbp: 2499, includes: ["Full assessment support", "Portfolio development", "Assessor visits", "Certificate upon completion", "Black CSCS card eligibility"] },
      { name: "Plus", priceEur: 4200, priceGbp: 3499, includes: ["Everything in Essentials", "Enhanced assessment sessions", "Management coaching", "Industry mentorship", "Career advancement planning"] },
      { name: "Premium", priceEur: 6000, priceGbp: 4999, includes: ["Everything in Plus", "Unlimited assessor support", "Executive coaching", "CIOB membership support", "Leadership development programme"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "NVQ Level 6 makes you eligible for the black CSCS Manager card — the highest level." },
      { question: "Is this equivalent to a degree?", answer: "Yes! NVQ Level 6 is on the same qualification framework level as a bachelor's degree." }
    ],
    entryRequirements: ["Substantial site management experience", "Currently in a site management role", "Access to complex construction projects"],
    assessmentMethods: ["Workplace observation", "Professional discussion", "Portfolio evidence", "Project case studies"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80"
  },
  {
    id: "pro-11", slug: "nvq-level-7-construction-senior-management",
    title: "NVQ Level 7 Construction Senior Management", titleShort: "NVQ L7 Senior Management",
    type: "NVQ", level: "7", pathway: "Construction", duration: "18-24 months", mode: "Work-based + Online",
    tagline: "Lead at the highest level",
    description: "The ultimate construction management qualification. Equivalent to a master's degree. For senior leaders managing multiple projects, divisions, or entire organisations.",
    fullDescription: "This NVQ Level 7 is equivalent to a master's degree and recognizes the highest level of construction management competence. Prove your ability to lead at strategic level.",
    outcomes: ["Lead strategic business operations", "Manage multiple projects or divisions", "Drive organisational development", "Shape business strategy", "Develop future leaders", "Ensure business sustainability"],
    whoIsFor: ["Senior construction managers", "Directors and executives", "Business owners in construction", "Those leading multiple sites or projects"],
    careers: ["Construction Director", "Operations Director", "Managing Director", "Regional Manager", "Business Owner"],
    modules: [
      { title: "Managing Productive Working Relationships", description: "Lead stakeholder relationships at senior level.", credits: 0, mandatory: true },
      { title: "Developing Self and Others", description: "Build high-performing teams and leaders.", credits: 0, mandatory: true },
      { title: "Contributing to Business Performance", description: "Drive business results and growth.", credits: 0, mandatory: true },
      { title: "Controlling Business Operations", description: "Oversee organisational efficiency.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 4500, priceGbp: 3749, includes: ["Full assessment support", "Portfolio development", "Senior assessor", "Certificate upon completion", "Black CSCS card eligibility"] },
      { name: "Plus", priceEur: 6300, priceGbp: 5249, includes: ["Everything in Essentials", "Executive assessment sessions", "Business coaching", "Industry networking", "Leadership assessment"] },
      { name: "Premium", priceEur: 9000, priceGbp: 7499, includes: ["Everything in Plus", "Unlimited senior assessor support", "Executive mentorship", "Professional body applications", "Bespoke development programme"] }
    ],
    faqs: [
      { question: "Is this equivalent to a master's degree?", answer: "Yes! NVQ Level 7 is on the same qualification framework level as a master's degree." },
      { question: "Can this support chartered membership?", answer: "Yes! Level 7 NVQ supports applications for FCIOB and other senior professional memberships." }
    ],
    entryRequirements: ["Senior management experience in construction", "Strategic responsibility for projects or business", "Currently in senior leadership role"],
    assessmentMethods: ["Professional discussion", "Strategic portfolio", "Business case studies", "Leadership evidence"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
  },
  // ===== NVQ Trade-Specific =====
  {
    id: "pro-12", slug: "nvq-level-2-bricklaying",
    title: "NVQ Level 2 Bricklaying", titleShort: "NVQ L2 Bricklaying",
    type: "NVQ", level: "2", pathway: "Bricklaying", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Master the craft that builds Britain",
    description: "Transform your bricklaying skills into a recognised qualification. Prove your competence on-site and unlock your blue CSCS card for a lifelong career.",
    fullDescription: "Bricklaying is one of construction's most essential trades — and qualified bricklayers are in high demand. This NVQ proves you can build walls, chimneys, and structures to professional standards.",
    outcomes: ["Set out and build brick and block structures", "Lay bricks and blocks to line and level", "Build solid walls and cavity walls", "Construct decorative features and bonds", "Work safely on construction sites", "Read and interpret technical drawings"],
    whoIsFor: ["Working bricklayers seeking formal recognition", "Apprentices completing their training", "Career changers with on-site experience", "Self-employed bricklayers wanting credentials"],
    careers: ["Qualified Bricklayer (Blue CSCS Card)", "Site Bricklayer", "Self-Employed Contractor", "Progress to Supervisor roles", "Specialist Restoration Bricklayer"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Work safely and responsibly on construction sites.", credits: 0, mandatory: true },
      { title: "Setting Out to Form Brick and Block Structures", description: "Accurately set out for construction work.", credits: 0, mandatory: true },
      { title: "Building Solid Walling", description: "Construct solid brick and block walls.", credits: 0, mandatory: true },
      { title: "Building Cavity Walling", description: "Build cavity walls with insulation and ties.", credits: 0, mandatory: true },
      { title: "Laying Blocklaying to Brick Structures", description: "Combine blocks and bricks effectively.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1400, priceGbp: 1199, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Blue CSCS card eligibility"] },
      { name: "Plus", priceEur: 1960, priceGbp: 1679, includes: ["Everything in Essentials", "Additional assessor sessions", "Skills coaching", "Career guidance", "Industry mentoring"] },
      { name: "Premium", priceEur: 2800, priceGbp: 2399, includes: ["Everything in Plus", "Unlimited assessor support", "Trade development", "Business guidance for self-employment", "Supervisor pathway planning"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "NVQ Level 2 qualifies you for the blue CSCS Skilled Worker card in Bricklaying." },
      { question: "Do I need to attend college?", answer: "No! Assessment happens on your actual work site." }
    ],
    entryRequirements: ["Currently working as a bricklayer", "Access to a range of bricklaying work", "Basic site safety knowledge"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Photographic evidence", "Work records"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
  },
  {
    id: "pro-13", slug: "nvq-level-3-bricklaying",
    title: "NVQ Level 3 Bricklaying", titleShort: "NVQ L3 Bricklaying",
    type: "NVQ", level: "3", pathway: "Bricklaying", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Advanced masonry for complex projects",
    description: "Elevate your bricklaying expertise. Prove your ability to handle complex structures, decorative work, and supervise quality. Eligible for gold CSCS card.",
    fullDescription: "Level 3 recognises advanced bricklaying skills — complex bonding patterns, decorative features, and the ability to work on challenging projects. Positions you as a senior craftsperson.",
    outcomes: ["Construct complex decorative brickwork", "Build arches, chimneys, and fireplaces", "Execute advanced bonding patterns", "Supervise bricklaying teams", "Ensure quality standards", "Interpret complex technical drawings"],
    whoIsFor: ["Experienced bricklayers seeking advancement", "Those supervising bricklaying teams", "Craftsmen specialising in decorative work", "Bricklayers ready for gold card status"],
    careers: ["Senior Bricklayer (Gold CSCS Card)", "Lead Bricklayer", "Bricklaying Supervisor", "Specialist Heritage Bricklayer", "Progress to Site Management"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Maintain safety standards across teams.", credits: 0, mandatory: true },
      { title: "Setting Out Complex Masonry Structures", description: "Plan advanced bricklaying projects.", credits: 0, mandatory: true },
      { title: "Erecting Complex Masonry", description: "Build challenging masonry features.", credits: 0, mandatory: true },
      { title: "Constructing Decorative Brickwork", description: "Create artistic and heritage details.", credits: 0, mandatory: true },
      { title: "Supervising Bricklaying Operations", description: "Lead and guide bricklaying teams.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1800, priceGbp: 1499, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Gold CSCS card eligibility"] },
      { name: "Plus", priceEur: 2520, priceGbp: 2099, includes: ["Everything in Essentials", "Enhanced assessment sessions", "Leadership coaching", "Career pathway planning", "Industry mentoring"] },
      { name: "Premium", priceEur: 3600, priceGbp: 2999, includes: ["Everything in Plus", "Unlimited assessor support", "Supervisor development", "Management pathway planning", "Professional networking"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "Level 3 qualifies you for the gold CSCS Supervisory card." },
      { question: "Do I need Level 2 first?", answer: "Not necessarily, but you need significant bricklaying experience." }
    ],
    entryRequirements: ["Substantial bricklaying experience", "Access to complex/decorative work", "Some supervisory responsibility"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Complex project evidence", "Supervisory records"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"
  },
  {
    id: "pro-14", slug: "nvq-level-2-carpentry-joinery",
    title: "NVQ Level 2 Carpentry & Joinery", titleShort: "NVQ L2 Carpentry",
    type: "NVQ", level: "2", pathway: "Carpentry", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Craft your future with wood",
    description: "Transform your carpentry skills into a nationally recognised qualification. From first fix to finishing, prove your competence and unlock your blue CSCS card.",
    fullDescription: "Carpentry is one of construction's most versatile and in-demand trades. This NVQ proves you can work with timber to professional standards — from first fix to second fix work.",
    outcomes: ["Install first fix timber structures", "Fit doors, frames, and linings", "Install staircases and handrails", "Complete second fix carpentry", "Work safely with power tools", "Read and work from technical drawings"],
    whoIsFor: ["Working carpenters seeking formal recognition", "Apprentices completing their training", "Site carpenters wanting blue CSCS card", "Self-employed carpenters needing credentials"],
    careers: ["Qualified Carpenter (Blue CSCS Card)", "Site Carpenter", "Bench Joiner", "Self-Employed Contractor", "Progress to Supervisor roles"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Work safely on construction sites.", credits: 0, mandatory: true },
      { title: "First Fix Carpentry", description: "Install structural timber elements.", credits: 0, mandatory: true },
      { title: "Second Fix Carpentry", description: "Complete finishing carpentry work.", credits: 0, mandatory: true },
      { title: "Fitting Doors and Frames", description: "Install internal and external doors.", credits: 0, mandatory: true },
      { title: "Installing Staircases", description: "Fit staircases and balustrades.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1400, priceGbp: 1199, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Blue CSCS card eligibility"] },
      { name: "Plus", priceEur: 1960, priceGbp: 1679, includes: ["Everything in Essentials", "Additional assessor sessions", "Skills development coaching", "Career guidance", "Industry mentoring"] },
      { name: "Premium", priceEur: 2800, priceGbp: 2399, includes: ["Everything in Plus", "Unlimited assessor support", "Trade mastery programme", "Business guidance", "Supervisor pathway planning"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "NVQ Level 2 qualifies you for the blue CSCS Skilled Worker card in Carpentry." },
      { question: "Is site work or bench joinery covered?", answer: "We can assess either site carpentry or bench joinery — or a combination." }
    ],
    entryRequirements: ["Currently working as a carpenter/joiner", "Access to a variety of carpentry work", "Basic site safety knowledge"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Photographic evidence", "Work records"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=600&q=80"
  },
  {
    id: "pro-15", slug: "nvq-level-3-carpentry-joinery",
    title: "NVQ Level 3 Carpentry & Joinery", titleShort: "NVQ L3 Carpentry",
    type: "NVQ", level: "3", pathway: "Carpentry", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Master craftsperson status",
    description: "Elevate your carpentry to master craftsperson level. Prove your ability to handle complex installations, bespoke joinery, and supervise teams. Gold CSCS card eligible.",
    fullDescription: "Level 3 recognises advanced carpentry skills — complex roof construction, bespoke joinery, and the ability to lead and supervise others.",
    outcomes: ["Construct complex roof structures", "Create bespoke joinery items", "Install intricate timber features", "Supervise carpentry teams", "Plan and organise work activities", "Ensure quality standards"],
    whoIsFor: ["Experienced carpenters seeking advancement", "Those supervising carpentry teams", "Specialist bespoke joiners", "Carpenters ready for gold card status"],
    careers: ["Senior Carpenter (Gold CSCS Card)", "Lead Carpenter", "Carpentry Supervisor", "Master Joiner", "Progress to Site Management"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Maintain safety across teams.", credits: 0, mandatory: true },
      { title: "Setting Out Complex Carpentry", description: "Plan advanced timber installations.", credits: 0, mandatory: true },
      { title: "Constructing Complex Roof Structures", description: "Build challenging roof systems.", credits: 0, mandatory: true },
      { title: "Creating Bespoke Joinery", description: "Craft custom timber elements.", credits: 0, mandatory: true },
      { title: "Supervising Carpentry Operations", description: "Lead carpentry teams effectively.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1800, priceGbp: 1499, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Gold CSCS card eligibility"] },
      { name: "Plus", priceEur: 2520, priceGbp: 2099, includes: ["Everything in Essentials", "Enhanced assessment sessions", "Leadership coaching", "Career pathway planning", "Industry mentoring"] },
      { name: "Premium", priceEur: 3600, priceGbp: 2999, includes: ["Everything in Plus", "Unlimited assessor support", "Supervisor development", "Management pathway planning", "Professional networking"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "Level 3 qualifies you for the gold CSCS Supervisory card." },
      { question: "Is roof work essential?", answer: "Complex work is required — this could be roofing, bespoke joinery, or other advanced carpentry." }
    ],
    entryRequirements: ["Substantial carpentry experience", "Access to complex timber work", "Some supervisory responsibility"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Complex project evidence", "Supervisory records"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=600&q=80"
  },
  {
    id: "pro-16", slug: "nvq-level-2-plastering",
    title: "NVQ Level 2 Plastering", titleShort: "NVQ L2 Plastering",
    type: "NVQ", level: "2", pathway: "Plastering", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Perfect finishes, proven skills",
    description: "Transform your plastering skills into a recognised qualification. Prove your ability to create flawless finishes and unlock your blue CSCS card.",
    fullDescription: "A skilled plasterer can transform any space — and qualified plasterers are always in demand. This NVQ proves you can apply plaster, render, and dry lining to professional standards.",
    outcomes: ["Apply plaster to internal surfaces", "Apply render to external walls", "Install dry lining systems", "Achieve smooth, professional finishes", "Work safely with plastering materials", "Read and work from specifications"],
    whoIsFor: ["Working plasterers seeking formal recognition", "Apprentices completing their training", "Site plasterers wanting blue CSCS card", "Self-employed plasterers needing credentials"],
    careers: ["Qualified Plasterer (Blue CSCS Card)", "Site Plasterer", "Dry Liner", "Renderer", "Self-Employed Contractor"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Work safely on construction sites.", credits: 0, mandatory: true },
      { title: "Applying Plaster to Internal Surfaces", description: "Apply and finish internal plasterwork.", credits: 0, mandatory: true },
      { title: "Applying Render to External Surfaces", description: "Apply and finish external render.", credits: 0, mandatory: true },
      { title: "Installing Dry Lining Systems", description: "Fix plasterboard and dry lining.", credits: 0, mandatory: true },
      { title: "Preparing Surfaces for Plastering", description: "Prepare backgrounds for plaster application.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1400, priceGbp: 1199, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Blue CSCS card eligibility"] },
      { name: "Plus", priceEur: 1960, priceGbp: 1679, includes: ["Everything in Essentials", "Additional assessor sessions", "Skills coaching", "Career guidance", "Industry mentoring"] },
      { name: "Premium", priceEur: 2800, priceGbp: 2399, includes: ["Everything in Plus", "Unlimited assessor support", "Trade development", "Business guidance", "Supervisor pathway planning"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "NVQ Level 2 qualifies you for the blue CSCS Skilled Worker card in Plastering." },
      { question: "Is dry lining or wet trades covered?", answer: "We can assess solid plastering, dry lining, or rendering — or all three!" }
    ],
    entryRequirements: ["Currently working as a plasterer", "Access to a variety of plastering work", "Basic site safety knowledge"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Photographic evidence", "Work records"],
    totalCredits: 0, popular: true,
    image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&q=80"
  },
  {
    id: "pro-17", slug: "nvq-level-3-plastering",
    title: "NVQ Level 3 Plastering", titleShort: "NVQ L3 Plastering",
    type: "NVQ", level: "3", pathway: "Plastering", duration: "12-18 months", mode: "Work-based + Online",
    tagline: "Advanced finishes, leadership skills",
    description: "Elevate your plastering expertise. Prove your ability to handle decorative work, complex finishes, and supervise teams. Gold CSCS card eligible.",
    fullDescription: "Level 3 recognises advanced plastering skills — decorative cornices, complex mouldings, and the ability to lead and supervise others.",
    outcomes: ["Create decorative plasterwork", "Apply complex mouldings and cornices", "Execute specialist finishes", "Supervise plastering teams", "Ensure quality standards", "Plan and organise work activities"],
    whoIsFor: ["Experienced plasterers seeking advancement", "Those supervising plastering teams", "Specialist decorative plasterers", "Plasterers ready for gold card status"],
    careers: ["Senior Plasterer (Gold CSCS Card)", "Lead Plasterer", "Plastering Supervisor", "Decorative Plaster Specialist", "Progress to Site Management"],
    modules: [
      { title: "Conforming to Health and Safety", description: "Maintain safety across teams.", credits: 0, mandatory: true },
      { title: "Setting Out Complex Plastering", description: "Plan advanced plastering projects.", credits: 0, mandatory: true },
      { title: "Creating Decorative Plasterwork", description: "Produce ornamental features.", credits: 0, mandatory: true },
      { title: "Applying Complex Finishes", description: "Execute specialist finishing techniques.", credits: 0, mandatory: true },
      { title: "Supervising Plastering Operations", description: "Lead plastering teams effectively.", credits: 0, mandatory: true }
    ],
    tiers: [
      { name: "Essentials", priceEur: 1800, priceGbp: 1499, includes: ["Full assessment support", "Portfolio development", "Assessor site visits", "Certificate upon completion", "Gold CSCS card eligibility"] },
      { name: "Plus", priceEur: 2520, priceGbp: 2099, includes: ["Everything in Essentials", "Enhanced assessment sessions", "Leadership coaching", "Career pathway planning", "Industry mentoring"] },
      { name: "Premium", priceEur: 3600, priceGbp: 2999, includes: ["Everything in Plus", "Unlimited assessor support", "Supervisor development", "Management pathway planning", "Professional networking"] }
    ],
    faqs: [
      { question: "What CSCS card will I get?", answer: "Level 3 qualifies you for the gold CSCS Supervisory card." },
      { question: "Is decorative work essential?", answer: "Advanced work is required — decorative plastering, complex rendering, or specialist finishes." }
    ],
    entryRequirements: ["Substantial plastering experience", "Access to complex/decorative work", "Some supervisory responsibility"],
    assessmentMethods: ["On-site observation", "Professional discussion", "Complex project evidence", "Supervisory records"],
    totalCredits: 0, popular: false,
    image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600&q=80"
  },
];

// Helper: get all unique professional course pathways
export function getProfessionalPathways(): string[] {
  return Array.from(new Set(PROFESSIONAL_COURSES.map(c => c.pathway)));
}

// Helper: get all unique professional course types
export function getProfessionalTypes(): ProfessionalCourse["type"][] {
  return Array.from(new Set(PROFESSIONAL_COURSES.map(c => c.type)));
}

// Helper: get professional course by slug
export function getProfessionalCourseBySlug(slug: string): ProfessionalCourse | undefined {
  return PROFESSIONAL_COURSES.find(c => c.slug === slug);
}
