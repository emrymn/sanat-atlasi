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
    viewport: { width: 390, height: 844 },
    baseURL: `http://localhost:${PORT}/sanat-atlasi/`,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    trace: 'retain-on-failure',
  },
  projects: [
    // Varsayılan: bütün uçtan uca testler (npm run test:e2e)
    { name: 'chromium', use: { browserName: 'chromium' } },
    // T3: gerçek Safari motoru. Mac'te `npx playwright install webkit`, sonra `npm run test:webkit`.
    // Yalnızca iPhone'a özgü davranışı sınayan testler (scroll() / view() zaman çizgileri, taşma); service worker
    // ve ağ fikstürü ayrıntıları WebKit'te farklı olduğundan bütün takım orada çalıştırılmaz.
    { name: 'webkit', use: { browserName: 'webkit' }, testMatch: /safari\.spec\.js$/ },
  ],
  webServer: {
    command: `node scripts/sunucu.mjs ${PORT}`,
    url: `http://localhost:${PORT}/sanat-atlasi/`,
    reuseExistingServer: true,
  },
});
