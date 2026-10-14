import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

for (const [lang, label] of [
  ['ro', 'Proiecte civice'],
  ['en', 'Civic projects'],
] as const) {
  test(`the first link leads back to the hub (${lang})`, async ({ page }) => {
    await page.addInitScript((l) => localStorage.setItem('ro-intel-lang', l), lang)
    await page.goto(BASE)
    const first = page.getByRole('link').first()
    await expect(first).toHaveAttribute('href', 'https://projects.cristian-nichifor.com/')
    await expect(first).toContainText(label)
    const box = await first.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(24)
  })
}
