/**
 * HTML scanning helpers for the feed pipeline.
 *
 * feed 流程使用的 HTML 扫描工具。
 */

/**
 * Raw text elements whose content must be dropped together with the element.
 *
 * 内容需要随元素一起丢弃的原始文本元素。
 */
export const RAW_TEXT_TAGS: ReadonlySet<string> = new Set(['script', 'style'])

interface HtmlTag {
  /** Tag name with its original case / 保持原始大小写的标签名 */
  name: string
  closing: boolean
  selfClosing: boolean
  /** Index after the closing `>` / `>` 之后的索引 */
  end: number
}

const TAG_NAME_CHAR_RE = /[\w:-]/

/**
 * Read a tag starting at `<`, honoring quoted attribute values.
 *
 * 从 `<` 开始读取一个标签，正确处理属性值中的引号。
 *
 * @param html - HTML source / HTML 源码
 * @param start - Index of `<` / `<` 的位置
 * @returns Parsed tag, `undefined` when it is not a tag / 解析结果，不是标签时为 `undefined`
 */
function readTag(html: string, start: number): HtmlTag | undefined {
  let index = start + 1
  const closing = html[index] === '/'
  if (closing)
    index++

  const nameStart = index
  while (index < html.length && TAG_NAME_CHAR_RE.test(html[index]))
    index++

  // 正文中的 `<` 并不是标签，例如 `a < b` / `<` in text is not a tag
  if (index === nameStart)
    return undefined

  const name = html.slice(nameStart, index)
  let quote: string | undefined

  while (index < html.length) {
    const char = html[index]
    if (quote) {
      if (char === quote)
        quote = undefined
    }
    else if (char === '"' || char === '\'') {
      quote = char
    }
    else if (char === '>') {
      return {
        name,
        closing,
        selfClosing: html[index - 1] === '/',
        end: index + 1,
      }
    }
    index++
  }

  return undefined
}

/**
 * Find the index after the matching closing tag of a raw text element.
 *
 * 查找原始文本元素对应结束标签之后的索引。
 *
 * @param html - HTML source / HTML 源码
 * @param name - Lowercase tag name / 小写标签名
 * @param from - Index to start scanning / 开始扫描的位置
 */
function findClosingTagEnd(html: string, name: string, from: number): number {
  let index = from

  while (index < html.length) {
    const start = html.indexOf('<', index)
    if (start === -1)
      return html.length

    const tag = readTag(html, start)
    if (!tag) {
      index = start + 1
      continue
    }

    if (tag.closing && tag.name.toLowerCase() === name)
      return tag.end

    index = tag.end
  }

  return html.length
}

/**
 * Options of {@link transformHtml}.
 *
 * {@link transformHtml} 的配置。
 */
export interface TransformHtmlOptions {
  /**
   * Tags removed together with their content, compared case-insensitively.
   *
   * 连同内容一起移除的标签，按忽略大小写比较。
   */
  removeWithContent?: ReadonlySet<string>
  /**
   * Decide whether a tag should be removed while keeping its content.
   *
   * 判断标签是否移除（保留内容），入参保留原始大小写。
   */
  removeTag?: (name: string) => boolean
  /**
   * Keep the remaining tags in the output, `false` turns the markup into text.
   *
   * 是否在输出中保留其余标签，`false` 表示将标记转换为文本。
   *
   * @default false
   */
  keepTags?: boolean
  /**
   * Block level tags converted into a space when tags are stripped.
   *
   * 剥离标签时转换为空格的块级标签。
   */
  blockTags?: ReadonlySet<string>
}

/**
 * Walk through an HTML fragment, removing the requested elements.
 *
 * 遍历 HTML 片段并移除指定元素。
 *
 * @param html - HTML fragment / HTML 片段
 * @param options - Transform options / 转换配置
 */
export function transformHtml(html: string, options: TransformHtmlOptions = {}): string {
  const { removeWithContent, removeTag, keepTags = false, blockTags } = options

  let output = ''
  let index = 0

  while (index < html.length) {
    const start = html.indexOf('<', index)
    if (start === -1) {
      output += html.slice(index)
      break
    }

    output += html.slice(index, start)

    // 注释整段丢弃 / Drop comments entirely
    if (html.startsWith('<!--', start)) {
      const end = html.indexOf('-->', start + 4)
      index = end === -1 ? html.length : end + 3
      continue
    }

    // `<!DOCTYPE>` 等声明 / Declarations such as `<!DOCTYPE>`
    if (html[start + 1] === '!') {
      const end = html.indexOf('>', start + 2)
      if (end === -1)
        break
      if (keepTags)
        output += html.slice(start, end + 1)
      index = end + 1
      continue
    }

    const tag = readTag(html, start)
    if (!tag) {
      output += '<'
      index = start + 1
      continue
    }

    const name = tag.name.toLowerCase()

    if (!tag.closing && !tag.selfClosing && removeWithContent?.has(name)) {
      index = findClosingTagEnd(html, name, tag.end)
      continue
    }

    if (removeTag?.(tag.name)) {
      index = tag.end
      continue
    }

    if (keepTags)
      output += html.slice(start, tag.end)
    else if (blockTags?.has(name))
      output += ' '

    index = tag.end
  }

  return output
}

/**
 * Strip every tag and keep the text only.
 *
 * 移除所有标签，仅保留文本。
 *
 * @param html - HTML fragment / HTML 片段
 * @param options - Transform options / 转换配置
 */
export function stripHtml(
  html: string,
  options: Omit<TransformHtmlOptions, 'keepTags'> = {},
): string {
  return transformHtml(html, { ...options, keepTags: false })
}

/**
 * Remove the requested elements but keep every other tag as is.
 *
 * 移除指定元素，其余标签原样保留。
 *
 * @param html - HTML fragment / HTML 片段
 * @param options - Transform options / 转换配置
 */
export function removeElements(
  html: string,
  options: Omit<TransformHtmlOptions, 'keepTags' | 'blockTags'> = {},
): string {
  return transformHtml(html, { ...options, keepTags: true })
}
