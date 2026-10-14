import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

async function advance(page: Page, steps: number) {
  const next = page.getByRole('button', { name: /Next/ })
  for (let index = 0; index < steps; index += 1) {
    const progress = page.locator('.sim-progress')
    const before = await progress.textContent()
    await next.click()
    await expect(progress).not.toHaveText(before!)
  }
}

test('each T3–T6 hop is highlighted with a moving token chip', async ({ page }) => {
  await page.goto(`${BASE}#/handshake`)
  const map = page.getByRole('figure', { name: /T3–T6 path/ })
  await expect(map).toBeVisible()
  await expect(map.locator('.hop.active')).toHaveCount(0)

  await advance(page, 5)
  await expect(map.locator('.hop.active')).toHaveAttribute('data-hop', 'T3')
  await expect(map).toContainText('T3')
  await expect(map.locator('.token-chip animateMotion')).toHaveCount(1)

  await advance(page, 1)
  await expect(map.locator('.hop.active')).toHaveAttribute('data-hop', 'T4')
  await advance(page, 2)
  await expect(map.locator('.hop.active')).toHaveAttribute('data-hop', 'T5')
  await advance(page, 1)
  await expect(map.locator('.hop.active')).toHaveAttribute('data-hop', 'T6')

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])
})

test('reduced motion keeps the highlight and parks the chip without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${BASE}#/handshake`)
  await advance(page, 5)
  const map = page.getByRole('figure', { name: /T3–T6 path/ })
  await expect(map.locator('.hop.active')).toHaveAttribute('data-hop', 'T3')
  await expect(map.locator('.token-chip')).toHaveCount(1)
  await expect(map.locator('.token-chip')).toHaveAttribute('transform', /translate/)
  await expect(map.locator('animateMotion')).toHaveCount(0)
})
