/**
 * WaitlistForm — Waitlist signup form for Second Degree blog post
 * Collects name, email, phone and stores via Supabase contacts table
 */
import { useState } from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WaitlistFormProps {
  source?: string;
}

export default function WaitlistForm({ source = "second-degree-waitlist" }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [gdprChecked, setGdprChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprChecked) {
      toast.error("Te rugăm să accepți politica de confidențialitate.");
      return;
    }
    setLoading(true);
    try {
      const nameParts = formData.name.trim().split(" ");
      const { error } = await supabase.from("contacts").insert({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: formData.email,
        phone: formData.phone || null,
        source,
        notes: "Waitlist: Second Degree Funded Programme",
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Ești pe lista de așteptare! Te vom contacta cu prioritate.");
    } catch {
      toast.error("Ceva nu a mers. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-xl bg-green-50 border border-green-200">
        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Ești pe lista de așteptare!</p>
          <p className="text-sm text-green-700">Te vom contacta cu informații prioritare despre cursurile cu finanțare integrală pentru a doua facultate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 sm:p-8 bg-gradient-to-br from-[#2C3E50] to-[#1a252f] border border-white/10 shadow-2xl">
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-[#E67E22]/10 border border-[#E67E22]/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E67E22]">
            Lista de Asteptare
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1 text-white font-serif">
          Inscrie-te pe Lista de Asteptare pentru Second Degree
        </h3>
        <p className="text-sm text-white/60">
          Fii primul care afla despre sesiunile de informare, locurile disponibile si ghidul complet de inscriere pentru cursurile cu finantare integrala.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nume complet"
          className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E67E22]/40 focus:outline-none transition-colors"
        />
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Adresa de email"
          className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E67E22]/40 focus:outline-none transition-colors"
        />
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Numar de telefon"
          className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E67E22]/40 focus:outline-none transition-colors"
        />
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={gdprChecked}
            onChange={(e) => setGdprChecked(e.target.checked)}
            className="mt-0.5 accent-[#E67E22]"
          />
          <span className="text-xs text-white/50">
            Sunt de acord cu prelucrarea datelor personale conform politicii de confidentialitate EduForYou.
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider bg-[#E67E22] text-white hover:bg-[#c96b15] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Inscrie-te pe Lista de Asteptare
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
