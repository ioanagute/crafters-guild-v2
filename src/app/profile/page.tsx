import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Shield, LogOut, ScrollText, Swords, Crown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ParchmentCard from '@/components/ParchmentCard';
import ProfileFormClient from '@/components/ProfileFormClient';
import StatPill from '@/components/StatPill';
import ThemedLinkButton from '@/components/ThemedLinkButton';
import { requireSessionProfile } from '@/lib/auth';
import { getProfilePageData } from '@/features/profiles/server/profiles';
import { signOutAction, updateProfileAction } from '@/features/profiles/actions';

export default async function ProfilePage() {
  const { user } = await requireSessionProfile('/login');
  const pageData = await getProfilePageData(user.id);

  if (!pageData) {
    redirect('/error?message=Unable%20to%20load%20your%20heraldry.&returnTo=%2Fprofile');
  }

  const { profile, guildOptions, summary } = pageData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        eyebrow="Member Heraldry"
        title="Your Heraldry"
        description="Declare your titles, current banner, and next steps from a single hall of record."
        actions={
          <form action={signOutAction}>
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
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Crest" width={160} height={160} className="h-full w-full object-cover" unoptimized />
              ) : (
                <Shield className="h-12 w-12 text-leather-700 opacity-50" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Declared Identity</p>
              <h2 className="mt-2 font-serif text-3xl text-ink-900">
                {profile.username || profile.fullName || 'Unnamed Wanderer'}
              </h2>
              {profile.fullName && profile.username && profile.fullName !== profile.username ? (
                <p className="mt-1 text-sm italic text-leather-700">{profile.fullName}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-leather-900">
                <span className="border border-gold-600/60 bg-gold-500/10 px-3 py-2">{profile.role || 'patron'}</span>
                <span className="border border-leather-800/50 bg-parchment-100 px-3 py-2">
                  {profile.guildName || 'Lone Wanderer'}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-leather-900">
                {profile.bio || 'No lore has yet been recorded for this member.'}
              </p>
            </div>
          </div>
        </ParchmentCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatPill label="Listed Wares" value={summary.listedWares} />
          <StatPill label="Pinned Notices" value={summary.pinnedNotices} />
          <StatPill label="Current Guild" value={profile.guildName || 'None'} />
        </div>
      </div>

      <ParchmentCard className="mb-8 p-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-leather-700">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            {profile.role === 'artisan' ? (
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
        <ProfileFormClient
          action={updateProfileAction}
          profile={profile}
          guildOptions={guildOptions}
        />
      </ParchmentCard>
    </div>
  );
}
