export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage?: string;
}

// Static blog articles for fallback / initial content
export const blogArticles: BlogArticle[] = [
  {
    slug: 'cum-sa-obtii-finantare-student-finance-england',
    title: 'Cum să Obții Finanțare prin Student Finance England',
    excerpt: 'Ghid complet despre procesul de aplicare pentru Student Finance England. Află tot ce trebuie să știi despre eligibilitate, documente necesare și pașii de urmat.',
    category: 'Finanțare',
    author: 'EduForYou Team',
    date: '2024-12-15',
    readTime: '8 min',
  },
  {
    slug: 'top-10-universitati-uk-pentru-romani',
    title: 'Top 10 Universități din UK pentru Români',
    excerpt: 'Descoperă cele mai bune universități din Marea Britanie care acceptă studenți români și oferă programe cu finanțare completă.',
    category: 'Universități',
    author: 'EduForYou Team',
    date: '2024-12-10',
    readTime: '10 min',
  },
  {
    slug: 'metoda-edu-explicata',
    title: 'Metoda E.D.U. Explicată: De la Evaluare la Deblocare',
    excerpt: 'Află cum funcționează metoda noastră brevetată E.D.U. care a ajutat peste 6000 de studenți să-și transforme viitorul.',
    category: 'Educație',
    author: 'EduForYou Team',
    date: '2024-12-05',
    readTime: '6 min',
  },
  {
    slug: 'ghid-eligibilitate-studenti-internationali',
    title: 'Ghid de Eligibilitate pentru Studenți Internaționali',
    excerpt: 'Verifică dacă ești eligibil pentru finanțare. Ghid detaliat cu toate criteriile de eligibilitate pentru Student Finance.',
    category: 'Eligibilitate',
    author: 'EduForYou Team',
    date: '2024-11-28',
    readTime: '7 min',
  },
  {
    slug: 'cariere-dupa-universitate-uk',
    title: 'Cariere după Universitate în UK: Ce Oportunități ai?',
    excerpt: 'Ce opțiuni de carieră ai după ce termini o universitate din UK? Descoperă cele mai căutate domenii și salarii medii.',
    category: 'Cariere',
    author: 'EduForYou Team',
    date: '2024-11-20',
    readTime: '9 min',
  },
  {
    slug: 'ikigai-descopera-ti-pasiunea',
    title: 'IKIGAI: Descoperă-ți Pasiunea și Alege Cursul Potrivit',
    excerpt: 'Cum te poate ajuta testul IKIGAI să alegi cursul universitar care se potrivește perfect cu pasiunile și talentele tale.',
    category: 'Dezvoltare Personală',
    author: 'EduForYou Team',
    date: '2024-11-15',
    readTime: '5 min',
  },
];

export const blogCategories = ['Toate', 'Finanțare', 'Universități', 'Educație', 'Eligibilitate', 'Cariere', 'Dezvoltare Personală'];
