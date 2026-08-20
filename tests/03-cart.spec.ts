import { test, expect } from "@playwright/test";
import { signIn, openProduct, addToCartAndOpenCart, money } from "../lib/helpers";
import { CART_PRODUCTS } from "../lib/tuning";

test.describe("Cart arithmetic", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  for (let index = 0; index < CART_PRODUCTS; index++) {
    test(`product #${index + 1}: the cart line total equals unit price for a single item`, async ({
      page,
    }) => {
      const { name, price } = await openProduct(page, index);
      await addToCartAndOpenCart(page);

      const row = page.locator("tr", { hasText: name });
      await expect(row).toBeVisible();

      const lineTotal = money(await row.locator('[data-test="line-price"]').textContent());
      expect(lineTotal).toBeCloseTo(price, 2);

      const cartTotal = money(await page.locator('[data-test="cart-total"]').textContent());
      expect(cartTotal).toBeCloseTo(price, 2);
    });

    test(`product #${index + 1}: increasing quantity recalculates the line and cart totals`, async ({
      page,
    }) => {
      const { name, price } = await openProduct(page, index);
      await addToCartAndOpenCart(page);

      const row = page.locator("tr", { hasText: name });
      // The cart exposes a number input, not +/- buttons; the recalculation is
      // triggered on change, hence the Tab.
      const qty = row.getByTestId("product-quantity");
      await qty.fill("3");
      await qty.press("Tab");
      await page.waitForTimeout(5000);

      await expect(qty).toHaveValue("3");

      const lineTotal = money(await row.locator('[data-test="line-price"]').textContent());
      expect(lineTotal).toBeCloseTo(price * 3, 2);

      const cartTotal = money(await page.locator('[data-test="cart-total"]').textContent());
      expect(cartTotal).toBeCloseTo(price * 3, 2);
    });
  }
});
