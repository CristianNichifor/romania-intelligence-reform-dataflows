import { describe, expect, it, vi } from 'vitest'
import { onRequest } from './_middleware.js'

const secret = 'g'.repeat(64)
const call = (url, { header, env } = {}) => {
  const headers = new Headers()
  if (header !== undefined) headers.set('x-cnw-preview-gate', header)
  const next = vi.fn().mockResolvedValue(new Response('static'))
  return { next, response: onRequest({ request: new Request(url, { headers }), next, env }) }
}

describe('preview gate', () => {
  it.each(['https://dev.app-1ab.pages.dev/', 'https://8bd308ff.app-1ab.pages.dev/x'])(
    'closes preview host %s while the secret is not set',
    async (url) => {
      const { next, response } = call(url, { header: 'anything', env: {} })
      expect((await response).status).toBe(403)
      expect(next).not.toHaveBeenCalled()
    },
  )
  it.each([undefined, 'wrong', 'g'.repeat(63)])('refuses header %s when the secret is set', async (header) => {
    const { next, response } = call('https://dev.app-1ab.pages.dev/', { header, env: { PREVIEW_GATE_SECRET: secret } })
    const result = await response
    expect(result.status).toBe(403)
    expect(result.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(next).not.toHaveBeenCalled()
  })
  it('serves the gate', async () => {
    const { next, response } = call('https://dev.app-1ab.pages.dev/', { header: secret, env: { PREVIEW_GATE_SECRET: secret } })
    expect(await (await response).text()).toBe('static')
    expect(next).toHaveBeenCalledOnce()
  })
  it('serves the production pages.dev host without the secret', async () => {
    const { next, response } = call('https://app-1ab.pages.dev/', { env: {} })
    expect((await response).status).toBe(200)
    expect(next).toHaveBeenCalledOnce()
  })
})
