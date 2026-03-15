import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Check, CheckCircle2, Clock, Gift, Loader2, Play, Users } from "lucide-react";
import { toast } from "sonner";
import VideoTestimonialsCarousel from "@/components/VideoTestimonialsCarousel";
import { useTracking } from "@/hooks/useTracking";
import SEO from "@/components/SEO";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function WebinarPage() {
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clientEvents } = useTracking("Webinar Page", "webinar");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Store registration locally / fire tracking
      console.log("[Webinar] Registration:", formData);
      setRegistered(true);
      // Track registration
      clientEvents.webinarRegistered(formData.email);
      toast.success("Ești înregistrat! Verifică email-ul pentru link-ul de acces.");
    } catch {
      toast.error("Ceva nu a mers. Te rugăm să încerci din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO
        title="Webinar Gratuit — Cum Să Te Înscrii La Universitate în UK | EduForYou"
        description="Participă la webinarul gratuit EduForYou și află cum te poți înscrie la universitate în UK cu finanțare completă prin Student Finance England."
        canonical="/webinar/general"
      />
      <section className="bg-[#1a252f] py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <Badge className="mb-4 bg-[#E67E22]/20 text-[#f0a05c] border-[#E67E22]/30">Free Webinar</Badge>
              <h1 className="text-3xl lg:text-5xl font-serif text-white mb-5 leading-tight">
                Cum să Studiezi la <span className="text-[#E67E22]">Universitate în UK</span> cu Finanțare Completă
              </h1>
              <p className="text-white/60 mb-8 text-lg leading-relaxed">
                Află cum poți accesa până la £25,000/an prin Student Finance England și cum te putem ajuta gratuit de la A la Z.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Calendar, label: "Fiecare Marți", desc: "20:00 ora UK" },
                  { icon: Clock, label: "60 minute", desc: "Q&A inclus" },
                  { icon: Users, label: "50 locuri", desc: "Per sesiune" },
                  { icon: Gift, label: "100% Gratuit", desc: "Fără obligații" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <item.icon className="w-5 h-5 text-[#E67E22]" />
                    <div>
                      <div className="text-white text-sm font-medium">{item.label}</div>
                      <div className="text-white/40 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {["Cum funcționează Student Finance England", "Cursurile disponibile și cum să alegi", "Procesul complet de înscriere", "Programul de referral: câștigă recomandând", "Sesiune live de întrebări și răspunsuri"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  {!registered ? (
                    <>
                      <h3 className="font-serif text-xl text-[#1a252f] mb-2">Rezervă-ți Locul Gratuit</h3>
                      <p className="text-sm text-muted-foreground mb-6">Completează formularul și vei primi link-ul de acces pe email.</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nume complet</Label>
                          <Input id="name" placeholder="Ion Popescu" required className="mt-1" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="ion@email.com" required className="mt-1" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefon (WhatsApp)</Label>
                          <Input id="phone" placeholder="+44 7xxx xxx xxx" required className="mt-1" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#E67E22] hover:bg-[#c96b15] text-[#1a252f] font-bold text-base py-5">
                          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />} Rezervă Loc Gratuit
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">Datele tale sunt protejate. Nu trimitem spam.</p>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      <h3 className="font-serif text-xl text-[#1a252f] mb-2">Ești Înregistrat!</h3>
                      <p className="text-muted-foreground mb-4">Verifică email-ul pentru link-ul de acces la webinar.</p>
                      <p className="text-sm text-muted-foreground">Între timp, verifică-ți eligibilitatea:</p>
                      <Button className="mt-3 bg-[#2C3E50] hover:bg-[#3d566e] text-white" onClick={() => window.location.href = "/eligibilitate"}>
                        Check Eligibility
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== VIDEO TESTIMONIALS ===== */}
      <VideoTestimonialsCarousel
        title="Ce spun studenții noștri"
        subtitle="Peste 6,000 de studenți și-au transformat viața prin programele EduForYou. Ascultă-le poveștile."
        showStats={false}
      />
    </div>
  );
}
