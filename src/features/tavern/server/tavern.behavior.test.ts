import { afterEach, describe, expect, it, vi } from "vitest";

const {
  maybeSingleMock,
  fromMock,
  requireSessionProfileMock,
} = vi.hoisted(() => {
  const maybeSingleMock = vi.fn();
  const selectMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const eqSecondMock = vi.fn(() => ({ select: selectMock }));
  const eqFirstMock = vi.fn(() => ({ eq: eqSecondMock }));
  const deleteMock = vi.fn(() => ({ eq: eqFirstMock }));
  const fromMock = vi.fn(() => ({ delete: deleteMock }));
  const requireSessionProfileMock = vi.fn();

  return {
    maybeSingleMock,
    fromMock,
    requireSessionProfileMock,
  };
});

vi.mock("@/lib/auth", () => ({
  getCurrentSessionProfile: vi.fn(),
  requireSessionProfile: requireSessionProfileMock,
}));

import { deletePost } from "@/features/tavern/server/tavern";

describe("deletePost", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns a domain failure when the current user does not own the post", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    requireSessionProfileMock.mockResolvedValue({
      user: { id: "user-1" },
      profile: { id: "user-1" },
      supabase: {
        from: fromMock,
      },
    });

    const result = await deletePost("post-1");

    expect(result).toEqual({
      ok: false,
      message: "Notice not found or not owned by the current member.",
      fieldErrors: undefined,
    });
  });
});
