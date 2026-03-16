'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Signal, Users } from 'lucide-react';
import { useLiveAnnouncement } from '@/lib/client/useLiveAnnouncement';

type Message = {
  id: string;
  user: string;
  text: string;
  clientId?: string;
};

type TavernChannel = {
  send: (payload: {
    type: 'broadcast';
    event: 'chat_message';
    payload: { user: string; text: string; clientId: string };
  }) => Promise<unknown>;
};

export default function TavernChat({ currentUser }: { currentUser: { id: string; name: string } | null }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'system-1', user: 'Innkeeper', text: 'Welcome to the Local Hearth! Pull up a chair and find a party. (Messages here are ephemeral and fade into the ether when you leave).' }
  ]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const supabase = createClient();
  const channelRef = useRef<TavernChannel | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const seenMessageIdsRef = useRef<Set<string>>(new Set(["system-1"]));
  const liveAnnouncement = useLiveAnnouncement(
    connected ? "Local Hearth connected." : "Local Hearth reconnecting.",
  );

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    const shouldStickToBottom = distanceFromBottom < 80;

    if (shouldStickToBottom) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // 1. Subscribe to a Supabase "Broadcast" channel (no database required, strictly real-time socket events)
    const channel = supabase.channel('tavern_hearth')
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        const clientId = payload.payload.clientId as string;
        if (seenMessageIdsRef.current.has(clientId)) {
          return;
        }

        seenMessageIdsRef.current.add(clientId);
        setMessages((prev) => [
          ...prev, 
          { id: clientId, user: payload.payload.user, text: payload.payload.text, clientId }
        ]);
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });
    
    channelRef.current = channel;

    return () => {
      setConnected(false);
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;
    const clientId = crypto.randomUUID();

    const newMsg = {
      id: clientId,
      user: currentUser.name,
      text: input.trim(),
      clientId,
    };

    seenMessageIdsRef.current.add(clientId);
    setMessages((prev) => [...prev, newMsg]);
    
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: newMsg
    });

    setInput('');
  };

  return (
    <div className="flex-1 max-w-sm flex flex-col bg-iron-800/80 border-2 border-iron-700 p-4 h-[600px] md:sticky md:top-24">
      <div aria-live="polite" className="sr-only">{liveAnnouncement}</div>
      <div className="mb-4 border-b border-iron-600 pb-2">
        <h2 className="flex items-center gap-2 font-serif text-2xl text-gold-400">
          <Users className="w-5 h-5" /> Local Hearth
        </h2>
        <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-parchment-400">
          <span>Ephemeral chat</span>
          <span className={`inline-flex items-center gap-2 ${connected ? 'text-gold-400' : 'text-iron-500'}`}>
            <Signal className="h-3.5 w-3.5" />
            {connected ? 'Connected' : 'Connecting'}
          </span>
        </div>
      </div>

      <div ref={messagesViewportRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-iron-600 scrollbar-track-transparent">
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
