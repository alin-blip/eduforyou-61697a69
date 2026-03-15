/**
 * CoursesPage - E.D.U. Method Platform
 * Integrated with Ikigai quiz results for personalized course matching
 * Shows match score (%) per course based on user's Ikigai profile
 */
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search, Clock, MapPin, ChevronRight, Filter,
  Sparkles, Star, ArrowRight, Heart, Lightbulb, Globe2, PoundSterling,
  Target, TrendingUp, CheckCircle2
} from "lucide-react";
import { COURSES, DOMAINS, CAMPUSES, Course } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead, { organizationSchema } from "@/components/SEOHead";
import Layout from "@/components/layout/Layout";
import HomeFAQ from "@/components/HomeFAQ";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// ─── Ikigai → Course Domain Mapping ───────────────────────────────────────────
// Maps each Ikigai quiz tag to domain match weights
const DOMAIN_WEIGHTS: Record<string, Record<string, number>> = {
  Technology:           { Technology: 100, Business: 30, Construction: 20, Psychology: 10, Health: 10, "Project Management": 40 },
  Business:             { Business: 100, Psychology: 40, Technology: 30, Health: 20, Construction: 15, "Project Management": 80 },
  Psychology:           { Psychology: 100, Health: 60, Business: 40, Technology: 10, Construction: 5, "Project Management": 25 },
  Health:               { Health: 100, Psychology: 70, Business: 20, Technology: 15, Construction: 10, "Project Management": 20 },
  Construction:         { Construction: 100, Technology: 40, Business: 30, Health: 10, Psychology: 5, "Project Management": 70 },
  "Project Management": { "Project Management": 100, Business: 70, Construction: 60, Technology: 40, Health: 15, Psychology: 15 },
};

// Pillar labels for display
const PILLAR_ICONS = [
  { id: "love", label: "Passion", icon: Heart, color: "#d94f4f" },
  { id: "good", label: "Skills", icon: Lightbulb, color: "#3da34f" },
  { id: "world", label: "Purpose", icon: Globe2, color: "#3d566e" },
  { id: "paid", label: "Career", icon: PoundSterling, color: "#E67E22" },
];

// Compute match score (0-100) for a course given Ikigai tagCounts
function computeMatchScore(
  courseDomain: string,
  tagCounts: Record<string, number>
): number {
  const total = Object.values(tagCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  let weightedScore = 0;
  let maxPossible = 0;

  for (const [tag, count] of Object.entries(tagCounts)) {
    const domainWeights = DOMAIN_WEIGHTS[tag] ?? {};
    const weight = domainWeights[courseDomain] ?? 0;
    weightedScore += (count / total) * weight;
    maxPossible += (count / total) * 100;
  }

  return maxPossible > 0 ? Math.round((weightedScore / maxPossible) * 100) : 0;
}

function getMatchLabel(score: number, t: (key: string) => string): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: t("courses.perfectMatch"), color: "text-emerald-700", bg: "bg-emerald-100" };
  if (score >= 60) return { label: t("courses.greatMatch"), color: "text-blue-700", bg: "bg-blue-100" };
  if (score >= 40) return { label: t("courses.goodMatch"), color: "text-amber-700", bg: "bg-amber-100" };
  return { label: t("courses.explore"), color: "text-muted-foreground", bg: "bg-muted" };
}

// Ikigai result shape stored in localStorage
interface IkigaiLocalResult {
  quizType: "ikigai";
  tagCounts: Record<string, number>;
  recommendedCourses?: string[];
  createdAt: string;
}

export default function CoursesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [level, setLevel] = useState("all");
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "match">("default");

  // Load Ikigai results from localStorage (set by the Ikigai quiz page)
  const [ikigaiResult, setIkigaiResult] = useState<IkigaiLocalResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ikigai_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.tagCounts) {
          setIkigaiResult(parsed as IkigaiLocalResult);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const tagCounts: Record<string, number> = useMemo(() => {
    if (!ikigaiResult?.tagCounts) return {};
    return ikigaiResult.tagCounts;
  }, [ikigaiResult]);

  const hasIkigai = Object.keys(tagCounts).length > 0;
  const topDomain = hasIkigai
    ? Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  // Build course list with match scores
  const coursesWithScore = useMemo(() => {
    return COURSES.map((c) => ({
      ...c,
      matchScore: hasIkigai ? computeMatchScore(c.domain, tagCounts) : null,
    }));
  }, [tagCounts, hasIkigai]);

  const filtered = useMemo(() => {
    let list = coursesWithScore.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.domain.toLowerCase().includes(search.toLowerCase())) return false;
      if (domain !== "all" && c.domain !== domain) return false;
      if (level !== "all" && c.level !== level) return false;
      if (location !== "all" && !c.campuses.includes(location)) return false;
      return true;
    });

    if (sortBy === "match" && hasIkigai) {
      list = [...list].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    return list;
  }, [search, domain, level, location, sortBy, coursesWithScore, hasIkigai]);

  const topMatches = useMemo(() => {
    if (!hasIkigai) return [];
    return coursesWithScore
      .filter(c => (c.matchScore ?? 0) >= 60)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 3);
  }, [coursesWithScore, hasIkigai]);

  // Generate Service schema for all courses
  const coursesSchema = COURSES.map(course => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "EduForYou",
      "url": "https://www.eduforyou.co.uk"
    },
    "serviceType": "University Course",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "description": "Free consultancy service. Tuition fees are covered by Student Finance England."
    },
    "url": `https://www.eduforyou.co.uk/cursuri/${course.slug}`
  }));

  return (
    <Layout>
      <SEOHead
        title="14 Cursuri Universitare Acreditate UK | EduForYou"
        description="Descoperă 14 cursuri universitare acreditate în UK: Business, Psychology, Computing, Construction și altele. Finanțare completă prin Student Finance England."
        canonical="/cursuri"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Cursuri Universitare Acreditate UK | EduForYou",
          "description": "Descoperă 14 cursuri universitare acreditate în UK. Finanțare completă prin Student Finance England."
        }}
      />

      {/* Hero */}
      <section className="bg-[#1a252f] py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Badge className="mb-3 bg-[#E67E22]/20 text-[#f0a05c] border-[#E67E22]/30">{t("courses.accreditedProgrammes")}</Badge>
            <h1 className="text-3xl lg:text-5xl font-serif text-white mb-4">{t("courses.title")}</h1>
            <p className="text-white/60 max-w-xl">{t("courses.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* ─── IKIGAI BANNER ─────────────────────────────────────────────────────── */}
      {hasIkigai ? (
        /* Personalized banner — user has completed Ikigai */
        <section className="bg-gradient-to-r from-[#E67E22]/15 via-[#E67E22]/8 to-transparent border-b border-[#E67E22]/20">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#c96b15]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a252f]">
                    {t("courses.ikigaiActive")}{" "}
                    <span className="text-[#c96b15]">{topDomain}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("courses.ikigaiDesc")}
                  </p>
                </div>
              </div>

              {/* Pillar breakdown mini */}
              <div className="flex items-center gap-3">
                {Object.entries(tagCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([tag, count]) => {
                    const total = Object.values(tagCounts).reduce((a, b) => a + b, 0);
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={tag} className="text-center hidden sm:block">
                        <div className="text-sm font-bold text-[#2C3E50]">{pct}%</div>
                        <div className="text-[10px] text-muted-foreground">{tag}</div>
                      </div>
                    );
                  })}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-[#E67E22]/40 text-[#c96b15] hover:bg-[#E67E22]/10"
                  onClick={() => setSortBy(sortBy === "match" ? "default" : "match")}
                >
                  {sortBy === "match" ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t("courses.sortedByMatch")}</>
                  ) : (
                    <><Target className="w-3.5 h-3.5 mr-1.5" /> {t("courses.sortByMatch")}</>
                  )}
                </Button>
              </div>
            </div>

            {/* Top 3 matches quick access */}
            {topMatches.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground self-center">{t("courses.topMatches")}</span>
                {topMatches.map((c) => (
                  <Link key={c.id} to={`/cursuri/${c.slug}`}>
                    <Badge className="bg-white border border-[#E67E22]/30 text-[#2C3E50] hover:bg-[#E67E22]/10 cursor-pointer transition-colors gap-1.5 py-1 px-3">
                      <Star className="w-3 h-3 text-[#E67E22]" />
                      {c.nameShort}
                      <span className="font-bold text-emerald-600">{c.matchScore}% {t("courses.matchScore")}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Invite banner — user hasn't done Ikigai yet */
        <section className="bg-gradient-to-r from-[#1a252f] to-[#243342] border-b border-[#E67E22]/20">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("courses.ikigaiInviteTitle")}
                  </p>
                  <p className="text-xs text-white/60">
                    {t("courses.ikigaiInviteDesc")}
                  </p>
                </div>
              </div>
              <Link to="/ikigai">
                <Button size="sm" className="bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-bold shrink-0">
                  {t("courses.doIkigai")} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* What Ikigai measures */}
            <div className="mt-4 flex flex-wrap gap-3">
              {PILLAR_ICONS.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 text-xs text-white/60">
                  <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-6 border-b border-border bg-white sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t("courses.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-full md:w-44"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Domain" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("courses.filterAll")}</SelectItem>
                {DOMAINS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("courses.filterAllLevels")}</SelectItem>
                <SelectItem value="undergraduate">{t("courses.undergraduateBsc")}</SelectItem>
                <SelectItem value="postgraduate">{t("courses.postgraduateMsc")}</SelectItem>
                <SelectItem value="hnd">{t("courses.hndLevel")}</SelectItem>
                <SelectItem value="top-up">{t("courses.topUp")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-44"><MapPin className="w-4 h-4 mr-2" /><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("courses.filterAllLocations")}</SelectItem>
                {CAMPUSES.map((c) => <SelectItem key={c.slug} value={c.city}>{c.city}</SelectItem>)}
              </SelectContent>
            </Select>
            {hasIkigai && (
              <Button
                variant={sortBy === "match" ? "default" : "outline"}
                className={sortBy === "match"
                  ? "bg-[#E67E22] text-[#1a252f] hover:bg-[#c96b15] font-semibold shrink-0"
                  : "border-[#E67E22]/40 text-[#c96b15] shrink-0"}
                onClick={() => setSortBy(sortBy === "match" ? "default" : "match")}
              >
                <TrendingUp className="w-4 h-4 mr-1.5" />
                {t("courses.showPerfect")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length !== 1 ? t("courses.foundPlural") : t("courses.found")}
              {sortBy === "match" && hasIkigai && (
                <span className="ml-2 text-[#c96b15] font-medium">· {t("courses.sortedByIkigai")}</span>
              )}
            </p>
            {hasIkigai && sortBy !== "match" && (
              <button
                onClick={() => setSortBy("match")}
                className="text-xs text-[#c96b15] hover:text-[#c96b15] flex items-center gap-1 font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> {t("courses.showPerfect")}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => {
              const score = course.matchScore;
              const matchInfo = score !== null ? getMatchLabel(score, t) : null;
              const isTopMatch = score !== null && score >= 80;
              const isRecommended = ikigaiResult?.recommendedCourses?.includes(course.slug);

              return (
                <motion.div
                  key={course.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/cursuri/${course.slug}`}>
                    <Card className={`group h-full bg-white border-0 shadow-sm hover:shadow-xl transition-all overflow-hidden ${isTopMatch ? "ring-2 ring-[#E67E22]/60" : ""}`}>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.nameShort}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Domain badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-[#2C3E50] text-xs">{course.domain}</Badge>
                        </div>
                        {/* Level badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-[#E67E22] text-[#1a252f] text-xs font-semibold">
                            {course.level === "undergraduate" ? t("courses.bsc") : course.level === "postgraduate" ? t("courses.msc") : course.level === "top-up" ? t("courses.topUpShort") : t("courses.hnd")}
                          </Badge>
                        </div>

                        {/* Ikigai match score overlay */}
                        {score !== null && (
                          <div className="absolute bottom-3 left-3">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${matchInfo?.bg} ${matchInfo?.color} backdrop-blur-sm`}>
                              {isTopMatch && <Star className="w-3 h-3 fill-current" />}
                              {score}% {t("courses.matchScore")}
                            </div>
                          </div>
                        )}

                        {/* "Recommended" ribbon for top Ikigai matches */}
                        {isRecommended && (
                          <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1a252f]/80 text-white text-[10px] font-semibold backdrop-blur-sm">
                              <Sparkles className="w-2.5 h-2.5 text-[#E67E22]" /> {t("courses.recommended")}
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5">
                        <h3 className="font-serif text-lg text-[#1a252f] mb-2 group-hover:text-[#E67E22] transition-colors leading-snug">
                          {course.nameShort}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{course.campuses.length} {t("courses.campuses")}</span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>

                        {/* Ikigai match progress bar */}
                        {score !== null && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className={`font-semibold ${matchInfo?.color}`}>{matchInfo?.label}</span>
                              <span className="text-muted-foreground">{score}%</span>
                            </div>
                            <Progress
                              value={score}
                              className="h-1.5"
                              style={{
                                ["--progress-color" as string]: score >= 80
                                  ? "#3da34f"
                                  : score >= 60
                                  ? "#3d566e"
                                  : score >= 40
                                  ? "#c96b15"
                                  : "#8899aa"
                              } as React.CSSProperties}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#2C3E50]">{course.feesAnnual}/{t("home.perYear")}</span>
                          <span className="text-xs text-[#E67E22] font-medium flex items-center gap-1">
                            {t("courses.viewDetails")} <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("courses.noResults")}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setSearch(""); setDomain("all"); setLevel("all"); setLocation("all"); setSortBy("default"); }}
              >
                {t("courses.resetFilters")}
              </Button>
            </div>
          )}

          {/* Bottom CTA — invite to Ikigai if not done */}
          {!hasIkigai && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mt-12"
            >
              <div className="rounded-2xl bg-[#1a252f] p-8 text-white text-center">
                <Sparkles className="w-10 h-10 text-[#E67E22] mx-auto mb-4" />
                <h3 className="text-2xl font-serif mb-3">{t("courses.notSureTitle")}</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  {t("courses.notSureDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/ikigai">
                    <Button size="lg" className="bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-bold px-8">
                      {t("courses.doIkigai")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/eligibilitate">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                      {t("courses.checkEligibility")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <HomeFAQ />
    </Layout>
  );
}
