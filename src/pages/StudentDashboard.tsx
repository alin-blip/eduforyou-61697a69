/**
 * Student Dashboard - E.D.U. Pipeline Design
 * Full sidebar navigation with all student sub-pages.
 * Routes to EDU journey pages, documents, finance, preparation,
 * messages, referral, profile, freedom launchpad, skill scanner.
 * Includes E.D.U. pipeline visualization header.
 */
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Compass, FileText, ClipboardList, PoundSterling, User, Mail,
  Trophy, Wrench, Rocket, Gift, Plane, Shield, BookOpen, Brain,
  GraduationCap, FileSearch, Building2, Users, Sparkles,
} from 'lucide-react';

// ── Student sub-pages ──────────────────────────────────────
import EDUDashboard from './student/EDUDashboard';
import StudentJourney from './student/StudentJourney';
import StudentDocuments from './student/StudentDocuments';
import StudentApplications from './student/StudentApplications';
import StudentFinanceTab from './student/StudentFinanceTab';
import StudentProfile from './student/StudentProfile';
import StudentMessages from './student/StudentMessages';
import StudentPreparation from './student/StudentPreparation';
import StudentReferral from './student/StudentReferral';
import GamificationWidget from '@/components/student/GamificationWidget';
import CVBuilder from './CVBuilder';

// ── Freedom Launchpad wizard pages ─────────────────────────
import DefineYourPath from './wizard/DefineYourPath';
import SkillScanner from './wizard/SkillScanner';
import IkigaiBuilder from './wizard/IkigaiBuilder';
import OfferBuilder from './wizard/OfferBuilder';
import ProfileBuilder from './wizard/ProfileBuilder';
import OutreachGenerator from './wizard/OutreachGenerator';
import FreedomPlanExport from './wizard/FreedomPlanExport';

// ── Sidebar Navigation ────────────────────────────────────
const navItems = [
  // Core
  { title: 'Dashboard', url: '/student', icon: Compass },
  { title: 'Journey', url: '/student/journey', icon: Compass },

  // E — Evaluate
  { title: 'Eligibility', url: '/student/edu/eligibility', icon: Shield },
  { title: 'Course Match', url: '/student/edu/course-match', icon: GraduationCap },
  { title: 'E.D.U Plan', url: '/student/edu/plan', icon: Brain },
  { title: 'Test Prep', url: '/student/edu/test-prep', icon: BookOpen },

  // D — Deliver
  { title: 'Documents', url: '/student/documents', icon: FileText },
  { title: 'CV Builder', url: '/student/cv', icon: Wrench },
  { title: 'Doc Checks', url: '/student/edu/document-checks', icon: FileSearch },
  { title: 'Applications', url: '/student/applications', icon: ClipboardList },

  // U — Unlock
  { title: 'Finance', url: '/student/finance', icon: PoundSterling },
  { title: 'Bonuses', url: '/student/edu/bonuses', icon: Gift },
  { title: 'Freedom Circle', url: '/student/edu/freedom-circle', icon: Users },

  // Extras
  { title: 'Preparation', url: '/student/preparation', icon: Plane },
  { title: 'Messages', url: '/student/messages', icon: Mail },
  { title: 'Referrals', url: '/student/referrals', icon: Gift },
  { title: 'Progress', url: '/student/progress', icon: Trophy },
  { title: 'Launchpad', url: '/student/launchpad', icon: Rocket },
  { title: 'Skill Scanner', url: '/student/launchpad/skills', icon: Sparkles },
  { title: 'Profile', url: '/student/profile', icon: User },
];

// ── Component ──────────────────────────────────────────────
const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard" navItems={navItems} groupLabel="Student">
      <Routes>
        {/* Default dashboard view — full E.D.U. pipeline */}
        <Route index element={<EDUDashboard />} />
        <Route path="journey" element={<StudentJourney />} />

        {/* Messages & Documents */}
        <Route path="messages" element={<StudentMessages />} />
        <Route path="documents" element={<StudentDocuments />} />

        {/* Applications & Finance */}
        <Route path="applications" element={<StudentApplications />} />
        <Route path="finance" element={<StudentFinanceTab />} />

        {/* Preparation */}
        <Route path="preparation" element={<StudentPreparation />} />

        {/* Referral & Progress */}
        <Route path="referrals" element={<StudentReferral />} />
        <Route path="progress" element={<GamificationWidget />} />

        {/* Freedom Launchpad wizard routes */}
        <Route path="launchpad" element={<DefineYourPath />} />
        <Route path="launchpad/skills" element={<SkillScanner />} />
        <Route path="launchpad/ikigai" element={<IkigaiBuilder />} />
        <Route path="launchpad/offer" element={<OfferBuilder />} />
        <Route path="launchpad/profile" element={<ProfileBuilder />} />
        <Route path="launchpad/outreach" element={<OutreachGenerator />} />
        <Route path="launchpad/export" element={<FreedomPlanExport />} />

        {/* CV Builder */}
        <Route path="cv" element={<CVBuilder />} />

        {/* Profile */}
        <Route path="profile" element={<StudentProfile />} />

        {/* E.D.U. sub-routes (rendered inside dashboard) */}
        <Route path="edu/*" element={<StudentJourney />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
