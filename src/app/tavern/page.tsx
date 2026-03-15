import { Megaphone, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import TavernChat from '@/components/TavernChat';

type PostRow = {
  id: string;
  content: string;
  tier_required: string;
  created_at: string;
  profiles:
    | {
        username: string | null;
        full_name: string | null;
        role: string | null;
        guilds: { name: string } | { name: string }[] | null;
      }
    | {
        username: string | null;
        full_name: string | null;
        role: string | null;
        guilds: { name: string } | { name: string }[] | null;
      }[]
    | null;
};

function getAuthorProfile(profile: PostRow['profiles']) {
  if (!profile) return null;
  return Array.isArray(profile) ? profile[0] || null : profile;
}

function getGuildName(guilds: { name: string } | { name: string }[] | null | undefined) {
  if (!guilds) return undefined;
  return Array.isArray(guilds) ? guilds[0]?.name : guilds.name;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default async function Tavern() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user for the chat
  let chatUser = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single();
      
    chatUser = {
      id: user.id,
      name: profile?.username || profile?.full_name || 'Wanderer'
    };
  }

  // Fetch real posts ordered by newest
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      tier_required,
      created_at,
      profiles:author_id ( 
        username, 
        full_name, 
        role,
        guilds (name)
      )
    `)
    .order('created_at', { ascending: false });

  // Server Action to post a new notice
  async function createPost(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const content = formData.get('content') as string;
    const tier_required = formData.get('tier_required') as string;

    if (!content.trim()) return;

    await supabase.from('posts').insert({
      author_id: user.id,
      content,
      tier_required: tier_required || 'Public'
    });

    revalidatePath('/tavern');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      
      {/* Noticeboard (Feed) */}
      <div className="flex-[2] flex flex-col">
        <div className="border-b-2 border-gold-600 pb-4 mb-8">
          <h1 className="text-4xl font-serif text-gold-accent tracking-widest mb-2 flex items-center gap-3">
            <Megaphone className="text-gold-500" />
            The Noticeboard
          </h1>
          <p className="text-parchment-300 italic">Hear ye, hear ye! Updates from your favored guilds and patrons.</p>
        </div>

        <div className="bg-parchment flex-1 p-8 rounded-sm border-4 border-iron-800 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] flex flex-col">
          
          {/* Post Creation Form (Only if logged in) */}
          {user && (
            <div className="mb-8 pb-8 border-b-4 border-double border-leather-800">
              <form action={createPost} className="flex flex-col gap-3">
                <textarea 
                  name="content"
                  required
                  placeholder="Nail a notice to the board..."
                  className="w-full p-4 bg-parchment-100 border-2 border-leather-700 text-ink-900 font-serif outline-none focus:border-gold-600 resize-none"
                  rows={3}
                ></textarea>
                <div className="flex justify-between items-center">
                  <select name="tier_required" className="px-3 py-2 bg-parchment-100 border-2 border-leather-700 font-serif text-xs uppercase tracking-widest text-ink-900 outline-none">
                    <option value="Public">Public Notice</option>
                    <option value="Copper">Copper Tier+</option>
                    <option value="Iron">Iron Tier+</option>
                    <option value="Gold">Gold Tier Exclusive</option>
                  </select>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-leather-800 hover:bg-leather-700 text-parchment-200 font-serif transition border border-gold-600">
                    <Send className="w-4 h-4" /> Post Notice
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-8">
            {!posts || posts.length === 0 ? (
              <div className="text-center text-leather-800 italic py-8">
                The board is empty. Be the first to nail a dispatch.
              </div>
            ) : (
              (posts as PostRow[]).map((post) => {
                const author = getAuthorProfile(post.profiles);

                return (
                  <Post 
                    key={post.id}
                    author={author?.username || author?.full_name || 'Unknown Wanderer'}
                    role={author?.role || 'patron'}
                    guildName={getGuildName(author?.guilds)}
                    time={timeAgo(post.created_at)}
                    content={post.content}
                    tier={post.tier_required !== 'Public' ? `${post.tier_required} Tier Exclusive` : undefined}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <TavernChat currentUser={chatUser} />
    </div>
  );
}

function Post({ author, role, guildName, time, content, tier }: { author: string, role: string, guildName?: string, time: string, content: string, tier?: string }) {
  return (
    <div className="border-b-2 border-dashed border-leather-800 pb-6 mb-6 last:border-0 relative">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="font-serif font-bold text-xl text-ink-900 capitalize capitalize-first">{author}</span>
          <span className="text-leather-700 ml-3 text-sm italic capitalize">
            {role}{guildName ? ` of ${guildName}` : ''}
          </span>
        </div>
        <span className="text-leather-800/70 text-sm font-serif">{time}</span>
      </div>
      
      {tier && (
        <div className="inline-block px-3 py-1 bg-gold-500/20 border border-gold-600 text-gold-800 text-xs font-bold uppercase tracking-widest mb-3">
          {tier}
        </div>
      )}

      <p className="text-ink-900 leading-relaxed font-serif text-lg whitespace-pre-wrap">{content}</p>
    </div>
  );
}
