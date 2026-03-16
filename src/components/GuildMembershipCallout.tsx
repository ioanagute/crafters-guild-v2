import Link from "next/link";
import { Crown, Shield, UserRound } from "lucide-react";
import type { MembershipState } from "@/features/guilds/types";

export default function GuildMembershipCallout({
  state,
  variant = "directory",
}: {
  state: MembershipState;
  variant?: "directory" | "detail";
}) {
  const compact = variant === "detail";

  if (state.kind === "anonymous") {
    return (
      <section className="section-panel px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
              Oath Required
            </p>
            <h2 className="font-serif text-2xl text-parchment-200">
              Enter the Guild to declare allegiance
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment-300">
              Browse the great houses freely. To swear your colors, present yourself
              at the gate and complete your heraldry.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-[1rem] border border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-[0.18em] text-gold-300 transition hover:bg-leather-700 hover:text-gold-200"
          >
            <Shield className="h-4 w-4" />
            Enter
          </Link>
        </div>
      </section>
    );
  }

  if (state.kind === "unaffiliated") {
    return (
      <section className="section-panel px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
              No Banner Chosen
            </p>
            <h2 className="font-serif text-2xl text-parchment-200">
              Choose your banner in Heraldry
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment-300">
              {state.username
                ? `${state.username}, you remain a lone wanderer. Browse the charters below and choose a guild from your profile.`
                : "You remain a lone wanderer. Browse the charters below and choose a guild from your profile."}
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-[1rem] border border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-[0.18em] text-gold-300 transition hover:bg-leather-700 hover:text-gold-200"
          >
            <UserRound className="h-4 w-4" />
            Open Heraldry
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-panel px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold-400">
            {state.isCurrentGuild ? "Your House" : "Current Allegiance"}
          </p>
          <h2 className="font-serif text-2xl text-parchment-200">
            {state.isCurrentGuild ? "This is your guild" : `Currently sworn to ${state.guildName}`}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment-300">
            {state.isCurrentGuild
              ? compact
                ? "Your colors already fly here. Use Heraldry if you wish to change affiliation."
                : "Your colors already fly here. You may still inspect the other charters, but any change of allegiance is handled in Heraldry."
              : `${state.username || "You"} serve under ${state.guildName}. Change your affiliation in Heraldry if you wish to join a different house.`}
          </p>
        </div>
        <div className="flex gap-3">
          {!state.isCurrentGuild && (
            <Link
              href={`/guilds/${state.guildId}`}
              className="inline-flex min-h-12 items-center gap-2 self-start rounded-[1rem] border border-iron-600 bg-iron-900 px-4 py-3 font-serif text-sm tracking-[0.16em] text-parchment-200 transition hover:border-gold-600"
            >
              <Crown className="h-4 w-4 text-gold-500" />
              View Guild
            </Link>
          )}
          <Link
            href="/profile"
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-[1rem] border border-gold-600 bg-leather-800 px-5 py-3 font-serif tracking-[0.18em] text-gold-300 transition hover:bg-leather-700 hover:text-gold-200"
          >
            <Shield className="h-4 w-4" />
            Manage in Heraldry
          </Link>
        </div>
      </div>
    </section>
  );
}
