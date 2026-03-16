import { fail, ok } from "@/lib/action-result";
import type { Database } from "@/lib/database.types";
import { readString } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";
import { getCurrentSessionProfile, requireSessionProfile } from "@/lib/auth";
import {
  TAVERN_TIERS,
  type CreatePostInput,
  type TavernMutationResult,
  type TavernPost,
  type TavernTier,
  type UpdatePostInput,
} from "@/features/tavern/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  profiles:
    | {
        username: string | null;
        full_name: string | null;
        role: string | null;
        guilds: { name: string } | { name: string }[] | null;
      }
    | {
        username: string | null;
        full_name: string | null;
        role: string | null;
        guilds: { name: string } | { name: string }[] | null;
      }[]
    | null;
};

function getAuthorProfile(profile: PostRow["profiles"]) {
  if (!profile) return null;
  return Array.isArray(profile) ? profile[0] ?? null : profile;
}

function getGuildName(guilds: { name: string } | { name: string }[] | null | undefined) {
  if (!guilds) return undefined;
  return Array.isArray(guilds) ? guilds[0]?.name : guilds.name;
}

function isTavernTier(value: string): value is TavernTier {
  return TAVERN_TIERS.includes(value as TavernTier);
}

export function validatePostInput(formData: FormData) {
  const content = readString(formData, "content").trim();
  const tierRequired = readString(formData, "tier_required");
  const fieldErrors: Record<string, string> = {};

  if (!content) fieldErrors.content = "Post content is required.";
  if (!isTavernTier(tierRequired)) fieldErrors.tier_required = "Select a valid tavern tier.";

  if (Object.keys(fieldErrors).length > 0) {
    return fail<CreatePostInput>("Invalid tavern post input.", fieldErrors);
  }

  return ok<CreatePostInput>({ content, tierRequired: tierRequired as TavernTier });
}

export async function getTavernPageData() {
  const supabase = await createClient();
  const [session, { data: posts }] = await Promise.all([
    getCurrentSessionProfile(),
    supabase
      .from("posts")
      .select(`
        id,
        author_id,
        content,
        tier_required,
        created_at,
        profiles:author_id (
          username,
          full_name,
          role,
          guilds (name)
        )
      `)
      .order("created_at", { ascending: false }),
  ]);

  const viewerId = session.user?.id ?? null;

  return {
    posts: ((posts as PostRow[] | null) ?? []).map<TavernPost>((post) => {
      const author = getAuthorProfile(post.profiles);
      return {
        id: post.id,
        content: post.content,
        tierRequired: post.tier_required,
        createdAt: post.created_at,
        authorId: post.author_id,
        authorName: author?.username ?? author?.full_name ?? "Unknown Wanderer",
        authorRole: author?.role ?? "patron",
        guildName: getGuildName(author?.guilds),
        isOwner: post.author_id === viewerId,
      };
    }),
    isAuthenticated: Boolean(viewerId),
    chatUser: session.user
      ? {
          id: session.user.id,
          name: session.profile?.username ?? session.profile?.fullName ?? "Wanderer",
        }
      : null,
  };
}

export async function createPost(input: CreatePostInput): Promise<TavernMutationResult> {
  const { user, supabase } = await requireSessionProfile("/tavern");

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      content: input.content,
      tier_required: input.tierRequired,
    })
    .select("id")
    .single();

  if (error || !data) {
    return fail("Unable to create tavern notice.");
  }

  return ok({ id: data.id as string });
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<TavernMutationResult> {
  const { user, supabase } = await requireSessionProfile("/tavern");

  const { data, error } = await supabase
    .from("posts")
    .update({
      content: input.content,
      tier_required: input.tierRequired,
    })
    .eq("id", id)
    .eq("author_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return fail("Unable to update tavern notice.");
  }

  if (!data) {
    return fail("Notice not found or not owned by the current member.");
  }

  return ok({ id: data.id as string });
}

export async function deletePost(id: string): Promise<TavernMutationResult> {
  const { user, supabase } = await requireSessionProfile("/tavern");

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return fail("Unable to remove tavern notice.");
  }

  if (!data) {
    return fail("Notice not found or not owned by the current member.");
  }

  return ok({ id: data.id as string });
}
