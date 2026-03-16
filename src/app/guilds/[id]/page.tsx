import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, ShieldCheck, Users } from "lucide-react";
import GuildMemberList from "@/components/GuildMemberList";
import GuildMembershipCallout from "@/components/GuildMembershipCallout";
import { getGuildDetailData } from "@/features/guilds/server/guilds";

export default async function GuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getGuildDetailData(id);

  if (!detail) {
    notFound();
  }
  const { guild: guildDetail, members: guildMembers, membershipState } = detail;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/guilds"
          className="text-sm uppercase tracking-[0.25em] text-parchment-400 transition hover:text-gold-400"
        >
          Back to the Great Houses
        </Link>
      </div>

      <section className="mb-10 border-4 border-iron-800 bg-parchment p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border-4 border-leather-800 bg-iron-900/10">
              {guildDetail.emblemUrl ? (
                <Image
                  src={guildDetail.emblemUrl}
                  alt={`${guildDetail.name} emblem`}
                  width={224}
                  height={224}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <Crown className="h-12 w-12 text-leather-700 opacity-60" />
              )}
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-leather-700">
                Guild Charter
              </p>
              <h1 className="font-serif text-4xl text-ink-900 md:text-5xl">
                {guildDetail.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-leather-900">
                {guildDetail.description || "No charter has yet been recorded for this guild."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-2 border-leather-800 bg-parchment-100 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Members</p>
              <p className="mt-2 font-serif text-3xl text-ink-900">{guildMembers.length}</p>
            </div>
            <div className="border-2 border-leather-800 bg-parchment-100 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-leather-700">Status</p>
              <p className="mt-2 font-serif text-xl text-ink-900">Open Charter</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <GuildMembershipCallout state={membershipState} variant="detail" />
      </div>

      <section>
        <div className="mb-6 flex items-end justify-between border-b-2 border-gold-600 pb-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
              Member Roster
            </p>
            <h2 className="font-serif text-3xl text-gold-accent">Sworn to This Banner</h2>
          </div>
          <div className="hidden items-center gap-2 text-parchment-300 md:flex">
            <Users className="h-4 w-4 text-gold-500" />
            {guildMembers.length} listed
          </div>
        </div>

        <GuildMemberList members={guildMembers} />
      </section>

      <section className="mt-12 border border-iron-700 bg-iron-800/70 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-parchment-200">Ready to pledge your colors?</h2>
            <p className="mt-2 text-sm text-parchment-300">
              Guild affiliation is managed through your heraldry so the realm keeps a single source of truth.
            </p>
          </div>
          <Link
            href={membershipState.kind === "anonymous" ? "/login" : "/profile"}
            className="inline-flex items-center gap-2 self-start border-2 border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-wider text-gold-400 transition hover:bg-leather-700 hover:text-gold-300"
          >
            <ShieldCheck className="h-4 w-4" />
            {membershipState.kind === "anonymous" ? "Enter the Guild" : "Open Heraldry"}
          </Link>
        </div>
      </section>
    </div>
  );
}
