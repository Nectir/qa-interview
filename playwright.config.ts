import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL,
  apiURL: process.env.API_URL,
  email: process.env.CUSTOMER_EMAIL ?? "",
  password: process.env.CUSTOMER_PASSWORD ?? "",
};

const SECONDS = 1000;

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
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
