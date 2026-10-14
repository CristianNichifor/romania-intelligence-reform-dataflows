import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const BASE = '/romania-intelligence-reform-dataflows/'

test.use({ viewport: { width: 390, height: 760 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'en'))
})

test('a phone opens the current flows as a list and toggles to the graph', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const list = page.getByRole('list', { name: 'Flows' })
  await expect(list).toBeVisible()
  await expect(page.locator('.react-flow')).toHaveCount(0)
  const c1 = list.getByRole('listitem').filter({ has: page.getByRole('heading', { name: /^C1 / }) })
  await expect(c1).toContainText('→')
  await expect(c1).toContainText('Legal basis')
  await expect(c1).toContainText('Auditability')
  await expect(c1.getByRole('link').first()).toHaveAttribute('href', /^https:/)

  await page.getByRole('button', { name: 'Graph' }).click()
  await expect(page.getByRole('button', { name: 'Graph' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.react-flow__node').first()).toBeVisible()
  await page.getByRole('button', { name: 'List' }).click()
  await expect(list).toBeVisible()
})

test('the category chips filter the list', async ({ page }) => {
  await page.goto(`${BASE}#/target`)
  const items = page.getByRole('list', { name: 'Flows' }).getByRole('listitem')
  const before = await items.count()
  expect(before).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Show all' }).click()
  expect(await items.count()).toBeGreaterThan(before)
})

test('the Romanian toggle reads Listă/Graf', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ro-intel-lang', 'ro'))
  await page.goto(`${BASE}#/current`)
  await expect(page.getByRole('button', { name: 'Listă' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Graf' })).toBeVisible()
})

for (const view of ['current', 'target']) {
  test(`the ${view} list has no axe violations at 390 px`, async ({ page }) => {
    await page.goto(`${BASE}#/${view}`)
    await expect(page.getByRole('list', { name: 'Flows' })).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
  })
}

test('a wide screen still opens the graph', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`${BASE}#/current`)
  await expect(page.locator('.react-flow__node').first()).toBeVisible()
  await expect(page.getByRole('list', { name: 'Flows' })).toHaveCount(0)
})

test('the view tabs are at least 44 px tall on a phone', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const tabs = page.locator('.nav-btn')
  await expect(tabs.first()).toBeVisible()
  for (const box of await tabs.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))) {
    expect(box).toBeGreaterThanOrEqual(44)
  }
})

test('list rows carry risk and an audit line swatch; chips are 44 px', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  const c1 = page.getByRole('list', { name: 'Flows' }).getByRole('listitem').filter({ has: page.getByRole('heading', { name: /^C1 / }) })
  await expect(c1).toContainText('Risk')
  await expect(c1.locator('.audit-swatch line')).toHaveCount(1)
  for (const chip of await page.locator('.explorer-toolbar .chip').all()) {
    expect((await chip.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
})

test('the list says how many flows it shows out of the total', async ({ page }) => {
  await page.goto(`${BASE}#/current`)
  await expect(page.locator('.flow-count')).toHaveText('14 of 14 flows')
  await page.goto(`${BASE}#/target`)
  await expect(page.locator('.flow-count')).toHaveText(/^\d+ of 33 flows$/)
  await page.getByRole('button', { name: 'Show all' }).click()
  await expect(page.locator('.flow-count')).toHaveText('33 of 33 flows')
})

test('each list row is edged in its destination category colour', async ({ page }) => {
  const { currentActors, resolveActorColor } = await import('../../src/data/actors')
  const rgb = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16))
    return `rgb(${r}, ${g}, ${b})`
  }
  await page.goto(`${BASE}#/current`)
  const c1 = page.getByRole('list', { name: 'Flows' }).getByRole('listitem').filter({ has: page.getByRole('heading', { name: /^C1 / }) })
  const sri = currentActors.find((actor) => actor.id === 'SRI')!
  await expect(c1).toHaveCSS('border-left-color', rgb(resolveActorColor(sri, 'current')))
  await expect(c1).toHaveCSS('border-left-width', '4px')
})
