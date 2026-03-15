import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Star, Users, TrendingUp, Award } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  course: string;
  category: string;
  youtubeId: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Andrei M.',
    course: 'Business Management',
    category: 'Business',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Am primit finanțare completă pentru studii de Business Management.',
  },
  {
    id: '2',
    name: 'Maria P.',
    course: 'Computing & IT',
    category: 'Technology',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Cursul de IT mi-a schimbat complet cariera.',
  },
  {
    id: '3',
    name: 'Ion C.',
    course: 'Health & Social Care',
    category: 'Health',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Acum lucrez în NHS datorită calificării obținute.',
  },
  {
    id: '4',
    name: 'Elena D.',
    course: 'Construction Management',
    category: 'Construction',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Am avansat de la muncitor pe șantier la manager de proiect.',
  },
  {
    id: '5',
    name: 'Alexandru R.',
    course: 'Business & Marketing',
    category: 'Business',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'EduForYou m-a ghidat prin întregul proces de aplicare.',
  },
  {
    id: '6',
    name: 'Cristina S.',
    course: 'Software Engineering',
    category: 'Technology',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'De la zero cunoștințe la dezvoltator full-stack.',
  },
  {
    id: '7',
    name: 'Florin L.',
    course: 'Nursing Studies',
    category: 'Health',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Studiile în nursing mi-au deschis uși incredibile.',
  },
  {
    id: '8',
    name: 'Dan B.',
    course: 'Civil Engineering',
    category: 'Construction',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Calificarea universitară mi-a dublat salariul.',
  },
];

const CATEGORIES = ['All', 'Business', 'Technology', 'Health', 'Construction'] as const;

const STATS = [
  { icon: Users, value: '6288+', label: 'studenți' },
  { icon: TrendingUp, value: '£31M+', label: 'finanțare' },
  { icon: Star, value: '4.8/5', label: 'Trustpilot' },
  { icon: Award, value: '94%', label: 'success' },
];

const VideoTestimonialsCarousel = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filterByCategory = (category: string) => {
    if (category === 'All') return TESTIMONIALS;
    return TESTIMONIALS.filter((t) => t.category === category);
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Stats bar */}
        <div className="mb-12 grid grid-cols-2 gap-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="mb-1 h-5 w-5 opacity-80" />
              <span className="text-2xl font-bold md:text-3xl">{value}</span>
              <span className="text-xs uppercase tracking-wider opacity-80">{label}</span>
            </div>
          ))}
        </div>

        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Ce Spun Studenții Noștri
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Peste 6.000 de studenți români au ales să studieze gratuit în UK
        </p>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mx-auto mb-8 flex w-fit flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="px-4 text-sm">
                {cat === 'All' ? 'Toate' : cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filterByCategory(cat).map((testimonial) => (
                  <Card key={testimonial.id} className="overflow-hidden">
                    {/* Video embed / thumbnail */}
                    <div className="relative aspect-video bg-gray-900">
                      {playingId === testimonial.id ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${testimonial.youtubeId}?autoplay=1`}
                          title={`Testimonial ${testimonial.name}`}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      ) : (
                        <button
                          onClick={() => setPlayingId(testimonial.id)}
                          className="group absolute inset-0 flex items-center justify-center"
                          aria-label={`Redă testimonialul lui ${testimonial.name}`}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${testimonial.youtubeId}/hqdefault.jpg`}
                            alt={testimonial.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-6 w-6 fill-white text-white" />
                          </div>
                        </button>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="mb-2 text-sm italic text-gray-600">
                        "{testimonial.quote}"
                      </p>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-blue-600">{testimonial.course}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default VideoTestimonialsCarousel;
