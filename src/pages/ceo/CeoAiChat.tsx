import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Loader2, Send, Bot, User, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: string | null;
  content: string | null;
  created_at: string;
}

const CeoAiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('ceo_agent_messages').select('*').order('created_at', { ascending: true }).limit(100);
    setMessages((data as Message[]) || []);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    const userMessage = input.trim();
    setInput('');

    // Save user message
    const { data: savedMsg } = await supabase.from('ceo_agent_messages').insert({
      role: 'user',
      content: userMessage,
      source: 'ceo_chat',
    }).select().single();

    if (savedMsg) {
      setMessages((prev) => [...prev, savedMsg as Message]);
    }

    try {
      const res = await supabase.functions.invoke('ceo-ai-engine', {
        body: { type: 'chat', message: userMessage },
      });

      if (res.error) throw res.error;

      const aiContent = res.data?.response || res.data?.message || res.data?.summary || 'I processed your request.';

      // Save AI response
      const { data: aiMsg } = await supabase.from('ceo_agent_messages').insert({
        role: 'assistant',
        content: aiContent,
        source: 'ceo_chat',
      }).select().single();

      if (aiMsg) {
        setMessages((prev) => [...prev, aiMsg as Message]);
      }
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message || 'Failed to get response', variant: 'destructive' });
      // Save error message
      const { data: errMsg } = await supabase.from('ceo_agent_messages').insert({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        source: 'ceo_chat',
      }).select().single();
      if (errMsg) setMessages((prev) => [...prev, errMsg as Message]);
    }
    setSending(false);
  };

  const clearChat = async () => {
    await (supabase.from('ceo_agent_messages') as any).delete().eq('source', 'ceo_chat');
    setMessages([]);
    toast({ title: 'Chat cleared' });
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#d4a843]" /></div>;
  }

  return (
    <div className="space-y-4 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-[#d4a843]" /> AI Chat Assistant
        </h1>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <Trash2 className="w-4 h-4 mr-1" /> Clear
        </Button>
      </div>

      {/* Messages */}
      <Card className="bg-white border-0 shadow-sm flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot className="w-16 h-16 mb-3" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Ask me about business metrics, strategies, or get reports.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#0a1628]" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#0a1628] text-white'
                  : 'bg-gray-100 text-[#0a1628]'
              }`}>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content || '') }}
                />
                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#0a1628]" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#d4a843]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about revenue, agents, OKRs, or anything..."
              className="flex-1"
              disabled={sending}
            />
            <Button onClick={sendMessage} disabled={sending || !input.trim()} className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628]">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CeoAiChat;
