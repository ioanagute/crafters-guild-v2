import { describe, expect, it } from "vitest";
import { validateProductInput } from "@/features/marketplace/server/marketplace";

function buildProductFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
}

describe("validateProductInput", () => {
  it("accepts valid artisan listing input", () => {
    const result = validateProductInput(
      buildProductFormData({
        title: "Moonsteel Blade",
        description: "Folded under seven stars.",
        category: "Weaponry",
        price: "125",
        stock: "3",
        image_url: "https://example.com/blade.png",
      }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.category).toBe("Weaponry");
      expect(result.data.stock).toBe(3);
      expect(result.data.imageUrl).toBe("https://example.com/blade.png");
    }
  });

  it("returns field errors for invalid marketplace input", () => {
    const result = validateProductInput(
      buildProductFormData({
        title: "",
        description: "",
        category: "Invalid",
        price: "0",
        stock: "-1",
      }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        title: "Title is required.",
        description: "Description is required.",
        category: "Select a valid category.",
        price: "Price must be between 0.01 and 999999.99.",
        stock: "Stock must be a whole number between 0 and 999999.",
      });
    }
  });

  it("rejects invalid image URLs and oversized content", () => {
    const result = validateProductInput(
      buildProductFormData({
        title: "x".repeat(121),
        description: "y".repeat(2001),
        category: "Weaponry",
        price: "1000000",
        stock: "1000000",
        image_url: "http://example.com/blade.png",
      }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        title: "Title must be 120 characters or fewer.",
        description: "Description must be 2000 characters or fewer.",
        price: "Price must be between 0.01 and 999999.99.",
        stock: "Stock must be a whole number between 0 and 999999.",
        image_url: "Image URL must be a valid HTTPS address.",
      });
    }
  });
});
