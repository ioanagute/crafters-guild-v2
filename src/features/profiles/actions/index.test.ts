import { afterEach, describe, expect, it, vi } from "vitest";

const { redirectMock, revalidatePathMock, updateProfileMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  updateProfileMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/features/profiles/server/profiles", async () => {
  const mod = await vi.importActual<typeof import("@/features/profiles/server/profiles")>(
    "@/features/profiles/server/profiles",
  );

  return {
    ...mod,
    updateProfile: updateProfileMock,
  };
});

import { updateProfileAction } from "@/features/profiles/actions";

describe("updateProfileAction", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns success state and revalidates affected pages", async () => {
    updateProfileMock.mockResolvedValue({ ok: true, data: { id: "user-1" } });

    const formData = new FormData();
    formData.set("full_name", "Lysa of Dawn");

    const result = await updateProfileAction({ status: "idle" }, formData);

    expect(result).toEqual({ status: "success", message: "Heraldry updated." });
    expect(revalidatePathMock).toHaveBeenCalledWith("/profile");
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
