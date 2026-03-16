import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectMock,
  revalidatePathMock,
  signInWithPasswordMock,
  signUpMock,
  createClientMock,
} = vi.hoisted(() => ({
  redirectMock: vi.fn(),
  revalidatePathMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  signUpMock: vi.fn(),
  createClientMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: createClientMock,
}));

import { submitAuthAction } from "@/features/auth/actions";

describe("submitAuthAction", () => {
  beforeEach(() => {
    createClientMock.mockResolvedValue({
      auth: {
        signInWithPassword: signInWithPasswordMock,
        signUp: signUpMock,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns inline errors when credentials are missing", async () => {
    const result = await submitAuthAction({ status: "idle" }, new FormData());

    expect(result).toEqual({
      status: "error",
      message: "Email and password are required.",
      fieldErrors: {
        email: "Email is required.",
        password: "Password is required.",
      },
    });
    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  it("returns inline auth failures for login", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: { message: "Invalid login credentials" } });

    const formData = new FormData();
    formData.set("email", "member@example.com");
    formData.set("password", "badpass");

    const result = await submitAuthAction({ status: "idle" }, formData);

    expect(result).toEqual({
      status: "error",
      message: "Invalid login credentials",
    });
  });

  it("signs up when signup intent is selected", async () => {
    signUpMock.mockResolvedValue({ error: null });

    const formData = new FormData();
    formData.set("email", "member@example.com");
    formData.set("password", "secret123");
    formData.set("role", "artisan");
    formData.set("intent", "signup");

    await submitAuthAction({ status: "idle" }, formData);

    expect(signUpMock).toHaveBeenCalledWith({
      email: "member@example.com",
      password: "secret123",
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/", "layout");
    expect(redirectMock).toHaveBeenCalledWith("/tavern");
  });
});
