import { afterEach, describe, expect, it, vi } from "vitest";

const { redirectMock, revalidatePathMock, createProductMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  createProductMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/features/marketplace/server/marketplace", async () => {
  const mod = await vi.importActual<typeof import("@/features/marketplace/server/marketplace")>(
    "@/features/marketplace/server/marketplace",
  );

  return {
    ...mod,
    createProduct: createProductMock,
  };
});

import { createProductAction } from "@/features/marketplace/actions";

function buildFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("createProductAction", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns inline field errors for invalid input", async () => {
    const result = await createProductAction(
      { status: "idle" },
      buildFormData({
        title: "",
        description: "",
        category: "Invalid",
        price: "0",
        stock: "-1",
      }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors).toMatchObject({
      title: "Title is required.",
      description: "Description is required.",
    });
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it("redirects on successful creation after revalidation", async () => {
    createProductMock.mockResolvedValue({ ok: true, data: { id: "listing-1" } });

    await createProductAction(
      { status: "idle" },
      buildFormData({
        title: "Moonsteel Blade",
        description: "Folded under seven stars.",
        category: "Weaponry",
        price: "125",
        stock: "3",
      }),
    );

    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/marketplace");
    expect(redirectMock).toHaveBeenCalledWith("/marketplace");
  });
});
