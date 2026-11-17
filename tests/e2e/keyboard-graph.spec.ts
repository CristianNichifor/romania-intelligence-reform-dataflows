import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('Enter on a focused flow opens its details, Escape returns focus to the flow', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const edge = page.getByRole('group', { name: /Flow graph/ }).locator('.react-flow__edge').first()
  await expect(edge).toHaveAttribute('aria-label', /^Flow C\w+: .+ to .+/)
  await edge.focus()
  await page.keyboard.press('Enter')
  const panel = page.locator('.detail-panel')
  await expect(panel).toBeVisible()
  await expect(panel).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(edge).toBeFocused()
})

test('Space on a focused actor opens the actor details', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const node = page.locator('.react-flow__node').filter({ hasText: 'SRI' }).first()
  await expect(node).toHaveAttribute('aria-label', /^Actor SRI: /)
  await node.focus()
  await page.keyboard.press(' ')
  await expect(page.locator('.detail-panel h3')).toHaveText('SRI')
})

test('on a phone the graph keeps its filters and legend off the canvas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}#/current`)
  await page.getByRole('button', { name: 'Graph' }).click()
  const canvas = await page.locator('.explorer-canvas').boundingBox()
  const toolbar = await page.locator('.explorer-toolbar').boundingBox()
  const legend = await page.locator('.legend').boundingBox()
  expect(toolbar!.y + toolbar!.height).toBeLessThanOrEqual(canvas!.y)
  expect(legend!.y).toBeGreaterThanOrEqual(canvas!.y + canvas!.height)
})
