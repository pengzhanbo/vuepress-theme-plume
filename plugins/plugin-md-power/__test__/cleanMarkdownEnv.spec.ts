import { describe, expect, it } from 'vitest'
import { cleanMarkdownEnv, type CleanMarkdownEnv } from '../src/node/utils/cleanMarkdownEnv.js'

describe('cleanMarkdownEnv', () => {
  const env: CleanMarkdownEnv = {
    base: 'base',
    filePath: 'filePath',
    filePathRelative: 'filePathRelative',
    references: 'references',
    abbreviations: 'abbreviations',
    annotations: 'annotations',
    // @ts-expect-error should be ignored
    foo: 'foo',
    bar: 'bar',
  }
  it('should clean markdown env', () => {
    const result = cleanMarkdownEnv(env)
    expect(result).toEqual({
      base: 'base',
      filePath: 'filePath',
      filePathRelative: 'filePathRelative',
      references: 'references',
      abbreviations: 'abbreviations',
      annotations: 'annotations',
    })
  })

  it('should clean markdown env with excludes', () => {
    const result = cleanMarkdownEnv(env, ['references', 'abbreviations'])
    expect(result).toEqual({
      base: 'base',
      filePath: 'filePath',
      filePathRelative: 'filePathRelative',
      annotations: 'annotations',
    })
  })

  it('should handle empty env', () => {
    const result = cleanMarkdownEnv({})
    expect(result).toEqual({})
  })

  it('should handle env with only valid keys', () => {
    const validEnv = {
      base: '/base/',
      filePath: '/path/to/file.md',
      filePathRelative: 'path/to/file.md',
    }
    const result = cleanMarkdownEnv(validEnv)
    expect(result).toEqual(validEnv)
  })

  it('should handle env with undefined values', () => {
    const envWithUndefined = {
      base: undefined,
      filePath: 'file.md',
    }
    const result = cleanMarkdownEnv(envWithUndefined)
    expect(result).toEqual({
      base: undefined,
      filePath: 'file.md',
    })
  })

  it('should exclude all valid keys', () => {
    const result = cleanMarkdownEnv(env, ['base', 'filePath', 'filePathRelative', 'references', 'abbreviations', 'annotations'])
    expect(result).toEqual({})
  })

  it('should handle complex references', () => {
    const envWithRefs: CleanMarkdownEnv = {
      base: '/',
      references: {
        link1: { href: 'https://example.com', title: 'Example' },
      },
      abbreviations: { HTML: 'HyperText Markup Language' },
      annotations: { note: { sources: ['Note 1'], rendered: [] } },
    }
    const result = cleanMarkdownEnv(envWithRefs)
    expect(result.references).toEqual({ link1: { href: 'https://example.com', title: 'Example' } })
    expect(result.abbreviations).toEqual({ HTML: 'HyperText Markup Language' })
    expect(result.annotations).toEqual({ note: { sources: ['Note 1'], rendered: [] } })
  })

  it('should not mutate original env', () => {
    const originalEnv = { ...env }
    cleanMarkdownEnv(env)
    expect(env).toEqual(originalEnv)
  })
})
