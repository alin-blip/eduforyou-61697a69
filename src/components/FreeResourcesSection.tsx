/*
 * FreeResourcesSection — "Resurse Gratuite" / "Free Resources"
 * Download cards for free books/lead magnets
 * Design: Premium, powerful, empowering — navy + gold
 * Book cover is the dominant hero visual. No decorative icons.
 *
 * NOTE: This section contains Romanian-only guide/ebook content.
 * It is intentionally hidden when any language other than Romanian is selected.
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

interface ResourceCard {
  id: string;
  href: string;
  titleKey: string;
  descKey: string;
  ctaKey: string;
  tag: string;
  tagStyle: "free" | "paid" | "tool";
  coverImage: string;
  external?: boolean;
}

const RESOURCES: ResourceCard[] = [
  {
    id: "ghidFinantare",
    href: "/ghid-finantare",
    titleKey: "freeResources.financeTitle",
    descKey: "freeResources.financeDesc",
    ctaKey: "freeResources.downloadCta",
    tag: "GRATUIT",
    tagStyle: "free",
    coverImage: "/images/cover_finantare_studii.webp",
  },
  {
    id: "ghidTransformare",
    href: "/ghid-transformare",
    titleKey: "freeResources.enrollmentTitle",
    descKey: "freeResources.enrollmentDesc",
    ctaKey: "freeResources.downloadCta",
    tag: "GRATUIT",
    tagStyle: "free",
    coverImage: "/images/cover_job_la_diploma.webp",
  },
  {
    id: "ikigai",
    href: "/ghid-gratuit",
    titleKey: "freeResources.ikigaiTitle",
    descKey: "freeResources.ikigaiDesc",
    ctaKey: "freeResources.ikigaiCta",
    tag: "GRATUIT",
    tagStyle: "free",
    coverImage: "/images/cover_blackbook.webp",
  },
  {
    id: "blackbook",
    href: "/ebook",
    titleKey: "freeResources.threeRoadsTitle",
    descKey: "freeResources.threeRoadsDesc",
    ctaKey: "freeResources.threeRoadsCta",
    tag: "£5",
    tagStyle: "paid",
    coverImage: "/images/cover_ikigai.webp",
  },
];

const TAG_STYLES: Record<ResourceCard["tagStyle"], string> = {
  free: "bg-emerald-500 text-white",
  paid: "bg-[#D4AF37] text-black",
  tool: "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/50",
};

function CardContent({ resource, t }: { resource: ResourceCard; t: (key: string) => string }) {
  return (
    <div className="group relative flex flex-col h-full bg-[#0a1628] border border-white/[0.07] hover:border-[#D4AF37]/50 transition-all duration-500 cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.12)]">

      {/* Book Cover — dominant visual, 3D mockup */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#0a1222] flex-shrink-0 flex items-center justify-center p-6"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          src={resource.coverImage}
          alt={t(resource.titleKey)}
          className="max-h-full max-w-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent" />

        {/* Tag badge */}
        <span
          className={`absolute top-0 left-0 text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 ${TAG_STYLES[resource.tagStyle]}`}
        >
          {resource.tag}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 bg-gradient-to-b from-[#0a1628]/50 to-[#0a1628]/80">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
          {t(resource.titleKey)}
        </h3>
        <p className="text-xs sm:text-sm text-white/50 mb-4 line-clamp-2 flex-1">
          {t(resource.descKey)}
        </p>
        <button className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#e6c555] transition-colors group-hover:translate-x-1 transition-transform">
          {t(resource.ctaKey)} →
        </button>
      </div>
    </div>
  );
}

export default function FreeResourcesSection() {
  const { t, lang } = useLanguage();

  // Show resources for all languages
  if (!RESOURCES.length) return null;

  return (
    <section className="py-24 lg:py-32 bg-[#07111d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("freeResources.title")}
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            {t("freeResources.subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {RESOURCES.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              {resource.external ? (
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <CardContent resource={resource} t={t} />
                </a>
              ) : (
                <Link to={resource.href} className="block h-full">
                  <CardContent resource={resource} t={t} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
