import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TrackingProvider from "@/components/TrackingProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

// Eager imports for critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";

// Lazy-loaded public pages
const CoursesPage = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const EligibilityPage = lazy(() => import("./pages/Eligibility"));
const IkigaiQuiz = lazy(() => import("./pages/IkigaiQuiz"));
const LocationsPage = lazy(() => import("./pages/Locations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const ContactPage = lazy(() => import("./pages/Contact"));
const AboutPage = lazy(() => import("./pages/About"));
const BlogPage = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const WebinarPage = lazy(() => import("./pages/Webinar"));
const FinanceCalculator = lazy(() => import("./pages/FinanceCalculator"));
const StudentFinancePage = lazy(() => import("./pages/StudentFinance"));
const CareersPage = lazy(() => import("./pages/Careers"));
const ReviewsPage = lazy(() => import("./pages/Reviews"));
const EbookPage = lazy(() => import("./pages/Ebook"));
const LegalPage = lazy(() => import("./pages/Legal"));
const AgentsPage = lazy(() => import("./pages/Agents"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));

// Phase 2: Auth pages
const AuthLogin = lazy(() => import("./pages/auth/Login"));
const AuthRegister = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AgentLogin = lazy(() => import("./pages/auth/AgentLogin"));

// Phase 3: New public pages
const WhyFree = lazy(() => import("./pages/WhyFree"));
const Team = lazy(() => import("./pages/Team"));
const Partners = lazy(() => import("./pages/Partners"));
const AgentsOffer = lazy(() => import("./pages/AgentsOffer"));
const AgentsSuccess = lazy(() => import("./pages/AgentsSuccess"));
const WebinarList = lazy(() => import("./pages/webinar/WebinarList"));
const WebinarUniversity = lazy(() => import("./pages/webinar/WebinarUniversity"));
const WebinarAgents = lazy(() => import("./pages/webinar/WebinarAgents"));
const WebinarIkigai = lazy(() => import("./pages/webinar/WebinarIkigai"));
const ProfessionalCourses = lazy(() => import("./pages/ProfessionalCourses"));
const ProfessionalCourseDetail = lazy(() => import("./pages/ProfessionalCourseDetail"));
const TestimonialsHub = lazy(() => import("./pages/TestimonialsHub"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const BookLanding = lazy(() => import("./pages/BookLanding"));
const AudiobookUpsell = lazy(() => import("./pages/AudiobookUpsell"));
const ThankYouEbook = lazy(() => import("./pages/ThankYouEbook"));
const BlackbookSales = lazy(() => import("./pages/BlackbookSales"));
const RoLanding = lazy(() => import("./pages/RoLanding"));
const LeadMagnet = lazy(() => import("./pages/LeadMagnet"));
const CareerApply = lazy(() => import("./pages/CareerApply"));

// Dashboards
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));

// Phase 4: CEO Dashboard
const CeoDashboardLayout = lazy(() => import("./components/CeoDashboardLayout"));
const CeoDashboard = lazy(() => import("./pages/ceo/CeoDashboard"));
const CeoSales = lazy(() => import("./pages/ceo/CeoSales"));
const CeoTasks = lazy(() => import("./pages/ceo/CeoTasks"));
const CeoAnalytics = lazy(() => import("./pages/ceo/CeoAnalytics"));
const CeoOkrs = lazy(() => import("./pages/ceo/CeoOkrs"));
const CeoAgents = lazy(() => import("./pages/ceo/CeoAgents"));
const CeoContentStudio = lazy(() => import("./pages/ceo/CeoContentStudio"));
const CeoCmoReview = lazy(() => import("./pages/ceo/CeoCmoReview"));
const CeoContentCalendar = lazy(() => import("./pages/ceo/CeoContentCalendar"));
const CeoSettings = lazy(() => import("./pages/ceo/CeoSettings"));
const CeoQuality = lazy(() => import("./pages/ceo/CeoQuality"));
const CeoAiChat = lazy(() => import("./pages/ceo/CeoAiChat"));
const CeoHr = lazy(() => import("./pages/ceo/CeoHr"));
const CeoSuccess = lazy(() => import("./pages/ceo/CeoSuccess"));
const CeoCmo = lazy(() => import("./pages/ceo/CeoCmo"));
const CeoCandidates = lazy(() => import("./pages/ceo/CeoCandidates"));
const CeoAgentPlatform = lazy(() => import("./pages/ceo/CeoAgentPlatform"));
const CeoWorkflows = lazy(() => import("./pages/ceo/CeoWorkflows"));
const CeoApprovals = lazy(() => import("./pages/ceo/CeoApprovals"));

// Global components (conditionally rendered)
const GlobalSocialProof = lazy(() => import("./components/GlobalSocialProof"));
const ExitIntentPopupGlobal = lazy(() => import("./components/ExitIntentPopupGlobal"));
const WebinarAnnouncementBanner = lazy(() => import("./components/WebinarAnnouncementBanner"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isDashboard = /^\/(admin|agent|student|ceo)/.test(location.pathname);
  const isWebinar = location.pathname.startsWith('/webinar');

  return (
    <>
      <TrackingProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Index />} />
            <Route path="/cursuri" element={<CoursesPage />} />
            <Route path="/cursuri/:slug" element={<CourseDetail />} />
            <Route path="/cursuri-profesionale" element={<ProfessionalCourses />} />
            <Route path="/cursuri-profesionale/:slug" element={<ProfessionalCourseDetail />} />
            <Route path="/eligibilitate" element={<EligibilityPage />} />
            <Route path="/ikigai" element={<IkigaiQuiz />} />
            <Route path="/locatii" element={<LocationsPage />} />
            <Route path="/locatii/:slug" element={<LocationDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/why-free" element={<WhyFree />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/about/partners" element={<Partners />} />
            <Route path="/why-free" element={<WhyFree />} />
            <Route path="/team" element={<Team />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/webinar" element={<WebinarList />} />
            <Route path="/webinar/university" element={<WebinarUniversity />} />
            <Route path="/webinar/agents" element={<WebinarAgents />} />
            <Route path="/webinar/ikigai" element={<WebinarIkigai />} />
            <Route path="/calculator-finantare" element={<FinanceCalculator />} />
            <Route path="/student-finance" element={<StudentFinancePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug/apply" element={<CareerApply />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/testimoniale" element={<TestimonialsHub />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/ebook" element={<EbookPage />} />
            <Route path="/carte" element={<BookLanding />} />
            <Route path="/book" element={<BookLanding />} />
            <Route path="/upsell-audiobook" element={<AudiobookUpsell />} />
            <Route path="/thank-you-ebook" element={<ThankYouEbook />} />
            <Route path="/sfe-blackbook" element={<BlackbookSales />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/offer" element={<AgentsOffer />} />
            <Route path="/agents/success" element={<AgentsSuccess />} />
            <Route path="/ro" element={<RoLanding />} />
            <Route path="/ghid-gratuit" element={<LeadMagnet />} />
            <Route path="/ghid-finantare" element={<LeadMagnet />} />
            <Route path="/ghid-transformare" element={<LeadMagnet />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/cv-builder" element={<CVBuilder />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/auth/register" element={<AuthRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/agent/login" element={<AgentLogin />} />

            {/* Admin */}
            <Route path="/admin/blog/new" element={<ProtectedRoute requiredRole="admin"><BlogEditor /></ProtectedRoute>} />
            <Route path="/admin/blog/:id" element={<ProtectedRoute requiredRole="admin"><BlogEditor /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* Agent */}
            <Route path="/agent/*" element={<ProtectedRoute requiredRole="agent"><AgentDashboard /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student/*" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />

            {/* CEO Dashboard */}
            <Route path="/ceo" element={<ProtectedRoute requiredRole="admin"><CeoDashboardLayout /></ProtectedRoute>}>
              <Route index element={<CeoDashboard />} />
              <Route path="sales" element={<CeoSales />} />
              <Route path="tasks" element={<CeoTasks />} />
              <Route path="analytics" element={<CeoAnalytics />} />
              <Route path="okrs" element={<CeoOkrs />} />
              <Route path="agents" element={<CeoAgents />} />
              <Route path="content" element={<CeoContentStudio />} />
              <Route path="cmo-review" element={<CeoCmoReview />} />
              <Route path="calendar" element={<CeoContentCalendar />} />
              <Route path="settings" element={<CeoSettings />} />
              <Route path="quality" element={<CeoQuality />} />
              <Route path="ai-chat" element={<CeoAiChat />} />
              <Route path="hr" element={<CeoHr />} />
              <Route path="success" element={<CeoSuccess />} />
              <Route path="cmo" element={<CeoCmo />} />
              <Route path="candidates" element={<CeoCandidates />} />
              <Route path="agent-platform" element={<CeoAgentPlatform />} />
              <Route path="workflows" element={<CeoWorkflows />} />
              <Route path="approvals" element={<CeoApprovals />} />
            </Route>

            {/* Legal */}
            <Route path="/legal/cookies" element={<LegalPage type="cookies" />} />
            <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/legal/terms" element={<LegalPage type="terms" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TrackingProvider>

      {/* Global overlays for public pages only */}
      {!isDashboard && (
        <Suspense fallback={null}>
          <GlobalSocialProof />
          <ExitIntentPopupGlobal />
          {!isWebinar && <WebinarAnnouncementBanner />}
        </Suspense>
      )}
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
