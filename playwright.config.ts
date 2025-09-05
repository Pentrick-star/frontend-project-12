import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npx @hexlet/chat-server',
      port: 5001,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

