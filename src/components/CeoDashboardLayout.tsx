import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Brain, LayoutDashboard, TrendingUp, CheckSquare, BarChart3, Target,
  Users, FileText, Eye, CalendarDays, Settings, ShieldCheck, MessageSquare,
  UserCheck, Award, Briefcase, UserSearch, Cpu, GitBranch, ClipboardCheck,
  ArrowLeft, Globe, Menu, X, ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/ceo', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/ceo/sales', label: 'Sales', icon: TrendingUp },
  { path: '/ceo/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/ceo/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/ceo/okrs', label: 'OKRs', icon: Target },
  { path: '/ceo/agents', label: 'Agents', icon: Users },
  { path: '/ceo/content-studio', label: 'Content Studio', icon: FileText },
  { path: '/ceo/cmo-review', label: 'CMO Review', icon: Eye },
  { path: '/ceo/content-calendar', label: 'Content Calendar', icon: CalendarDays },
  { path: '/ceo/settings', label: 'Settings', icon: Settings },
  { path: '/ceo/quality', label: 'Quality', icon: ShieldCheck },
  { path: '/ceo/ai-chat', label: 'AI Chat', icon: MessageSquare },
  { path: '/ceo/hr', label: 'HR', icon: Briefcase },
  { path: '/ceo/success', label: 'Success', icon: Award },
  { path: '/ceo/cmo', label: 'CMO', icon: UserCheck },
  { path: '/ceo/candidates', label: 'Candidates', icon: UserSearch },
  { path: '/ceo/agent-platform', label: 'Agent Platform', icon: Cpu },
  { path: '/ceo/workflows', label: 'Workflows', icon: GitBranch },
  { path: '/ceo/approvals', label: 'Approvals', icon: ClipboardCheck },
];

const CeoDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#d4a843] flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#0a1628]" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">EduForYou</h1>
          <p className="text-[#d4a843] text-xs font-medium">CEO Command Center</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[#d4a843]/15 text-[#d4a843] border-l-2 border-[#d4a843]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-[#d4a843]' : ''}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inapoi la Admin</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <Globe className="w-4 h-4" />
          <span>Inapoi la Site</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8f7f4]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[264px] flex-shrink-0 bg-[#0a1628] flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-[264px] bg-[#0a1628] z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-[264px] min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#0a1628] px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-white hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#d4a843]" />
            <span className="text-white font-semibold text-sm">CEO Dashboard</span>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CeoDashboardLayout;
