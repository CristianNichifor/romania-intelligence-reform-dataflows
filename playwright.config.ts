import { defineConfig } from '@playwright/test'
// PW_PORT lets parallel checkouts run e2e side by side.
const PORT = process.env.PW_PORT ?? '4176'
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: `http://127.0.0.1:${PORT}`, browserName: 'chromium' },
  webServer: { command: `npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`, url: `http://127.0.0.1:${PORT}` },
})
