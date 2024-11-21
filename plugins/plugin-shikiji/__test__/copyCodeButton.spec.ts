import type { App } from 'vuepress/core'
import type { CopyCodeOptions } from '../src/node/types.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { copyCodeButtonPlugin } from '../src/node/copy-code-button/index.js'

function createMarkdown(options: boolean | CopyCodeOptions = {}, lang = 'en-US') {
  const md = new MarkdownIt()
  md.options.highlight = str => `<pre><code>${str}</code></pre>`
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => `<div class="language-lang">${fence(...args)}</div>`
  const app = {
    env: { isDebug: false },
    siteData: {
      lang,
      locales: { '/': { lang }, '/zh/': { lang: 'zh-CN' }, '/en/': { lang: 'en-US' }, '/xxx/': { lang: 'unknown' } },
    },
  } as unknown as App
  copyCodeButtonPlugin(md, app, options)
  return md
}

describe('copy code button plugin', () => {
  it('should work with default', () => {
    const md = createMarkdown()

    expect(md.render('```js\nconst a = 1\n```', { filePathRelative: '/test.md' })).toContain('<button class="copy"')

    expect(md.render('```js\nconst a = 1\n```', { filePathRelative: '/zh/test.md' })).toContain('<button class="copy"')

    expect(md.render('```js\nconst a = 1\n```', { filePathRelative: '/xxx/test.md' })).toContain('<button class="copy"')

    expect(md.render('```js\nconst a = 1\n```', {})).toContain('<button class="copy"')
  })

  it('should work with true', () => {
    const md = createMarkdown(true)

    expect(md.render('```js\nconst a = 1\n```', { filePathRelative: '/test.md' })).toContain('<button class="copy"')

    expect(md.render('```js\nconst a = 1\n```', {})).toContain('<button class="copy"')
  })

  it('should not work with disable', () => {
    const md = createMarkdown(false)

    expect(md.render('```js\nconst a = 1\n```', { filePathRelative: '/test.js' })).not.toContain('<button class="copy"')
  })
})
