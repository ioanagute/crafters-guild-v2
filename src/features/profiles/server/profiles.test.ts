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
});
