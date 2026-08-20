import { test, expect } from "@playwright/test";
import { signIn, money } from "../lib/helpers";
import { SORT_CASES } from "../lib/tuning";

test.describe("Catalogue sorting", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  for (const sortCase of SORT_CASES) {
    test(`sorts by ${sortCase.label}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(3000);

      await page.getByTestId("sort").selectOption(sortCase.value);
      await page.waitForTimeout(3500);

      const cards = page.locator('a[data-test^="product-"]');
      await expect(cards.first()).toBeVisible();

      const values =
        sortCase.by === "name"
          ? (await cards.locator('[data-test="product-name"]').allTextContents()).map((t) =>
              t.trim().toLowerCase()
            )
          : (await cards.locator('[data-test="product-price"]').allTextContents()).map(money);

      expect(values.length).toBeGreaterThan(1);

      const sorted = [...values].sort((a: any, b: any) =>
        typeof a === "number" ? a - b : String(a).localeCompare(String(b))
      );
      if (sortCase.direction === "desc") sorted.reverse();

      expect(values).toEqual(sorted);
    });
  }
});
