import type { ActionResult } from "@/lib/action-result";
import type { AppRole } from "@/lib/auth";
import type { FormActionState } from "@/lib/form-action-state";

export type Profile = {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: AppRole;
  bio: string | null;
  guildId: string | null;
  guildName: string | null;
};

export type GuildOption = {
  id: string;
  name: string;
};

export type ProfileSummary = {
  listedWares: number;
  pinnedNotices: number;
};

export type ProfilePageData = {
  profile: Profile;
  guildOptions: GuildOption[];
  summary: ProfileSummary;
};

export type UpdateProfileInput = {
  username: string | null;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  guildId: string | null;
};

export type ProfileMutationResult = ActionResult<{ id: string }>;
export type ProfileField =
  | "username"
  | "full_name"
  | "bio"
  | "avatar_url"
  | "guild_id";
export type ProfileFormState = FormActionState<ProfileField>;
