import { afterEach, describe, expect, it, vi } from "vitest";

const { revalidatePathMock, createPostMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  createPostMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/features/tavern/server/tavern", async () => {
  const mod = await vi.importActual<typeof import("@/features/tavern/server/tavern")>(
    "@/features/tavern/server/tavern",
  );

  return {
    ...mod,
    createPost: createPostMock,
  };
});

import { createPostAction } from "@/features/tavern/actions";

describe("createPostAction", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns inline errors for invalid tavern input", async () => {
    const formData = new FormData();
    formData.set("content", "");
    formData.set("tier_required", "Diamond");

    const result = await createPostAction({ status: "idle" }, formData);

    expect(result.status).toBe("error");
    expect(result.fieldErrors).toMatchObject({
      content: "Post content is required.",
      tier_required: "Select a valid tavern tier.",
    });
    expect(createPostMock).not.toHaveBeenCalled();
  });

  it("returns success state and revalidates tavern data", async () => {
    createPostMock.mockResolvedValue({ ok: true, data: { id: "post-1" } });

    const formData = new FormData();
    formData.set("content", "The forge is open at dawn.");
    formData.set("tier_required", "Public");

    const result = await createPostAction({ status: "idle" }, formData);

    expect(result).toEqual({ status: "success", message: "Notice posted." });
    expect(revalidatePathMock).toHaveBeenCalledWith("/tavern");
  });
});
