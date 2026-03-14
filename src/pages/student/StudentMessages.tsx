import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudentMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });
    setMessages(data || []);
  };

  useEffect(() => { fetchMessages(); }, [user]);

  const markRead = async (msg: any) => {
    setSelected(msg);
    if (!msg.read) {
      await supabase.from('messages').update({ read: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Messages</h2>
        {unreadCount > 0 && <Badge>{unreadCount} unread</Badge>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
        {/* List */}
        <div className="border-r border-border divide-y divide-border md:col-span-1 overflow-auto max-h-[500px]">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No messages yet.</div>
          ) : messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => markRead(msg)}
              className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${selected?.id === msg.id ? 'bg-muted' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.read ? <MailOpen className="w-4 h-4 text-muted-foreground" /> : <Mail className="w-4 h-4 text-primary" />}
                <span className={`text-sm font-medium ${msg.read ? 'text-foreground' : 'text-primary'}`}>
                  {msg.subject || 'No subject'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="md:col-span-2 p-6">
          {selected ? (
            <div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{selected.subject || 'No subject'}</h3>
              <p className="text-xs text-muted-foreground mb-4">{new Date(selected.created_at).toLocaleString()}</p>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{selected.content}</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
