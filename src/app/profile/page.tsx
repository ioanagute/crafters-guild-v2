import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Shield, Save, LogOut, ScrollText, Swords, Crown } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ParchmentCard from '@/components/ParchmentCard';
import StatPill from '@/components/StatPill';
import ThemedLinkButton from '@/components/ThemedLinkButton';

type ProfileFormUpdate = {
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  guild_id?: string | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile WITH guild info
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      guilds (
        name
      )
    `)
    .eq('id', user.id)
    .single();

  // Fetch all available guilds
  const { data: guilds } = await supabase
    .from('guilds')
    .select('*')
    .order('name');

  const [{ count: productCount }, { count: postCount }] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('crafter_id', user.id),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id),
  ]);

  async function updateHeraldry(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const username = formData.get('username') as string;
    const full_name = formData.get('full_name') as string;
    const bio = formData.get('bio') as string;
    const avatar_url = formData.get('avatar_url') as string;
    const guild_id = formData.get('guild_id') as string;

    const updateData: ProfileFormUpdate = {
      username,
      full_name,
      bio,
      avatar_url,
    };

    if (guild_id) {
      updateData.guild_id = guild_id;
    } else {
      updateData.guild_id = null;
    }

    const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);

    if (!error) {
      revalidatePath('/profile');
      revalidatePath('/tavern');
      revalidatePath('/marketplace');
    } else {
      console.error("Failed to update profile:", error);
    }
  }

  async function signOut() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    revalidatePath('/marketplace');
    revalidatePath('/marketplace/my-listings');
    redirect('/');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        eyebrow="Member Heraldry"
        title="Your Heraldry"
        description="Declare your titles, current banner, and next steps from a single hall of record."
        actions={
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-2 border border-blood-600 bg-blood-600/20 px-4 py-2 font-serif text-sm uppercase tracking-widest text-blood-600 transition hover:bg-blood-600 hover:text-parchment-200">
              <LogOut className="w-4 h-4" /> Depart
            </button>
          </form>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <ParchmentCard className="p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden border-4 border-gold-600 bg-iron-900">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Crest" width={160} height={160} className="h-full w-full object-cover" unoptimized />
              ) : (
                <Shield className="h-12 w-12 text-leather-700 opacity-50" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Declared Identity</p>
              <h2 className="mt-2 font-serif text-3xl text-ink-900">
                {profile?.username || profile?.full_name || 'Unnamed Wanderer'}
              </h2>
              {profile?.full_name && profile?.username && profile.full_name !== profile.username ? (
                <p className="mt-1 text-sm italic text-leather-700">{profile.full_name}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-leather-900">
                <span className="border border-gold-600/60 bg-gold-500/10 px-3 py-2">{profile?.role || 'patron'}</span>
                <span className="border border-leather-800/50 bg-parchment-100 px-3 py-2">
                  {profile?.guilds?.name || 'Lone Wanderer'}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-leather-900">
                {profile?.bio || 'No lore has yet been recorded for this member.'}
              </p>
            </div>
          </div>
        </ParchmentCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatPill label="Listed Wares" value={productCount || 0} />
          <StatPill label="Pinned Notices" value={postCount || 0} />
          <StatPill label="Current Guild" value={profile?.guilds?.name || 'None'} />
        </div>
      </div>

      <ParchmentCard className="mb-8 p-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-leather-700">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            {profile?.role === 'artisan' ? (
              <>
                <ThemedLinkButton href="/marketplace/new" icon={<Crown className="h-4 w-4" />}>Forge New Work</ThemedLinkButton>
                <ThemedLinkButton href="/marketplace/my-listings" variant="secondary" icon={<ScrollText className="h-4 w-4" />}>Manage Listings</ThemedLinkButton>
                <ThemedLinkButton href="/marketplace" variant="secondary">Visit Bazaar</ThemedLinkButton>
              </>
            ) : (
              <>
                <ThemedLinkButton href="/guilds" icon={<Crown className="h-4 w-4" />}>Browse Guilds</ThemedLinkButton>
                <ThemedLinkButton href="/tavern" variant="secondary" icon={<Swords className="h-4 w-4" />}>Visit Tavern</ThemedLinkButton>
                <ThemedLinkButton href="/marketplace" variant="secondary" icon={<ScrollText className="h-4 w-4" />}>Browse Bazaar</ThemedLinkButton>
              </>
            )}
          </div>
        </div>
      </ParchmentCard>

      <ParchmentCard className="p-8 sm:p-12">
        <form action={updateHeraldry} className="flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center border-b-2 border-dashed border-leather-800 pb-8">
            <div className="w-32 h-32 bg-iron-900 border-4 border-gold-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Crest" width={160} height={160} className="h-full w-full object-cover" unoptimized />
              ) : (
                <Shield className="w-12 h-12 text-leather-700 opacity-50" />
              )}
            </div>
            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Crest Portrait (Image URL)</label>
              <input 
                name="avatar_url" 
                defaultValue={profile?.avatar_url || ''}
                placeholder="https://example.com/my-portrait.png"
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 w-full font-serif"
              />
              <p className="text-xs text-leather-700 italic">Provide a link to an image depicting your visage or guild animal.</p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Chosen Name (Username)</label>
              <input 
                name="username" 
                defaultValue={profile?.username || ''}
                placeholder="e.g. GromTheSmith"
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Full Title</label>
              <input 
                name="full_name" 
                defaultValue={profile?.full_name || ''}
                placeholder="Grom of the Iron Hills"
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Current Role within the Realm</label>
              <div className="px-4 py-3 bg-iron-900 border-2 border-iron-800 text-gold-500 font-serif uppercase tracking-widest opacity-80 cursor-not-allowed">
                {profile?.role || 'Patron'}
              </div>
              <p className="text-xs text-leather-700 italic">Roles are declared upon registration.</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Guild Affiliation</label>
              <div className="rounded-sm border border-gold-600/60 bg-leather-800 px-4 py-3 text-sm text-parchment-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-400">Current Banner</span>
                <span className="mt-1 block font-serif text-lg">
                  {profile?.guilds?.name || 'Unaffiliated (Lone Wanderer)'}
                </span>
              </div>
              <select 
                name="guild_id"
                defaultValue={profile?.guild_id || ''}
                className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif"
              >
                <option value="">Unaffiliated (Lone Wanderer)</option>
                {guilds?.map((guild) => (
                  <option key={guild.id} value={guild.id}>{guild.name}</option>
                ))}
              </select>
              <div className="flex items-center justify-between gap-3 text-xs text-leather-700 italic">
                <span>Join a guild to bear their colors in the Tavern.</span>
                <Link href="/guilds" className="not-italic text-leather-900 underline decoration-gold-600 underline-offset-2 hover:text-gold-600">
                  Browse all guilds
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-serif text-ink-900 font-bold uppercase tracking-widest text-xs">Biography & Lore</label>
            <textarea 
              name="bio"
              defaultValue={profile?.bio || ''}
              rows={5}
              placeholder="Tell the realm of your deeds and specialties..."
              className="px-4 py-3 bg-parchment-100 border-2 border-leather-800 text-ink-900 outline-none focus:border-gold-600 font-serif resize-y"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit"
              className="px-8 py-3 bg-leather-800 hover:bg-leather-700 text-parchment-200 font-serif border-2 border-gold-600 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all tracking-wider text-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Impress into Wax
            </button>
          </div>
        </form>
      </ParchmentCard>
    </div>
  );
}
