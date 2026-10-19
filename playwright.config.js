import { defineConfig, devices } from '@playwright/test';

// Service worker'ın yaptığı istekler de context.route ile fikstürlere yönlensin (Chromium)
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1';

const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['iPhone 13'],
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    baseURL: `http://localhost:${PORT}/sanat-atlasi/`,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/sunucu.mjs ${PORT}`,
    url: `http://localhost:${PORT}/sanat-atlasi/`,
    reuseExistingServer: true,
  },
});
