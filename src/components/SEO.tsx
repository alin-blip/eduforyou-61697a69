import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

const SEO = ({ title, description, canonical, image, type = 'website', noindex }: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | EduForYou`;
    document.title = fullTitle;

    const setMeta = (nameOrProp: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, nameOrProp);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Standard meta
    setMeta('description', description);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'EduForYou', true);

    if (canonical) {
      setMeta('og:url', canonical, true);
    }

    if (image) {
      setMeta('og:image', image, true);
      setMeta('og:image:width', '1200', true);
      setMeta('og:image:height', '630', true);
    }

    // Twitter Card
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    if (image) {
      setMeta('twitter:image', image);
    }

    // Robots
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonical;
    } else if (canonicalEl) {
      canonicalEl.remove();
    }

    return () => {
      const ldScript = document.querySelector('script[data-seo-ld]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonical, image, type, noindex]);

  return null;
};

export default SEO;

// JSON-LD helper: Organization schema
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'EduForYou',
  url: 'https://eduforyou.co.uk',
  logo: 'https://eduforyou.co.uk/favicon.ico',
  description:
    'Free UK university consultancy helping Romanian students access higher education through Student Finance England.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Romanian'],
  },
};

// Inject JSON-LD into page head
export const injectJsonLd = (schema: Record<string, unknown>) => {
  const existing = document.querySelector('script[data-seo-ld]');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-ld', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};
