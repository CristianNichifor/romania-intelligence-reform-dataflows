import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { parseHeaders } from './src/lib/headers.ts'

// The preview server applies the same headers as Cloudflare Pages, so the e2e
// suite runs under the production content security policy.
const headers = parseHeaders(readFileSync(new URL('./public/_headers', import.meta.url), 'utf8')).find(
  (rule) => rule.path === '/*',
)?.headers

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/romania-intelligence-reform-dataflows/',
  preview: { headers },
})
