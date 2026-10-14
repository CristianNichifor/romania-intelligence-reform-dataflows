import { expect, it } from 'vitest'
import { MERMAID_CONFIG } from './mermaidConfig'

it('runs mermaid in strict security mode', () => {
  expect(MERMAID_CONFIG.securityLevel).toBe('strict')
  expect(MERMAID_CONFIG.startOnLoad).toBe(false)
})
