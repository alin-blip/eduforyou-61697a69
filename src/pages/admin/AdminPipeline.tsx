import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'converted'] as const;

const stageLabels: Record<string, string> = {
  new: '🟢 New',
  contacted: '🟡 Contacted',
  qualified: '🟠 Qualified',
  converted: '🔵 Converted',
};

const stageColors: Record<string, string> = {
  new: 'bg-green-500/10 border-green-500/30',
  contacted: 'bg-yellow-500/10 border-yellow-500/30',
  qualified: 'bg-[#D4AF37]/10 border-[#D4AF37]/30',
  converted: 'bg-blue-500/10 border-blue-500/30',
};

function DraggableContact({ contact }: { contact: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: contact.id,
    data: { contact },
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ContactCard contact={contact} />
    </div>
  );
}

function ContactCard({ contact }: { contact: any }) {
  return (
    <Card className="shadow-sm cursor-grab active:cursor-grabbing">
      <CardContent className="p-3 space-y-1">
        <p className="font-medium text-sm text-foreground">{contact.full_name}</p>
        <p className="text-xs text-muted-foreground">{contact.email}</p>
        {contact.course_interest && (
          <p className="text-xs text-muted-foreground">📚 {contact.course_interest}</p>
        )}
      </CardContent>
    </Card>
  );
}

function DroppableColumn({ stage, contacts }: { stage: string; contacts: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="space-y-3">
      <div className={`rounded-lg border p-3 ${stageColors[stage]}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{stageLabels[stage]}</h3>
          <Badge variant="outline" className="text-xs">{contacts.length}</Badge>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[200px] rounded-lg p-2 transition-colors ${isOver ? 'bg-accent/50 ring-2 ring-primary/30' : ''}`}
      >
        {contacts.map(contact => (
          <DraggableContact key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
}

const AdminPipeline = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState<any | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      setContacts(data || []);
      setLoading(false);
    })();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveContact(event.active.data.current?.contact ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveContact(null);
    const { active, over } = event;
    if (!over) return;

    const contactId = active.id as string;
    const newStatus = over.id as string;
    const contact = contacts.find(c => c.id === contactId);
    if (!contact || (contact.status || 'new') === newStatus) return;

    // Optimistic update
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus } : c));

    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', contactId);
    if (error) {
      // Revert
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: contact.status } : c));
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Sales Pipeline</h1>
        <Badge variant="secondary">{contacts.length} contacts</Badge>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STAGES.map(stage => (
            <DroppableColumn
              key={stage}
              stage={stage}
              contacts={contacts.filter(c => (c.status || 'new') === stage)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeContact ? <ContactCard contact={activeContact} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AdminPipeline;
