import { Crown } from "lucide-react";
import GuildDirectoryClient from "@/components/GuildDirectoryClient";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import { getGuildDirectoryData } from "@/features/guilds/server/guilds";

export const revalidate = 60;

export const metadata = {
  title: "The Great Houses",
  description:
    "Browse the charters and member rosters of the realm's legendary guilds.",
};

export default async function GuildsPage() {
  const { guilds, membershipState, swornMembers } =
    await getGuildDirectoryData();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <section className="border-gold-600 mb-10 border-b-2 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-gold-400 mb-3 text-xs tracking-[0.35em] uppercase">
              Guild Directory
            </p>
            <h1 className="text-gold-accent font-serif text-4xl tracking-widest md:text-5xl">
              The Great Houses
            </h1>
            <p className="text-parchment-300 mt-4 text-lg italic">
              Read the charters of the realm, study each banner, and decide
              where your craft belongs.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="border-gold-600/80 bg-iron-800/80 border px-5 py-4 text-center shadow-2xl">
              <p className="text-parchment-400 text-xs tracking-[0.25em] uppercase">
                Guilds
              </p>
              <p className="text-gold-400 mt-2 font-serif text-3xl">
                {guilds.length}
              </p>
            </div>
            <div className="border-gold-600/80 bg-iron-800/80 border px-5 py-4 text-center shadow-2xl">
              <p className="text-parchment-400 text-xs tracking-[0.25em] uppercase">
                Sworn Members
              </p>
              <p className="text-gold-400 mt-2 font-serif text-3xl">
                {swornMembers}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} />
      </div>

      {guilds.length === 0 ? (
        <section className="border-iron-700 bg-iron-800/70 border-2 border-dashed px-6 py-16 text-center shadow-2xl">
          <Crown className="text-gold-500 mx-auto mb-4 h-12 w-12 opacity-80" />
          <h2 className="text-parchment-200 mb-3 font-serif text-3xl">
            No guilds have raised their banners
          </h2>
          <p className="text-parchment-300 mx-auto max-w-2xl text-sm leading-relaxed">
            The halls stand ready, but no charter has yet been entered into the
            record.
          </p>
        </section>
      ) : (
        <GuildDirectoryClient guilds={guilds} />
      )}
    </div>
  );
}
