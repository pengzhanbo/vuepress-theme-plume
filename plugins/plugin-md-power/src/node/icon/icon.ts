import type { PluginWithOptions } from 'markdown-it'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { IconOptions } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { logger } from '../utils/logger.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createIconRule } from './createIconRule.js'
import { resolveIcon } from './resolveIcon.js'

function iconRender(content: string, options: IconOptions): string {
  const icon = resolveIcon(content, options)
  return `<VPIcon${stringifyAttrs(icon)} />`
}

export const iconPlugin: PluginWithOptions<IconOptions> = (md, options = {}) => {
  /**
   * ::collect:icon_name =size /color::
   */
  md.inline.ruler.before(
    'link',
    'icon',
    //               :     :      :      :
    createIconRule([0x3A, 0x3A, 0x3A, 0x3A]),
  )
  /**
   * :[collect:icon_name size/color]:
   * @deprecated
   */
  md.inline.ruler.before(
    'link',
    'icon_deprecated',
    //               :     [      ]      :
    createIconRule([0x3A, 0x5B, 0x5D, 0x3A], true),
  )

  md.renderer.rules.icon = (tokens, idx, _, env: MarkdownEnv) => {
    const { content, meta } = tokens[idx]
    let icon = content

    /* istanbul ignore if -- @preserve */
    if (meta.deprecated) {
      const [name, opt = ''] = content.split(' ')
      const [size, color] = opt.trim().split('/')
      icon = `${name}${size ? ` =${size}` : ''}${color ? ` /${color}` : ''}`

      logger.warn('icon', `The icon syntax of \`${colors.yellow(`:[${content}]:`)}\` is deprecated, please use \`${colors.green(`::${icon}::`)}\` instead. (${colors.gray(env.filePathRelative || env.filePath)})`)
    }

    return iconRender(icon, options)
  }
}
