import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Users, UserCheck, FileText, BookOpen, ClipboardList, Calendar, MapPin, MessageSquare, ShoppingCart, GitBranch, Mail, GraduationCap } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminContacts from './admin/AdminContacts';
import AdminApplications from './admin/AdminApplications';
import AdminBlog from './admin/AdminBlog';
import AdminQuizzes from './admin/AdminQuizzes';
import AdminStudents from './admin/AdminStudents';
import AdminPipeline from './admin/AdminPipeline';
import AdminEmailTemplates from './admin/AdminEmailTemplates';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import CampusesTab from '@/components/admin/CampusesTab';
import SmsLogsTab from '@/components/admin/SmsLogsTab';
import AbandonedCartsTab from '@/components/admin/AbandonedCartsTab';

const navItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Students CRM', url: '/admin/students', icon: GraduationCap },
  { title: 'Pipeline', url: '/admin/pipeline', icon: GitBranch },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Leads', url: '/admin/contacts', icon: UserCheck },
  { title: 'Applications', url: '/admin/applications', icon: ClipboardList },
  { title: 'Email Templates', url: '/admin/email-templates', icon: Mail },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Quizzes', url: '/admin/quizzes', icon: BookOpen },
  { title: 'Appointments', url: '/admin/appointments', icon: Calendar },
  { title: 'Campuses', url: '/admin/campuses', icon: MapPin },
  { title: 'SMS Logs', url: '/admin/sms', icon: MessageSquare },
  { title: 'Abandoned Carts', url: '/admin/carts', icon: ShoppingCart },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems} groupLabel="Admin">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="pipeline" element={<AdminPipeline />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="email-templates" element={<AdminEmailTemplates />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="appointments" element={<AppointmentsTab />} />
        <Route path="campuses" element={<CampusesTab />} />
        <Route path="sms" element={<SmsLogsTab />} />
        <Route path="carts" element={<AbandonedCartsTab />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
