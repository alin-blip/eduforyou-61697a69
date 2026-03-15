import { useEffect } from 'react';

const NoIndexMeta = () => {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      const el = document.querySelector('meta[name="robots"]');
      if (el) el.remove();
    };
  }, []);

  return null;
};

export default NoIndexMeta;
