import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Plane, Home, FileText, Globe, Shield, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const checklistItems = [
  { id: 'visa', label: 'Visa Application Submitted', icon: Globe, category: 'Documentation' },
  { id: 'cas', label: 'CAS Letter Received', icon: FileText, category: 'Documentation' },
  { id: 'insurance', label: 'Health Insurance Arranged', icon: Shield, category: 'Documentation' },
  { id: 'accommodation', label: 'Accommodation Confirmed', icon: Home, category: 'Living' },
  { id: 'bank', label: 'UK Bank Account Info Ready', icon: FileText, category: 'Living' },
  { id: 'flight', label: 'Flight Booked', icon: Plane, category: 'Travel' },
  { id: 'packing', label: 'Packing Checklist Complete', icon: BookOpen, category: 'Travel' },
  { id: 'orientation', label: 'Orientation Date Noted', icon: BookOpen, category: 'University' },
];

const StudentPreparation = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const progress = Math.round((checked.size / checklistItems.length) * 100);
  const categories = [...new Set(checklistItems.map(i => i.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pre-Departure Preparation</h1>
        <p className="text-muted-foreground mt-1">Complete these tasks before you travel to the UK.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Preparation Progress</p>
          <p className="text-sm font-bold text-primary">{progress}%</p>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {categories.map(cat => (
        <Card key={cat}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{cat}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {checklistItems.filter(i => i.category === cat).map(item => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                  onClick={() => toggle(item.id)}
                >
                  {checked.has(item.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className={checked.has(item.id) ? 'text-foreground line-through' : 'text-foreground'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentPreparation;
