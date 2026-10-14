import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('the target graph opens on agencies and the broker, readable, without the minimap', async ({ page }) => {
  await page.goto(`${BASE}#/target`)
  await expect(page.locator('.react-flow__node').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Agencies' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Broker' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Oversight' })).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.react-flow__node')).toHaveCount(4)
  await expect(page.locator('.react-flow__minimap')).toHaveCount(0)
  await expect(page.locator('.react-flow__attribution')).toHaveCount(0)
  const zoom = await page.locator('.react-flow__viewport').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)
  expect(zoom).toBeGreaterThanOrEqual(0.6)
  await page.getByRole('button', { name: 'Show all' }).click()
  await expect(page.locator('.react-flow__node')).toHaveCount(15)
})

test('the legend starts open and line style encodes the audit trail', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await expect(page.getByRole('button', { name: /Legend/ })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.legend-items')).toContainText('dotted')
  // Each line style names the flows it covers, so the legend can be checked against the list.
  await expect(page.locator('.legend-items')).toContainText('C13')
  const dash = (id: string) =>
    page.locator(`.react-flow__edge[data-id="current:${id}"] path.react-flow__edge-path`).evaluate((el) => getComputedStyle(el).strokeDasharray)
  expect(await dash('C4')).toBe('none')
  expect(await dash('C1')).not.toBe('none')
  expect(await dash('C3')).not.toBe('none')
  expect(await dash('C3')).not.toBe(await dash('C1'))
})

test('the overview links the docs folder', async ({ page }) => {
  await page.goto(BASE)
  await expect(page.getByRole('link', { name: 'docs/' })).toHaveAttribute(
    'href',
    'https://github.com/CristianNichifor/romania-intelligence-reform-dataflows/tree/main/docs',
  )
})

test('the footer scrolls with the page on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.goto(BASE)
  const footer = page.getByRole('contentinfo')
  const box = await footer.boundingBox()
  expect(box!.y).toBeGreaterThan(760)
})

test('the legend shows each category glyph next to its colour', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const glyphs = page.locator('.legend-items .legend-glyph')
  await expect(glyphs.first()).toHaveText('◆')
  expect(await glyphs.count()).toBeGreaterThanOrEqual(4)
})

test('the target legend explains edge colours with their flow ids', async ({ page }) => {
  await page.goto(`${BASE}#/target`)
  const legend = page.locator('.legend-items')
  await expect(legend).toContainText('Executive')
  await expect(legend).toContainText('W1, W2')
  await expect(legend).toContainText('T3')
})

test('the target view says it starts with a subset and how many actors are hidden', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(`${BASE}#/target`)
  const hint = page.locator('.explorer-hint')
  await expect(hint).toContainText('opens with only the agencies and the broker')
  await expect(hint).toContainText(/\d+ actors are hidden/)
  await page.getByRole('button', { name: 'Show all' }).click()
  await expect(hint).toHaveCount(0)
  await page.goto(`${BASE}#/current`)
  await expect(page.locator('.explorer-hint')).toHaveCount(0)
})
