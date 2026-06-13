import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

function resolveBaseURL(): string {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const env = (process.env.TTA_ENV || 'qa').toLowerCase();
  switch (env) {
   case 'api':
      return process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
    case 'dev':
    case 'local':
      return process.env.DEV_BASE_URL || 'http://localhost:3000';
    case 'stg':
    case 'stage':
    case 'staging':
      return process.env.STG_BASE_URL || 'https://stage.thetestingacademy.com';
    case 'prod':
    case 'production':
      return process.env.PROD_BASE_URL || 'https://app.thetestingacademy.com';
    case 'qa':
    default:
      return process.env.QA_BASE_URL || 'https://app.thetestingacademy.com';
  }
}


export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],
  
  use: {
    baseURL: resolveBaseURL(),
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }
  ],

});
