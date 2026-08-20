import { test, expect } from "@playwright/test";
import { signIn, inStockCards } from "../lib/helpers";
import { SEARCH_TERMS, NO_MATCH_TERM } from "../lib/tuning";

test.describe("Product search", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  for (const term of SEARCH_TERMS) {
    test(`search for "${term}" returns only matching products`, async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(3000);

      await page.getByTestId("search-query").fill(term);
      await page.getByTestId("search-submit").click();
      await page.waitForTimeout(4000);

      const cards = page.locator('a[data-test^="product-"]');
      const count = await cards.count();

      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const label = (await cards.nth(i).textContent())?.toLowerCase() ?? "";
        expect(label).toContain(term.toLowerCase());
      }
    });
  }

  test("a search with no matches shows no products", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(3000);

    await page.getByTestId("search-query").fill(NO_MATCH_TERM);
    await page.getByTestId("search-submit").click();
    await page.waitForTimeout(4000);

    await expect(page.locator('a[data-test^="product-"]')).toHaveCount(0);
  });
});
