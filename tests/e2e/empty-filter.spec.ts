import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('a filter with no matches says so on the graph', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await page.getByRole('searchbox', { name: 'Filter actors' }).fill('zzzz')
  await expect(page.getByRole('status')).toContainText('No actors match')
  await page.getByRole('searchbox', { name: 'Filter actors' }).fill('')
  await expect(page.getByRole('status')).toHaveCount(0)
})

test('a filter with no matches says so on the phone list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.goto(`${BASE}#/target`)
  await page.getByRole('searchbox', { name: 'Filter actors' }).fill('zzzz')
  await expect(page.getByRole('status')).toContainText('No actors match')
  await expect(page.getByRole('list', { name: 'Flows' })).toHaveCount(0)
})
