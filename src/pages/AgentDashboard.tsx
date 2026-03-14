import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Coins, Trophy, UserCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AgentOverview from './agent/AgentOverview';
import AgentReferrals from './agent/AgentReferrals';
import AgentCommissions from './agent/AgentCommissions';
import AgentLeaderboard from './agent/AgentLeaderboard';
import AgentProfile from './agent/AgentProfile';

const navItems = [
  { title: 'Overview', url: '/agent', icon: LayoutDashboard },
  { title: 'Referrals', url: '/agent/referrals', icon: Users },
  { title: 'Commissions', url: '/agent/commissions', icon: Coins },
  { title: 'Leaderboard', url: '/agent/leaderboard', icon: Trophy },
  { title: 'Profile', url: '/agent/profile', icon: UserCircle },
];

const AgentDashboard = () => (
  <DashboardLayout title="Agent Dashboard" navItems={navItems} groupLabel="Agent">
    <Routes>
      <Route index element={<AgentOverview />} />
      <Route path="referrals" element={<AgentReferrals />} />
      <Route path="commissions" element={<AgentCommissions />} />
      <Route path="leaderboard" element={<AgentLeaderboard />} />
      <Route path="profile" element={<AgentProfile />} />
      <Route path="*" element={<Navigate to="/agent" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AgentDashboard;
