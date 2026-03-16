'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Signal, Users } from 'lucide-react';
import { useLiveAnnouncement } from '@/lib/client/useLiveAnnouncement';

const MAX_CHAT_MESSAGES = 100;
const MAX_CHAT_MESSAGE_LENGTH = 500;

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
  const [supabase] = useState(() => createClient());
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
        setMessages((prev) =>
          [
            ...prev,
            { id: clientId, user: payload.payload.user, text: payload.payload.text, clientId },
          ].slice(-MAX_CHAT_MESSAGES),
        );
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });
    
    channelRef.current = channel;

    return () => {
      setConnected(false);
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = input.trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
    if (!normalizedInput || !currentUser) return;
    const clientId = crypto.randomUUID();

    const newMsg = {
      id: clientId,
      user: currentUser.name,
      text: normalizedInput,
      clientId,
    };

    seenMessageIdsRef.current.add(clientId);
    setMessages((prev) => [...prev, newMsg].slice(-MAX_CHAT_MESSAGES));
    
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: newMsg
    });

    setInput('');
  };

  return (
    <div className="surface-dark flex h-[600px] max-w-none flex-1 flex-col rounded-[1.5rem] p-4 md:sticky md:top-28 xl:max-w-sm">
      <div aria-live="polite" className="sr-only">{liveAnnouncement}</div>
      <div className="mb-4 border-b border-iron-600/70 pb-3">
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

      <div ref={messagesViewportRef} className="scroll-area mb-4 flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-[1rem] border px-3 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.18)] ${m.user === 'Innkeeper' ? 'border-leather-700/60 bg-leather-800/20' : 'border-iron-700 bg-iron-900/55'}`}>
            <span className={m.user === 'Innkeeper' ? 'mr-2 text-sm font-bold italic text-leather-600' : 'mr-2 text-sm font-bold text-gold-500'}>
              {m.user}:
            </span>
            <span className={m.user === 'Innkeeper' ? 'text-sm italic text-leather-600/80' : 'text-sm whitespace-pre-wrap break-words text-parchment-300'}>
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
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHAT_MESSAGE_LENGTH))}
              placeholder="Speak your mind..."
              className="min-h-12 w-full rounded-[1rem] border border-iron-600 bg-iron-900 px-4 py-3 pr-10 font-serif text-parchment-200 outline-none focus:border-gold-500"
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
