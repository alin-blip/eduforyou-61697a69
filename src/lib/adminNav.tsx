import {
  LayoutDashboard, Users, Contact, Kanban, BookOpen, BarChart3,
  GraduationCap, FileText, Building, Calendar, MessageSquare,
  ShoppingCart, Mail, Send, ClipboardCheck, UserCheck
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Contacte', path: '/admin/contacts', icon: Contact },
  { label: 'Pipeline', path: '/admin/pipeline', icon: Kanban },
  { label: 'Cursuri', path: '/admin/courses', icon: BookOpen },
  { label: 'Studenți', path: '/admin/students', icon: GraduationCap },
  { label: 'Student CRM', path: '/admin/student-crm', icon: UserCheck },
  { label: 'Funnel', path: '/admin/funnel', icon: BarChart3 },
  { label: 'Eligibilitate', path: '/admin/eligibility-stats', icon: ClipboardCheck },
  { label: 'Utilizatori', path: '/admin/users', icon: Users },
  { label: 'Contracte', path: '/admin/contracts', icon: FileText },
  { label: 'Campusuri', path: '/admin/campuses', icon: Building },
  { label: 'Programări', path: '/admin/appointments', icon: Calendar },
  { label: 'SMS', path: '/admin/sms', icon: Send },
  { label: 'Coșuri Abandonate', path: '/admin/abandoned-carts', icon: ShoppingCart },
  { label: 'Email Secvențe', path: '/admin/email-sequences', icon: Mail },
  { label: 'Email Templates', path: '/admin/email-templates', icon: MessageSquare },
  { label: 'HR', path: '/admin/hr', icon: Users },
  { label: 'Blog', path: '/admin/blog', icon: FileText },
];
