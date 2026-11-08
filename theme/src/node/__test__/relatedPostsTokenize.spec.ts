import { describe, expect, it } from 'vitest'
import {
  cleanMarkdown,
  extractHeadings,
  hasSegmenter,
  tokenize,
} from '../features/relatedPosts/tokenize.js'

describe('cleanMarkdown', () => {
  it('drops code fences entirely', () => {
    const text = cleanMarkdown('```js\nconst value = 1\n```\n正文内容', 0)

    expect(text).not.toContain('const')
    expect(text).toContain('正文内容')
  })

  it('drops unclosed code fences', () => {
    const text = cleanMarkdown('intro\n```ts\nconst value = 1', 0)

    expect(text).toContain('intro')
    expect(text).not.toContain('const')
  })

  it('keeps the visible text of links and drops the url', () => {
    const text = cleanMarkdown('[配置说明](../config/theme.md) 的用法', 0)

    expect(text).toContain('配置说明')
    expect(text).not.toContain('config')
  })

  it('drops images and html tags', () => {
    const text = cleanMarkdown('![cover](./cover.png)\n<div class="tip">提示</div>', 0)

    expect(text).not.toContain('cover.png')
    expect(text).not.toContain('div')
    expect(text).toContain('提示')
  })

  it('drops list markers and table pipes', () => {
    const text = cleanMarkdown('- 第一项\n1. 第二项\n| 列 | 值 |', 0)

    expect(text).not.toContain('- 第一项')
    expect(text).not.toContain('1. 第二项')
    expect(text).not.toContain('|')
    expect(text).toContain('第一项')
    expect(text).toContain('第二项')
  })

  it('truncates the result to the given limit', () => {
    const text = cleanMarkdown('一'.repeat(500), 100)

    expect(text.length).toBeLessThanOrEqual(100)
  })

  it('does not truncate when the limit is 0', () => {
    const text = cleanMarkdown('一'.repeat(500), 0)

    expect(text.length).toBe(500)
  })
})

describe('extractHeadings', () => {
  it('collects heading text of every level', () => {
    expect(extractHeadings('## 一级\n正文\n### 二级\n#### 三级')).toEqual([
      '一级',
      '二级',
      '三级',
    ])
  })

  it('returns an empty list when there is no heading', () => {
    expect(extractHeadings('只有正文')).toEqual([])
  })
})

describe('tokenize: latin', () => {
  it('lowercases words and filters stop words and single characters', () => {
    expect(tokenize('The Vue Router a', 'bigram')).toEqual(['vue', 'router'])
  })

  it('keeps technical tokens with dots and dashes', () => {
    expect(tokenize('vue-router nuxt.js', 'bigram')).toEqual(['vue-router', 'nuxt.js'])
  })
})

describe('tokenize: cjk', () => {
  it('splits han runs into 2-grams with the bigram strategy', () => {
    const tokens = tokenize('响应式布局', 'bigram')

    expect(tokens).toContain('响应')
    expect(tokens).toContain('布局')
  })

  it('keeps a single han character', () => {
    expect(tokenize('中', 'bigram')).toEqual(['中'])
  })

  it('drops cjk stop words', () => {
    expect(tokenize('我们可以', 'bigram')).not.toContain('我们')
  })

  it.skipIf(!hasSegmenter)('segments han runs with Intl.Segmenter', () => {
    const tokens = tokenize('响应式布局与组合式函数', 'segmenter')

    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.some(token => token.includes('布局') || token === '组合')).toBe(true)
  })
})

describe('tokenize: non-latin scripts', () => {
  it('keeps cyrillic and greek words', () => {
    expect(tokenize('Привет мир', 'bigram')).toEqual(['привет', 'мир'])
    expect(tokenize('Ελληνικά', 'bigram')).toEqual(['ελληνικά'])
  })

  it('keeps latin letters with diacritics', () => {
    expect(tokenize('Café naïve', 'bigram')).toEqual(['café', 'naïve'])
  })

  it('splits japanese kana into 2-grams with the bigram strategy', () => {
    const tokens = tokenize('ひらがな', 'bigram')

    expect(tokens).toContain('ひら')
    expect(tokens).toContain('がな')
  })

  it.skipIf(!hasSegmenter)('segments japanese kana with the ja segmenter', () => {
    const tokens = tokenize('ひらがなとカタカナ', 'segmenter')

    expect(tokens.length).toBeGreaterThan(0)
  })

  it.skipIf(!hasSegmenter)('segments korean hangul with the ko segmenter', () => {
    const tokens = tokenize('한국어 문서', 'segmenter')

    expect(tokens).toContain('한국어')
  })
})
