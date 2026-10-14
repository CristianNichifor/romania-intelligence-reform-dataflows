import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test('the flow detail panel lists its sources', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C6"] .react-flow__edge-textwrapper').dispatchEvent('click')
  const panel = page.locator('.detail-panel')
  await expect(panel.getByRole('heading', { name: 'Flow C6' })).toBeVisible()
  const sources = panel.getByRole('list', { name: 'Sources' }).getByRole('link')
  await expect(sources.first()).toHaveAttribute('href', /^https:\/\/legislatie\.just\.ro\//)
  await expect(panel).toContainText(/Sources checked \d{4}-\d{2}-\d{2}/)
  await expect(panel.locator('.source-meta').first()).toHaveText(/^legislatie\.just\.ro · \d{4}-\d{2}-\d{2}$/)
})

test('a flow without a verified source says so', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C10"] .react-flow__edge-textwrapper').dispatchEvent('click')
  await expect(page.locator('.detail-panel')).toContainText('No verified source yet')
})

test('the footer links to the corrections log', async ({ page }) => {
  await page.goto(BASE)
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /corrections/i })).toHaveAttribute(
    'href',
    'https://github.com/CristianNichifor/romania-intelligence-reform-dataflows/blob/main/ERRATA.md',
  )
})

test('a flow without a verified source shows a status block linking the errata', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C10"] .react-flow__edge-textwrapper').dispatchEvent('click')
  const block = page.locator('.detail-panel .detail-status[role="status"]')
  await expect(block).toContainText('No verified source yet')
  await expect(block.getByRole('link')).toHaveAttribute('href', /ERRATA\.md$/)
})

test('only target flows carry the proposal note', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/target`)
  await page.getByRole('button', { name: 'Show all' }).click()
  await page.locator('.react-flow__edge[data-id="target:W1"] .react-flow__edge-textwrapper').dispatchEvent('click')
  await expect(page.locator('.detail-panel .detail-note')).toContainText('Target-state flows are a proposal')
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C6"] .react-flow__edge-textwrapper').dispatchEvent('click')
  await expect(page.locator('.detail-panel')).toContainText('Flow C6')
  await expect(page.locator('.detail-panel .detail-note')).toHaveCount(0)
})

test('selecting a flow fades the other edges', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C6"] .react-flow__edge-textwrapper').dispatchEvent('click')
  await expect(page.locator('.react-flow__edge[data-id="current:C6"]')).not.toHaveClass(/faded/)
  await expect(page.locator('.react-flow__edge[data-id="current:C1"]')).toHaveClass(/faded/)
})

test('the flow detail opens with its route and category glyphs', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/current`)
  await page.locator('.react-flow__edge[data-id="current:C6"] .react-flow__edge-textwrapper').dispatchEvent('click')
  const route = page.locator('.detail-panel .detail-route')
  await expect(route).toBeVisible()
  await expect(route.locator('.route-glyph')).toHaveCount(2)
  await expect(route).toContainText('→')
  await expect(route.locator('.sr-only')).toHaveText(/^\s*to\s*$/)
})
