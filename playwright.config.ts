import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { authStatePath, saucedemoUrl } from './config/saucedemo';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'fixtures/**/*.ts'],
  matchKeywords: true,
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // shortcut: cap public SauceDemo traffic at 2 workers; increase after full runs stay stable.
  workers: 2,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: saucedemoUrl,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-signed-out',
      testMatch: '**/login.feature.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: '**/login.feature.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: authStatePath },
    },
    {
      name: 'firefox-signed-out',
      testMatch: '**/login.feature.spec.js',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/login.feature.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], storageState: authStatePath },
    },
  ],
});
