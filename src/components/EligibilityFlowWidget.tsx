/**
 * EligibilityFlowWidget — Reusable 4-step inline widget
 *
 * Step 1: Eligibility check (financing, qualification, personal info, age rules)
 *         → Lead saved immediately after step 1 (email, phone, name)
 * Step 2: Choose course (from eligible courses) OR "Nu știu — fă testul Ikigai"
 *         → Skipped if preSelectedCourseSlug is provided (course pages)
 * Step 3: Choose campus (from available campuses for the chosen course)
 * Step 4: Set password → create account → apply to course → redirect to dashboard
 *
 * Props:
 *   preSelectedCourseSlug?: string — if set, skip step 2 (course already chosen)
 */
// GTM dataLayer type declaration
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2, ArrowRight, ArrowLeft,
  ShieldCheck, GraduationCap, MapPin, User,
  Loader2, AlertCircle, Phone, Eye, EyeOff,
  BookOpen, Target, Sparkles, MessageCircle,
  KeyRound, Mail,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { COURSES, BRAND, type Course } from "@/data/courses";
import { trackLead, trackCompleteRegistration } from "@/lib/tracking";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

/* ─── Eligibility levels mapping ─── */
const ELIGIBILITY_LEVELS_MAP: Record<string, string[]> = {
  TOP_UP: ["top-up"],
  PARTIAL: ["hnd", "undergraduate"],
  FULL: ["undergraduate", "hnd", "top-up", "postgraduate"],
  MASTER: ["postgraduate"],
};

/* ─── Types ─── */
type FlowStep = "eligibility" | "choose-course" | "choose-campus" | "create-account";
type EligSubStep = "financing" | "qualification" | "personal" | "age_bacc" | "age_work";

interface EligData {
  yearsOfFinancing: "0" | "1" | "2+" | null;
  qualification: "none" | "level4" | "level5" | "level6" | "other" | null;
  age: number | null;
  residencyYears: number | null;
  immigrationStatus: "citizen" | "settled" | "presettled" | "ilr" | "refugee" | "other" | null;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hasBaccalaureate: boolean | null;
  hasWorkExperience: boolean | null;
}

interface Props {
  preSelectedCourseSlug?: string;
}

/* ─── Local eligibility calculation (replaces tRPC) ─── */
function calculateEligibilityLocal(data: {
  yearsOfFinancing: string;
  qualification: string;
  age: number;
  residencyYears: number;
  immigrationStatus: string;
  hasBaccalaureate?: boolean;
  hasWorkExperience?: boolean;
}) {
  const { yearsOfFinancing, qualification, age, residencyYears, immigrationStatus, hasBaccalaureate, hasWorkExperience } = data;

  // Basic residency check
  if (residencyYears < 3 && immigrationStatus !== "citizen" && immigrationStatus !== "settled" && immigrationStatus !== "ilr" && immigrationStatus !== "refugee") {
    return {
      eligible: false,
      eligibilityType: "NOT_ELIGIBLE",
      eligibleLevels: [],
      reason: "Minimum 3 years UK residency required",
      message: "You need at least 3 years of UK residency to qualify for Student Finance.",
      maxYears: 0,
      details: null,
      specialAttention: false,
    };
  }

  // Age check
  if (age < 18) {
    return {
      eligible: false,
      eligibilityType: "NOT_ELIGIBLE",
      eligibleLevels: [],
      reason: "Must be 18 or older",
      message: "You must be at least 18 years old to apply.",
      maxYears: 0,
      details: null,
      specialAttention: false,
    };
  }

  // Pre-settled with less than 5 years
  if (immigrationStatus === "presettled" && residencyYears < 5) {
    return {
      eligible: false,
      eligibilityType: "NOT_ELIGIBLE",
      eligibleLevels: [],
      reason: "Pre-Settled status requires 5+ years residency",
      message: "With Pre-Settled status, you need at least 5 years of UK residency.",
      maxYears: 0,
      details: "Contact us for alternative options.",
      specialAttention: true,
    };
  }

  // Other immigration status
  if (immigrationStatus === "other") {
    return {
      eligible: false,
      eligibilityType: "NOT_ELIGIBLE",
      eligibleLevels: [],
      reason: "Immigration status requires review",
      message: "Your immigration status requires individual assessment.",
      maxYears: 0,
      details: "Please contact our team for a personalised eligibility check.",
      specialAttention: true,
    };
  }

  // Age 18-21 without baccalaureate and without work experience
  if (age >= 18 && age <= 21 && hasBaccalaureate === false && hasWorkExperience === false) {
    return {
      eligible: false,
      eligibilityType: "NOT_ELIGIBLE",
      eligibleLevels: [],
      reason: "Need Level 3 qualification or 2+ years work experience",
      message: "You need either A-Levels/Level 3 or 2+ years UK work experience.",
      maxYears: 0,
      details: "Contact us for guidance on gaining the required qualifications.",
      specialAttention: true,
    };
  }

  // Determine eligibility type based on financing history and qualifications
  let eligibilityType = "FULL";
  let eligibleLevels: string[] = [];
  let maxYears = 4;

  if (yearsOfFinancing === "0") {
    // Never used financing
    if (qualification === "none" || qualification === "other") {
      eligibilityType = "FULL";
      eligibleLevels = ["undergraduate", "hnd", "top-up", "postgraduate"];
      maxYears = 4;
    } else if (qualification === "level4") {
      eligibilityType = "PARTIAL";
      eligibleLevels = ["hnd", "undergraduate"];
      maxYears = 3;
    } else if (qualification === "level5") {
      eligibilityType = "TOP_UP";
      eligibleLevels = ["top-up"];
      maxYears = 1;
    } else if (qualification === "level6") {
      eligibilityType = "MASTER";
      eligibleLevels = ["postgraduate"];
      maxYears = 1;
    }
  } else if (yearsOfFinancing === "1") {
    eligibilityType = "PARTIAL";
    eligibleLevels = ["hnd", "undergraduate"];
    maxYears = 3;
  } else if (yearsOfFinancing === "2+") {
    if (qualification === "none" || qualification === "other") {
      eligibilityType = "PARTIAL";
      eligibleLevels = ["hnd", "undergraduate"];
      maxYears = 2;
    } else if (qualification === "level4") {
      eligibilityType = "PARTIAL";
      eligibleLevels = ["hnd", "undergraduate"];
      maxYears = 2;
    } else if (qualification === "level5") {
      eligibilityType = "TOP_UP";
      eligibleLevels = ["top-up"];
      maxYears = 1;
    } else if (qualification === "level6") {
      eligibilityType = "MASTER";
      eligibleLevels = ["postgraduate"];
      maxYears = 1;
    }
  }

  return {
    eligible: true,
    eligibilityType,
    eligibleLevels,
    reason: "Eligible for Student Finance",
    message: `You are eligible for ${eligibilityType} funding.`,
    maxYears,
    details: null,
    specialAttention: false,
  };
}

/* ─── Translations ─── */
const translationsRO = {
  // Progress step labels
  stepEligibility: "Eligibilitate",
  stepCourse: "Curs",
  stepCampus: "Campus",
  stepAccount: "Cont",

  // Step 1 header
  step1Title: "Verificare Eligibilitate",
  step1Subtitle: "Află în 2 minute dacă ești eligibil pentru Student Finance",

  // Financing sub-step
  financingQuestion: "Ai mai folosit Student Finance înainte?",
  financingOpt0Title: "Nu, niciodată",
  financingOpt0Sub: "Prima dată când aplic",
  financingOpt1Title: "Da, 1 an",
  financingOpt1Sub: "Am folosit finanțare pentru 1 an",
  financingOpt2Title: "Da, 2+ ani",
  financingOpt2Sub: "Am folosit finanțare pentru 2 sau mai mulți ani",

  // Qualification sub-step
  qualificationQuestion: "Ce calificare ai obținut?",
  qualNone: "Nicio calificare universitară",
  qualLevel4: "Level 4 (HNC, CertHE)",
  qualLevel5: "Level 5 (HND, FdA, DipHE)",
  qualLevel6: "Level 6 (Bachelor's Degree)",
  qualOther: "Altceva / Nu sunt sigur",

  // Personal info sub-step
  personalTitle: "Informații personale",
  labelAge: "Vârsta *",
  placeholderAge: "ex: 28",
  labelYearsUK: "Ani în UK *",
  placeholderYearsUK: "ex: 5",
  labelImmigration: "Status imigrare *",
  immigCitizen: "Cetățean UK",
  immigSettled: "Settled Status",
  immigPresettled: "Pre-Settled",
  immigIlr: "ILR",
  immigRefugee: "Refugiat",
  immigOther: "Altul",
  labelFullName: "Nume complet *",
  placeholderFullName: "Ion Popescu",
  labelEmail: "Email *",
  placeholderEmail: "ion@email.com",
  labelPhone: "Telefon *",
  placeholderPhone: "+44 7xxx xxx xxx",
  labelDob: "Data nașterii *",

  // Age 18-21: Baccalaureate
  baccQuestion: "Ai Bacalaureat sau calificare Level 3?",
  baccSubtitle: "Deoarece ai între 18-21 ani, trebuie să verificăm nivelul calificării.",
  baccYes: "Da, am Bacalaureat / Level 3",
  baccNo: "Nu, nu am",

  // Age 18-21: Work experience
  workQuestion: "Ai 2+ ani experiență de muncă în UK (cu P60)?",
  workYes: "Da, am 2+ ani de muncă în UK",
  workNo: "Nu, nu am",

  // Navigation buttons
  btnBack: "Înapoi",
  btnContinue: "Continuă",
  btnCalculating: "Se calculează...",

  // Validation toasts
  toastSelectOption: "Selectează o opțiune.",
  toastFillAll: "Completează toate câmpurile obligatorii.",
  toastSelectCourse: "Selectează un curs sau alege testul Ikigai.",
  toastSelectCampus: "Selectează un campus.",
  toastPasswordMin: "Parola trebuie să aibă minim 8 caractere.",
  toastPasswordMatch: "Parolele nu coincid.",
  toastFillFirstName: "Te rugăm să introduci prenumele.",
  toastFillLastName: "Te rugăm să introduci numele de familie.",
  toastAccountCreated: "Cont creat cu succes! Redirecționare...",
  toastApplicationSent: "Aplicație trimisă cu succes!",
  toastEligibilityError: "Eroare la calcularea eligibilității. Încearcă din nou.",

  // Special attention / not eligible
  specialAttentionTitle: "Cazul tău necesită atenție specială",
  notEligibleTitle: "Nu ești eligibil pentru Student Finance",
  btnContactConsultant: "Contactează un consultant",
  btnTryAgain: "Încearcă din nou",
  whatsappMessage: "Bună! Am completat verificarea de eligibilitate pe EduForYou și am nevoie de asistență.",

  // Step 2: Choose course
  step2Title: "Alege Cursul",
  step2Subtitle: (count: number) => `${count} cursuri disponibile pentru tine`,
  ikigaiTitle: "Nu știu — fă testul Ikigai",
  ikigaiSubtitle: "Descoperă cursul perfect bazat pe pasiunile și abilitățile tale",

  // Step 3: Choose campus
  step3Title: "Alege Campusul",
  step3Subtitle: "Unde vrei să studiezi?",
  btnApplyNow: "Aplică acum",

  // Step 4: Create account
  step4Title: "Creează-ți Contul",
  step4Subtitle: "Ultimul pas — setează parola și contul e gata",
  summaryTitle: "Rezumat aplicație",
  summaryEmail: "Email:",
  summaryCourse: "Curs:",
  summaryCampus: "Campus:",
  labelFirstName: "Prenume *",
  placeholderFirstName: "Ex: Ion",
  labelLastName: "Nume *",
  placeholderLastName: "Ex: Popescu",
  labelPassword: "Parolă * ",
  labelPasswordHint: "(minim 8 caractere)",
  placeholderPassword: "Minim 8 caractere",
  labelConfirmPassword: "Confirmă parola *",
  placeholderConfirmPassword: "Repetă parola",
  btnCreateAccount: "Creează Contul",
  btnCreatingAccount: "Se creează contul...",
  passwordWeak: "Slabă",
  passwordMedium: "Medie",
  passwordStrong: "Puternică",
  termsText: "Prin crearea contului, accepți Termenii și Condițiile EduForYou.",

  // Error messages
  errorEmailExists: "Acest email este deja înregistrat. Încearcă să te autentifici.",
  errorGeneric: "Eroare la crearea contului.",
  errorApplication: "Eroare la trimiterea aplicației.",
};

const translationsEN: typeof translationsRO = {
  // Progress step labels
  stepEligibility: "Eligibility",
  stepCourse: "Course",
  stepCampus: "Campus",
  stepAccount: "Account",

  // Step 1 header
  step1Title: "Check Your Eligibility",
  step1Subtitle: "Find out in 2 minutes if you're eligible for Student Finance England",

  // Financing sub-step
  financingQuestion: "Have you used Student Finance before?",
  financingOpt0Title: "No, never",
  financingOpt0Sub: "First time applying",
  financingOpt1Title: "Yes, 1 year",
  financingOpt1Sub: "I used financing for 1 year",
  financingOpt2Title: "Yes, 2+ years",
  financingOpt2Sub: "I used financing for 2 or more years",

  // Qualification sub-step
  qualificationQuestion: "What qualification do you have?",
  qualNone: "No university qualification",
  qualLevel4: "Level 4 (HNC, CertHE)",
  qualLevel5: "Level 5 (HND, FdA, DipHE)",
  qualLevel6: "Level 6 (Bachelor's Degree)",
  qualOther: "Other / Not sure",

  // Personal info sub-step
  personalTitle: "Personal Information",
  labelAge: "Age *",
  placeholderAge: "e.g. 28",
  labelYearsUK: "Years in UK *",
  placeholderYearsUK: "e.g. 5",
  labelImmigration: "Immigration status *",
  immigCitizen: "UK Citizen",
  immigSettled: "Settled Status",
  immigPresettled: "Pre-Settled",
  immigIlr: "ILR",
  immigRefugee: "Refugee",
  immigOther: "Other",
  labelFullName: "Full name *",
  placeholderFullName: "John Smith",
  labelEmail: "Email *",
  placeholderEmail: "john@email.com",
  labelPhone: "Phone *",
  placeholderPhone: "+44 7xxx xxx xxx",
  labelDob: "Date of birth *",

  // Age 18-21: Baccalaureate
  baccQuestion: "Do you have A-Levels or a Level 3 qualification?",
  baccSubtitle: "As you are between 18-21 years old, we need to verify your qualification level.",
  baccYes: "Yes, I have A-Levels / Level 3",
  baccNo: "No, I don't",

  // Age 18-21: Work experience
  workQuestion: "Do you have 2+ years of work experience in the UK (with P60)?",
  workYes: "Yes, I have 2+ years of work in the UK",
  workNo: "No, I don't",

  // Navigation buttons
  btnBack: "Back",
  btnContinue: "Continue",
  btnCalculating: "Calculating...",

  // Validation toasts
  toastSelectOption: "Please select an option.",
  toastFillAll: "Please fill in all required fields.",
  toastSelectCourse: "Please select a course or choose the Ikigai test.",
  toastSelectCampus: "Please select a campus.",
  toastPasswordMin: "Password must be at least 8 characters.",
  toastPasswordMatch: "Passwords do not match.",
  toastFillFirstName: "Please enter your first name.",
  toastFillLastName: "Please enter your last name.",
  toastAccountCreated: "Account created successfully! Redirecting...",
  toastApplicationSent: "Application submitted successfully!",
  toastEligibilityError: "Error calculating eligibility. Please try again.",

  // Special attention / not eligible
  specialAttentionTitle: "Your case requires special attention",
  notEligibleTitle: "You are not eligible for Student Finance",
  btnContactConsultant: "Contact a consultant",
  btnTryAgain: "Try again",
  whatsappMessage: "Hello! I completed the eligibility check on EduForYou and need assistance.",

  // Step 2: Choose course
  step2Title: "Choose Your Course",
  step2Subtitle: (count: number) => `${count} courses available for you`,
  ikigaiTitle: "Not sure — take the Ikigai test",
  ikigaiSubtitle: "Discover the perfect course based on your passions and skills",

  // Step 3: Choose campus
  step3Title: "Choose Your Campus",
  step3Subtitle: "Where do you want to study?",
  btnApplyNow: "Apply now",

  // Step 4: Create account
  step4Title: "Create Your Account",
  step4Subtitle: "Last step — set your password and your account is ready",
  summaryTitle: "Application Summary",
  summaryEmail: "Email:",
  summaryCourse: "Course:",
  summaryCampus: "Campus:",
  labelFirstName: "First name *",
  placeholderFirstName: "e.g. John",
  labelLastName: "Last name *",
  placeholderLastName: "e.g. Smith",
  labelPassword: "Password * ",
  labelPasswordHint: "(minimum 8 characters)",
  placeholderPassword: "Minimum 8 characters",
  labelConfirmPassword: "Confirm password *",
  placeholderConfirmPassword: "Repeat password",
  btnCreateAccount: "Create Account",
  btnCreatingAccount: "Creating account...",
  passwordWeak: "Weak",
  passwordMedium: "Medium",
  passwordStrong: "Strong",
  termsText: "By creating an account, you accept EduForYou's Terms and Conditions.",

  // Error messages
  errorEmailExists: "This email is already registered. Please try logging in.",
  errorGeneric: "Error creating account.",
  errorApplication: "Error submitting application.",
};

export default function EligibilityFlowWidget({ preSelectedCourseSlug }: Props) {
  const navigate = useNavigate();
  // Detect form language from URL path: /eligibilitate → "ro", /eligibility → "en"
  const formLanguage: "ro" | "en" = window.location.pathname.startsWith("/eligibility") &&
    !window.location.pathname.startsWith("/eligibilitate") ? "en" : "ro";

  // Select translations based on language
  const t = formLanguage === "en" ? translationsEN : translationsRO;

  const { user } = useAuth();
  const isAuthenticated = !!user;

  // ─── Flow state ───
  const [flowStep, setFlowStep] = useState<FlowStep>("eligibility");
  const [eligSubStep, setEligSubStep] = useState<EligSubStep>("financing");
  const [eligData, setEligData] = useState<EligData>({
    yearsOfFinancing: null, qualification: null,
    age: null, residencyYears: null, immigrationStatus: null,
    name: "", email: "", phone: "", dateOfBirth: "",
    hasBaccalaureate: null, hasWorkExperience: null,
  });
  const [eligResult, setEligResult] = useState<any>(null);
  const [eligLoading, setEligLoading] = useState(false);
  const [specialAttention, setSpecialAttention] = useState(false);

  // ─── Course & Campus ───
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>(preSelectedCourseSlug || "");
  const [selectedCampusSlug, setSelectedCampusSlug] = useState<string>("");
  const [wantsIkigai, setWantsIkigai] = useState(false);

  // ─── Account ───
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  // Pre-fill from logged-in user
  useEffect(() => {
    if (user) {
      setEligData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.user_metadata?.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // ─── Eligible courses ───
  const eligibleCourses = useMemo(() => {
    if (!eligResult?.eligibleLevels?.length) return [];
    // RULE B: 1 year financing → only HND + Global Business Management
    if (eligResult.eligibilityType === "PARTIAL" && eligData.yearsOfFinancing === "1") {
      return COURSES.filter(c => c.level === "hnd" || c.slug === "global-business-management");
    }
    return COURSES.filter(c => eligResult.eligibleLevels.includes(c.level));
  }, [eligResult, eligData.yearsOfFinancing]);

  // ─── Hardcoded 5 campuses (always shown, independent of data.ts) ───
  const WIDGET_CAMPUSES = useMemo(() => [
    { slug: "london-stratford", name: "Londra — Stratford", city: "London", region: "East London" },
    { slug: "greenford", name: "Londra — Greenford", city: "London", region: "West London" },
    { slug: "birmingham", name: "Birmingham", city: "Birmingham", region: "West Midlands" },
    { slug: "manchester", name: "Manchester", city: "Manchester", region: "Greater Manchester" },
    { slug: "leeds", name: "Leeds", city: "Leeds", region: "West Yorkshire" },
  ], []);

  // ─── Password strength ───
  const passwordStrength = useMemo(() => {
    if (!password) return null;
    if (password.length < 8) return "weak";
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2 && password.length >= 10) return "strong";
    if (score >= 1) return "medium";
    return "weak";
  }, [password]);

  // ─── Step 1: Eligibility sub-step navigation ───
  const handleEligNext = async () => {
    if (eligSubStep === "financing") {
      if (!eligData.yearsOfFinancing) { toast.error(t.toastSelectOption); return; }
      if (eligData.yearsOfFinancing === "2+") {
        setEligSubStep("qualification");
      } else {
        setEligSubStep("personal");
      }
    } else if (eligSubStep === "qualification") {
      if (!eligData.qualification) { toast.error(t.toastSelectOption); return; }
      setEligSubStep("personal");
    } else if (eligSubStep === "personal") {
      const nameVal = isAuthenticated && user ? (user.user_metadata?.full_name || user.user_metadata?.name || eligData.name) : eligData.name;
      const emailVal = isAuthenticated && user ? (user.email || eligData.email) : eligData.email;
      if (!nameVal || !emailVal || !eligData.age || !eligData.residencyYears || !eligData.immigrationStatus || !eligData.phone || !eligData.dateOfBirth) {
        toast.error(t.toastFillAll);
        return;
      }
      // ─── Early lead capture: save contact to Supabase immediately
      try {
        const nameParts = nameVal.trim().split(" ");
        await supabase.from("contacts").upsert({
          first_name: nameParts[0] || "",
          last_name: nameParts.slice(1).join(" ") || "",
          email: emailVal,
          phone: eligData.phone || null,
          source: "eligibility-flow",
          notes: `Language: ${formLanguage}`,
        }, { onConflict: "email" });
      } catch (_e) { /* non-blocking */ }
      // RULE D: Age 18-21 → ask baccalaureate
      if (eligData.age >= 18 && eligData.age <= 21 && eligData.hasBaccalaureate === null) {
        setEligSubStep("age_bacc");
        return;
      }
      await runEligibility(nameVal, emailVal);
    } else if (eligSubStep === "age_bacc") {
      if (eligData.hasBaccalaureate === null) { toast.error(t.toastSelectOption); return; }
      if (eligData.hasBaccalaureate === true) {
        const nameVal = isAuthenticated && user ? (user.user_metadata?.full_name || user.user_metadata?.name || eligData.name) : eligData.name;
        const emailVal = isAuthenticated && user ? (user.email || eligData.email) : eligData.email;
        await runEligibility(nameVal, emailVal);
      } else {
        setEligSubStep("age_work");
      }
    } else if (eligSubStep === "age_work") {
      if (eligData.hasWorkExperience === null) { toast.error(t.toastSelectOption); return; }
      const nameVal = isAuthenticated && user ? (user.user_metadata?.full_name || user.user_metadata?.name || eligData.name) : eligData.name;
      const emailVal = isAuthenticated && user ? (user.email || eligData.email) : eligData.email;
      await runEligibility(nameVal, emailVal);
    }
  };

  const handleEligBack = () => {
    if (eligSubStep === "qualification") setEligSubStep("financing");
    else if (eligSubStep === "personal") {
      setEligSubStep(eligData.yearsOfFinancing === "2+" ? "qualification" : "financing");
    }
    else if (eligSubStep === "age_bacc") setEligSubStep("personal");
    else if (eligSubStep === "age_work") setEligSubStep("age_bacc");
  };

  // ─── Calculate eligibility + save lead ───
  const runEligibility = async (nameVal: string, emailVal: string) => {
    setEligLoading(true);
    try {
      const result = calculateEligibilityLocal({
        yearsOfFinancing: eligData.yearsOfFinancing || "0",
        qualification: eligData.qualification || "none",
        age: eligData.age || 0,
        residencyYears: eligData.residencyYears || 0,
        immigrationStatus: eligData.immigrationStatus || "other",
        hasBaccalaureate: eligData.hasBaccalaureate ?? undefined,
        hasWorkExperience: eligData.hasWorkExperience ?? undefined,
      });
      setEligResult(result);

      // Track lead
      trackLead("eligibility-flow", {
        email: emailVal,
        phone: eligData.phone,
        firstName: nameVal.split(" ")[0],
        lastName: nameVal.split(" ").slice(1).join(" ") || undefined,
      });

      // Save eligibility result to Supabase
      try {
        await supabase.from("eligibility_results").insert({
          email: emailVal,
          name: nameVal,
          phone: eligData.phone,
          date_of_birth: eligData.dateOfBirth || null,
          years_of_financing: eligData.yearsOfFinancing || "0",
          qualification: eligData.qualification || "none",
          age: eligData.age || 0,
          residency_years: eligData.residencyYears || 0,
          immigration_status: eligData.immigrationStatus || "other",
          eligible: result.eligible,
          eligibility_type: result.eligibilityType,
          eligible_levels: result.eligibleLevels || [],
          reason: result.reason,
          max_years: result.maxYears,
          details: result.details,
          special_attention: result.specialAttention,
          has_baccalaureate: eligData.hasBaccalaureate ?? null,
          has_work_experience: eligData.hasWorkExperience ?? null,
          form_language: formLanguage,
        });
      } catch (_e) { /* non-blocking */ }

      // ─── GTM dataLayer: formular_finalizat (lead salvat cu succes) ───
      // DEDUPLICATION: fire ONCE per session using sessionStorage flag
      try {
        const PIXEL_FLAG = `formular_finalizat_fired_${emailVal}`;
        if (!sessionStorage.getItem(PIXEL_FLAG)) {
          sessionStorage.setItem(PIXEL_FLAG, "1");
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "formular_finalizat",
            user_data: {
              email: emailVal,
              phone: eligData.phone || "",
              first_name: nameVal.split(" ")[0] || "",
              last_name: nameVal.split(" ").slice(1).join(" ") || "",
            },
          });
        }
      } catch (_e) {}

      // ─── GTM dataLayer: curs_interes (numai pe paginile de cursuri) ───
      if (preSelectedCourseSlug) {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "curs_interes",
            user_data: {
              email: emailVal,
              phone: eligData.phone || "",
              first_name: nameVal.split(" ")[0] || "",
              last_name: nameVal.split(" ").slice(1).join(" ") || "",
            },
          });
        } catch (_e) {}
      }

      if (result.specialAttention || !result.eligible) {
        setSpecialAttention(true);
      } else {
        // Move to next step
        if (preSelectedCourseSlug) {
          // Course page → skip course selection, go to campus
          setFlowStep("choose-campus");
        } else {
          setFlowStep("choose-course");
        }
      }
    } catch (err) {
      console.error("Eligibility error:", err);
      toast.error(t.toastEligibilityError);
    } finally {
      setEligLoading(false);
    }
  };

  // ─── Step 4: Create account ───
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error(t.toastPasswordMin); return; }
    if (password !== confirmPassword) { toast.error(t.toastPasswordMatch); return; }

    setAccountLoading(true);
    try {
      const emailVal = isAuthenticated && user ? (user.email || eligData.email) : eligData.email;
      // Use explicit firstName/lastName fields; fall back to splitting eligData.name if not filled
      const fName = firstName.trim() || eligData.name.split(" ")[0] || "";
      const lName = lastName.trim() || eligData.name.split(" ").slice(1).join(" ") || fName;
      if (!fName) { toast.error(t.toastFillFirstName); setAccountLoading(false); return; }
      if (!lName) { toast.error(t.toastFillLastName); setAccountLoading(false); return; }

      // Register account via Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailVal,
        password,
        options: {
          data: {
            first_name: fName,
            last_name: lName,
            full_name: `${fName} ${lName}`,
            phone: eligData.phone || undefined,
            role: "student",
          },
        },
      });

      if (signUpError) throw signUpError;

      // Track account registration
      trackCompleteRegistration("eligibility-flow");

      // Save quiz/application results to Supabase
      const courseSlug = selectedCourseSlug || preSelectedCourseSlug;
      if (courseSlug && selectedCampusSlug) {
        try {
          await supabase.from("quiz_results").insert({
            email: emailVal,
            name: `${fName} ${lName}`,
            phone: eligData.phone || null,
            course_slug: courseSlug,
            campus_slug: selectedCampusSlug,
            eligible: eligResult?.eligible ?? true,
            eligibility_type: eligResult?.eligibilityType || "FULL",
          });
        } catch (_applyErr) {
          // Don't block redirect if application fails (e.g., duplicate)
          console.warn("Course application save error:", _applyErr);
        }
      }

      toast.success(t.toastAccountCreated);
      setTimeout(() => {
        window.location.href = "/student/dashboard";
      }, 800);
    } catch (err: any) {
      if (err?.message?.includes("already") || err?.message?.includes("duplicate")) {
        toast.error(t.errorEmailExists);
      } else {
        toast.error(err?.message || t.errorGeneric);
      }
    } finally {
      setAccountLoading(false);
    }
  };

  // ─── Progress calculation ───
  const totalSteps = preSelectedCourseSlug ? 3 : 4;
  const currentStepNum = flowStep === "eligibility" ? 1
    : flowStep === "choose-course" ? 2
    : flowStep === "choose-campus" ? (preSelectedCourseSlug ? 2 : 3)
    : (preSelectedCourseSlug ? 3 : 4);
  const progressPercent = (currentStepNum / totalSteps) * 100;

  const stepLabels = preSelectedCourseSlug
    ? [t.stepEligibility, t.stepCampus, t.stepAccount]
    : [t.stepEligibility, t.stepCourse, t.stepCampus, t.stepAccount];

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="w-full" id="eligibility-widget">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i + 1 <= currentStepNum
                  ? "bg-[#E67E22] text-white"
                  : "bg-slate-200 text-slate-500"
              }`}>
                {i + 1 <= currentStepNum - 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                i + 1 <= currentStepNum ? "text-[#E67E22]" : "text-slate-400"
              }`}>{label}</span>
              {i < stepLabels.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 ${
                  i + 1 < currentStepNum ? "bg-[#E67E22]" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ STEP 1: ELIGIBILITY ═══ */}
        {flowStep === "eligibility" && !specialAttention && (
          <motion.div key="eligibility" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-[#1a252f] to-[#2C3E50] p-5 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t.step1Title}</h3>
                    <p className="text-xs text-white/50">{t.step1Subtitle}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {/* Financing */}
                  {eligSubStep === "financing" && (
                    <motion.div key="financing" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
                      <h4 className="text-lg font-semibold text-[#1a252f] mb-4">{t.financingQuestion}</h4>
                      <div className="space-y-3">
                        {[
                          { value: "0" as const, title: t.financingOpt0Title, subtitle: t.financingOpt0Sub },
                          { value: "1" as const, title: t.financingOpt1Title, subtitle: t.financingOpt1Sub },
                          { value: "2+" as const, title: t.financingOpt2Title, subtitle: t.financingOpt2Sub },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                              eligData.yearsOfFinancing === opt.value
                                ? "border-[#E67E22] bg-[#E67E22]/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setEligData({ ...eligData, yearsOfFinancing: opt.value })}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              eligData.yearsOfFinancing === opt.value ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                            }`}>
                              {eligData.yearsOfFinancing === opt.value && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-[#1a252f]">{opt.title}</p>
                              <p className="text-xs text-slate-500">{opt.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Qualification */}
                  {eligSubStep === "qualification" && (
                    <motion.div key="qualification" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
                      <h4 className="text-lg font-semibold text-[#1a252f] mb-4">{t.qualificationQuestion}</h4>
                      <div className="space-y-3">
                        {[
                          { value: "none" as const, label: t.qualNone },
                          { value: "level4" as const, label: t.qualLevel4 },
                          { value: "level5" as const, label: t.qualLevel5 },
                          { value: "level6" as const, label: t.qualLevel6 },
                          { value: "other" as const, label: t.qualOther },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                              eligData.qualification === opt.value
                                ? "border-[#E67E22] bg-[#E67E22]/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setEligData({ ...eligData, qualification: opt.value })}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              eligData.qualification === opt.value ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                            }`}>
                              {eligData.qualification === opt.value && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <p className="text-sm text-[#1a252f]">{opt.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Personal Info */}
                  {eligSubStep === "personal" && (
                    <motion.div key="personal" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
                      <h4 className="text-lg font-semibold text-[#1a252f] mb-4">{t.personalTitle}</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm mb-1 block">{t.labelAge}</Label>
                            <Input
                              type="number"
                              placeholder={t.placeholderAge}
                              value={eligData.age || ""}
                              onChange={(e) => setEligData({ ...eligData, age: parseInt(e.target.value) || null })}
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">{t.labelYearsUK}</Label>
                            <Input
                              type="number"
                              placeholder={t.placeholderYearsUK}
                              value={eligData.residencyYears || ""}
                              onChange={(e) => setEligData({ ...eligData, residencyYears: parseInt(e.target.value) || null })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">{t.labelImmigration}</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { value: "citizen" as const, label: t.immigCitizen },
                              { value: "settled" as const, label: t.immigSettled },
                              { value: "presettled" as const, label: t.immigPresettled },
                              { value: "ilr" as const, label: t.immigIlr },
                              { value: "refugee" as const, label: t.immigRefugee },
                              { value: "other" as const, label: t.immigOther },
                            ].map((s) => (
                              <div
                                key={s.value}
                                className={`p-2 rounded-lg border text-center cursor-pointer transition-all text-xs ${
                                  eligData.immigrationStatus === s.value
                                    ? "border-[#E67E22] bg-[#E67E22]/5 text-[#E67E22] font-medium"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                                onClick={() => setEligData({ ...eligData, immigrationStatus: s.value })}
                              >
                                {s.label}
                              </div>
                            ))}
                          </div>
                        </div>

                        {!isAuthenticated && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <Label className="text-sm mb-1 block">{t.labelFullName}</Label>
                              <Input
                                placeholder={t.placeholderFullName}
                                value={eligData.name}
                                onChange={(e) => setEligData({ ...eligData, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label className="text-sm mb-1 block">{t.labelEmail}</Label>
                              <Input
                                type="email"
                                placeholder={t.placeholderEmail}
                                value={eligData.email}
                                onChange={(e) => setEligData({ ...eligData, email: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm mb-1 block">{t.labelPhone}</Label>
                          <Input
                            type="tel"
                            placeholder={t.placeholderPhone}
                            value={eligData.phone}
                            onChange={(e) => setEligData({ ...eligData, phone: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm mb-1 block">{t.labelDob}</Label>
                          <Input
                            type="date"
                            value={eligData.dateOfBirth}
                            onChange={(e) => setEligData({ ...eligData, dateOfBirth: e.target.value })}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Age 18-21: Baccalaureate */}
                  {eligSubStep === "age_bacc" && (
                    <motion.div key="age_bacc" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
                      <h4 className="text-lg font-semibold text-[#1a252f] mb-2">{t.baccQuestion}</h4>
                      <p className="text-sm text-slate-500 mb-4">{t.baccSubtitle}</p>
                      <div className="space-y-3">
                        {[
                          { value: true, label: t.baccYes },
                          { value: false, label: t.baccNo },
                        ].map((opt) => (
                          <div
                            key={String(opt.value)}
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                              eligData.hasBaccalaureate === opt.value
                                ? "border-[#E67E22] bg-[#E67E22]/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setEligData({ ...eligData, hasBaccalaureate: opt.value })}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              eligData.hasBaccalaureate === opt.value ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                            }`}>
                              {eligData.hasBaccalaureate === opt.value && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <p className="font-medium text-[#1a252f]">{opt.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Age 18-21: Work Experience */}
                  {eligSubStep === "age_work" && (
                    <motion.div key="age_work" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
                      <h4 className="text-lg font-semibold text-[#1a252f] mb-2">{t.workQuestion}</h4>
                      <div className="space-y-3">
                        {[
                          { value: true, label: t.workYes },
                          { value: false, label: t.workNo },
                        ].map((opt) => (
                          <div
                            key={String(opt.value)}
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                              eligData.hasWorkExperience === opt.value
                                ? "border-[#E67E22] bg-[#E67E22]/5"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setEligData({ ...eligData, hasWorkExperience: opt.value })}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              eligData.hasWorkExperience === opt.value ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                            }`}>
                              {eligData.hasWorkExperience === opt.value && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <p className="font-medium text-[#1a252f]">{opt.label}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-6">
                  {eligSubStep !== "financing" && (
                    <Button variant="outline" onClick={handleEligBack} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" /> {t.btnBack}
                    </Button>
                  )}
                  <Button
                    onClick={handleEligNext}
                    disabled={eligLoading}
                    className="flex-1 bg-[#E67E22] hover:bg-[#c96b15] text-white font-bold"
                  >
                    {eligLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.btnCalculating}</>
                    ) : (
                      <>{t.btnContinue} <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ SPECIAL ATTENTION / NOT ELIGIBLE ═══ */}
        {flowStep === "eligibility" && specialAttention && (
          <motion.div key="special" initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                {eligResult?.specialAttention ? (
                  <>
                    <Phone className="w-14 h-14 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-serif text-[#1a252f] mb-2">{t.specialAttentionTitle}</h3>
                    <p className="text-slate-600 mb-6">{eligResult.details || eligResult.message}</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-serif text-[#1a252f] mb-2">{t.notEligibleTitle}</h3>
                    <p className="text-slate-600 mb-6">{eligResult?.message}</p>
                  </>
                )}
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace(/\s/g, "").replace("+", "")}?text=${encodeURIComponent(t.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button size="lg" className="w-full bg-[#E67E22] hover:bg-[#c96b15] text-white font-bold mb-3">
                    <MessageCircle className="w-5 h-5 mr-2" /> {t.btnContactConsultant}
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => { setSpecialAttention(false); setEligSubStep("financing"); setEligResult(null); }}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> {t.btnTryAgain}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ STEP 2: CHOOSE COURSE ═══ */}
        {flowStep === "choose-course" && (
          <motion.div key="choose-course" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-[#1a252f] to-[#2C3E50] p-5 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t.step2Title}</h3>
                    <p className="text-xs text-white/50">
                      {t.step2Subtitle(eligibleCourses.length)}
                    </p>
                  </div>
                </div>
                {eligResult && (
                  <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Eligibil — {eligResult.eligibilityType}
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {eligibleCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCourseSlug === course.slug
                          ? "border-[#E67E22] bg-[#E67E22]/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => { setSelectedCourseSlug(course.slug); setSelectedCampusSlug(""); }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedCourseSlug === course.slug ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                      }`}>
                        {selectedCourseSlug === course.slug && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a252f] text-sm">{course.nameShort}</p>
                        <p className="text-xs text-slate-500">{course.level === "undergraduate" ? "BSc/BA" : course.level === "postgraduate" ? "MSc" : course.level === "top-up" ? "Top-Up" : "HND"} · {course.duration} · {course.feesAnnual}/yr</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ikigai option */}
                <div className="mt-4 pt-4 border-t">
                  <div
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      wantsIkigai
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                    onClick={() => { setWantsIkigai(true); setSelectedCourseSlug(""); }}
                  >
                    <Target className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-medium text-[#1a252f] text-sm">{t.ikigaiTitle}</p>
                      <p className="text-xs text-slate-500">{t.ikigaiSubtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setFlowStep("eligibility")} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t.btnBack}
                  </Button>
                  <Button
                    onClick={() => {
                      if (wantsIkigai) {
                        // Store eligibility data in sessionStorage and redirect to Ikigai
                        sessionStorage.setItem("eligibilityResult", JSON.stringify({
                          eligible: eligResult.eligible,
                          eligibilityType: eligResult.eligibilityType,
                          eligibleCourses: eligResult.eligibleCourses,
                          eligibleLevels: eligResult.eligibleLevels,
                          specialAttention: eligResult.specialAttention,
                        }));
                        sessionStorage.setItem("eligibilityUserData", JSON.stringify({
                          name: eligData.name,
                          email: eligData.email,
                          phone: eligData.phone,
                        }));
                        navigate("/ikigai");
                        return;
                      }
                      if (!selectedCourseSlug) {
                        toast.error(t.toastSelectCourse);
                        return;
                      }
                      setFlowStep("choose-campus");
                    }}
                    disabled={!selectedCourseSlug && !wantsIkigai}
                    className="flex-1 bg-[#E67E22] hover:bg-[#c96b15] text-white font-bold"
                  >
                    {t.btnContinue} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ STEP 3: CHOOSE CAMPUS ═══ */}
        {flowStep === "choose-campus" && (
          <motion.div key="choose-campus" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-[#1a252f] to-[#2C3E50] p-5 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t.step3Title}</h3>
                    <p className="text-xs text-white/50">{t.step3Subtitle}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {WIDGET_CAMPUSES.map((campus) => (
                    <div
                      key={campus.slug}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCampusSlug === campus.slug
                          ? "border-[#E67E22] bg-[#E67E22]/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedCampusSlug(campus.slug)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedCampusSlug === campus.slug ? "border-[#E67E22] bg-[#E67E22]" : "border-slate-300"
                      }`}>
                        {selectedCampusSlug === campus.slug && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a252f] text-sm">{campus.name}</p>
                        <p className="text-xs text-slate-500">{campus.region}</p>
                      </div>
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setFlowStep(preSelectedCourseSlug ? "eligibility" : "choose-course")}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t.btnBack}
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedCampusSlug) { toast.error(t.toastSelectCampus); return; }
                      // If already authenticated, apply directly
                      if (isAuthenticated) {
                        const courseSlug = selectedCourseSlug || preSelectedCourseSlug || "";
                        // Save application to Supabase
                        supabase.from("quiz_results").insert({
                          email: user?.email || eligData.email,
                          name: eligData.name,
                          course_slug: courseSlug,
                          campus_slug: selectedCampusSlug,
                          eligible: eligResult?.eligible ?? true,
                          eligibility_type: eligResult?.eligibilityType || "FULL",
                        }).then(({ error }) => {
                          if (error) {
                            toast.error(error.message || t.errorApplication);
                          } else {
                            toast.success(t.toastApplicationSent);
                            window.location.href = "/student/dashboard";
                          }
                        });
                        return;
                      }
                      setFlowStep("create-account");
                    }}
                    disabled={!selectedCampusSlug}
                    className="flex-1 bg-[#E67E22] hover:bg-[#c96b15] text-white font-bold"
                  >
                    {isAuthenticated ? t.btnApplyNow : t.btnContinue} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ═══ STEP 4: CREATE ACCOUNT ═══ */}
        {flowStep === "create-account" && (
          <motion.div key="create-account" initial="hidden" animate="visible" exit="hidden" variants={fadeUp}>
            <Card className="border-0 shadow-lg">
              <div className="bg-gradient-to-r from-[#1a252f] to-[#2C3E50] p-5 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E67E22]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#E67E22]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t.step4Title}</h3>
                    <p className="text-xs text-white/50">{t.step4Subtitle}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                {/* Summary */}
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">{t.summaryTitle}</span>
                  </div>
                  <div className="text-xs text-green-800 space-y-1">
                    <p><strong>{t.summaryEmail}</strong> {eligData.email}</p>
                    {(selectedCourseSlug || preSelectedCourseSlug) && (
                      <p><strong>{t.summaryCourse}</strong> {COURSES.find(c => c.slug === (selectedCourseSlug || preSelectedCourseSlug))?.nameShort}</p>
                    )}
                    {selectedCampusSlug && (
                      <p><strong>{t.summaryCampus}</strong> {WIDGET_CAMPUSES.find(c => c.slug === selectedCampusSlug)?.name}</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm mb-1 block">{t.labelFirstName}</Label>
                      <Input
                        type="text"
                        placeholder={t.placeholderFirstName}
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">{t.labelLastName}</Label>
                      <Input
                        type="text"
                        placeholder={t.placeholderLastName}
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t.labelPassword}<span className="text-slate-400">{t.labelPasswordHint}</span></Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t.placeholderPassword}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordStrength && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex gap-1">
                          {["weak", "medium", "strong"].map((level, i) => (
                            <div key={level} className={`h-1 w-8 rounded-full transition-colors ${
                              passwordStrength === "weak" && i === 0 ? "bg-red-400" :
                              passwordStrength === "medium" && i <= 1 ? "bg-yellow-400" :
                              passwordStrength === "strong" ? "bg-green-400" : "bg-slate-200"
                            }`} />
                          ))}
                        </div>
                        <span className={`text-xs ${
                          passwordStrength === "weak" ? "text-red-500" :
                          passwordStrength === "medium" ? "text-yellow-600" : "text-green-600"
                        }`}>
                          {passwordStrength === "weak" ? t.passwordWeak : passwordStrength === "medium" ? t.passwordMedium : t.passwordStrong}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm mb-1 block">{t.labelConfirmPassword}</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t.placeholderConfirmPassword}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button type="button" variant="outline" onClick={() => setFlowStep("choose-campus")} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" /> {t.btnBack}
                    </Button>
                    <Button
                      type="submit"
                      disabled={accountLoading}
                      className="flex-1 bg-[#E67E22] hover:bg-[#c96b15] text-white font-bold"
                    >
                      {accountLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.btnCreatingAccount}</>
                      ) : (
                        <>{t.btnCreateAccount} <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-slate-400">
                    {t.termsText}
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
