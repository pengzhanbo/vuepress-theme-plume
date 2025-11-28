import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { removeLeadingSlash } from '@vuepress/shared'
import { path } from '@vuepress/utils'
import { isLinkWithProtocol } from 'vuepress/shared'

export function linksPlugin(md: Markdown): void {
  // attrs that going to be added to external links
  const externalAttrs = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  let hasOpenInternalLink = false
  const internalTag = 'VPLink'

  function handleLinkOpen(tokens: Token[], idx: number, env: MarkdownEnv) {
    hasOpenInternalLink = false
    const token = tokens[idx]
    // get `href` attr index
    const hrefIndex = token.attrIndex('href')

    // if `href` attr does not exist, skip
    /* istanbul ignore if -- @preserve */
    if (hrefIndex < 0) {
      return
    }

    // if `href` attr exists, `token.attrs` is not `null`
    const hrefAttr = token.attrs![hrefIndex]
    const hrefLink: string = hrefAttr[1]

    if (isLinkWithProtocol(hrefLink)) {
      // set `externalAttrs` to current token
      Object.entries(externalAttrs).forEach(([key, val]) => {
        token.attrSet(key, val)
      })
      return
    }

    if (hrefLink[0] === '#')
      return

    // convert starting tag of internal link
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
    if (hasOpenInternalLink) {
      hasOpenInternalLink = false
      tokens[idx].tag = internalTag
    }
    return self.renderToken(tokens, idx, opts)
  }
}

/**
 * Resolve relative and absolute paths according to the `base` and `filePathRelative`
 */
export function resolvePaths(rawPath: string, base: string, filePathRelative: string | null): {
  absolutePath: string | null
  relativePath: string
} {
  let absolutePath: string | null
  let relativePath: string

  // if raw path is absolute
  if (rawPath.startsWith('/')) {
    // if raw path is a link to markdown file
    if (rawPath.endsWith('.md')) {
      // prepend `base` to the link
      absolutePath = path.join(base, rawPath)
      relativePath = removeLeadingSlash(rawPath)
    }
    // if raw path is a link to other kind of file
    else {
      // keep the link as is
      absolutePath = rawPath
      relativePath = path.relative(base, absolutePath)
    }
  }
  // if raw path is relative
  // if `filePathRelative` is available
  else if (filePathRelative) {
    // resolve relative path according to `filePathRelative`
    relativePath = path.join(
      // file path may contain non-ASCII characters
      path.dirname(encodeURI(filePathRelative)),
      rawPath,
    )
    // resolve absolute path according to `base`
    absolutePath = path.join(base, relativePath)
  }
  // if `filePathRelative` is not available
  else {
    // remove leading './'
    relativePath = rawPath.replace(/^(?:\.\/)?(.*)$/, '$1')
    // just take relative link as absolute link
    absolutePath = null
  }

  return {
    absolutePath,
    relativePath,
  }
}
