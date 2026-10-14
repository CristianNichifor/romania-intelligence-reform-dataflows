import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test('a diagram that fails to render says so in the app language and offers a retry', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.route('**/assets/flowDiagram-*.js', (route) => route.abort())
  await page.goto(`${BASE}#/governance`)
  const alert = page.locator('.gov-diagram-card [role="alert"]').first()
  await expect(alert).toContainText('Diagrama nu a putut fi redată')
  await expect(alert.getByRole('button', { name: 'Reîncercați' })).toBeVisible()
  await expect(page.locator('.gov-diagram-card').first().locator('.gov-diagram-title')).not.toBeEmpty()
})

test('rendered diagrams leave no loading status and label their controls in Romanian', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.goto(`${BASE}#/governance`)
  const card = page.locator('.gov-diagram-card').first()
  await expect(card.locator('.mermaid-svg-host svg')).toBeVisible()
  await expect(card.getByRole('status')).toHaveCount(0)
  await expect(card.getByRole('button', { name: 'Mărește' })).toBeVisible()
  await expect(card.getByRole('button', { name: 'Micșorează' })).toBeVisible()
  await expect(card.getByRole('button', { name: 'Resetează vederea' })).toBeVisible()
})
