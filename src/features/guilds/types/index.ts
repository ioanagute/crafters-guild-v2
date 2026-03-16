export type Guild = {
  id: string;
  name: string;
  description: string | null;
  emblemUrl: string | null;
  memberCount: number;
  createdAt: string;
};

export type GuildMember = {
  id: string;
  username: string | null;
  fullName: string | null;
  role: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export type MembershipState =
  | { kind: "anonymous" }
  | { kind: "unaffiliated"; username?: string | null }
  | {
      kind: "member";
      username?: string | null;
      guildId: string;
      guildName: string;
      isCurrentGuild?: boolean;
    };

export type GuildDirectoryData = {
  guilds: Guild[];
  membershipState: MembershipState;
  swornMembers: number;
};

export type GuildDetailData = {
  guild: Guild;
  members: GuildMember[];
  membershipState: MembershipState;
};
