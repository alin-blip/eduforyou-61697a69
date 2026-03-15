import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CeoContentCalendar = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchCalendar(); }, [currentWeek, currentYear]);

  const fetchCalendar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ai_content_calendar')
      .select('*')
      .eq('week', currentWeek)
      .eq('year', currentYear);
    setEntries(data || []);
    setLoading(false);
  };

  const navigateWeek = (delta: number) => {
    let newWeek = currentWeek + delta;
    let newYear = currentYear;
    if (newWeek < 1) { newWeek = 52; newYear--; }
    if (newWeek > 52) { newWeek = 1; newYear++; }
    setCurrentWeek(newWeek);
    setCurrentYear(newYear);
  };

  // Parse plan data into daily items
  const getPlanForDay = (dayIndex: number) => {
    const plans: any[] = [];
    entries.forEach((entry) => {
      if (entry.plan && typeof entry.plan === 'object') {
        const plan = entry.plan as any;
        const dayKey = DAYS[dayIndex].toLowerCase();
        if (Array.isArray(plan)) {
          const dayPlan = plan[dayIndex];
          if (dayPlan) plans.push({ ...dayPlan, calendarId: entry.id, status: entry.status });
        } else if (plan[dayKey]) {
          const items = Array.isArray(plan[dayKey]) ? plan[dayKey] : [plan[dayKey]];
          items.forEach((item: any) => plans.push({ ...item, calendarId: entry.id, status: entry.status }));
        }
      }
    });
    return plans;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <Calendar className="w-7 h-7 text-[#d4a843]" /> Content Calendar
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-[#0a1628] min-w-[120px] text-center">
            Week {currentWeek}, {currentYear}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((day, index) => {
          const dayItems = getPlanForDay(index);
          return (
            <Card key={day} className="bg-white border-0 shadow-sm min-h-[200px]">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm font-semibold text-[#0a1628]">{day}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                {dayItems.length > 0 ? (
                  dayItems.map((item, i) => (
                    <div key={i} className="p-2 rounded bg-[#d4a843]/10 border border-[#d4a843]/20">
                      <p className="text-xs font-medium text-[#0a1628] line-clamp-2">
                        {item.title || item.topic || item.type || 'Content'}
                      </p>
                      {item.type && (
                        <Badge variant="outline" className="mt-1 text-[10px]">{item.type}</Badge>
                      )}
                      <Badge variant="secondary" className="mt-1 ml-1 text-[10px]">{item.status || 'planned'}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-300 text-center py-4">No content</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {entries.length === 0 && (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No content calendar data for this week</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CeoContentCalendar;
