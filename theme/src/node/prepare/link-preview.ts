import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemePageData } from '../../shared/index.js'
import { collectLinkPreviews } from '../features/linkPreview/index.js'
import { getThemeOptions } from '../options.js'
import { logger, perf } from '../utils/index.js'

/**
 * Prepare internal link previews
 *
 * 准备内链悬浮预览数据：把每条内链目标的轻量元数据写入源页的 `page.data.linkPreviews`。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareLinkPreview(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:link-preview')

  const pages = app.pages as Page<ThemePageData>[]

  try {
    // 主题级与所有语言级都未开启时，同样要执行一次以清理旧字段（配置热更新场景）
    const result = collectLinkPreviews(pages, options, app.options.base)

    if (app.env.isBuild) {
      logger.info(
        `link preview: ${result.items} items for ${result.pages} pages `
        + `(${result.links} internal links scanned)`,
      )
    }
  }
  catch (error) {
    logger.error('[link-preview] failed to collect link previews:', error)
  }

  perf.log('prepare:link-preview')
}
