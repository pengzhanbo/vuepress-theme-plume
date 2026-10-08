import { describe, expect, it } from 'vitest'
import { Mode } from '../src/constants.js'
import { resolveDocsDir } from '../src/run.js'

describe('resolveDocsDir', () => {
  it('should always scaffold into docs in create mode', () => {
    expect(resolveDocsDir(Mode.create, './my-project')).toBe('docs')
    expect(resolveDocsDir(Mode.create, './')).toBe('docs')
  })

  it('should reuse the chosen directory in init mode', () => {
    expect(resolveDocsDir(Mode.init, './docs')).toBe('docs')
    expect(resolveDocsDir(Mode.init, 'docs/')).toBe('docs')
    expect(resolveDocsDir(Mode.init, 'a/b/c')).toBe('a/b/c')
  })

  it('should never return an empty directory for init ./', () => {
    // 回归：`init ./` 曾生成空 docsDir，使 `vuepress dev ` 无法运行。
    // Regression: `init ./` used to produce an empty docsDir, making
    // `vuepress dev ` unrunnable.
    expect(resolveDocsDir(Mode.init, './')).toBe('.')
    expect(resolveDocsDir(Mode.init, '.')).toBe('.')
    expect(resolveDocsDir(Mode.init, '')).toBe('.')
  })
})
