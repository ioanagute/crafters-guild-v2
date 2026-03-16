import { describe, expect, it } from "vitest";
import { validatePostInput } from "@/features/tavern/server/tavern";

function buildPostFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("validatePostInput", () => {
  it("accepts a valid tavern post", () => {
    const result = validatePostInput(
      buildPostFormData({
        content: "The forge is open at dawn.",
        tier_required: "Public",
      }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tierRequired).toBe("Public");
    }
  });

  it("rejects empty or invalid post input", () => {
    const result = validatePostInput(
      buildPostFormData({
        content: "   ",
        tier_required: "Diamond",
      }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        content: "Post content is required.",
        tier_required: "Select a valid tavern tier.",
      });
    }
  });

  it("rejects oversized tavern posts", () => {
    const result = validatePostInput(
      buildPostFormData({
        content: "x".repeat(501),
        tier_required: "Public",
      }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        content: "Post content must be 500 characters or fewer.",
      });
    }
  });
});
