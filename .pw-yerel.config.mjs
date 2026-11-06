import base from '/home/user/sanat-atlasi/playwright.config.js';
export default { ...base, testDir: '/home/user/sanat-atlasi/tests/e2e', use: { ...base.use, launchOptions: { executablePath: '/opt/pw-browsers/chromium' } }, projects: [base.projects[0]] };
