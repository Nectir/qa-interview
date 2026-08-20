import { test, expect } from "@playwright/test";

/**
 * Field-level validation on the contact form.
 * Each permutation is exercised through the browser.
 */
const cases = [
  { field: "first-name", label: "First name", value: "" },
  { field: "last-name", label: "Last name", value: "" },
  { field: "email", label: "Email", value: "" },
  { field: "email", label: "Email", value: "not-an-email" },
  { field: "subject", label: "Subject", value: "" },
  { field: "message", label: "Message", value: "" },
  { field: "message", label: "Message", value: "too short" },
];

const VALID_MESSAGE = "This is a long enough message to pass the minimum length rule.";

test.describe("Contact form validation", () => {
  // Deliberately anonymous: when signed in the app drops the name/email
  // fields and pre-fills them from the session, so those cases cannot run.

  for (const c of cases) {
    test(`rejects ${c.field} = "${c.value || "(empty)"}"`, async ({ page }) => {
      await page.goto("/contact");
      await page.waitForTimeout(2500);

      // Every field gets a valid value except the one under test, which gets
      // the invalid one. "subject" is a select whose empty option is disabled,
      // so an empty subject means leaving it untouched.
      await page.getByTestId("first-name").fill(c.field === "first-name" ? c.value : "Jane");
      await page.getByTestId("last-name").fill(c.field === "last-name" ? c.value : "Doe");
      await page.getByTestId("email").fill(c.field === "email" ? c.value : "jane@example.com");
      if (c.field !== "subject") {
        await page.getByTestId("subject").selectOption({ index: 1 });
      }
      await page.getByTestId("message").fill(c.field === "message" ? c.value : VALID_MESSAGE);

      await page.waitForTimeout(1500);
      await page.getByTestId("contact-submit").click();
      await page.waitForTimeout(3000);

      await expect(page.locator(".alert, .invalid-feedback").first()).toBeVisible();
      await expect(page.getByText("Thanks for your message")).toHaveCount(0);
    });
  }
});
