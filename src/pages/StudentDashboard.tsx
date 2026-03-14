import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Compass, FileText, ClipboardList, PoundSterling, User, Mail, Trophy, Wrench } from 'lucide-react';
import StudentJourney from './student/StudentJourney';
import StudentDocuments from './student/StudentDocuments';
import StudentApplications from './student/StudentApplications';
import StudentFinanceTab from './student/StudentFinanceTab';
import StudentProfile from './student/StudentProfile';
import StudentMessages from './student/StudentMessages';
import GamificationWidget from '@/components/student/GamificationWidget';

const navItems = [
  { title: 'Journey', url: '/student', icon: Compass },
  { title: 'Messages', url: '/student/messages', icon: Mail },
  { title: 'Documents', url: '/student/documents', icon: FileText },
  { title: 'Applications', url: '/student/applications', icon: ClipboardList },
  { title: 'Finance', url: '/student/finance', icon: PoundSterling },
  { title: 'Progress', url: '/student/progress', icon: Trophy },
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
        <Route path="progress" element={<GamificationWidget />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
