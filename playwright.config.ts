import { defineConfig } from '@playwright/test';
import path from 'node:path';

const reportDirectory = process.env.EMP_TEST_REPORT_DIR || 'qa';

// Start the deployment build separately. Tests never launch a second server.
export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: path.join(reportDirectory, 'playwright-artifacts'),
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(reportDirectory, 'playwright-results.json') }],
    ['html', { outputFolder: path.join(reportDirectory, 'playwright-report'), open: 'never' }],
  ],
  use: {
    baseURL: process.env.EMP_TEST_BASE_URL || 'http://127.0.0.1:3102',
    channel: process.env.EMP_TEST_BROWSER || 'msedge',
    headless: true,
    locale: 'en-US',
    timezoneId: 'Asia/Hong_Kong',
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
