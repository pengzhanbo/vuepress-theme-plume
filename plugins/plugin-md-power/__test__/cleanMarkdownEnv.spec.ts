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
})
