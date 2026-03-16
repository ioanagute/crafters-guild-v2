import { afterEach, describe, expect, it, vi } from "vitest";

const {
  maybeSingleMock,
  fromMock,
  requireArtisanProfileMock,
} = vi.hoisted(() => {
  const maybeSingleMock = vi.fn();
  const selectMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const eqSecondMock = vi.fn(() => ({ select: selectMock }));
  const eqFirstMock = vi.fn(() => ({ eq: eqSecondMock }));
  const updateMock = vi.fn(() => ({ eq: eqFirstMock }));
  const fromMock = vi.fn(() => ({ update: updateMock }));
  const requireArtisanProfileMock = vi.fn();

  return {
    maybeSingleMock,
    fromMock,
    requireArtisanProfileMock,
  };
});

vi.mock("@/lib/auth", () => ({
  requireArtisanProfile: requireArtisanProfileMock,
}));

import { updateProduct } from "@/features/marketplace/server/marketplace";

describe("updateProduct", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns a domain failure when the listing is not owned by the artisan", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    requireArtisanProfileMock.mockResolvedValue({
      user: { id: "artisan-1" },
      profile: { role: "artisan" },
      supabase: {
        from: fromMock,
      },
    });

    const result = await updateProduct("listing-1", {
      title: "Blade",
      description: "Lore",
      category: "Weaponry",
      price: 100,
      imageUrl: null,
      stock: 1,
    });

    expect(result).toEqual({
      ok: false,
      message: "Listing not found or not owned by the current artisan.",
      fieldErrors: undefined,
    });
  });
});
