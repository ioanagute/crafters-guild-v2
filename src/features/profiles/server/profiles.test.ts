import { describe, expect, it } from "vitest";
import { validateProfileInput } from "@/features/profiles/server/profiles";

describe("validateProfileInput", () => {
  it("normalizes optional blank fields to null", () => {
    const formData = new FormData();
    formData.set("username", "  ");
    formData.set("full_name", "Lysa of Dawn");
    formData.set("bio", "");
    formData.set("avatar_url", " https://example.com/avatar.png ");
    formData.set("guild_id", "");

    const result = validateProfileInput(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        username: null,
        fullName: "Lysa of Dawn",
        bio: null,
        avatarUrl: "https://example.com/avatar.png",
        guildId: null,
      });
    }
  });

  it("rejects invalid profile URLs, UUIDs, and oversized bios", () => {
    const formData = new FormData();
    formData.set("username", "bad name");
    formData.set("bio", "x".repeat(501));
    formData.set("avatar_url", "http://example.com/avatar.png");
    formData.set("guild_id", "not-a-uuid");

    const result = validateProfileInput(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        username: "Username may only use letters, numbers, and underscores.",
        bio: "Biography must be 500 characters or fewer.",
        avatar_url: "Avatar URL must be a valid HTTPS address.",
        guild_id: "Select a valid guild.",
      });
    }
  });
});
