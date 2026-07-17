/**
 * @[codesandbox](id)
 * @[codesandbox share](user/id)
 * @[codesanbox title="xxx" layout="Editor+Preview" height="500px" navbar="false" console="false"](id#filepath)
 */
import type { PluginSimple } from 'markdown-it'
import type { CodeSandboxTokenMeta } from '../../../shared/index.js'
import { parseRect } from '../../utils/parseRect.js'
import { resolveAttrs } from '../../utils/resolveAttrs.js'
import { stringifyAttrs } from '../../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from '../createEmbedRuleBlock.js'

export const codeSandboxPlugin: PluginSimple = (md) => {
  createEmbedRuleBlock<CodeSandboxTokenMeta>(md, {
    type: 'codesandbox',
    meta(info, source) {
      const { button, ...attrs } = resolveAttrs(info)
      const [profile, filepath = ''] = source.split('#')
      const [user, id] = profile.includes('/') ? profile.split('/') : ['', profile]
      const type = button ? 'button' : 'embed'
      return {
        width: attrs.width ? parseRect(attrs.width) : '100%',
        height: attrs.height ? parseRect(attrs.height) : '500px',
        user,
        id,
        title: attrs.title ?? '',
        console: attrs.console ?? false,
        navbar: attrs.navbar ?? true,
        layout: attrs.layout ?? '',
        type,
        filepath,
      }
    },
    content: meta => `<VPCodeSandbox${stringifyAttrs(meta)} />`,
  })
}
