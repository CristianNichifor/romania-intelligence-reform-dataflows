import { expect, test } from '@playwright/test'

test('html lang follows the stored language on first load', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.goto('/romania-intelligence-reform-dataflows/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro')
})

test('html lang follows the language toggle', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.goto('/romania-intelligence-reform-dataflows/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'RO', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})
