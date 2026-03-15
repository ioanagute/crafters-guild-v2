import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, Save, LogOut } from 'lucide-react';
import { revalidatePath } from 'next/cache';

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

    const updateData: any = {
      username,
      full_name,
      bio,
      avatar_url,
    };

    if (guild_id) {
      updateData.guild_id = guild_id;
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
    redirect('/');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end border-b-2 border-gold-600 pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-gold-accent tracking-widest mb-2 flex items-center gap-3">
            <Shield className="text-gold-500 w-8 h-8" />
            Your Heraldry
          </h1>
          <p className="text-parchment-300 italic">Declare your titles, lineage, and crest to the realm.</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blood-600/20 text-blood-600 border border-blood-600 hover:bg-blood-600 hover:text-parchment-200 transition font-serif text-sm uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Depart
          </button>
        </form>
      </div>

      <div className="bg-parchment p-8 sm:p-12 border-4 border-iron-800 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <form action={updateHeraldry} className="flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center border-b-2 border-dashed border-leather-800 pb-8">
            <div className="w-32 h-32 bg-iron-900 border-4 border-gold-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Crest" className="w-full h-full object-cover" />
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
              <p className="text-xs text-leather-700 italic">Join a guild to bear their colors in the Tavern.</p>
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
      </div>
    </div>
  );
}