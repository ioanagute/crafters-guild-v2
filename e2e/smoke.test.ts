import { test, expect } from "@playwright/test";

test("landing page smoke test", async ({ page }) => {
  await page.goto("/");

  // Verify the title
  await expect(page).toHaveTitle(/The Artisans' Guild/);

  // Verify main heading
  const heading = page.getByRole("heading", { name: /Welcome to the Guild/i });
  await expect(heading).toBeVisible();

  // Verify navigation items exist
  await expect(page.getByRole("link", { name: /Marketplace/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Guilds/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /The Tavern/i })).toBeVisible();
});

test("navigation check", async ({ page }) => {
  await page.goto("/");

  // Navigate to Marketplace
  await page.getByRole("link", { name: /Marketplace/i }).click();
  await expect(page).toHaveURL(/\/marketplace/);
  await expect(
    page.getByRole("heading", { name: /The Grand Bazaar/i }),
  ).toBeVisible();

  // Navigate to Guilds
  await page.getByRole("link", { name: /Guilds/i }).click();
  await expect(page).toHaveURL(/\/guilds/);
  await expect(
    page.getByRole("heading", { name: /The Great Houses/i }),
  ).toBeVisible();
});
