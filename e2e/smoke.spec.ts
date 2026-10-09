import { test, expect } from "@playwright/test";

test("home shows categories and products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /sodo technika/i }).first()).toBeVisible();
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(4);
});

test("category lists products and filters by stock", async ({ page }) => {
  await page.goto("/c/sodo-technika");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
  await page.goto("/c/sodo-technika?stock=1&sort=price-asc");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
  await page.goto("/c/does-not-exist");
  await expect(page.getByText("404")).toBeVisible();
});

test("product add to cart updates header and cart page", async ({ page }) => {
  await page.goto("/c/sodo-technika");
  await page.locator("a[href^='/p/']").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("€").first()).toBeVisible();
  await page.getByRole("button", { name: /į krepšelį/i }).first().click();
  await expect(page.getByTestId("cart-count")).toHaveText("1");
  await page.goto("/cart");
  await expect(page.getByTestId("cart-row")).toHaveCount(1);
  await expect(page.getByTestId("cart-total")).not.toHaveText(/0,00/);
});

test("search by word", async ({ page }) => {
  await page.goto("/search?q=makita");
  expect(await page.locator("a[href^='/p/']").count()).toBeGreaterThan(0);
  await page.goto("/search?q=zzzzqqqq");
  await expect(page.getByText("Nieko nerasta")).toBeVisible();
});
