import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.use({ viewport: { width: 390, height: 844 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('the tab row says there are more tabs and keeps the open tab in view', async ({ page }) => {
  await page.goto(`${BASE}#/overview`)
  const wrap = page.locator('.nav-wrap')
  await expect(wrap).toHaveAttribute('data-more-end', 'true')
  await expect(wrap).not.toHaveAttribute('data-more-start', /.*/)
  await page.goto(`${BASE}#/governance`)
  await page.reload()
  const tab = await page.getByRole('tab', { name: /Governance/ }).boundingBox()
  expect(tab!.x + tab!.width).toBeLessThanOrEqual(390)
  await expect(wrap).toHaveAttribute('data-more-start', 'true')
})

test('a ledger wider than the screen says so and can be scrolled from the keyboard', async ({ page }) => {
  await page.goto(`${BASE}#/ledger`)
  const region = page.getByRole('region', { name: 'Ledger entries' })
  await expect(region).toBeVisible()
  await expect(page.getByText('Scroll sideways for more columns')).toBeVisible()
  await region.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.scroll-wrap')).toHaveAttribute('data-more-start', 'true')
})

test('comparison and access tables stack on a phone, each cell named by its column', async ({ page }) => {
  await page.goto(`${BASE}#/compare`)
  await expect(page.getByText('Scroll sideways for more columns')).toHaveCount(0)
  const cell = page.locator('table.stack td[data-label]').first()
  await expect(cell).toHaveAttribute('data-label', 'Today')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
})

test('the step controls stay on screen while the walkthrough moves down the list', async ({ page }) => {
  await page.goto(`${BASE}#/handshake`)
  const next = page.getByRole('button', { name: 'Next step' })
  for (let step = 0; step < 9; step++) await next.click()
  await expect(next).toBeInViewport()
  await expect(page.locator('.timeline li.current')).toBeInViewport()
  await page.getByRole('button', { name: /Show artifact/ }).click()
  await expect(page.locator('.artifact-panel')).toBeFocused()
  await next.click()
  await next.click()
  await expect(page.getByRole('status').filter({ hasText: 'Handshake complete' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Open the audit ledger/ })).toHaveAttribute('href', '#/ledger')
  await expect(page.getByRole('button', { name: 'Run again' })).toBeVisible()
})

for (const view of ['handshake', 'redteam', 'dashboard', 'ledger', 'compare', 'governance']) {
  test(`the ${view} tab has no axe violations at 390 px`, async ({ page }) => {
    await page.goto(`${BASE}#/${view}`)
    await page.waitForTimeout(view === 'governance' ? 2500 : 300)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations.map((violation) => violation.id)).toEqual([])
  })
}
