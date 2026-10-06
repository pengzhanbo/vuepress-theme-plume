import type { App } from 'vuepress/core'
import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { encryptPlugin } from '../src/node/container/encrypt.js'

function createApp(): App {
  return {
    dir: { temp: (file: string) => `/tmp/__md_power__/${file}` },
    options: { locales: { '/': {}, '/en/': {} } },
    writeTemp: vi.fn(async () => {}),
  } as unknown as App
}

function createMarkdown(app: App, options: Parameters<typeof encryptPlugin>[2]) {
  const md = new MarkdownIt()
  encryptPlugin(app, md as unknown as Parameters<typeof encryptPlugin>[1], options)
  return md
}

describe('encrypt snippet container', () => {
  it('should hide content and render an alert placeholder when password is missing', () => {
    const md = createMarkdown(createApp(), {})

    const rendered = md.render('::: encrypt\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('vp-encrypt-error')
    expect(rendered).toContain('role="alert"')
    expect(rendered).not.toContain('secret-content')
    expect(rendered).not.toContain('VPEncryptSnippet')
  })

  it('should treat an empty password as missing', () => {
    const md = createMarkdown(createApp(), { password: '' })

    const rendered = md.render('::: encrypt password=""\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('vp-encrypt-error')
    expect(rendered).not.toContain('secret-content')
  })

  it('should render the encrypted snippet when a password is set on the container', () => {
    const app = createApp()
    const md = createMarkdown(app, {})

    const rendered = md.render('::: encrypt password="123456"\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('VPEncryptSnippet')
    expect(rendered).not.toContain('secret-content')
    expect(app.writeTemp).toHaveBeenCalled()
  })

  it('should fall back to the default password', () => {
    const md = createMarkdown(createApp(), { password: '123456' })

    const rendered = md.render('::: encrypt\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('VPEncryptSnippet')
    expect(rendered).not.toContain('secret-content')
  })
})
