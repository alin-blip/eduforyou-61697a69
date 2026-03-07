import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import EligibilityPage from "./pages/Eligibility";
import IkigaiQuiz from "./pages/IkigaiQuiz";
import LocationsPage from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import WebinarPage from "./pages/Webinar";
import FinanceCalculator from "./pages/FinanceCalculator";
import StudentFinancePage from "./pages/StudentFinance";
import CareersPage from "./pages/Careers";
import ReviewsPage from "./pages/Reviews";
import EbookPage from "./pages/Ebook";
import LegalPage from "./pages/Legal";
import AgentsPage from "./pages/Agents";
import LoginPage from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cursuri" element={<CoursesPage />} />
            <Route path="/cursuri/:slug" element={<CourseDetail />} />
            <Route path="/cursuri-profesionale" element={<CoursesPage />} />
            <Route path="/eligibilitate" element={<EligibilityPage />} />
            <Route path="/ikigai" element={<IkigaiQuiz />} />
            <Route path="/locatii" element={<LocationsPage />} />
            <Route path="/locatii/:slug" element={<LocationDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/why-free" element={<AboutPage />} />
            <Route path="/team" element={<AboutPage />} />
            <Route path="/partners" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/webinar" element={<WebinarPage />} />
            <Route path="/calculator-finantare" element={<FinanceCalculator />} />
            <Route path="/student-finance" element={<StudentFinancePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/ebook" element={<EbookPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/legal/cookies" element={<LegalPage type="cookies" />} />
            <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/legal/terms" element={<LegalPage type="terms" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
