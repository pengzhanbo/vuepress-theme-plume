/**
 * @[replit](user/repl-name)
 * @[replit](user/repl-name#filepath)
 * @[replit title="" height="400px" width="100%" theme="dark"](user/repl-name)
 */
import type { PluginWithOptions } from 'markdown-it'
import { createRuleBlock } from '../utils/createRuleBlock.js'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import type { ReplitTokenMeta } from '../../shared/index.js'

export const replitPlugin: PluginWithOptions<never> = (md) => {
  createRuleBlock<ReplitTokenMeta>(md, {
    type: 'replit',
    syntaxPattern: /^@\[replit([^\]]*)\]\(([^)]*)\)/,
    meta: ([, info = '', source = '']) => {
      const { attrs } = resolveAttrs(info)
      return {
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '450px',
        source: source.startsWith('@') ? source : `@${source}`,
        title: attrs.title,
        theme: attrs.theme || '',
      }
    },
    content({ title, height, width, source, theme }) {
      return `<ReplitViewer title="${title || ''}" height="${height}" width="${width}" source="${source}" theme="${theme}" />`
    },
  })
}
