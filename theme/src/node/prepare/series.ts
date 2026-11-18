import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemePageData, ThemeSeriesData } from '../../shared/index.js'
import type { ResolvedSeries } from '../features/series/index.js'
import { resolveSeriesFeedUrls } from '../features/feed/plan.js'
import { collectSeries } from '../features/series/collect.js'
import { collectOccupiedPaths } from '../features/series/pages.js'
import { getThemeOptions } from '../options.js'
import { genTempCode, logger, perf, writeTemp } from '../utils/index.js'

/**
 * Chapter count above which the index size is reported as a warning.
 *
 * 超过该章节数时提示索引体积。
 */
const LARGE_INDEX_CHAPTERS = 500

/**
 * Index size above which the index should be split by locale.
 *
 * 超过该体积时应按语言分片。
 */
const LARGE_INDEX_SIZE = 100 * 1024

/**
 * Convert the resolved series into the serializable client data.
 *
 *
 * 将解析后的系列转换为可序列化的客户端数据。结果以对象字面量写入虚拟模块
 *
 * @param series - Resolved series / 解析后的系列
 * @param feedUrls - Subscription URL per `` `${locale}::${id}` `` key / 以 `` `${locale}::${id}` `` 为键的订阅地址
 */
export function toSeriesData(
  series: ResolvedSeries[],
  feedUrls: Map<string, string> = new Map(),
): ThemeSeriesData {
  const data: ThemeSeriesData = Object.create(null)

  for (const item of series) {
    data[item.locale] ??= {}
    data[item.locale][item.id] = {
      id: item.id,
      title: item.title,
      description: item.description,
      cover: item.cover,
      link: item.link,
      // 展示开关在构建期解析后随索引下发，客户端因此不需要读取 `series` 配置
      nav: item.nav,
      feedUrl: feedUrls.get(`${item.locale}::${item.id}`),
      chapters: item.chapters.map(chapter => ({
        path: chapter.path,
        title: chapter.title,
        order: chapter.order,
        createTime: chapter.createTimeText,
        readingTime: chapter.readingTime,
        draft: chapter.draft || undefined,
      })),
    }
  }

  return data
}

/**
 * Prepare series data
 *
 * 准备系列数据：收集并排序全站系列，写入 `@internal/seriesData`。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareSeries(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:series')

  let data: ThemeSeriesData = {}

  try {
    const pages = app.pages as Page<ThemePageData>[]
    const series = collectSeries(pages, options, {
      isBuild: app.env.isBuild,
      occupiedPaths: collectOccupiedPaths(pages),
    })

    data = toSeriesData(series, resolveSeriesFeedUrls(app, options))

    if (app.env.isBuild) {
      const chapters = series.reduce((total, item) => total + item.chapters.length, 0)
      logger.info(`series: ${series.length} series, ${chapters} chapter(s)`)

      if (chapters > LARGE_INDEX_CHAPTERS)
        logger.warn(`[series] ${chapters} chapters are indexed, consider splitting the index by locale.`)

      const size = JSON.stringify(data).length
      if (size > LARGE_INDEX_SIZE)
        logger.warn(`[series] the index is ${(size / 1024).toFixed(1)} KB, consider splitting it by locale.`)
    }
  }
  catch (error) {
    logger.error('[series] failed to prepare series data:', error)
  }

  await writeTemp(app, 'internal/seriesData.js', genTempCode(app, { name: 'seriesData', content: data }))

  perf.log('prepare:series')
}
