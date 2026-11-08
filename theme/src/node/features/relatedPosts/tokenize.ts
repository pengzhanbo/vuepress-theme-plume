/**
 * Text cleaning and tokenization for the related posts similarity model.
 *
 * 相关文章相似度模型使用的文本清洗与分词工具。
 */

/**
 * CJK tokenizer strategy, see {@link RelatedPostsOptions.cjk}
 *
 * 中文分词策略，见 {@link RelatedPostsOptions.cjk}
 */
export type CjkTokenizer = 'segmenter' | 'bigram'

const CODE_FENCE_RE = /(^|\n)(?:```|~~~)[^\n]*\n[\s\S]*?(?:\n(?:```|~~~)|$)/g
const IMAGE_RE = /!\[[^\]]*\]\([^)]*\)/g
const LINK_RE = /\[([^\]]*)\]\([^)]*\)/g
const HTML_TAG_RE = /<[^>]+>/g
const LIST_MARKER_RE = /^\s*(?:[-*+]|\d+\.)\s+/gm
const TABLE_PIPE_RE = /\|/g
const HEADING_LINE_RE = /^#{1,6}\s(.+)$/gm
const WORD_RE = /[a-z0-9][\w$+.-]*/gi
const CJK_RUN_RE = /\p{Script=Han}+/gu

/**
 * Minimal built-in stop words.
 *
 * 内置的最小停用词表，不加载外部词典。
 */
const STOP_WORDS = new Set<string>([
  // latin
  'the',
  'and',
  'for',
  'are',
  'was',
  'were',
  'but',
  'not',
  'you',
  'they',
  'this',
  'that',
  'with',
  'from',
  'will',
  'can',
  'all',
  'any',
  'has',
  'have',
  'its',
  'our',
  'their',
  'when',
  'what',
  'which',
  'how',
  'use',
  'using',
  'used',
  'also',
  'into',
  'than',
  'then',
  'there',
  'here',
  'about',
  // CJK (segments and 2-grams)
  '我们',
  '你们',
  '他们',
  '可以',
  '这个',
  '那个',
  '这些',
  '那些',
  '如果',
  '因为',
  '所以',
  '但是',
  '已经',
  '以及',
  '进行',
  '使用',
  '通过',
  '需要',
  '一个',
  '没有',
  '就是',
  '这样',
  '那样',
  '什么',
  '如何',
  '其中',
  '然后',
  '并且',
  '或者',
])

interface SegmenterLike {
  segment: (input: string) => Iterable<{ segment: string, isWordLike?: boolean }>
}

const SEGMENTER: SegmenterLike | null = (() => {
  const SegmenterCtor = (Intl as unknown as { Segmenter?: new (locale: string, options: { granularity: string }) => SegmenterLike }).Segmenter
  return SegmenterCtor ? new SegmenterCtor('zh', { granularity: 'word' }) : null
})()

/**
 * Whether the built-in `Intl.Segmenter` is available in the current runtime.
 *
 * 当前运行时是否支持内置的 `Intl.Segmenter`。
 */
export const hasSegmenter = SEGMENTER !== null

/**
 * Check whether a token is a stop word.
 *
 * 判断一个词项是否为停用词。
 *
 * @param token - Token to check / 要检查的词项
 */
export function isStopWord(token: string): boolean {
  return STOP_WORDS.has(token)
}

/**
 * Strip Markdown syntax and keep the prose that carries topic signals.
 *
 * 去除 Markdown 语法，只保留承载主题信号的正文。
 *
 * @param content - Raw Markdown content / 原始 Markdown 内容
 * @param limit - Max characters to keep, `0` means unlimited / 保留的最大字符数，`0` 表示不限制
 */
export function cleanMarkdown(content: string, limit: number): string {
  // 先粗截断，避免对超大文件跑全量正则
  const raw = limit > 0 ? content.slice(0, Math.max(limit * 4, 4000)) : content
  const text = raw
    .replace(CODE_FENCE_RE, ' ')
    .replace(IMAGE_RE, ' ')
    .replace(LINK_RE, '$1')
    .replace(HTML_TAG_RE, ' ')
    .replace(LIST_MARKER_RE, ' ')
    .replace(TABLE_PIPE_RE, ' ')

  return limit > 0 ? text.slice(0, limit) : text
}

/**
 * Extract heading text from raw Markdown.
 *
 * 从原始 Markdown 中提取标题文本。
 *
 * @param content - Raw Markdown content / 原始 Markdown 内容
 */
export function extractHeadings(content: string): string[] {
  const headings: string[] = []
  for (const match of content.matchAll(HEADING_LINE_RE))
    headings.push(match[1].trim())
  return headings
}

/**
 * Tokenize text into latin words and CJK segments (or 2-grams).
 *
 * 将文本切分为拉丁词与中文词段（或 2-gram）。
 *
 * @param text - Text to tokenize / 要分词的文本
 * @param cjk - CJK tokenizer strategy / 中文分词策略
 */
export function tokenize(text: string, cjk: CjkTokenizer = 'segmenter'): string[] {
  const tokens: string[] = []

  for (const match of text.matchAll(WORD_RE)) {
    const word = match[0].toLowerCase()
    if (word.length >= 2 && !STOP_WORDS.has(word))
      tokens.push(word)
  }

  for (const match of text.matchAll(CJK_RUN_RE)) {
    const run = match[0]

    if (run.length === 1) {
      if (!STOP_WORDS.has(run))
        tokens.push(run)
      continue
    }

    if (cjk === 'segmenter' && SEGMENTER) {
      for (const part of SEGMENTER.segment(run)) {
        if (part.isWordLike && part.segment.length >= 2 && !STOP_WORDS.has(part.segment))
          tokens.push(part.segment)
      }
      continue
    }

    for (let i = 0; i + 1 < run.length; i++) {
      const bigram = run.slice(i, i + 2)
      if (!STOP_WORDS.has(bigram))
        tokens.push(bigram)
    }
  }

  return tokens
}
