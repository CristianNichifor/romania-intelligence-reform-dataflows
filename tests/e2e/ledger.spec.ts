import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('the ledger starts empty, says how to fill it, and lists entries once the handshake runs', async ({ page }) => {
  await page.goto(`${BASE}#/ledger`)
  await expect(page.getByText('The ledger is empty. Run the handshake or red-team scenario.')).toBeVisible()
  await expect(page.locator('.ledger-table')).toHaveCount(0)

  await page.getByRole('tab', { name: /Handshake T3–T6/ }).click()
  const next = page.getByRole('button', { name: /Next/ })
  const progress = page.locator('.sim-progress')
  for (let step = 0; step < 5; step += 1) {
    const before = await progress.textContent()
    await next.click()
    await expect(progress).not.toHaveText(before!)
  }

  await page.getByRole('tab', { name: /Audit Ledger/ }).click()
  await expect(page.locator('.ledger-table tbody tr').first()).toBeVisible()
  await expect(page.getByText('The ledger is empty.', { exact: false })).toHaveCount(0)
})
