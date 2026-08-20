import { test, expect } from "@playwright/test";
import { signIn } from "../lib/helpers";
import { ACCOUNT_PAGES } from "../lib/tuning";

/** Every authenticated route must render for a signed-in customer. */
test.describe("Account area", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  for (const accountPage of ACCOUNT_PAGES) {
    test(`${accountPage.path} is reachable and shows "${accountPage.heading}"`, async ({ page }) => {
      await page.goto(accountPage.path);
      await page.waitForTimeout(2500);

      await expect(page).toHaveURL(new RegExp(`${accountPage.path}$`));
      await expect(
        page.getByRole("heading", { name: accountPage.heading, exact: true }).first()
      ).toBeVisible();
    });
  }
});
