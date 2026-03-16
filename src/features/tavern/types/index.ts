import type { ActionResult } from "@/lib/action-result";
import type { FormActionState } from "@/lib/form-action-state";

export const TAVERN_TIERS = ["Public", "Copper", "Iron", "Gold"] as const;

export type TavernTier = (typeof TAVERN_TIERS)[number];

export type TavernPost = {
  id: string;
  content: string;
  tierRequired: TavernTier;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  guildName?: string;
  isOwner: boolean;
};

export type TavernChatUser = {
  id: string;
  name: string;
};

export type CreatePostInput = {
  content: string;
  tierRequired: TavernTier;
};

export type UpdatePostInput = CreatePostInput;

export type TavernMutationResult = ActionResult<{ id: string }>;
export type TavernField = "content" | "tier_required";
export type TavernFormState = FormActionState<TavernField>;
