import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Users, UserCheck, FileText, BookOpen, ClipboardList, Calendar, MapPin, MessageSquare, ShoppingCart, GitBranch, Mail, GraduationCap, TrendingUp, BarChart3, Briefcase, FileSignature, Building2, MailPlus, UserCog } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminContacts from './admin/AdminContacts';
import AdminApplications from './admin/AdminApplications';
import AdminBlog from './admin/AdminBlog';
import AdminQuizzes from './admin/AdminQuizzes';
import AdminStudents from './admin/AdminStudents';
import AdminPipeline from './admin/AdminPipeline';
import AdminEmailTemplates from './admin/AdminEmailTemplates';
import AdminCourses from './admin/AdminCourses';
import AdminFunnel from './admin/AdminFunnel';
import AdminEligibilityStats from './admin/AdminEligibilityStats';
import AdminHr from './admin/AdminHr';
import AdminContracts from './admin/AdminContracts';
import AdminCampuses from './admin/AdminCampuses';
import AdminAppointments from './admin/AdminAppointments';
import AdminSMS from './admin/AdminSMS';
import AdminAbandonedCarts from './admin/AdminAbandonedCarts';
import AdminEmailSequences from './admin/AdminEmailSequences';
import AdminStudentCRM from './admin/AdminStudentCRM';

const navItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Student CRM', url: '/admin/student-crm', icon: UserCog },
  { title: 'Students', url: '/admin/students', icon: GraduationCap },
  { title: 'Pipeline', url: '/admin/pipeline', icon: GitBranch },
  { title: 'Funnel', url: '/admin/funnel', icon: TrendingUp },
  { title: 'Eligibility Stats', url: '/admin/eligibility', icon: BarChart3 },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Leads', url: '/admin/contacts', icon: UserCheck },
  { title: 'Applications', url: '/admin/applications', icon: ClipboardList },
  { title: 'Courses', url: '/admin/courses', icon: BookOpen },
  { title: 'Email Templates', url: '/admin/email-templates', icon: Mail },
  { title: 'Email Sequences', url: '/admin/email-sequences', icon: MailPlus },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Quizzes', url: '/admin/quizzes', icon: BookOpen },
  { title: 'HR', url: '/admin/hr', icon: Briefcase },
  { title: 'Contracts', url: '/admin/contracts', icon: FileSignature },
  { title: 'Appointments', url: '/admin/appointments', icon: Calendar },
  { title: 'Campuses', url: '/admin/campuses', icon: Building2 },
  { title: 'SMS', url: '/admin/sms', icon: MessageSquare },
  { title: 'Abandoned Carts', url: '/admin/carts', icon: ShoppingCart },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems} groupLabel="Admin">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="student-crm" element={<AdminStudentCRM />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="pipeline" element={<AdminPipeline />} />
        <Route path="funnel" element={<AdminFunnel />} />
        <Route path="eligibility" element={<AdminEligibilityStats />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="email-templates" element={<AdminEmailTemplates />} />
        <Route path="email-sequences" element={<AdminEmailSequences />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="hr" element={<AdminHr />} />
        <Route path="contracts" element={<AdminContracts />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="campuses" element={<AdminCampuses />} />
        <Route path="sms" element={<AdminSMS />} />
        <Route path="carts" element={<AdminAbandonedCarts />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
