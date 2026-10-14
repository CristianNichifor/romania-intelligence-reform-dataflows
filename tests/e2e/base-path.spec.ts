import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'
const CANONICAL = `https://projects.cristian-nichifor.com${BASE}`
const html = () => readFileSync(new URL('../../dist/index.html', import.meta.url), 'utf8')

test('built index.html has no root-absolute href or src outside the base', () => {
  const refs = [...html().matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1])
  expect(refs.length).toBeGreaterThan(0)
  expect(refs.filter((ref) => ref.startsWith('/') && !ref.startsWith(BASE))).toEqual([])
})

test('built index.html carries canonical and open graph metadata', () => {
  const doc = html()
  const meta = (property: string) =>
    doc.match(new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]*)"`))?.[1]
  expect(doc).toContain(`<link rel="canonical" href="${CANONICAL}"`)
  expect(meta('og:url')).toBe(CANONICAL)
  expect(meta('og:image')).toBe(`${CANONICAL}og.png`)
  expect(meta('og:type')).toBe('website')
  expect(meta('og:title')).toBeTruthy()
  expect(meta('og:description')).toBeTruthy()
  expect(doc).toMatch(/<meta\s+name="twitter:card"\s+content="summary_large_image"/)
})

test('every request under the base answers 200 and none leaves the origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin
  const failed: string[] = []
  const foreign: string[] = []
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`)
  })
  page.on('requestfailed', (request) => failed.push(`failed ${request.url()}`))
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.protocol.startsWith('http') && url.origin !== origin) foreign.push(request.url())
  })
  await page.goto(BASE)
  for (const tab of await page.locator('.app-nav button').all()) {
    await tab.click()
  }
  await expect(page.locator('.gov-diagram-card svg')).toHaveCount(4)
  await page.waitForLoadState('networkidle')
  const favicon = await page.request.get(`${BASE}favicon.svg`)
  expect(favicon.status()).toBe(200)
  const og = await page.request.get(`${BASE}og.png`)
  expect(og.status()).toBe(200)
  expect(og.headers()['content-type']).toBe('image/png')
  expect(failed).toEqual([])
  expect(foreign).toEqual([])
})
