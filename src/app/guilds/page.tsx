import { Crown } from "lucide-react";
import GuildDirectoryClient from "@/components/GuildDirectoryClient";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import { getGuildDirectoryData } from "@/features/guilds/server/guilds";

export default async function GuildsPage() {
  const { guilds, membershipState, swornMembers } = await getGuildDirectoryData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <section className="mb-10 border-b-2 border-gold-600 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold-400">
              Guild Directory
            </p>
            <h1 className="font-serif text-4xl tracking-widest text-gold-accent md:text-5xl">
              The Great Houses
            </h1>
            <p className="mt-4 text-lg italic text-parchment-300">
              Read the charters of the realm, study each banner, and decide where
              your craft belongs.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="border border-gold-600/80 bg-iron-800/80 px-5 py-4 text-center shadow-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-parchment-400">Guilds</p>
              <p className="mt-2 font-serif text-3xl text-gold-400">{guilds.length}</p>
            </div>
            <div className="border border-gold-600/80 bg-iron-800/80 px-5 py-4 text-center shadow-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-parchment-400">Sworn Members</p>
              <p className="mt-2 font-serif text-3xl text-gold-400">{swornMembers}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} />
      </div>

      {guilds.length === 0 ? (
        <section className="border-2 border-dashed border-iron-700 bg-iron-800/70 px-6 py-16 text-center shadow-2xl">
          <Crown className="mx-auto mb-4 h-12 w-12 text-gold-500 opacity-80" />
          <h2 className="mb-3 font-serif text-3xl text-parchment-200">
            No guilds have raised their banners
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-parchment-300">
            The halls stand ready, but no charter has yet been entered into the record.
          </p>
        </section>
      ) : (
        <GuildDirectoryClient guilds={guilds} />
      )}
    </div>
  );
}
