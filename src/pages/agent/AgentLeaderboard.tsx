import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Medal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AgentLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.rpc('get_agent_leaderboard'),
      supabase.from('profiles').select('full_name').eq('user_id', user.id).single(),
    ]).then(([lbRes, profRes]) => {
      setLeaderboard(lbRes.data || []);
      setProfile(profRes.data);
    });
  }, [user]);

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary" /> Agent Leaderboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Top performing agents by referral count</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Converted</TableHead>
            <TableHead>Commission</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry) => (
            <TableRow key={entry.agent_rank} className={entry.agent_display === profile?.full_name ? 'bg-primary/5' : ''}>
              <TableCell>
                <span className={`font-bold ${entry.agent_rank <= 3 ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                  {entry.agent_rank === 1 ? '🥇' : entry.agent_rank === 2 ? '🥈' : entry.agent_rank === 3 ? '🥉' : `#${entry.agent_rank}`}
                </span>
              </TableCell>
              <TableCell className="font-medium text-foreground">{entry.agent_display}</TableCell>
              <TableCell>{entry.total_referrals}</TableCell>
              <TableCell><Badge variant={Number(entry.converted) > 0 ? 'default' : 'secondary'}>{entry.converted}</Badge></TableCell>
              <TableCell className="font-semibold text-foreground">£{entry.total_commission}</TableCell>
            </TableRow>
          ))}
          {leaderboard.length === 0 && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No leaderboard data yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentLeaderboard;
