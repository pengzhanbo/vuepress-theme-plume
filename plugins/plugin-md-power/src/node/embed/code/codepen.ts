/**
 * @[codepen](user/slash)
 * @[codepen preview](user/slash)
 * @[codepen preview editable title="" height="400px" tab="css,result" theme="dark"](user/slash)
 */

import type { Markdown } from 'vuepress/markdown'
import type { CodepenTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

export function codepenPlugin(md: Markdown): void {
  createEmbedRuleBlock<CodepenTokenMeta>(md, {
    type: 'codepen',
    meta: (info, source) => {
      const { width, height, title, tab, preview, editable, theme } = resolveAttrs<CodepenTokenMeta>(info)
      const [user, slash] = source.split('/')

      return {
        title: title || 'Code Pen',
        tab: tab || 'result',
        width: width ? parseRect(width) : '100%',
        height: height ? parseRect(height) : '400px',
        user,
        slash,
        preview,
        editable,
        theme,
      }
    },
    content: meta => `<VPCodePen${stringifyAttrs(meta)} />`,
  })
}
