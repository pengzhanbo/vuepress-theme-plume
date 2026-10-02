import type { ResolvedData } from '../src/types.js'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { DeployType } from '../src/constants.js'
import { createRender } from '../src/render.js'

const templateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates/.vuepress')

const base: ResolvedData = {
  displayLang: 'en-US',
  root: './my-project',
  siteName: 'My Vuepress Site',
  siteDescription: '',
  bundler: 'vite',
  multiLanguage: false,
  defaultLanguage: 'en-US',
  injectNpmScripts: true,
  deploy: DeployType.custom,
  git: false,
  install: false,
  packageManager: 'npm',
  docsDir: 'docs',
}

describe('createRender', () => {
  it('should expose the kebab-case name and english-first locales', () => {
    const render = createRender(base)

    expect(render('<%= it.name %>')).toBe('my-vuepress-site')
    expect(render('<%= it.isEN %>')).toBe('true')
    expect(render(`<%= it.locales[0].prefix + ',' + it.locales[1].prefix %>`)).toBe('en,zh')
    expect(render('<%= t("English", "中文") %>')).toBe('English')
  })

  it('should switch to chinese-first locales when the default language is zh-CN', () => {
    const render = createRender({ ...base, defaultLanguage: 'zh-CN' })

    expect(render('<%= it.isEN %>')).toBe('false')
    expect(render(`<%= it.locales[0].prefix + ',' + it.locales[1].prefix %>`)).toBe('zh,en')
    expect(render('<%= it.locales[0].lang %>')).toBe('zh-CN')
    expect(render('<%= t("English", "中文") %>')).toBe('中文')
  })

  it('should escape user input for js string literals without html entities', () => {
    const render = createRender({
      ...base,
      siteName: String.raw`Peng's\Blog`,
      siteDescription: 'line1\nline2',
    })

    expect(render(String.raw`'<%~ it.escapedSiteName %>'`)).toBe(String.raw`'Peng\'s\\Blog'`)
    expect(render(String.raw`'<%~ it.escapedSiteDescription %>'`)).toBe(String.raw`'line1\nline2'`)
    // 不应输出 HTML 实体，否则生成文件中的文本会被破坏。
    // HTML entities must not be emitted, otherwise the generated text is corrupted.
    expect(render('<%~ it.escapedSiteName %>')).not.toContain('&#39;')
  })

  it('should keep escaped user input valid inside the config template', () => {
    const render = createRender({
      ...base,
      siteName: String.raw`Peng's & <Blog>`,
      siteDescription: String.raw`a\b`,
    })

    const source = readFileSync(path.join(templateDir, 'config.ts.tpl'), 'utf-8')
    const output = render(source)

    expect(output).toContain(String.raw`title: 'Peng\'s & <Blog>',`)
    expect(output).toContain(String.raw`description: 'a\\b',`)
    expect(output).not.toContain('&#39;')
  })
})
