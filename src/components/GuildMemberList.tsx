import { Shield, UserRound } from "lucide-react";

export type GuildMember = {
  id: string;
  username: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export default function GuildMemberList({
  members,
}: {
  members: GuildMember[];
}) {
  if (members.length === 0) {
    return (
      <div className="border-2 border-dashed border-leather-800/60 bg-parchment p-8 text-center text-leather-800">
        <Shield className="mx-auto mb-4 h-10 w-10 text-gold-600 opacity-80" />
        <h2 className="mb-2 font-serif text-2xl text-ink-900">No sworn members yet</h2>
        <p className="text-sm italic">
          This banner awaits the first artisan or patron to take its oath.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {members.map((member) => {
        const displayName = member.username || member.full_name || "Unknown Wanderer";
        const role = member.role || "patron";
        const bio = member.bio?.trim();

        return (
          <article
            key={member.id}
            className="bg-parchment border-2 border-leather-800 p-5 shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-4 flex items-start gap-4 border-b border-dashed border-leather-800/50 pb-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-gold-600 bg-iron-900/10">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={`${displayName} crest`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-7 w-7 text-leather-700 opacity-60" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-2xl text-ink-900">{displayName}</h3>
                {member.full_name && member.username && member.full_name !== member.username && (
                  <p className="text-sm italic text-leather-700">{member.full_name}</p>
                )}
                <p className="mt-2 inline-block border border-gold-600/60 bg-gold-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-leather-900">
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
