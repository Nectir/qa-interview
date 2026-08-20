import { Page, expect } from "@playwright/test";
import { config } from "../playwright.config";

export async function signIn(page: Page) {
  await page.goto("/auth/login");
  await page.waitForTimeout(1500);
  await page.getByTestId("email").fill(config.email);
  await page.getByTestId("password").fill(config.password);
  await page.getByTestId("login-submit").click();
  await page.waitForTimeout(3000);
  await expect(page.getByTestId("nav-menu")).toBeVisible();
}

/** Parses "$12.34" / "12,34" into a number. */
export function money(raw: string | null): number {
  if (!raw) return NaN;
  const cleaned = raw.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return Number.parseFloat(cleaned);
}

export function inStockCards(page: Page) {
  return page
    .locator('a[data-test^="product-"]')
    .filter({ hasNot: page.locator('[data-test="out-of-stock"]') });
}

export async function openProduct(
  page: Page,
  index = 0
): Promise<{ name: string; price: number }> {
  await page.goto("/");
  await page.waitForTimeout(3000);
  await page.getByTestId("sort").selectOption("name,asc");
  await page.waitForTimeout(2500);

  const card = inStockCards(page).nth(index);
  await expect(card).toBeVisible();
  await card.click();
  await page.waitForTimeout(2500);

  const name = (await page.getByTestId("product-name").textContent())?.trim() ?? "";
  const price = money(await page.getByTestId("unit-price").textContent());
  return { name, price };
}

export function openFirstProduct(page: Page) {
  return openProduct(page, 0);
}

export async function addToCartAndOpenCart(page: Page) {
  await page.getByTestId("add-to-cart").click();
  await page.waitForTimeout(3000);
  await page.getByTestId("nav-cart").click();
  await page.waitForTimeout(3000);
}
