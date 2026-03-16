import { Shield, UserRound } from "lucide-react";
import RemoteImage from "@/components/RemoteImage";
import StatePanel from "@/components/StatePanel";
import type { GuildMember } from "@/features/guilds/types";

export default function GuildMemberList({
  members,
}: {
  members: GuildMember[];
}) {
  if (members.length === 0) {
    return (
      <StatePanel
        tone="empty"
        title="No sworn members yet"
        description="This banner awaits the first artisan or patron to take its oath."
        icon={<Shield className="h-10 w-10 text-gold-600 opacity-80" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {members.map((member) => {
        const displayName = member.username || member.fullName || "Unknown Wanderer";
        const role = member.role || "patron";
        const bio = member.bio?.trim();

        return (
          <article
            key={member.id}
            className="bg-parchment rounded-[1.3rem] border border-leather-800/70 p-5 shadow-[0_16px_30px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-4 flex items-start gap-4 border-b border-dashed border-leather-800/50 pb-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] border-2 border-gold-600 bg-iron-900/10">
                {member.avatarUrl ? (
                  <RemoteImage
                    src={member.avatarUrl}
                    alt={`${displayName} crest`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-7 w-7 text-leather-700 opacity-60" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-2xl text-ink-900">{displayName}</h3>
                {member.fullName && member.username && member.fullName !== member.username && (
                  <p className="text-sm italic text-leather-700">{member.fullName}</p>
                )}
                <p className="mt-2 inline-block rounded-full border border-gold-600/60 bg-gold-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-leather-900">
                  {role}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-leather-900">
              {bio || "No lore has been recorded for this guild member."}
            </p>
          </article>
        );
      })}
    </div>
  );
}
