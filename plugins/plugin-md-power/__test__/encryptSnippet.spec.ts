import type { App } from 'vuepress/core'
import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { encryptPlugin } from '../src/node/container/encrypt.js'

interface FakeApp {
  app: App
  written: string[]
}

function createApp(): FakeApp {
  const written: string[] = []
  return {
    app: {
      dir: { temp: (file: string) => `/tmp/__md_power__/${file}` },
      options: { locales: { '/': {}, '/en/': {} } },
      writeTemp: vi.fn(async (file: string) => {
        written.push(file)
      }),
    } as unknown as App,
    written,
  }
}

function createMarkdown(
  app: App,
  options: Parameters<typeof encryptPlugin>[2],
) {
  const md = new MarkdownIt()
  const flush = encryptPlugin(app, md as unknown as Parameters<typeof encryptPlugin>[1], options)
  return { md, flush }
}

describe('encrypt snippet container', () => {
  it('should hide content and render an alert placeholder when password is missing', () => {
    const { md } = createMarkdown(createApp().app, {})

    const rendered = md.render('::: encrypt\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('vp-encrypt-error')
    expect(rendered).toContain('role="alert"')
    expect(rendered).not.toContain('secret-content')
    expect(rendered).not.toContain('VPEncryptSnippet')
  })

  it('should treat an empty password as missing', () => {
    const { md } = createMarkdown(createApp().app, { password: '' })

    const rendered = md.render('::: encrypt password=""\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('vp-encrypt-error')
    expect(rendered).not.toContain('secret-content')
  })

  it('should render the encrypted snippet when a password is set on the container', () => {
    const { app } = createApp()
    const { md } = createMarkdown(app, {})

    const rendered = md.render('::: encrypt password="123456"\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('VPEncryptSnippet')
    expect(rendered).not.toContain('secret-content')
    expect(app.writeTemp).toHaveBeenCalled()
  })

  it('should fall back to the default password', () => {
    const { md } = createMarkdown(createApp().app, { password: '123456' })

    const rendered = md.render('::: encrypt\nsecret-content\n:::', { filePathRelative: 'notes/a.md' })

    expect(rendered).toContain('VPEncryptSnippet')
    expect(rendered).not.toContain('secret-content')
  })

  it('should keep identical content with different passwords in separate files', async () => {
    const { app, written } = createApp()
    const { md, flush } = createMarkdown(app, {})

    md.render(
      '::: encrypt password="password-a"\nsame-content\n:::\n\n::: encrypt password="password-b"\nsame-content\n:::',
      { filePathRelative: 'notes/a.md' },
    )
    await flush()

    const snippets = written
      .filter(file => file.startsWith('internal/encrypt-snippets/') && !file.endsWith('/index.js'))
      .map(file => file.replace('internal/encrypt-snippets/', ''))

    expect(snippets).toHaveLength(2)
    expect(new Set(snippets).size).toBe(2)
  })
})
