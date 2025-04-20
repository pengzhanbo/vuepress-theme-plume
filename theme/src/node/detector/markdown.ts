import type { ThemeOptions } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { createTranslate, logger } from '../utils/index.js'
import { MARKDOWN_SUPPORT_FIELDS } from './fields.js'

const t = createTranslate({
  en: { message: '{{ markdown }} unsupported fields: {{ unsupported }}, please check your config.' },
  zh: { message: '{{ markdown }} 不支持以下字段: {{ unsupported }}, 请检查你的配置。' },
})

export function detectMarkdown(options: ThemeOptions): void {
  const { markdown } = options

  if (!markdown)
    return

  const unsupported = Object.keys(markdown).filter(key => !MARKDOWN_SUPPORT_FIELDS.includes(key as keyof ThemeOptions['markdown']))

  if (unsupported.length) {
    logger.warn(t('message', {
      markdown: colors.green('markdown'),
      unsupported: unsupported.map(field => colors.magenta(`"${field}"`)).join(', '),
    }))
  }
}
