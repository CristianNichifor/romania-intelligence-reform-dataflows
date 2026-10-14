import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test('a handshake step that cannot be signed says so, stays put and can be retried', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ro-intel-lang', 'en')
    // As on an insecure origin: no SubtleCrypto.
    Object.defineProperty(window.crypto, 'subtle', { value: undefined, configurable: true })
  })
  await page.goto(`${BASE}#/handshake`)
  const progress = page.locator('.sim-progress')
  const next = page.getByRole('button', { name: /Next step/ })
  const alert = page.getByRole('alert')

  // Steps 1 and 2 need no signature; step 3 asks the SSC to sign a warrant token.
  for (let step = 0; step < 3; step += 1) await next.click()
  await expect(alert).toContainText('This step could not be signed.')
  const stuck = await progress.textContent()
  await next.click()
  await expect(progress).toHaveText(stuck!)

  await page.evaluate(() => {
    delete (window.crypto as { subtle?: unknown }).subtle
  })
  await alert.getByRole('button', { name: 'Retry' }).click()
  await expect(alert).toHaveCount(0)
  await expect(progress).not.toHaveText(stuck!)
})
