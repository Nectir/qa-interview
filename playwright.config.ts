import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? "https://practicesoftwaretesting.com",
  apiURL: process.env.API_URL ?? "https://api.practicesoftwaretesting.com",
  email: process.env.CUSTOMER_EMAIL ?? "customer@practicesoftwaretesting.com",
  password: process.env.CUSTOMER_PASSWORD ?? "welcome01",
};

const SECONDS = 1000;

// Opt-in for networks where Cloudflare challenges headless runs. See "Troubleshooting" in the README.
// The Chrome major version below must match the bundled Chromium's major version.
const cloudflareWorkaround = process.env.CLOUDFLARE_WORKAROUND === "1";

const uaPlatform =
  process.platform === "darwin"
    ? "Macintosh; Intel Mac OS X 10_15_7"
    : process.platform === "win32"
      ? "Windows NT 10.0; Win64; x64"
      : "X11; Linux x86_64";

const chPlatform =
  process.platform === "darwin" ? "macOS" : process.platform === "win32" ? "Windows" : "Linux";

export default defineConfig({
  testDir: "./tests",
  timeout: 90 * SECONDS,
  fullyParallel: false,
  workers: 1,
  retries: 2,
  expect: { timeout: 10 * SECONDS },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    testIdAttribute: "data-test",
    baseURL: config.baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 20 * SECONDS,
    ...(cloudflareWorkaround && {
      userAgent: `Mozilla/5.0 (${uaPlatform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36`,
      extraHTTPHeaders: {
        "sec-ch-ua": '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"${chPlatform}"`,
      },
      launchOptions: { args: ["--disable-blink-features=AutomationControlled"] },
    }),
  },
  projects: [
    {
      name: "chromium",
      // "channel: chromium" uses the full Chromium binary, not the headless shell.
      use: { browserName: "chromium", ...(cloudflareWorkaround && { channel: "chromium" as const }) },
    },
  ],
});
