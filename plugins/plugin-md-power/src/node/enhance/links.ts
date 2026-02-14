import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { removeLeadingSlash } from '@vuepress/shared'
import { path } from '@vuepress/utils'
import { isLinkWithProtocol } from 'vuepress/shared'

/**
 * Links plugin - Process internal and external links
 *
 * 链接插件 - 处理内部和外部链接
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function linksPlugin(md: Markdown): void {
  // attrs that going to be added to external links
  // 要添加到外部链接的属性
  const externalAttrs = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  let hasOpenInternalLink = false
  const internalTag = 'VPLink'

  /**
   * Handle link open token
   *
   * 处理链接打开令牌
   *
   * @param tokens - Token array / 令牌数组
   * @param idx - Token index / 令牌索引
   * @param env - Markdown environment / Markdown 环境
   */
  function handleLinkOpen(tokens: Token[], idx: number, env: MarkdownEnv) {
    hasOpenInternalLink = false
    const token = tokens[idx]
    // get `href` attr index
    // 获取 `href` 属性索引
    const hrefIndex = token.attrIndex('href')

    // if `href` attr does not exist, skip
    // 如果 `href` 属性不存在，跳过
    /* istanbul ignore if -- @preserve */
    if (hrefIndex < 0) {
      return
    }

    // if `href` attr exists, `token.attrs` is not `null`
    // 如果 `href` 属性存在，`token.attrs` 不为 `null`
    const hrefAttr = token.attrs![hrefIndex]
    const hrefLink: string = hrefAttr[1]

    if (isLinkWithProtocol(hrefLink)) {
      // set `externalAttrs` to current token
      // 将 `externalAttrs` 设置到当前令牌
      Object.entries(externalAttrs).forEach(([key, val]) => {
        token.attrSet(key, val)
      })
      return
    }

    if (hrefLink[0] === '#')
      return

    // convert starting tag of internal link
    // 转换内部链接的开始标签
    hasOpenInternalLink = true
    token.tag = internalTag

    const matched = hrefLink.match(/^([^#?]*?(?:\/|\.md|\.html))([#?].*)?$/)

    if (matched) {
      const rawPath = matched[1]
      const { absolutePath, relativePath } = resolvePaths(
        rawPath,
        env.base || '/',
        env.filePathRelative ?? null,
      )
      // extract internal links for file / page existence check
      // 并不能保证文件存在，以及是否属于内部链接
      // 需要进一步在 extendPage 阶段中与 page.path / page.filePath 进行对比
      ;(env.links ??= []).push({
        raw: rawPath,
        absolute: absolutePath,
        relative: relativePath,
      })
    }
  }

  md.renderer.rules.link_open = (tokens, idx, opts, env: MarkdownEnv, self) => {
    handleLinkOpen(tokens, idx, env)
    return self.renderToken(tokens, idx, opts)
  }

  md.renderer.rules.link_close = (tokens, idx, opts, _env, self) => {
    // convert ending tag of internal link
    // 转换内部链接的结束标签
    if (hasOpenInternalLink) {
      hasOpenInternalLink = false
      tokens[idx].tag = internalTag
    }
    return self.renderToken(tokens, idx, opts)
  }
}

/**
 * Resolve relative and absolute paths according to the `base` and `filePathRelative`
 *
 * 根据 `base` 和 `filePathRelative` 解析相对和绝对路径
 *
 * @param rawPath - Raw path / 原始路径
 * @param base - Base URL / 基础 URL
 * @param filePathRelative - Relative file path / 相对文件路径
 * @returns Object with absolutePath and relativePath / 包含 absolutePath 和 relativePath 的对象
 */
export function resolvePaths(rawPath: string, base: string, filePathRelative: string | null): {
  absolutePath: string | null
  relativePath: string
} {
  let absolutePath: string | null
  let relativePath: string

  // if raw path is absolute
  // 如果原始路径是绝对路径
  if (rawPath.startsWith('/')) {
    // if raw path is a link to markdown file
    // 如果原始路径是 markdown 文件链接
    if (rawPath.endsWith('.md')) {
      // prepend `base` to the link
      // 将 `base` 添加到链接前面
      absolutePath = path.join(base, rawPath)
      relativePath = removeLeadingSlash(rawPath)
    }
    // if raw path is a link to other kind of file
    // 如果原始路径是其他类型文件链接
    else {
      // keep the link as is
      // 保持链接不变
      absolutePath = rawPath
      relativePath = path.relative(base, absolutePath)
    }
  }
  // if raw path is relative
  // 如果原始路径是相对路径
  // if `filePathRelative` is available
  // 如果 `filePathRelative` 可用
  else if (filePathRelative) {
    // resolve relative path according to `filePathRelative`
    // 根据 `filePathRelative` 解析相对路径
    relativePath = path.join(
      // file path may contain non-ASCII characters
      // 文件路径可能包含非 ASCII 字符
      path.dirname(encodeURI(filePathRelative)),
      rawPath,
    )
    // resolve absolute path according to `base`
    // 根据 `base` 解析绝对路径
    absolutePath = path.join(base, relativePath)
  }
  // if `filePathRelative` is not available
  // 如果 `filePathRelative` 不可用
  else {
    // remove leading './'
    // 移除开头的 './'
    relativePath = rawPath.replace(/^(?:\.\/)?(.*)$/, '$1')
    // just take relative link as absolute link
    // 将相对链接视为绝对链接
    absolutePath = null
  }

  return {
    absolutePath,
    relativePath,
  }
}
