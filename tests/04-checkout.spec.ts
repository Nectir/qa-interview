import { test, expect, Page } from "@playwright/test";
import { signIn, openFirstProduct, addToCartAndOpenCart, money } from "../lib/helpers";
import { SHIPPING_ADDRESS } from "../lib/tuning";

async function reachPaymentStep(page: Page) {
  await page.locator('[data-test="proceed-1"]').click();
  await page.waitForTimeout(2500);
  await page.locator('[data-test="proceed-2"]').click();
  await page.waitForTimeout(2500);

  await page.locator('[data-test="street"]').fill(SHIPPING_ADDRESS.street);
  await page.locator('[data-test="city"]').fill(SHIPPING_ADDRESS.city);
  await page.locator('[data-test="state"]').fill(SHIPPING_ADDRESS.state);
  await page.locator('[data-test="postal_code"]').fill(SHIPPING_ADDRESS.postal_code);
  await page.locator('[data-test="house_number"]').fill(SHIPPING_ADDRESS.house_number);
  await page.locator('[data-test="country"]').selectOption({ label: SHIPPING_ADDRESS.country });
  await page.locator('[data-test="proceed-3"]').click();
  await page.waitForTimeout(3000);
}

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("a customer can complete a purchase and the total is preserved", async ({ page }) => {
    const { price } = await openFirstProduct(page);
    await addToCartAndOpenCart(page);

    const cartTotal = money(await page.locator('[data-test="cart-total"]').textContent());
    expect(cartTotal).toBeCloseTo(price, 2);

    await reachPaymentStep(page);

    // The amount charged must match the cart total shown before checkout started.
    const payable = money(await page.locator('[data-test="cart-total"]').textContent());
    expect(payable).toBeCloseTo(cartTotal, 2);

    await page.locator('[data-test="payment-method"]').selectOption("Cash on Delivery");
    await page.waitForTimeout(1500);
    await page.locator('[data-test="finish"]').click();
    await page.waitForTimeout(4000);

    await expect(
      page.locator("div").filter({ hasText: /^Payment was successful$/ }).first()
    ).toBeVisible();
  });

  /**
   * Stops short of `finish` on purpose: the test above is the only one that
   * places a real order on a shared public demo, and one per run is enough.
   */
  test("the total survives every checkout step for a multi-quantity cart", async ({ page }) => {
    const { name, price } = await openFirstProduct(page);
    await addToCartAndOpenCart(page);

    const row = page.locator("tr", { hasText: name });
    const qty = row.getByTestId("product-quantity");
    await qty.fill("2");
    await qty.press("Tab");
    await page.waitForTimeout(5000);

    const cartTotal = money(await page.locator('[data-test="cart-total"]').textContent());
    expect(cartTotal).toBeCloseTo(price * 2, 2);

    await reachPaymentStep(page);

    const payable = money(await page.locator('[data-test="cart-total"]').textContent());
    expect(payable).toBeCloseTo(cartTotal, 2);
    await expect(page.locator('[data-test="payment-method"]')).toBeVisible();
  });
});
