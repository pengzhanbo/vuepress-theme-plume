import { describe, expect, it } from 'vitest'
import { createTokenizer } from '../src/shared/index.js'

describe('createTokenizer', () => {
  it('returns a tokenize function', () => {
    expect(typeof createTokenizer('en')).toBe('function')
  })

  it('produces identical tokens for the same input', () => {
    const tokenize = createTokenizer('en')
    expect(tokenize('Hello world')).toEqual(tokenize('Hello world'))
  })

  it.skipIf(typeof Intl.Segmenter !== 'function')('segments text into contiguous tokens covering the input', () => {
    const tokenize = createTokenizer('zh')
    const text = '你好世界 hello'
    // Intl.Segmenter 的 word 粒度会产出连续且覆盖整段文本的词元（含分隔符）。
    expect(tokenize(text).join('')).toBe(text)
  })

  it('falls back to whitespace tokenization without Intl.Segmenter', () => {
    const Segmenter = (Intl as any).Segmenter
    try {
      (Intl as any).Segmenter = undefined
      const tokenize = createTokenizer('en')
      expect(tokenize('a b  c')).toEqual(['a', 'b', 'c'])
    }
    finally {
      (Intl as any).Segmenter = Segmenter
    }
  })
})
