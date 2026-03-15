/**
 * AgentContractModal — Full-screen obligatory contract pop-up
 * Shown to agents who haven't signed the agreement yet.
 * Must be signed before accessing any agent dashboard content.
 */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileText, Shield, Download, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const CONTRACT_VERSION = "1.0";

function ContractText() {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
      <h2 className="text-white text-center text-xl font-bold mb-1">AGENT COLLABORATION AGREEMENT</h2>
      <p className="text-center text-slate-400 text-sm mb-6">EduForYou Ltd — Version {CONTRACT_VERSION} — {today}</p>

      <p>This Agent Collaboration Agreement ("<strong>Agreement</strong>") is entered into between:</p>
      <p><strong>EduForYou Ltd</strong>, a company registered in England and Wales (the "<strong>Company</strong>"), and the individual or entity identified below (the "<strong>Agent</strong>").</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">1. SCOPE OF ENGAGEMENT</h3>
      <p>1.1. The Agent is engaged as an independent contractor to refer prospective students to EduForYou's educational programmes, including but not limited to BSc Foundation (4 years), HND Level 5 (2 years), Top-Up to BSc (1 year), and MSc programmes (1 year).</p>
      <p>1.2. The Agent shall act in accordance with all applicable laws, regulations, and ethical standards at all times.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">2. COMMISSION STRUCTURE</h3>
      <p>2.1. The Agent shall receive commission for each successfully referred student, based on the following tiered structure:</p>
      <table className="w-full text-sm border border-slate-600 my-3">
        <thead><tr className="bg-slate-800"><th className="p-2 text-left text-white border-b border-slate-600">Students Referred</th><th className="p-2 text-left text-white border-b border-slate-600">Commission per Student</th></tr></thead>
        <tbody>
          <tr className="border-b border-slate-700"><td className="p-2">1 – 5 students</td><td className="p-2 text-green-400 font-semibold">£500</td></tr>
          <tr className="border-b border-slate-700"><td className="p-2">6 – 10 students</td><td className="p-2 text-green-400 font-semibold">£550</td></tr>
          <tr className="border-b border-slate-700"><td className="p-2">11 – 20 students</td><td className="p-2 text-green-400 font-semibold">£600</td></tr>
          <tr className="border-b border-slate-700"><td className="p-2">21 – 50 students</td><td className="p-2 text-green-400 font-semibold">£650</td></tr>
          <tr className="border-b border-slate-700"><td className="p-2">51 – 100 students</td><td className="p-2 text-green-400 font-semibold">£700</td></tr>
          <tr><td className="p-2">100+ students</td><td className="p-2 text-green-400 font-semibold">Negotiable</td></tr>
        </tbody>
      </table>
      <p>2.2. Commission rates are subject to periodic review and may be adjusted by the Company with 30 days' written notice.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">3. COMMISSION PAYMENT CONDITIONS</h3>
      <p>3.1. <strong>Minimum Threshold:</strong> Commission payments shall only be unlocked after the Agent has referred a minimum of <strong>5 (five) students</strong> who have received a formal offer from a partnered university.</p>
      <p>3.2. <strong>Early Payment Option:</strong> Once the Agent has 5 or more students with confirmed offers, the Agent may request early payment of <strong>25% of total accrued commission</strong> (calculated as 50% of half the total commission).</p>
      <p>3.3. <strong>Full Payment:</strong> The remaining commission balance shall be paid upon the student's confirmed enrolment and commencement of the academic programme.</p>
      <p>3.4. All commission payments are subject to verification by the Company and may be withheld if any irregularity is detected.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">4. EXCLUSIVITY</h3>
      <p>4.1. During the term of this Agreement, the Agent shall <strong>not recruit, refer, or facilitate student enrolments</strong> for any competing educational agency, consultancy, or institution that offers similar services to those provided by EduForYou.</p>
      <p>4.2. Breach of this exclusivity clause shall constitute grounds for immediate termination and forfeiture of all unpaid commissions.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">5. USE OF MATERIALS</h3>
      <p>5.1. All marketing materials, training content, scripts, presentations, and proprietary resources provided by EduForYou remain the intellectual property of the Company.</p>
      <p>5.2. The Agent shall use such materials <strong>solely for the purpose of promoting EduForYou's services</strong> and shall not reproduce, distribute, or repurpose them for any other use.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">6. ETHICAL CONDUCT</h3>
      <p>6.1. The Agent shall <strong>NOT</strong>:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Request, accept, or receive any payment, fee, or financial consideration directly from prospective students</li>
        <li>Make false, misleading, or exaggerated claims about educational programmes, outcomes, or financial benefits</li>
        <li>Promise guaranteed admission, specific grades, or employment outcomes</li>
        <li>Misrepresent the terms of Student Finance England (SFE) or any other funding body</li>
        <li>Engage in any form of harassment, coercion, or undue pressure when communicating with prospective students</li>
      </ul>
      <p>6.2. The Agent shall always present accurate, truthful information and act in the best interest of the prospective student.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">7. CONFIDENTIALITY</h3>
      <p>7.1. The Agent acknowledges that during the course of this engagement, they may have access to confidential information including but not limited to: student personal data, business strategies, commission structures, partner university agreements, and internal processes.</p>
      <p>7.2. The Agent shall maintain strict confidentiality of all such information during and after the term of this Agreement.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">8. DATA PROTECTION (GDPR)</h3>
      <p>8.1. The Agent shall comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 at all times.</p>
      <p>8.2. Any personal data collected from prospective students shall be processed lawfully, fairly, and transparently, and shall be shared with EduForYou solely for the purpose of student enrolment.</p>
      <p>8.3. The Agent shall not store, share, or process student personal data for any purpose other than that expressly authorised by this Agreement.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">9. SANCTIONS AND TERMINATION</h3>
      <p>9.1. The Company reserves the right to terminate this Agreement immediately if the Agent:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Breaches any term of this Agreement</li>
        <li>Engages in fraudulent, unethical, or illegal conduct</li>
        <li>Brings the Company into disrepute</li>
        <li>Fails to meet the minimum performance standards set by the Company</li>
      </ul>
      <p>9.2. Upon termination, all unpaid commissions may be forfeited at the Company's discretion if the termination is due to Agent misconduct.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">10. DURATION AND TERMINATION</h3>
      <p>10.1. This Agreement shall commence on the date of digital signature and shall remain in effect for an initial period of <strong>12 (twelve) months</strong>.</p>
      <p>10.2. Either party may terminate this Agreement by providing <strong>30 days' written notice</strong>.</p>
      <p>10.3. Upon termination, the Agent shall cease all activities on behalf of EduForYou and return or destroy all Company materials in their possession.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">11. GOVERNING LAW</h3>
      <p>11.1. This Agreement shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>.</p>
      <p>11.2. Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

      <h3 className="text-white text-base font-bold mt-6 mb-2">12. INDEPENDENT CONTRACTOR STATUS</h3>
      <p>12.1. The Agent is an independent contractor and not an employee, partner, or joint venturer of EduForYou Ltd.</p>
      <p>12.2. The Agent is solely responsible for their own tax obligations, National Insurance contributions, and any other statutory payments.</p>
    </div>
  );
}

export default function AgentContractModal({ onSigned }: { onSigned: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState<"read" | "sign">("read");
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    companyName: "",
    companyNumber: "",
  });
  const [signatureText, setSignatureText] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: any) => {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
      setScrolledToBottom(true);
    }
  };

  const handleSign = async () => {
    if (!user) return;
    setSigning(true);
    try {
      const { error } = await supabase.from("agent_contracts").insert({
        user_id: user.id,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth || null,
        address_line1: formData.addressLine1 || null,
        address_line2: formData.addressLine2 || null,
        city: formData.city || null,
        postcode: formData.postcode || null,
        company_name: formData.companyName || null,
        company_number: formData.companyNumber || null,
        signature_text: signatureText,
        contract_version: CONTRACT_VERSION,
        signed_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Contract semnat cu succes!");
      onSigned();
    } catch (err: any) {
      toast.error("Eroare la semnare: " + (err?.message || "Unknown error"));
    } finally {
      setSigning(false);
    }
  };

  const canSign = agreed && signatureText.trim().length >= 2 && formData.fullName.trim().length >= 2;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a1628] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-[#0d1f3c] to-[#1a1a2e]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Agent Collaboration Agreement</h2>
              <p className="text-slate-400 text-sm">EduForYou Ltd — Version {CONTRACT_VERSION}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-300 text-sm">
              Trebuie să citești și să semnezi acest contract înainte de a accesa zona de agent.
            </p>
          </div>
        </div>

        {step === "read" ? (
          <>
            {/* Contract Body */}
            <div
              className="flex-1 overflow-y-auto p-6"
              onScroll={handleScroll}
              ref={scrollRef}
            >
              <ContractText />
            </div>
            {/* Continue Button */}
            <div className="p-4 border-t border-slate-700 bg-[#0d1f3c]">
              {!scrolledToBottom && (
                <p className="text-slate-500 text-xs text-center mb-2">
                  Derulează până la sfârșitul contractului pentru a continua
                </p>
              )}
              <Button
                onClick={() => setStep("sign")}
                disabled={!scrolledToBottom}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold disabled:opacity-40"
              >
                <FileText className="w-4 h-4 mr-2" />
                Am citit contractul — Continuă la semnare
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Signing Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <h3 className="text-white font-bold text-lg">Completează datele și semnează</h3>

              {/* Personal Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 text-xs">Nume complet *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-xs">Data nașterii</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs">Adresă UK</Label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Address Line 1"
                />
                <Input
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Address Line 2 (optional)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="City"
                  />
                  <Input
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Postcode"
                  />
                </div>
              </div>

              {/* Company (optional) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300 text-xs">Nume companie (opțional)</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-xs">Nr. companie (opțional)</Label>
                  <Input
                    value={formData.companyNumber}
                    onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })}
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                    placeholder="Company number"
                  />
                </div>
              </div>

              {/* Digital Signature */}
              <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Semnătură Digitală
                </h4>
                <div>
                  <Label className="text-slate-300 text-xs">Scrie-ți numele complet ca semnătură *</Label>
                  <Input
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="mt-1 bg-slate-800 border-slate-600 text-white text-lg font-serif italic"
                    placeholder="Semnătura ta aici..."
                  />
                </div>
                <p className="text-slate-500 text-xs">
                  Data semnării: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-1"
                />
                <label htmlFor="agree" className="text-sm text-slate-300 cursor-pointer">
                  Am citit, am înțeles și sunt de acord cu toți termenii și condițiile din acest Agent Collaboration Agreement.
                  Înțeleg că aceasta este o semnătură digitală cu valoare juridică.
                </label>
              </div>
            </div>

            {/* Sign Buttons */}
            <div className="p-4 border-t border-slate-700 bg-[#0d1f3c] flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("read")}
                className="border-slate-600 text-slate-300"
              >
                Înapoi la contract
              </Button>
              <Button
                onClick={handleSign}
                disabled={!canSign || signing}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold disabled:opacity-40"
              >
                {signing ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Se semnează...</span>
                ) : (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Semnează Contractul</span>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
