export interface Location {
  id: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  description: string;
  features: string[];
  courses: number;
  students: string;
}

export const locationsData: Location[] = [
  { id: '1', name: 'London', slug: 'london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', address: 'London, United Kingdom', description: 'Our flagship London campus offers a vibrant learning environment in the heart of the UK capital. With excellent transport links and a diverse student community.', features: ['Modern facilities', 'Library access', 'Student support centre', 'Career services', 'Central location'], courses: 14, students: '3,000+' },
  { id: '2', name: 'Birmingham', slug: 'birmingham', image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80', address: 'Birmingham, United Kingdom', description: 'Birmingham campus provides excellent facilities in the UK\'s second-largest city, known for its thriving business community and cultural diversity.', features: ['State-of-the-art classrooms', 'IT labs', 'Student lounge', 'Networking events', 'City centre location'], courses: 12, students: '1,500+' },
  { id: '3', name: 'Manchester', slug: 'manchester', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80', address: 'Manchester, United Kingdom', description: 'Manchester campus is located in one of the UK\'s most dynamic cities, offering students access to a thriving job market and cultural scene.', features: ['Modern campus', 'Research facilities', 'Student welfare', 'Industry partnerships', 'Transport links'], courses: 10, students: '1,200+' },
  { id: '4', name: 'Leeds', slug: 'leeds', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', address: 'Leeds, United Kingdom', description: 'Leeds campus offers a welcoming environment in one of the UK\'s fastest-growing cities with a strong graduate employment record.', features: ['Affordable living', 'Student community', 'Career support', 'Modern facilities', 'Green spaces'], courses: 8, students: '800+' },
  { id: '5', name: 'East London', slug: 'east-london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', address: 'East London, United Kingdom', description: 'East London campus serves the diverse communities of East London with accessible education and strong community links.', features: ['Community focused', 'Diverse campus', 'Local partnerships', 'Accessible location', 'Student support'], courses: 8, students: '600+' },
  { id: '6', name: 'Greenford', slug: 'greenford', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', address: 'Greenford, West London', description: 'Greenford campus provides a quieter study environment in West London with excellent facilities and strong pastoral support.', features: ['Quiet environment', 'Parking available', 'Small class sizes', 'Personal tutoring', 'Green surroundings'], courses: 6, students: '400+' },
];
