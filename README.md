# Nectir — QA Engineer Interview

This repository contains a small end-to-end test suite built with [Playwright](https://playwright.dev/). It runs against [practicesoftwaretesting.com](https://practicesoftwaretesting.com), a public demo e-commerce store. The store is not a Nectir product.

## What is in the repo

- `tests/` — seven spec files. They cover sign-in, search, cart, checkout, contact-form validation, sorting, and the account area.
- `lib/helpers.ts` — shared page actions.
- `lib/tuning.ts` — shared test data.
- `playwright.config.ts` — Playwright configuration.

## Setup

You need Node.js 18 or newer.

```bash
nvm use
npm install
npx playwright install chromium
cp .env.example .env
npm test
```

A full run takes about 9 minutes. This is normal.

`npm run test:report` opens the HTML report for the last run.

The tests use a shared demo account. These are public credentials, published by the demo app's maintainers:

`customer@practicesoftwaretesting.com` / `welcome01`

The demo app also has a public REST API at [api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com), with Swagger docs at that URL.

## Troubleshooting

**All tests time out, and `test-results/**/error-context.md` shows a Cloudflare "security verification" page or "Just a moment..." instead of the store.**

The demo store sits behind Cloudflare bot protection. On some networks, Cloudflare challenges Playwright's headless browser and never serves the app. This is a block on your network, not a defect in the suite or in your setup.

Try these steps, in order:

1. Run one spec headed: `npx playwright test tests/01-auth.spec.ts --headed`. Headed runs usually pass the challenge.
2. Add `CLOUDFLARE_WORKAROUND=1` to your `.env` and run `npm test` again. This makes the headless browser present itself as regular Chrome.
3. Try a different network, for example a phone hotspot.
4. If it still fails, contact us before the meeting. A Cloudflare block will not count against you.

## Before the interview

Please come to the interview with:

1. **The repo running locally.** Complete the setup above and do at least one full `npm test` run before the meeting.
2. **Your normal development environment ready.** You will share your screen, and we will read and change code in this repo together. Use the editor and tools you use every day — AI assistants included.
3. **Some familiarity with the suite.** Read through the tests and be ready to talk about how the suite works.

There is nothing to submit ahead of time.

If setup fails or the suite will not run on your machine, contact us before the meeting so we can help.
