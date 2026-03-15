'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Users } from 'lucide-react';

type Message = {
  id: string;
  user: string;
  text: string;
};

type TavernChannel = {
  send: (payload: {
    type: 'broadcast';
    event: 'chat_message';
    payload: { user: string; text: string };
  }) => Promise<unknown>;
};

export default function TavernChat({ currentUser }: { currentUser: { id: string; name: string } | null }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'system-1', user: 'Innkeeper', text: 'Welcome to the Local Hearth! Pull up a chair and find a party. (Messages here are ephemeral and fade into the ether when you leave).' }
  ]);
  const [input, setInput] = useState('');
  const supabase = createClient();
  const channelRef = useRef<TavernChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // 1. Subscribe to a Supabase "Broadcast" channel (no database required, strictly real-time socket events)
    const channel = supabase.channel('tavern_hearth')
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        setMessages((prev) => [
          ...prev, 
          { id: crypto.randomUUID(), user: payload.payload.user, text: payload.payload.text }
        ]);
      })
      .subscribe();
    
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const newMsg = {
      user: currentUser.name,
      text: input
    };

    // 2. Optimistic UI update (show for ourselves immediately)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...newMsg }]);
    
    // 3. Broadcast to all other connected clients
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: newMsg
    });

    setInput('');
  };

  return (
    <div className="flex-1 max-w-sm flex flex-col bg-iron-800/80 border-2 border-iron-700 p-4 h-[600px] md:sticky md:top-24">
      <h2 className="text-2xl font-serif text-gold-400 mb-4 border-b border-iron-600 pb-2 flex items-center gap-2">
        <Users className="w-5 h-5" /> Local Hearth
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-iron-600 scrollbar-track-transparent">
        {messages.map((m) => (
          <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className={m.user === 'Innkeeper' ? 'text-leather-600 font-bold mr-2 text-sm italic' : 'text-gold-500 font-bold mr-2 text-sm'}>
              {m.user}:
            </span>
            <span className={m.user === 'Innkeeper' ? 'text-leather-600/80 text-sm italic' : 'text-parchment-300 text-sm whitespace-pre-wrap break-words'}>
              {m.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto border-t border-iron-600 pt-4">
        {currentUser ? (
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your mind..."
              className="w-full bg-iron-900 border border-iron-600 px-4 py-3 text-parchment-200 focus:border-gold-500 outline-none pr-10 font-serif"
            />
            <button 
              type="submit" 
              disabled={!input.trim()} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-iron-500 hover:text-gold-400 disabled:opacity-50 transition"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <p className="text-sm text-iron-500 italic text-center font-serif py-2">
            Identify yourself at the register to speak.
          </p>
        )}
      </div>
    </div>
  );
}
