import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

const SEOHead = ({ title, description, canonical, ogImage, jsonLd, noindex }: SEOHeadProps) => {
  useEffect(() => {
    // Title
    document.title = `${title} | EduForYou`;

    // Meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:site_name', 'EduForYou', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    if (ogImage) {
      setMeta('og:image', ogImage, true);
      setMeta('twitter:image', ogImage);
    }

    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonical;
    }

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-ld]');
    if (existingLd) existingLd.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ldScript = document.querySelector('script[data-seo-ld]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonical, ogImage, jsonLd, noindex]);

  return null;
};

export default SEOHead;

// Common JSON-LD schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'EduForYou',
  url: 'https://eduforyou.co.uk',
  logo: 'https://eduforyou.co.uk/favicon.ico',
  description: 'Free UK university consultancy helping students access higher education through Student Finance.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Romanian', 'Hungarian', 'Polish'],
  },
};

export const courseSchema = (course: { title: string; description: string; slug: string; university: string; price: string; duration: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  url: `https://eduforyou.co.uk/cursuri/${course.slug}`,
  provider: {
    '@type': 'Organization',
    name: course.university,
  },
  offers: {
    '@type': 'Offer',
    price: course.price.replace(/[^0-9]/g, ''),
    priceCurrency: 'GBP',
  },
  timeRequired: course.duration,
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const blogPostSchema = (post: { title: string; excerpt: string; slug: string; author: string; created_at: string; cover_image?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  url: `https://eduforyou.co.uk/blog/${post.slug}`,
  author: { '@type': 'Person', name: post.author },
  datePublished: post.created_at,
  publisher: { '@type': 'Organization', name: 'EduForYou' },
  ...(post.cover_image ? { image: post.cover_image } : {}),
});

export const localBusinessSchema = (campus: { name: string; slug: string; address_line1?: string; city: string; postcode?: string; phone?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: `EduForYou ${campus.name}`,
  url: `https://eduforyou.co.uk/locatii/${campus.slug}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: campus.address_line1 || '',
    addressLocality: campus.city,
    postalCode: campus.postcode || '',
    addressCountry: 'GB',
  },
  telephone: campus.phone || '',
});
