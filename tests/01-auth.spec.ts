import { test, expect } from "@playwright/test";
import { signIn } from "../lib/helpers";
import { CUSTOMER_DISPLAY_NAME } from "../lib/tuning";

test.describe("Authentication", () => {
  test("a customer can sign in and reach their account", async ({ page }) => {
    await signIn(page);

    await page.goto("/account");
    await page.waitForTimeout(3000);

    await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText(CUSTOMER_DISPLAY_NAME);
  });

  test("signing out clears the session", async ({ page }) => {
    await signIn(page);

    await page.getByTestId("nav-menu").click();
    await page.waitForTimeout(1500);
    await page.getByTestId("nav-sign-out").click();
    await page.waitForTimeout(3000);

    await expect(page.getByTestId("nav-sign-in")).toBeVisible();

    // The account page must not be reachable once signed out.
    await page.goto("/account");
    await page.waitForTimeout(2500);
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
