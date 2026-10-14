import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test('the first screen names the tool, its purpose and its data (ro)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.goto(BASE)
  await expect(page.getByRole('navigation', { name: 'Familia de proiecte civice' })).toContainText('Fluxuri de date')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fluxuri de date pentru reforma serviciilor de informații')
  await expect(page.locator('.header-purpose')).toHaveText(/^Cine trimite ce date, cui, astăzi/)
  await expect(page.locator('.app-title .header-meta')).toContainText('Date:')
})

test('the stat tiles name their scope and count from the data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto(BASE)
  const stats = page.locator('.stat-row .stat')
  await expect(stats).toHaveText([
    /^13\s*actors, current state$/,
    /^14\s*flows, current state$/,
    /^15\s*actors, target state$/,
    /^33\s*flows, target state$/,
    /^6\s*current flows with a very low or no audit trail$/,
  ])
})

test('the overview offers the suggested route as three links', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.goto(BASE)
  const route = page.getByRole('navigation', { name: 'Traseu sugerat' })
  await expect(route.getByRole('link')).toHaveText([/Starea actuală/, /Starea țintă/, /Handshake T3–T6/])
  await route.getByRole('link', { name: /Starea țintă/ }).click()
  await expect(page).toHaveURL(/#\/target$/)
  await expect(page.getByRole('tab', { name: /Starea țintă/ })).toHaveAttribute('aria-selected', 'true')
})
