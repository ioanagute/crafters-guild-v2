import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import TavernChat from '@/components/TavernChat';
import PageHeader from '@/components/PageHeader';
import TavernBoardClient, { type TavernPostView } from '@/components/TavernBoardClient';

type PostRow = {
  id: string;
  author_id: string;
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
      author_id,
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

  async function updatePost(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const id = formData.get('id') as string;
    const content = formData.get('content') as string;
    const tier_required = formData.get('tier_required') as string;

    if (!content.trim()) return;

    await supabase
      .from('posts')
      .update({ content, tier_required })
      .eq('id', id)
      .eq('author_id', user.id);

    revalidatePath('/tavern');
  }

  async function deletePost(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const id = formData.get('id') as string;

    await supabase.from('posts').delete().eq('id', id).eq('author_id', user.id);
    revalidatePath('/tavern');
  }

  const boardPosts: TavernPostView[] = ((posts as PostRow[] | null) || []).map((post) => {
    const author = getAuthorProfile(post.profiles);

    return {
      id: post.id,
      content: post.content,
      tier_required: post.tier_required,
      created_at: post.created_at,
      authorName: author?.username || author?.full_name || 'Unknown Wanderer',
      authorRole: author?.role || 'patron',
      guildName: getGuildName(author?.guilds),
      isOwner: post.author_id === user?.id,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <PageHeader
        eyebrow="Community Hall"
        title="The Noticeboard"
        description="Hear ye, hear ye. The noticeboard preserves lasting dispatches, while the Local Hearth handles quick and fleeting exchange."
      />

      <div className="flex min-h-[80vh] flex-col gap-8 md:flex-row">
        <div className="flex-[2]">
          <TavernBoardClient
            posts={boardPosts}
            isAuthenticated={Boolean(user)}
            createPostAction={createPost}
            updatePostAction={updatePost}
            deletePostAction={deletePost}
          />
        </div>

        <TavernChat currentUser={chatUser} />
      </div>
    </div>
  );
}
