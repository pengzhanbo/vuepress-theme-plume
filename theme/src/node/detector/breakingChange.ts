/**
 * 检查由于版本变更，配置中出现破坏性更改时，输出警告。
 * 提醒用户更新配置，或告知用户进行迁移。
 */
import type { ThemeOptions } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { createTranslate, logger } from '../utils/index.js'

const t = createTranslate({
  en: {
    blog: `${colors.gray('blog')} configuration has been removed and migrated to collections. Please refer to the migration documentation: ${colors.cyan('https://theme-plume.vuejs.press/blog/dk58a4t2/')}`,
    notes: `${colors.gray('notes')} configuration has been removed and migrated to collections. Please refer to the migration documentation: ${colors.cyan('https://theme-plume.vuejs.press/blog/dk58a4t2/')}`,
  },
  zh: {
    blog: `${colors.gray('blog')} 配置已移除，迁移到集合中，请查看迁移文档：${colors.cyan('https://theme-plume.vuejs.press/blog/dk58a4t2/')}`,
    notes: `${colors.gray('notes')} 配置已移除，迁移到集合中，请查看迁移文档：${colors.cyan('https://theme-plume.vuejs.press/blog/dk58a4t2/')}`,
  },
})

export function detectBreakingChange(options: ThemeOptions): void {
  withBlogAndNotesHaveBeenDelete(options)
}

/**
 * @since `v1.0.0-rc.165`
 * @description 博客和笔记已经被删除，迁移到 collections 实现
 */
function withBlogAndNotesHaveBeenDelete(options: ThemeOptions): void {
  if ('blog' in options && options.collections?.length === 0) {
    logger.warn(t('blog'))
  }

  let shouldMigrateNotes = false
  if ((options.notes as any)?.length && options.collections?.length === 0) {
    shouldMigrateNotes = true
  }

  for (const locale of Object.values(options.locales || {})) {
    if ((locale.notes as any)?.length && locale.collections?.length === 0) {
      shouldMigrateNotes = true
    }
  }
  if (shouldMigrateNotes) {
    logger.warn(t('notes'))
  }
}
