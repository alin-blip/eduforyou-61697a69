import {
  LayoutDashboard, TrendingUp, CheckSquare, BarChart3, Target,
  Users, PenTool, Eye, CalendarDays, Settings, Shield, MessageCircle,
  UserCheck, Award, Megaphone, UserSearch, Bot, Workflow, ClipboardCheck
} from 'lucide-react';

export interface CeoNavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  section?: string;
}

export const ceoNavItems: CeoNavItem[] = [
  { label: 'Dashboard', path: '/ceo', icon: LayoutDashboard, section: 'Principal' },
  { label: 'Vânzări', path: '/ceo/sales', icon: TrendingUp, section: 'Principal' },
  { label: 'Tasks', path: '/ceo/tasks', icon: CheckSquare, section: 'Principal' },
  { label: 'Analytics', path: '/ceo/analytics', icon: BarChart3, section: 'Principal' },
  { label: 'OKR-uri', path: '/ceo/okrs', icon: Target, section: 'Principal' },
  { label: 'Agenți', path: '/ceo/agents', icon: Users, section: 'Echipă' },
  { label: 'Content Studio', path: '/ceo/content', icon: PenTool, section: 'Marketing' },
  { label: 'CMO Review', path: '/ceo/cmo-review', icon: Eye, section: 'Marketing' },
  { label: 'Calendar Content', path: '/ceo/calendar', icon: CalendarDays, section: 'Marketing' },
  { label: 'CMO', path: '/ceo/cmo', icon: Megaphone, section: 'Marketing' },
  { label: 'AI Chat', path: '/ceo/ai-chat', icon: MessageCircle, section: 'AI' },
  { label: 'Agent Platform', path: '/ceo/agent-platform', icon: Bot, section: 'AI' },
  { label: 'Workflows', path: '/ceo/workflows', icon: Workflow, section: 'AI' },
  { label: 'Aprobări', path: '/ceo/approvals', icon: ClipboardCheck, section: 'AI' },
  { label: 'HR', path: '/ceo/hr', icon: UserCheck, section: 'Resurse' },
  { label: 'Candidați', path: '/ceo/candidates', icon: UserSearch, section: 'Resurse' },
  { label: 'Succes Studenți', path: '/ceo/success', icon: Award, section: 'Performanță' },
  { label: 'Calitate', path: '/ceo/quality', icon: Shield, section: 'Performanță' },
  { label: 'Setări', path: '/ceo/settings', icon: Settings, section: 'Sistem' },
];
