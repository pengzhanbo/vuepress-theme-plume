/**
 * @[qrcode svg card title="xxx"](text)
 */
import type { PluginWithOptions } from 'markdown-it'
import type { QRCodeMeta, QRCodeProps } from '../../shared/index.js'
import { omit } from '@pengzhanbo/utils'
import { createContainerSyntaxPlugin } from '../container/createContainer.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from './createEmbedRuleBlock.js'

export const qrcodePlugin: PluginWithOptions<never> = (md) => {
  createEmbedRuleBlock<QRCodeMeta>(md, {
    type: 'qrcode',
    syntaxPattern: /^@\[qrcode([^\]]*)\]\(([^)]*)\)/,
    meta([, info, text]) {
      const { attrs } = resolveAttrs<QRCodeMeta>(info)
      const { card, ...rest } = omit(attrs, ['text'])

      return {
        text,
        ...rest,
        mode: rest.mode || (card ? 'card' : 'img'),
      }
    },
    content(meta) {
      return `<VPQRCode${stringifyAttrs(meta)} />`
    },
  })

  createContainerSyntaxPlugin(md, 'qrcode', (tokens, index) => {
    const { content, meta } = tokens[index]
    const { card, ...rest } = omit(meta, ['text'])
    const props: QRCodeProps = { text: content?.trim(), ...rest, mode: rest.mode || (card ? 'card' : 'img') }
    return `<VPQRCode ${stringifyAttrs(props)} />`
  })
}
