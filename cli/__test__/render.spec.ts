import type { ResolvedData } from '../src/types.js'
import { describe, expect, it } from 'vitest'
import { DeployType } from '../src/constants.js'
import { createRender } from '../src/render.js'

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
})
