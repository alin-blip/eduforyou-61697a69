import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { coursesData, type Course } from '@/data/courses';

const emptyCourse: Omit<Course, 'id'> & { id: string } = {
  id: '',
  title: '',
  slug: '',
  description: '',
  level: 'BSc',
  duration: '',
  category: '',
  campuses: [],
  price: '',
  image: '',
  modules: [],
  careers: [],
  university: '',
  studyMode: 'Full-time',
  fees: '',
  intakes: [],
  entryRequirements: '',
  documentsRequired: '',
  interviewInfo: '',
  admissionTestInfo: '',
  personalStatementGuidelines: '',
  additionalInfo: '',
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing({ ...emptyCourse, id: String(Date.now()) });
    setOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditing({ ...course });
    setOpen(true);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Course deleted' });
  };

  const save = () => {
    if (!editing?.title || !editing?.slug) {
      toast({ title: 'Title and slug are required', variant: 'destructive' });
      return;
    }
    const exists = courses.find(c => c.id === editing.id);
    if (exists) {
      setCourses(prev => prev.map(c => (c.id === editing.id ? editing : c)));
      toast({ title: 'Course updated' });
    } else {
      setCourses(prev => [...prev, editing]);
      toast({ title: 'Course added' });
    }
    setOpen(false);
  };

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  const levelColor = (level: string) => {
    switch (level) {
      case 'BSc': return 'default';
      case 'MSc': return 'secondary';
      case 'HND': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Course Catalog
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
            </div>
            <Button size="sm" onClick={openNew} className="bg-[#D4AF37] hover:bg-[#d35400]">
              <Plus className="w-4 h-4 mr-1" /> Add Course
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Campuses</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(course => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="text-sm">{course.category}</TableCell>
                <TableCell>
                  <Badge variant={levelColor(course.level) as any}>{course.level}</Badge>
                </TableCell>
                <TableCell className="text-sm">{course.duration}</TableCell>
                <TableCell className="text-sm">{course.campuses.length} campus{course.campuses.length !== 1 ? 'es' : ''}</TableCell>
                <TableCell className="text-sm">{course.price}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(course)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCourse(course.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No courses found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id && courses.find(c => c.id === editing.id) ? 'Edit Course' : 'New Course'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div><Label>Title *</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Slug *</Label><Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="e.g. computing" /></div>
              <div><Label>Description</Label><textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Level</Label>
                  <Select value={editing.level} onValueChange={v => setEditing({ ...editing, level: v as Course['level'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BSc">BSc</SelectItem>
                      <SelectItem value="MSc">MSc</SelectItem>
                      <SelectItem value="HND">HND</SelectItem>
                      <SelectItem value="Foundation">Foundation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Duration</Label><Input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} placeholder="e.g. 4 years" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Price</Label><Input value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} /></div>
              </div>
              <div><Label>University</Label><Input value={editing.university} onChange={e => setEditing({ ...editing, university: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={save} className="bg-[#D4AF37] hover:bg-[#d35400]">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
