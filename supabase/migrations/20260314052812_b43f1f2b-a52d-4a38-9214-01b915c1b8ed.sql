CREATE OR REPLACE FUNCTION public.get_agent_leaderboard()
RETURNS TABLE(agent_rank bigint, agent_display text, total_referrals bigint, converted bigint, total_commission numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as agent_rank,
    COALESCE(p.full_name, 'Agent ' || LEFT(r.agent_id::text, 4)) as agent_display,
    COUNT(*) as total_referrals,
    COUNT(*) FILTER (WHERE r.status = 'converted') as converted,
    COALESCE(SUM(r.commission_amount), 0) as total_commission
  FROM referrals r
  LEFT JOIN profiles p ON p.user_id = r.agent_id
  GROUP BY r.agent_id, p.full_name
  ORDER BY COUNT(*) DESC
  LIMIT 10
$$;