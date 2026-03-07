export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: 'BSc' | 'MSc' | 'HND' | 'Foundation';
  duration: string;
  campuses: string[];
  price: string;
  image: string;
  description: string;
  modules: string[];
  careers: string[];
  university: string;
}

export const coursesData: Course[] = [
  {
    id: '1', title: 'Psychology & Counselling', slug: 'psychology-counselling', category: 'Psychology', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80', description: 'Combining psychology and counselling, this course focuses on the study of human behaviour theory through the lens of diversity, characteristic and cultural context. Prepare for careers in mental health, HR, and social services.', modules: ['Introduction to Psychology', 'Counselling Skills', 'Developmental Psychology', 'Cognitive Psychology', 'Research Methods', 'Clinical Psychology', 'Abnormal Psychology', 'Forensic Psychology'], careers: ['Mental Health Counsellor', 'HR Specialist', 'Social Worker', 'Clinical Psychologist', 'Research Analyst'], university: 'Global Banking School',
  },
  {
    id: '2', title: 'Computing', slug: 'computing', category: 'Technology', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', description: 'Designed to provide a strong grounding in computing and IT to solve real-world problems. Based around 3 themes: Technology, Software, and Data.', modules: ['Programming Fundamentals', 'Database Systems', 'Web Development', 'Cyber Security', 'Networking', 'Software Engineering', 'AI & Machine Learning', 'Cloud Computing'], careers: ['Software Developer', 'Data Analyst', 'Cyber Security Analyst', 'Systems Administrator', 'Web Developer'], university: 'Global Banking School',
  },
  {
    id: '3', title: 'Global Business', slug: 'global-business-management', category: 'Business', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', description: 'Designed for those seeking a career in management and budding business owners. This business management degree provides the knowledge and skills that will give you a competitive edge in the global marketplace.', modules: ['Business Strategy', 'Marketing Management', 'Financial Management', 'Operations Management', 'International Business', 'Entrepreneurship', 'Human Resource Management', 'Project Management'], careers: ['Business Manager', 'Marketing Manager', 'Entrepreneur', 'Project Manager', 'Operations Director'], university: 'Global Banking School',
  },
  {
    id: '4', title: 'Accounting & Finance', slug: 'accounting-financial-management', category: 'Business', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', description: 'Build expertise in accounting, auditing, and financial management. This degree provides exemptions from major professional accounting bodies (IFA, ACCA, CIMA).', modules: ['Financial Accounting', 'Management Accounting', 'Auditing', 'Taxation', 'Corporate Finance', 'Financial Markets', 'Business Law', 'Economics'], careers: ['Accountant', 'Financial Analyst', 'Auditor', 'Tax Consultant', 'Investment Banker'], university: 'Global Banking School',
  },
  {
    id: '5', title: 'MSc Global Business', slug: 'msc-global-business', category: 'Business', level: 'MSc', duration: '1 year', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£8,595/year', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', description: 'A career-enhancing postgraduate qualification designed to prepare you for leadership roles in a global business environment.', modules: ['Strategic Management', 'Global Marketing', 'Leadership & Change', 'Research Methods', 'International Finance', 'Innovation Management', 'Dissertation'], careers: ['Senior Manager', 'Strategy Consultant', 'Business Director', 'CEO/Founder'], university: 'Global Banking School',
  },
  {
    id: '6', title: 'HND Cyber Security', slug: 'hnd-cyber-security', category: 'Technology', level: 'HND', duration: '2 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£6,355/year', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80', description: 'Develop a range of key skills essential for entry into the exciting and ever-evolving digital technology sector.', modules: ['Cyber Security Fundamentals', 'Network Security', 'Ethical Hacking', 'Digital Forensics', 'Risk Management', 'Cryptography'], careers: ['Cyber Security Analyst', 'Network Engineer', 'Penetration Tester', 'Security Consultant'], university: 'Global Banking School',
  },
  {
    id: '7', title: 'Health & Social Care', slug: 'health-social-care', category: 'Health', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', description: 'Develop the knowledge and skills needed for a rewarding career in health and social care settings.', modules: ['Health Policy', 'Social Care Practice', 'Public Health', 'Mental Health', 'Research Methods', 'Leadership in Care', 'Safeguarding', 'Communication Skills'], careers: ['Healthcare Manager', 'Social Worker', 'Care Coordinator', 'Public Health Officer'], university: 'Global Banking School',
  },
  {
    id: '8', title: 'Construction Management', slug: 'construction-management', category: 'Construction', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', description: 'Learn to manage complex construction projects from inception to completion in this practical, industry-focused degree.', modules: ['Construction Technology', 'Project Management', 'Building Surveying', 'Contract Law', 'Sustainable Construction', 'BIM', 'Cost Management', 'Site Management'], careers: ['Construction Manager', 'Site Manager', 'Quantity Surveyor', 'Project Director'], university: 'Global Banking School',
  },
  {
    id: '9', title: 'Digital Marketing', slug: 'digital-marketing', category: 'Business', level: 'BSc', duration: '4 years', campuses: ['London', 'Birmingham', 'Manchester', 'Leeds'], price: '£9,535/year', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', description: 'Master the art and science of digital marketing. From SEO and social media to data analytics and content strategy.', modules: ['Digital Marketing Strategy', 'SEO & SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics & Data', 'Email Marketing', 'Brand Management', 'Consumer Behaviour'], careers: ['Digital Marketing Manager', 'SEO Specialist', 'Social Media Manager', 'Content Strategist'], university: 'Global Banking School',
  },
  {
    id: '10', title: 'MSc Data Analytics', slug: 'msc-data-analytics', category: 'Technology', level: 'MSc', duration: '1 year', campuses: ['London', 'Manchester'], price: '£8,595/year', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', description: 'Develop advanced skills in data analysis, machine learning, and business intelligence for the data-driven economy.', modules: ['Advanced Statistics', 'Machine Learning', 'Big Data Technologies', 'Data Visualization', 'Business Intelligence', 'Python for Data Science', 'Dissertation'], careers: ['Data Scientist', 'Data Analyst', 'BI Consultant', 'ML Engineer'], university: 'QA Higher Education',
  },
];

export const categories = ['All', 'Business', 'Technology', 'Psychology', 'Health', 'Construction'];
export const levels = ['All', 'BSc', 'MSc', 'HND', 'Foundation'];
