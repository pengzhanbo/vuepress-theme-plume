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

  it('drops blank and punctuation-only tokens', () => {
    const tokenize = createTokenizer('en')
    // 回归：空白词元不得进入索引，否则会污染搜索结果与高亮。
    expect(tokenize('hello world')).not.toContain(' ')
    expect(tokenize('hello   world')).toEqual(['hello', 'world'])
    expect(tokenize('   ')).toEqual([])
    expect(tokenize('!?,。')).toEqual([])
  })

  it('falls back to whitespace tokenization without Intl.Segmenter', () => {
    const Segmenter = (Intl as any).Segmenter
    try {
      (Intl as any).Segmenter = undefined
      const tokenize = createTokenizer('en')
      expect(tokenize('a b  c')).toEqual(['a', 'b', 'c'])
      expect(tokenize('  ')).toEqual([])
    }
    finally {
      (Intl as any).Segmenter = Segmenter
    }
  })
})

describe('createTokenizer (chinese)', () => {
  it.skipIf(typeof Intl.Segmenter !== 'function')('keeps Chinese words and drops CJK punctuation', () => {
    const tokenize = createTokenizer('zh')
    // 中文词元按词典整词切分；中文标点（含全角标点）必须被过滤。
    expect(tokenize('你好，世界！')).toEqual(['你好', '世界'])
    expect(tokenize('深度学习（Deep Learning）很热门'))
      .toEqual(['深度', '学习', 'Deep', 'Learning', '很', '热门'])
  })

  it.skipIf(typeof Intl.Segmenter !== 'function')('never emits blank or CJK-punctuation tokens in mixed text', () => {
    const tokenize = createTokenizer('zh')
    const tokens = tokenize('你好，世界！欢迎使用 VuePress。')
    expect(tokens).toContain('你好')
    expect(tokens).toContain('世界')
    expect(tokens).toContain('VuePress')
    expect(tokens).not.toContain(' ')
    expect(tokens).not.toContain('，')
    expect(tokens).not.toContain('！')
    expect(tokens).not.toContain('。')
    // 过滤后所有词元都至少含一个字母或数字。
    expect(tokens.every(token => /\p{L}|\p{N}/u.test(token))).toBe(true)
  })

  it('still drops whitespace-only input without Intl.Segmenter', () => {
    const Segmenter = (Intl as any).Segmenter
    try {
      (Intl as any).Segmenter = undefined
      const tokenize = createTokenizer('zh')
      expect(tokenize('你好 世界')).toEqual(['你好', '世界'])
      expect(tokenize('   ')).toEqual([])
      // 兜底路径仅按空白切分：无空格的中文句子会整体保留（含标点）为单个词元。
      // 这是已知的退化行为（无法脱离 Intl.Segmenter 做中文分词），不影响空白过滤目标。
      expect(tokenize('你好，世界！')).toEqual(['你好，世界！'])
    }
    finally {
      (Intl as any).Segmenter = Segmenter
    }
  })
})
