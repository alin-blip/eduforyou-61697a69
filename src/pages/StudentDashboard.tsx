import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Compass, FileText, ClipboardList, PoundSterling, User, Mail, Trophy, Wrench, Rocket, Gift, Plane } from 'lucide-react';
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
import DefineYourPath from './wizard/DefineYourPath';
import SkillScanner from './wizard/SkillScanner';
import IkigaiBuilder from './wizard/IkigaiBuilder';
import OfferBuilder from './wizard/OfferBuilder';
import ProfileBuilder from './wizard/ProfileBuilder';
import OutreachGenerator from './wizard/OutreachGenerator';
import FreedomPlanExport from './wizard/FreedomPlanExport';

const navItems = [
  { title: 'Journey', url: '/student', icon: Compass },
  { title: 'Messages', url: '/student/messages', icon: Mail },
  { title: 'Documents', url: '/student/documents', icon: FileText },
  { title: 'Applications', url: '/student/applications', icon: ClipboardList },
  { title: 'Finance', url: '/student/finance', icon: PoundSterling },
  { title: 'Preparation', url: '/student/preparation', icon: Plane },
  { title: 'Referrals', url: '/student/referrals', icon: Gift },
  { title: 'Progress', url: '/student/progress', icon: Trophy },
  { title: 'Launchpad', url: '/student/launchpad', icon: Rocket },
  { title: 'CV Builder', url: '/student/cv', icon: Wrench },
  { title: 'Profile', url: '/student/profile', icon: User },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard" navItems={navItems} groupLabel="Student">
      <Routes>
        <Route index element={<StudentJourney />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="documents" element={<StudentDocuments />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="finance" element={<StudentFinanceTab />} />
        <Route path="preparation" element={<StudentPreparation />} />
        <Route path="referrals" element={<StudentReferral />} />
        <Route path="progress" element={<GamificationWidget />} />
        <Route path="launchpad" element={<DefineYourPath />} />
        <Route path="launchpad/skills" element={<SkillScanner />} />
        <Route path="launchpad/ikigai" element={<IkigaiBuilder />} />
        <Route path="launchpad/offer" element={<OfferBuilder />} />
        <Route path="launchpad/profile" element={<ProfileBuilder />} />
        <Route path="launchpad/outreach" element={<OutreachGenerator />} />
        <Route path="launchpad/export" element={<FreedomPlanExport />} />
        <Route path="cv" element={<CVBuilder />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
