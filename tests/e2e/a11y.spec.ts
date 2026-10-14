import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

function watchCsp(page: Page) {
  const violations: string[] = []
  page.on('console', (message) => {
    if (/Content Security Policy/i.test(message.text())) violations.push(message.text())
  })
  return violations
}

test('serves the page with the content security policy from public/_headers', async ({ page }) => {
  const response = await page.goto(BASE)
  expect(response?.headers()['content-security-policy']).toContain("default-src 'self'")
  expect(response?.headers()['x-content-type-options']).toBe('nosniff')
})

test('the main navigation is a tab list bound to its panel', async ({ page }) => {
  await page.goto(BASE)
  const tabs = page.getByRole('tablist').getByRole('tab')
  await expect(tabs).toHaveCount(9)
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  const target = page.getByRole('tab', { name: /Target State$/ })
  await target.click()
  await expect(target).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'false')
  await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', (await target.getAttribute('id'))!)
  await target.press('ArrowRight')
  await expect(page.getByRole('tab', { name: /Handshake T3–T6$/ })).toBeFocused()
  await expect(page.getByRole('tab', { name: /Handshake T3–T6$/ })).toHaveAttribute('aria-selected', 'true')
})

test('graph controls have accessible names and states', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await expect(page.getByRole('searchbox', { name: /search/i })).toBeVisible()
  const legend = page.getByRole('button', { name: /Legend/ })
  await expect(legend).toHaveAttribute('aria-expanded', 'false')
  await legend.click()
  await expect(legend).toHaveAttribute('aria-expanded', 'true')
  const labels = page.getByRole('button', { name: /labels/i })
  await expect(labels).toHaveAttribute('aria-pressed', 'true')
  await labels.click()
  await expect(labels).toHaveAttribute('aria-pressed', 'false')
})

for (const view of ['overview', 'current', 'target', 'handshake', 'redteam', 'dashboard', 'ledger', 'compare', 'governance']) {
  test(`${view} has no axe violations and no CSP violations`, async ({ page }) => {
    const csp = watchCsp(page)
    await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
    await page.goto(`${BASE}#/${view}`)
    await expect(page.getByRole('tabpanel')).toBeVisible()
    if (view === 'governance') await expect(page.locator('.gov-diagram-card svg')).toHaveCount(4)
    if (view === 'current' || view === 'target') await expect(page.locator('.react-flow__node').first()).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    expect(csp).toEqual([])
  })
}
