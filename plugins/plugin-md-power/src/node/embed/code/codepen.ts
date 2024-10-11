/**
 * @[codepen](user/slash)
 * @[codepen preview](user/slash)
 * @[codepen preview editable title="" height="400px" tab="css,result" theme="dark"](user/slash)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { CodepenTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

const CODEPEN_LINK = 'https://codepen.io/'

export const codepenPlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<CodepenTokenMeta>(md, {
    type: 'codepen',
    syntaxPattern: /^@\[codepen([^\]]*)\]\(([^)]*)\)/,
    meta: ([, info, source]) => {
      const { attrs } = resolveAttrs(info)
      const [user, slash] = source.split('/')

      return {
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '400px',
        user,
        slash,
        title: attrs.title,
        preview: attrs.preview,
        editable: attrs.editable,
        tab: attrs.tab || 'result',
        theme: attrs.theme,
      }
    },
    content: (meta) => {
      const { title = 'Codepen', height, width } = meta
      const params = new URLSearchParams()

      if (meta.editable) {
        params.set('editable', 'true')
      }

      params.set('default-tab', meta.tab!)

      if (meta.theme) {
        params.set('theme-id', meta.theme)
      }

      const middle = meta.preview ? '/embed/preview/' : '/embed/'

      const link = `${CODEPEN_LINK}${meta.user}${middle}${meta.slash}?${params.toString()}`
      const style = `width:${width};height:${height};margin:16px auto;border-radius:5px;`

      return `<iframe class="code-pen-iframe-wrapper" src="${link}" title="${title}" style="${style}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="${CODEPEN_LINK}${meta.user}/pen/${meta.slash}">${title}</a> by ${meta.user} (<a href="${CODEPEN_LINK}${meta.user}">@${meta.user}</a>) on <a href="${CODEPEN_LINK}">CodePen</a>.</iframe>`
    },
  })
}
