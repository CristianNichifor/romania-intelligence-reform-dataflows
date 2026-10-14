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

test('the red-team walkthrough exposes its progress and current step', async ({ page }) => {
  await page.goto(`${BASE}#/redteam`)
  const progress = page.getByRole('progressbar')
  await expect(progress).toHaveAttribute('aria-valuenow', '0')
  await expect(progress).toHaveAttribute('aria-valuemax', '6')
  await expect(page.locator('.timeline li[aria-current="step"]')).toHaveCount(1)
  await expect(page.locator('.timeline li').first()).toHaveAttribute('aria-current', 'step')

  await advance(page, 3)
  await expect(progress).toHaveAttribute('aria-valuenow', '3')
  await expect(page.locator('.timeline li').nth(3)).toHaveAttribute('aria-current', 'step')
  // The denied SSC step is marked in text, not only by its colour.
  await expect(page.locator('.timeline li.failed')).toHaveCount(1)
})
