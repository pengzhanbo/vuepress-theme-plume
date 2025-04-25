/**
 * @[jsfiddle](user/id)
 * @[jsfiddle theme="dark" tab="js,css,html,result"](user/id)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { JSFiddleTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

export const jsfiddlePlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<JSFiddleTokenMeta>(md, {
    type: 'jsfiddle',
    syntaxPattern: /^@\[jsfiddle([^\]]*)\]\(([^)]*)\)/,
    meta([, info, source]) {
      const { width, height, title, tab, theme } = resolveAttrs<JSFiddleTokenMeta>(info).attrs

      return {
        width: width ? parseRect(width) : '100%',
        height: height ? parseRect(height) : '400px',
        source,
        title: title || 'JS Fiddle',
        tab: tab?.replace(/\s+/g, '') || 'js,css,html,result',
        theme,
      }
    },
    content: meta => `<JSFiddleViewer${stringifyAttrs(meta)} />`,
  })
}
