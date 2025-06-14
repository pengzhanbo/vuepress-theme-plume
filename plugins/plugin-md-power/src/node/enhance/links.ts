import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { isLinkWithProtocol } from 'vuepress/shared'

export function linksPlugin(md: Markdown): void {
  // attrs that going to be added to external links
  const externalAttrs = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  let hasOpenInternalLink = false
  const internalTag = 'VPLink'

  function handleLinkOpen(tokens: Token[], idx: number) {
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
  }

  md.renderer.rules.link_open = (tokens, idx, opts, env: MarkdownEnv, self) => {
    handleLinkOpen(tokens, idx)
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
