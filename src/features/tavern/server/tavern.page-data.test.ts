import { afterEach, describe, expect, it, vi } from "vitest";

const { createClientMock, getCurrentSessionProfileMock, eqMock, fromMock } = vi.hoisted(() => {
  const eqMock = vi.fn();
  const publicResult = Promise.resolve({ data: [] });
  const orderMock = vi.fn(() => Object.assign(publicResult, { eq: eqMock }));
  const selectMock = vi.fn(() => ({
    order: orderMock,
  }));
  const fromMock = vi.fn(() => ({
    select: selectMock,
  }));
  const createClientMock = vi.fn();
  const getCurrentSessionProfileMock = vi.fn();

  return {
    createClientMock,
    getCurrentSessionProfileMock,
    eqMock,
    fromMock,
  };
});

vi.mock("@/utils/supabase/server", () => ({
  createClient: createClientMock,
}));

vi.mock("@/lib/auth", () => ({
  getCurrentSessionProfile: getCurrentSessionProfileMock,
  requireSessionProfile: vi.fn(),
}));

import { getTavernPageData } from "@/features/tavern/server/tavern";

describe("getTavernPageData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("limits anonymous viewers to public posts", async () => {
    createClientMock.mockResolvedValue({ from: fromMock });
    eqMock.mockResolvedValue({ data: [] });
    getCurrentSessionProfileMock.mockResolvedValue({ user: null, profile: null });

    const result = await getTavernPageData();

    expect(eqMock).toHaveBeenCalledWith("tier_required", "Public");
    expect(result.isAuthenticated).toBe(false);
    expect(result.posts).toEqual([]);
  });

  it("does not apply a tier filter for authenticated viewers", async () => {
    eqMock.mockResolvedValue({ data: [] });
    const memberResult = Promise.resolve({
      data: [
        {
          id: "post-1",
          author_id: "user-1",
          content: "Members only",
          tier_required: "Gold",
          created_at: "2026-03-16T00:00:00Z",
          profiles: {
            username: "lysa",
            full_name: "Lysa",
            role: "patron",
            guilds: null,
          },
        },
      ],
    });
    createClientMock.mockResolvedValue({
      from: () => ({
        select: () => ({
          order: () => Object.assign(memberResult, { eq: eqMock }),
        }),
      }),
    });
    getCurrentSessionProfileMock.mockResolvedValue({
      user: { id: "user-1" },
      profile: { username: "lysa", fullName: "Lysa" },
    });

    const result = await getTavernPageData();

    expect(eqMock).not.toHaveBeenCalled();
    expect(result.isAuthenticated).toBe(true);
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0]?.tierRequired).toBe("Gold");
  });
});
