import type { Page } from 'vuepress'
import type { DemoFile, MarkdownDemoEnv } from '../src/shared/demo.js'
import { describe, expect, it } from 'vitest'
import { extendsPageWithDemo } from '../src/node/demo/extendPage.js'
import { insertSetupScript } from '../src/node/demo/supports/insertScript.js'

/**
 * demo 相关的路径可能来自 `node:path`（Windows 上使用 `\`），也可能来自
 * `app.dir.temp()`（VuePress 统一使用 `/`）。凡是写入生成代码或 frontmatter 的路径，
 * 都必须归一化为 `/`，否则 Windows 会得到字符串转义错误或绝对路径。
 *
 * Demo paths may come from `node:path` (backslashes on Windows) or from `app.dir.temp()`
 * (always `/` in VuePress). Paths written into generated code or frontmatter must be
 * normalized to `/`, otherwise Windows ends up with string escapes or absolute paths.
 */

function createEnv(): MarkdownDemoEnv {
  return { sfcBlocks: {} } as unknown as MarkdownDemoEnv
}

function createPage(filePath: string | null, demoFiles: DemoFile[]): Page {
  return {
    filePath,
    deps: [],
    frontmatter: {},
    markdownEnv: { demoFiles },
  } as unknown as Page
}

describe('insertSetupScript', () => {
  it('writes the import specifier with forward slashes', () => {
    const env = createEnv()

    insertSetupScript({ type: 'vue', export: 'DemoBasic', path: 'C:\\project\\demo\\Basic.vue' }, env)

    const content = env.sfcBlocks!.scriptSetup!.content
    expect(content).toContain('import DemoBasic from \'C:/project/demo/Basic.vue\';')
    // Windows 的 `\` 在 JS 字符串中会被解析为转义符，不能出现在生成的代码里。
    expect(content).not.toContain('\\')
  })

  it('supports a side-effect import without an export name', () => {
    const env = createEnv()

    insertSetupScript({ type: 'css', path: 'C:\\project\\demo\\style.css' }, env)

    expect(env.sfcBlocks!.scriptSetup!.content).toContain('import \'C:/project/demo/style.css\';')
  })

  it('keeps `/` separated paths untouched', () => {
    const env = createEnv()

    insertSetupScript({ type: 'vue', export: 'Demo', path: '/tmp/md-power/demo/x.vue' }, env)

    expect(env.sfcBlocks!.scriptSetup!.content).toContain('import Demo from \'/tmp/md-power/demo/x.vue\';')
  })
})

describe('extendsPageWithDemo', () => {
  it('collects the markdown demos as page dependencies', () => {
    const page = createPage('/source/demo/a.md', [
      { type: 'markdown', path: '/source/demo/snippet.md' },
      { type: 'vue', path: '/tmp/md-power/demo/x.vue', gitignore: true },
    ])

    extendsPageWithDemo(page)

    expect(page.deps).toEqual(['/source/demo/snippet.md'])
  })

  it('computes git-included demo paths relative to the page directory', () => {
    // 反斜杠路径模拟 Windows 上由 `node:path` 解析出的 demo 文件路径。
    const page = createPage('/source/demo/guide/a.md', [
      { type: 'vue', path: '\\source\\demo\\guide\\Basic.vue', gitignore: false },
      { type: 'vue', path: '/source/demo/guide/nested/Deep.vue', gitignore: false },
    ])

    extendsPageWithDemo(page)

    expect(page.frontmatter.gitInclude).toEqual(['Basic.vue', 'nested/Deep.vue'])
  })

  it('skips demo files outside the page directory', () => {
    const page = createPage('/source/demo/a.md', [
      { type: 'vue', path: 'C:\\tmp\\md-power\\demo\\x.vue', gitignore: false },
    ])

    extendsPageWithDemo(page)

    // 页面目录之外的产物不应写入 `gitInclude`。
    expect(page.frontmatter.gitInclude).toBeUndefined()
  })

  it('ignores generated files marked as gitignored', () => {
    const page = createPage('/source/demo/a.md', [
      { type: 'vue', path: '/source/demo/x.vue', gitignore: true },
    ])

    extendsPageWithDemo(page)

    expect(page.frontmatter.gitInclude).toBeUndefined()
  })

  it('does nothing when the page has no file path', () => {
    const page = createPage(null, [
      { type: 'vue', path: '/source/demo/x.vue', gitignore: false },
    ])

    extendsPageWithDemo(page)

    expect(page.frontmatter.gitInclude).toBeUndefined()
  })
})
