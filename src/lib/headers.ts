export interface HeaderRule {
  path: string
  headers: Record<string, string>
}

/** Parses a Cloudflare Pages `_headers` file: a path line, then indented `Name: value` lines. */
export function parseHeaders(source: string): HeaderRule[] {
  const rules: HeaderRule[] = []
  for (const line of source.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      rules.push({ path: line.trim(), headers: {} })
      continue
    }
    const separator = line.indexOf(':')
    const rule = rules.at(-1)
    if (rule && separator > 0) rule.headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return rules
}
