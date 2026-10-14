import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
  await page.emulateMedia({ forcedColors: 'active' })
})

test('high contrast keeps node borders, edges and the active tab visible', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await expect(page.locator('.react-flow__node').first()).toBeVisible()
  expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true)

  const node = page.locator('.actor-node').first()
  expect(await node.evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe('solid')
  expect(await node.evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth))).toBeGreaterThanOrEqual(2)

  // Line style still carries the audit trail when colour is gone.
  const dash = (id: string) =>
    page.locator(`.react-flow__edge[data-id="current:${id}"] path.react-flow__edge-path`).evaluate((el) => getComputedStyle(el).strokeDasharray)
  expect(await dash('C4')).toBe('none')
  expect(await dash('C1')).not.toBe('none')

  const active = page.getByRole('tab', { selected: true })
  expect(await active.evaluate((el) => getComputedStyle(el).borderBottomStyle)).toBe('solid')
  expect(await active.evaluate((el) => parseFloat(getComputedStyle(el).borderBottomWidth))).toBeGreaterThanOrEqual(3)
})

test('high contrast marks pressed chips and the active handshake hop', async ({ page }) => {
  await page.goto(`${BASE}#/target`)
  const pressed = page.getByRole('button', { name: 'Agencies' })
  expect(await pressed.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('2px')

  await page.goto(`${BASE}#/handshake`)
  for (let index = 0; index < 5; index += 1) {
    const before = await page.locator('.sim-progress').textContent()
    await page.getByRole('button', { name: /Next/ }).click()
    await expect(page.locator('.sim-progress')).not.toHaveText(before!)
  }
  const hop = page.locator('.hop.active')
  expect(await hop.evaluate((el) => parseFloat(getComputedStyle(el).strokeWidth))).toBeGreaterThanOrEqual(4)
})
