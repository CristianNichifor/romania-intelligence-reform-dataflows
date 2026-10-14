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

test('the empty state clears the search and shows every category', async ({ page }) => {
  await page.goto(`${BASE}#/target`)
  await page.getByRole('searchbox', { name: 'Filter actors' }).fill('zzzz')
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.getByRole('searchbox', { name: 'Filter actors' })).toHaveValue('')
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Show all' })).toHaveCount(0)
  await expect(page.locator('.react-flow__node').first()).toBeVisible()
})

test('a wide screen can switch the graph to the list', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`${BASE}#/current`)
  await page.getByRole('button', { name: 'List' }).click()
  await expect(page.getByRole('list', { name: 'Flows' })).toBeVisible()
  await expect(page.locator('.react-flow')).toHaveCount(0)
})
