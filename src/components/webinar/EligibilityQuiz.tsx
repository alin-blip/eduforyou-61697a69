/**
 * EligibilityQuiz Component
 * Design: Brutalist Authority – dark cards, gold accents, Space Grotesk headings
 * Step 0: Qualifying question (interest type) – routes to redirect or continues
 * Steps 1-3: English level, Residence type, Previous funding
 * Step 4: Personalized eligibility result + registration form
 *
 * Routing logic:
 * - "Vreau sa ma inscriu la universitate" -> continue quiz
 * - "Vreau sa ma inscriu si sa recrutez" -> continue quiz
 * - "Vreau doar sa recrutez studenti" -> redirect to agents.eduforyou.co.uk/ro/webinar
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  Star,
  ExternalLink,
} from "lucide-react";

interface QuizAnswers {
  englishLevel: string;
  residenceType: string;
  previousFunding: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

// The 3 eligibility questions (steps 1-3 after the qualifying question)
const QUESTIONS = [
  {
    id: "englishLevel",
    title: "Care este nivelul tau de engleza?",
    subtitle: "Scris si vorbit – evalueaza-te onest.",
    options: [
      { value: "beginner", label: "Beginner", desc: "Inteleg cuvinte de baza" },
      { value: "intermediate", label: "Intermediate", desc: "Pot purta o conversatie" },
      { value: "advanced", label: "Advanced", desc: "Comunic fluent in majoritatea situatiilor" },
      { value: "fluent", label: "Fluent", desc: "Vorbesc si scriu la nivel nativ" },
    ],
  },
  {
    id: "residenceType",
    title: "Ce tip de rezidenta ai in UK?",
    subtitle: "Statusul tau determina accesul la finantare.",
    options: [
      { value: "settled", label: "Settled Status", desc: "Drept permanent de sedere" },
      { value: "pre-settled", label: "Pre-Settled Status", desc: "Drept temporar de sedere" },
      { value: "british", label: "British Citizen", desc: "Cetatean britanic" },
      { value: "other", label: "Altul", desc: "Alt tip de viza sau status" },
    ],
  },
  {
    id: "previousFunding",
    title: "Ai mai primit finantare pentru studii in UK?",
    subtitle: "Finantarea anterioara afecteaza eligibilitatea ta.",
    options: [
      { value: "no", label: "Nu", desc: "Nu am primit niciodata finantare" },
      { value: "yes", label: "Da", desc: "Am primit finantare anterior" },
      { value: "unsure", label: "Nu sunt sigur", desc: "Nu stiu exact" },
    ],
  },
];

// Interest options for qualifying question (step 0)
const INTEREST_OPTIONS = [
  {
    value: "enroll",
    label: "Vreau sa ma inscriu la universitate",
    desc: "Caut consultanta pentru inscriere si finantare",
    icon: "\uD83C\uDF93",
  },
  {
    value: "enroll_recruit",
    label: "Vreau sa ma inscriu si sa recrutez studenti",
    desc: "Ma inscriu si castig comision recomanand prieteni",
    icon: "\uD83C\uDF93\uD83D\uDCB0",
  },
  {
    value: "recruit_only",
    label: "Vreau doar sa recrutez studenti",
    desc: "Castig comision recomanand studenti fara sa ma inscriu",
    icon: "\uD83D\uDCB0",
    redirect: "/webinar/agents",
  },
];

function getEligibilityResult(answers: QuizAnswers) {
  const { englishLevel, residenceType, previousFunding } = answers;

  const hasGoodEnglish = englishLevel !== "beginner";
  const hasValidResidence =
    residenceType === "settled" ||
    residenceType === "pre-settled" ||
    residenceType === "british";
  const hasNoFunding = previousFunding === "no" || previousFunding === "unsure";

  if (hasGoodEnglish && hasValidResidence && hasNoFunding) {
    return {
      status: "eligible" as const,
      title: "Felicitari! Esti eligibil pentru inscriere.",
      message:
        "Pe baza raspunsurilor tale, indeplinesti criteriile de baza pentru a te inscrie la universitate in UK prin sistemul EduForYou. Urmatorul pas este sa rezervi locul la webinar si sa primesti consultanta gratuita 1 la 1.",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/30",
    };
  }

  if (!hasGoodEnglish && hasValidResidence) {
    return {
      status: "partial" as const,
      title: "Ai potential, dar trebuie sa lucrezi la engleza.",
      message:
        "Statusul tau de rezidenta este valid, dar nivelul de engleza trebuie imbunatatit. Testul de admitere necesita nivel mediu de engleza scris si vorbit. Inscrie-te la webinar si afla cum te pregatim noi pentru test.",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/30",
    };
  }

  if (previousFunding === "yes") {
    return {
      status: "partial" as const,
      title: "Situatia ta necesita o analiza detaliata.",
      message:
        "Daca ai primit finantare anterior, eligibilitatea depinde de cati ani ai studiat. Un an de finantare anterioara se accepta. Completeaza formularul si un consultant EduForYou va analiza situatia ta exacta.",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/30",
    };
  }

  if (!hasValidResidence) {
    return {
      status: "review" as const,
      title: "Statusul tau necesita verificare suplimentara.",
      message:
        "Finantarea studenteasca in UK necesita settled status, pre-settled status sau cetatenie britanica. Completeaza formularul si un consultant va verifica daca exista optiuni disponibile pentru situatia ta.",
      icon: XCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30",
    };
  }

  return {
    status: "partial" as const,
    title: "Hai sa analizam situatia ta.",
    message:
      "Completeaza formularul de mai jos si un consultant EduForYou te va contacta pentru o evaluare detaliata a eligibilitatii tale.",
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
  };
}

export default function EligibilityQuiz() {
  const navigate = useNavigate();
  // step -1 = qualifying question, 0-2 = eligibility questions, 3 = result + form
  const [step, setStep] = useState<number>(-1);
  const [interest, setInterest] = useState<string>("");
  const [redirecting, setRedirecting] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    englishLevel: "",
    residenceType: "",
    previousFunding: "",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const answerKeys: (keyof QuizAnswers)[] = ["englishLevel", "residenceType", "previousFunding"];

  const WEBINARJAM_URL = "https://event.webinarjam.com/llowom/register/o1z0zmby?webinar_id=13";

  const handleInterestSelect = (value: string) => {
    setInterest(value);
    // Auto-advance after brief visual feedback
    setTimeout(() => {
      const selected = INTEREST_OPTIONS.find((o) => o.value === value);
      if (!selected) return;
      if (selected.value === "recruit_only") {
        setRedirecting(true);
        setTimeout(() => {
          navigate("/webinar/agents");
        }, 600);
      } else if (selected.value === "enroll" || selected.value === "enroll_recruit") {
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = WEBINARJAM_URL;
        }, 600);
      }
    }, 400);
  };

  const handleInterestNext = () => {
    const selected = INTEREST_OPTIONS.find((o) => o.value === interest);
    if (!selected) return;

    if (selected.value === "recruit_only") {
      // Redirect to agents portal
      setRedirecting(true);
      setTimeout(() => {
        navigate(selected.redirect!);
      }, 600);
    } else if (selected.value === "enroll" || selected.value === "enroll_recruit") {
      // Redirect directly to WebinarJam registration
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = WEBINARJAM_URL;
      }, 600);
    } else {
      setStep(0);
    }
  };

  const handleSelect = (value: string) => {
    const key = answerKeys[step];
    setAnswers((prev) => ({ ...prev, [key]: value }));
    // Auto-advance to next step after brief visual feedback
    setTimeout(() => {
      if (step < 2) {
        setStep(step + 1);
      } else {
        setStep(3);
      }
    }, 400);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      setStep(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EligibilityQuiz] Form submitted:", { ...formData, answers });
    setSubmitted(true);
    // Redirect to WebinarJam registration page after a short delay
    setTimeout(() => {
      window.location.href = WEBINARJAM_URL;
    }, 2000);
  };

  const currentAnswer = step >= 0 && step < 3 ? answers[answerKeys[step]] : "";
  const result = step === 3 ? getEligibilityResult(answers) : null;

  // Total steps for progress bar: 3 eligibility questions
  // Progress bar only shown during steps 0-3
  const showProgressBar = step >= 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar – shown only after qualifying question */}
      {showProgressBar && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-[var(--font-display)] font-bold text-sm transition-all duration-300 ${
                    step >= s - 1
                      ? step === 3
                        ? "bg-gold text-black"
                        : step === s - 1
                          ? "bg-gold text-black"
                          : "bg-gold/30 text-gold"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {step > s - 1 || step === 3 ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-2 transition-all duration-500 ${
                      step > s - 1 || step === 3 ? "bg-gold/50" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-white/40 font-[var(--font-body)]">
            {step < 3 ? `Pasul ${step + 1} din 3` : "Rezultat"}
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ===== STEP -1: QUALIFYING QUESTION ===== */}
        {step === -1 && !redirecting && (
          <motion.div
            key="qualifying"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white mb-2">
              Ce te intereseaza?
            </h3>
            <p className="text-white/50 mb-8 font-[var(--font-body)]">
              Alege optiunea care descrie cel mai bine obiectivul tau.
            </p>

            <div className="space-y-3">
              {INTEREST_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInterestSelect(option.value)}
                  className={`w-full text-left p-4 sm:p-5 border transition-all duration-200 ${
                    interest === option.value
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 flex-shrink-0">{option.icon}</span>
                      <div>
                        <span
                          className={`font-[var(--font-display)] font-semibold text-base sm:text-lg block ${
                            interest === option.value ? "text-gold" : "text-white"
                          }`}
                        >
                          {option.label}
                        </span>
                        <p className="text-sm text-white/40 mt-0.5">{option.desc}</p>
                        {option.redirect && (
                          <p className="text-xs text-gold/60 mt-1 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Vei fi redirectionat la portalul agentilor
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                        interest === option.value ? "border-gold bg-gold" : "border-white/20"
                      }`}
                    >
                      {interest === option.value && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleInterestNext}
                disabled={!interest}
                className={`flex items-center gap-2 px-6 py-3 font-[var(--font-display)] font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                  interest
                    ? "bg-gold text-black hover:bg-gold-light"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {interest === "recruit_only" ? (
                  <>Acceseaza portalul <ExternalLink className="w-4 h-4" /></>
                ) : (
                  <>Inregistreaza-te la webinar <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== REDIRECT SCREEN ===== */}
        {redirecting && (
          <motion.div
            key="redirecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mx-auto mb-5">
              <ExternalLink className="w-7 h-7 text-gold animate-pulse" />
            </div>
            <h3 className="font-[var(--font-display)] text-2xl font-bold text-white mb-3">
              {interest === "recruit_only" ? "Te redirectionam la portalul agentilor" : "Te redirectionam la pagina de inregistrare"}
            </h3>
            <p className="text-white/50 font-[var(--font-body)] mb-6 max-w-md mx-auto">
              {interest === "recruit_only" ? (
                <>Vei fi dus la <strong className="text-gold">agents.eduforyou.co.uk/ro/webinar</strong> unde poti accesa programul de recrutare studenti.</>
              ) : (
                <>Te inregistram la <strong className="text-gold">webinarul live</strong>. Completeaza datele pe pagina urmatoare.</>
              )}
            </p>
            <a
              href={interest === "recruit_only" ? "/webinar/agents" : WEBINARJAM_URL}
              target={interest === "recruit_only" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-[var(--font-display)] font-bold text-sm uppercase tracking-wider hover:bg-gold-light transition-all"
            >
              {interest === "recruit_only" ? "Deschide portalul" : "Mergi la inregistrare"} <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => { setRedirecting(false); setInterest(""); }}
              className="block mx-auto mt-4 text-white/30 hover:text-white/60 text-sm font-[var(--font-body)] transition-colors"
            >
              &larr; Inapoi la quiz
            </button>
          </motion.div>
        )}

        {/* ===== STEPS 0-2: ELIGIBILITY QUESTIONS ===== */}
        {step >= 0 && step < 3 && !redirecting && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white mb-2">
              {QUESTIONS[step].title}
            </h3>
            <p className="text-white/50 mb-8 font-[var(--font-body)]">
              {QUESTIONS[step].subtitle}
            </p>

            <div className="space-y-3">
              {QUESTIONS[step].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left p-4 sm:p-5 border transition-all duration-200 ${
                    currentAnswer === option.value
                      ? "border-gold bg-gold/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-[var(--font-display)] font-semibold text-lg ${
                          currentAnswer === option.value ? "text-gold" : "text-white"
                        }`}
                      >
                        {option.label}
                      </span>
                      <p className="text-sm text-white/40 mt-0.5">{option.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                        currentAnswer === option.value
                          ? "border-gold bg-gold"
                          : "border-white/20"
                      }`}
                    >
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-[var(--font-body)]"
              >
                <ArrowLeft className="w-4 h-4" /> Inapoi
              </button>
              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className={`flex items-center gap-2 px-6 py-3 font-[var(--font-display)] font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                  currentAnswer
                    ? "bg-gold text-black hover:bg-gold-light"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {step < 2 ? "Continua" : "Vezi rezultatul"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== STEP 3: RESULT + FORM ===== */}
        {step === 3 && result && !redirecting && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Eligibility Result */}
            <div className={`p-6 border ${result.borderColor} ${result.bgColor} mb-8`}>
              <div className="flex items-start gap-4">
                <result.icon className={`w-8 h-8 ${result.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <h3 className={`font-[var(--font-display)] text-xl font-bold ${result.color} mb-2`}>
                    {result.title}
                  </h3>
                  <p className="text-white/70 font-[var(--font-body)] leading-relaxed">
                    {result.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            {!submitted ? (
              <div>
                <h3 className="font-[var(--font-display)] text-2xl font-bold text-white mb-2">
                  Rezerva-ti locul la webinar
                </h3>
                <p className="text-white/50 mb-6 font-[var(--font-body)]">
                  Completeaza datele si primesti acces la training-ul de executie + ghidul gratuit.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5 font-[var(--font-body)]">
                      Numele complet
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Andrei Popescu"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 font-[var(--font-body)] focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5 font-[var(--font-body)]">
                      Adresa de email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ex: andrei@email.com"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 font-[var(--font-body)] focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5 font-[var(--font-body)]">
                      Numar de telefon
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="ex: 07xxx xxx xxx"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 font-[var(--font-body)] focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gold text-black font-[var(--font-display)] font-bold text-lg uppercase tracking-wider hover:bg-gold-light transition-all duration-200 mt-6"
                  >
                    <Send className="w-5 h-5" /> Rezerva-mi locul acum
                  </button>
                </form>

                <p className="text-xs text-white/30 mt-4 text-center font-[var(--font-body)]">
                  Datele tale sunt in siguranta. Nu trimitem spam. Consultanta este 100% gratuita.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-[var(--font-display)] text-2xl font-bold text-white mb-2">
                  Locul tau este rezervat!
                </h3>
                <p className="text-white/60 font-[var(--font-body)] max-w-md mx-auto mb-4">
                  Esti redirectionat acum la pagina de confirmare WebinarJam. Finalizeaza inscrierea pentru a-ti garanta locul la webinar.
                </p>
                <div className="flex items-center justify-center gap-2 text-gold font-[var(--font-body)] text-sm mb-6">
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  Se redirectioneaza...
                </div>
                <a
                  href={WEBINARJAM_URL}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-[var(--font-display)] font-bold text-sm uppercase tracking-wider hover:bg-gold-light transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" /> Mergi la WebinarJam acum
                </a>
                <div className="mt-6 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-white/40 mt-2">4.8/5 pe Trustpilot &middot; 163 recenzii</p>
              </motion.div>
            )}

            {!submitted && (
              <button
                onClick={() => {
                  setStep(-1);
                  setInterest("");
                  setAnswers({ englishLevel: "", residenceType: "", previousFunding: "" });
                }}
                className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mt-6 text-sm font-[var(--font-body)]"
              >
                <ArrowLeft className="w-4 h-4" /> Reia quiz-ul
              </button>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
