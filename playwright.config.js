import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4189', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['iPhone SE'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'node server/index.mjs',
    url: 'http://127.0.0.1:4189/health',
    reuseExistingServer: false,
    timeout: 15000,
    env: {
      NODE_ENV: 'test',
      PORT: '4189',
      HOST: '127.0.0.1',
      PUBLIC_ORIGIN: 'http://127.0.0.1:4189',
      CONTACT_EMAIL: 'operator@example.test',
      BUSINESS_NAME: 'AutoFlow Test',
      LEADS_DB_PATH: 'test-results/browser-leads.sqlite',
    },
  },
});
