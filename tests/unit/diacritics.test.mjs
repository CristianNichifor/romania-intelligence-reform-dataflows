import { readdirSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = new URL('../../', import.meta.url)
// Tracked Romanian text outside messages.ts: data, Romanian diagrams and docs.
const dirs = ['src/data', 'diagrams/ro', 'docs/ro']

function files(dir) {
  const url = new URL(`${dir}/`, root)
  return readdirSync(url).flatMap((name) => {
    const path = `${dir}/${name}`
    if (statSync(new URL(name, url)).isDirectory()) return files(path)
    return /\.(ts|mmd|md)$/.test(name) ? [path] : []
  })
}

describe('Romanian diacritics', () => {
  const all = dirs.flatMap(files)

  it('finds the Romanian sources', () => {
    expect(all.length).toBeGreaterThan(5)
  })

  it('never uses cedilla ş ţ Ş Ţ', () => {
    expect(all.filter((path) => /[şţŞŢ]/.test(readFileSync(new URL(path, root), 'utf8')))).toEqual([])
  })
})
