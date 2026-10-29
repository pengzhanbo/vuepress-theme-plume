// same as the default of MiniSearch's `tokenize` / 与 MiniSearch 的 `tokenize` 默认行为相同
const SPACE_OR_PUNCTUATION_RE = /[\n\r\p{Z}\p{P}]+/u
// runs of characters from scripts written without spaces between words
// (`scx` also covers marks like the prolonged sound mark `ー`)
// 由在不使用词间空格书写的文字系统中连续出现的字符组成的一串字符
// （`scx` 也涵盖诸如长音符号 `ー` 之类的标记）
const UNSPACED_RUN_RE
  = /[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+|[^\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+/gu
const UNSPACED_START_RE = /^[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]/u
const NO_SPACE_AND_PUNCTUATION_RE_RE = /\p{L}|\p{N}/u

/**
 * Whether a token contains at least one letter or number.
 *
 * 词元是否至少包含一个字母或数字，用于过滤空白与标点词元。
 *
 * `Intl.Segmenter` 的 word 粒度与空白符兜底分词都会产出空白和标点片段，
 * 若直接写入索引会造成搜索结果假阳性（仅命中空格的文档）、索引膨胀，
 * 以及高亮时把标题中的空格包裹为 `<mark>`。因此统一只保留含字母/数字的词元。
 */
function isWordToken(token: string): boolean {
  return NO_SPACE_AND_PUNCTUATION_RE_RE.test(token)
}

/**
 * Create a tokenizer shared by the node (index build) and client (query) sides.
 *
 * 创建由 Node 端（构建索引）与客户端（查询）共享的分词器。
 *
 * MiniSearch requires the tokenizer used to build the index to be identical to
 * the one used at query time. Defining it in one place guarantees both sides
 * use the same strategy: `Intl.Segmenter` when available, otherwise the same
 * deterministic whitespace fallback. Blank and punctuation-only tokens are
 * discarded on both sides, so they never pollute the index or the query.
 *
 * MiniSearch 要求构建索引与查询时使用完全一致的分词器。集中定义可保证两端策略一致：
 * 支持 `Intl.Segmenter` 时使用它分词，否则统一退化为确定性的空白符分词。
 * 两端都会丢弃空白与纯标点词元，避免污染索引与查询。
 *
 * @param lang - Language code for word segmentation / 用于分词的语言代码
 * @returns Tokenizer that splits a string into tokens / 将字符串切分为词元的函数
 * @example
 * const tokenize = createTokenizer('en')
 * tokenize('Hello world') // ['Hello', 'world'] with Intl.Segmenter
 */
export function createTokenizer(lang: string): (text: string) => string[] {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
    return (text) => {
      const terms = text.split(SPACE_OR_PUNCTUATION_RE)
      return terms.flatMap(
        term =>
          term
            .match(UNSPACED_RUN_RE)
            ?.flatMap(run =>
              UNSPACED_START_RE.test(run)
                ? Array.from(segmenter!.segment(run), part => part.segment)
                : run,
            ) ?? term,
      ).filter(isWordToken)
    }
  }
  return text => text.split(SPACE_OR_PUNCTUATION_RE).filter(isWordToken)
}
