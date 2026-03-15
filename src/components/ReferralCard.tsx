/**
 * ReferralCard - Shared component
 * Prominent gold-accented card that promotes the referral program.
 * Navigates to /student/referral on click.
 */
import { useState, useEffect } from "react";
import { Gift, Users, ArrowRight, PoundSterling } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface ReferralCardProps {
  /** compact = smaller inline card; full = big hero banner */
  variant?: "compact" | "full";
  className?: string;
}

export default function ReferralCard({ variant = "full", className = "" }: ReferralCardProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<{ totalEarned?: number; total?: number; enrolled?: number } | null>(null);

  // Fetch referral stats from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_id", user.id);
        if (!error && data) {
          const total = data.length;
          const enrolled = data.filter((r: any) => r.status === "enrolled").length;
          const totalEarned = data.reduce((sum: number, r: any) => sum + (r.commission || 0), 0);
          setStats({ total, enrolled, totalEarned });
        }
      } catch (_e) {
        // silently fail
      }
    };
    fetchStats();
  }, [user]);

  const earned = stats?.totalEarned ? `£${Number(stats.totalEarned).toLocaleString()}` : "£0";
  const referralCount = stats?.total || 0;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Link to="/student/referral">
          <div className="group cursor-pointer flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#1a252f] to-[#243342] border border-[#d4a843]/30 hover:border-[#d4a843]/60 transition-all hover:shadow-lg hover:shadow-[#d4a843]/10">
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-[#d4a843]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4a843]/30 transition-colors">
              <Gift className="w-5 h-5 text-[#d4a843]" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm leading-tight">
                {t("referral.cardTitle") || "Recomandă un prieten și câștigă de la £500"}
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                {t("referral.cardSubtitle") || "Per fiecare prieten înscris la universitate"}
              </p>
            </div>
            {/* Arrow */}
            <ArrowRight className="w-4 h-4 text-[#d4a843] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Link to="/student/referral">
        <div className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a252f] via-[#243342] to-[#1a252f] border-2 border-[#d4a843]/40 hover:border-[#d4a843]/70 transition-all hover:shadow-xl hover:shadow-[#d4a843]/15">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4a843]/10 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-[#d4a843]/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Left content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4a843]/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-[#d4a843]" />
                  </div>
                  <Badge className="bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/30 text-xs font-semibold">
                    {t("referral.badgeLabel") || "Earn £500+ per referral"}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                  {t("referral.heroTitle") || "Recomandă un prieten și câștigă de la £500"}
                </h3>
                <p className="text-white/60 text-sm max-w-sm">
                  {t("referral.heroDesc") || "Distribuie link-ul tău unic. Când prietenul tău se înscrie la universitate prin EduForYou, tu câștigi £500 per recomandare confirmată."}
                </p>

                {/* Stats row */}
                {(referralCount > 0 || (stats?.enrolled ?? 0) > 0) && (
                  <div className="flex gap-4 mt-3">
                    {referralCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#d4a843]" />
                        <span className="text-xs text-white/70">
                          {referralCount} {t("referral.referred") || "referred"}
                        </span>
                      </div>
                    )}
                    {(stats?.enrolled ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <PoundSterling className="w-3.5 h-3.5 text-[#d4a843]" />
                        <span className="text-xs text-white/70">
                          {earned} {t("referral.earned") || "earned"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="mt-4 bg-[#d4a843] hover:bg-[#c49535] text-[#1a252f] font-bold gap-2 group-hover:shadow-lg transition-all"
                  size="sm"
                >
                  <Users className="w-4 h-4" />
                  {t("referral.ctaButton") || "Invită prieteni"}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right: big icon */}
              <div className="hidden sm:flex w-24 h-24 rounded-2xl bg-[#d4a843]/15 items-center justify-center flex-shrink-0 group-hover:bg-[#d4a843]/25 transition-colors">
                <Gift className="w-12 h-12 text-[#d4a843]" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
