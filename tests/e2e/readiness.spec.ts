import { expect, test } from '@playwright/test'

test('completes the actual handshake and exposes its audit trail', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: /Handshake T3–T6$/ }).click()
  const next = page.getByRole('button', { name: 'Next step' })
  for (let step = 0; step < 11; step++) await next.click()
  await expect(next).toBeDisabled()
  const artifact = JSON.parse(await page.locator('.artifact-json').innerText())
  expect(artifact.map((entry: { flowType: string }) => entry.flowType)).toEqual(['SSC', 'T3', 'T4', 'T5', 'T6'])
  expect(new Set(artifact.map((entry: { tokenId: string }) => entry.tokenId)).size).toBe(1)
  expect(artifact[0].tokenId).toMatch(/^wt-/)
  await page.getByRole('button', { name: /Audit Ledger$/ }).click()
  await expect(page.getByText(artifact[0].tokenId, { exact: true }).first()).toBeVisible()
  expect(errors).toEqual([])
})

test('renders all four governance diagrams with patched Mermaid dependencies', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Governance$/ }).click()
  await expect(page.locator('.gov-diagram-card svg')).toHaveCount(4)
  await expect(page.locator('.mermaid-error')).toHaveCount(0)
})
