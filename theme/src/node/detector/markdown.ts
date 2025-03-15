import type { ThemeOptions } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { logger } from '../utils/index.js'
import { MARKDOWN_SUPPORT_FIELDS } from './fields.js'

export function detectMarkdown(options: ThemeOptions): void {
  const { markdown } = options

  if (!markdown)
    return

  const unsupported = Object.keys(markdown).filter(key => !MARKDOWN_SUPPORT_FIELDS.includes(key as keyof ThemeOptions['markdown']))

  if (unsupported.length) {
    logger.warn(`\n${colors.green('markdown')} unsupported fields: ${unsupported.map(field => colors.yellow(`"${field}"`)).join(', ')}, please check your config.`)
  }
}
