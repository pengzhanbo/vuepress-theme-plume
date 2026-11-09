import type { App } from 'vuepress'
import type { FeedFormat, ThemeOptions } from '../../../shared/index.js'
import type { FeedChannel } from './collect.js'
import type { ResolvedFeedOptions } from './options.js'
import { Buffer } from 'node:buffer'
import { objectKeys } from '@pengzhanbo/utils'
import { fs, path } from 'vuepress/utils'
import { getThemeOptions } from '../../options.js'
import { logger, perf } from '../../utils/index.js'
import { renderAtom } from './atom.js'
import { buildEntries, resolveFeedChannels } from './collect.js'
import { renderJson } from './json.js'
import { resolveHostname, resolveLocaleFeedOptions } from './options.js'
import { renderRss } from './rss.js'

/**
 * Emit a warning when a single feed grows beyond this size.
 *
 * 单个 feed 超过该体积时输出警告。
 */
const MAX_FEED_SIZE = 10 * 1024 * 1024

interface WrittenFeed {
  channel: FeedChannel
  format: FeedFormat
  size: number
}

function renderFeed(
  format: FeedFormat,
  channel: FeedChannel,
  entries: ReturnType<typeof buildEntries>['entries'],
  hostname: string,
  base: string,
  filename: string,
): string {
  const ctx = { hostname, base, filename }
  if (format === 'rss')
    return renderRss(channel, entries, ctx)
  if (format === 'atom')
    return renderAtom(channel, entries, ctx)
  return renderJson(channel, entries, ctx)
}

async function generate(app: App, options: ThemeOptions): Promise<void> {
  const locales = objectKeys(options.locales ?? {})
    .map(locale => ({ locale, resolved: resolveLocaleFeedOptions(options, locale) }))
    .filter((item): item is { locale: string, resolved: ResolvedFeedOptions } => !!item.resolved)

  // 未启用时不产生任何日志与文件 / Do nothing when the feature is disabled
  if (!locales.length)
    return

  if (options.encrypt?.global) {
    logger.warn('[feed] feed is disabled because `encrypt.global` is enabled: the whole site is protected.')
    return
  }

  const hostname = resolveHostname(options.hostname)
  if (!hostname) {
    logger.warn('[feed] `hostname` is required to generate absolute links, feed is skipped.')
    return
  }

  perf.mark('generate:feed')

  const written = new Map<string, WrittenFeed>()
  let entryCount = 0
  let skippedPages = 0
  let debug = false

  for (const { locale, resolved } of locales) {
    for (const channel of resolveFeedChannels(app, options, locale, resolved)) {
      const { entries, skipped } = buildEntries(channel, app, resolved, hostname)
      entryCount += entries.length
      skippedPages += skipped

      debug ||= resolved.debug

      if (resolved.debug) {
        const latest = entries[0]?.updated
        logger.info(
          `[feed] ${channel.link} -> ${channel.formats.length} file(s), ${entries.length} item(s)`
          + `${latest ? `, latest ${latest.toISOString()}` : ''}`
          + `${skipped ? `, ${skipped} page(s) skipped without date` : ''}`,
        )
      }

      for (const format of channel.formats) {
        // `app.dir.dest()` 需要相对路径，根语言环境的全局频道必须使用 `feed.xml`
        // The path passed to `app.dir.dest()` must be relative.
        const filename = resolved.filename[format]
        const filepath = channel.dir ? `${channel.dir}/${filename}` : filename

        if (written.has(filepath)) {
          logger.warn(`[feed] output conflict: \`${filepath}\`, the feed of \`${channel.title}\` is skipped.`)
          continue
        }

        try {
          const content = renderFeed(format, channel, entries, hostname, app.options.base, filename)
          const target = app.dir.dest(filepath)
          await fs.promises.mkdir(path.dirname(target), { recursive: true })
          await fs.promises.writeFile(target, content, 'utf-8')

          const size = Buffer.byteLength(content)
          written.set(filepath, { channel, format, size })

          if (size > MAX_FEED_SIZE) {
            logger.warn(
              `[feed] \`${filepath}\` is ${(size / 1024 / 1024).toFixed(1)} MB, `
              + 'consider using `content: \'excerpt\'` or a smaller `limit`.',
            )
          }
        }
        catch (error) {
          logger.error(`[feed] failed to write \`${filepath}\`:`, error)
        }
      }
    }
  }

  perf.log('generate:feed')

  const totalSize = [...written.values()].reduce((sum, item) => sum + item.size, 0)
  logger.info(
    `[feed] generated ${written.size} file(s) with ${entryCount} item(s)`
    + `${skippedPages ? `, ${skippedPages} page(s) skipped without date` : ''}`
    + `${debug && totalSize ? `, ${(totalSize / 1024).toFixed(1)} KB` : ''}.`,
  )
}

/**
 * Generate RSS / Atom / JSON feeds at the end of a production build.
 *
 * Writes files into `dist`, logs a summary, and never throws: a failing feed
 * must not break the build.
 *
 * 在生产构建结束时生成 RSS / Atom / JSON feed：写入 `dist`、输出日志摘要，
 * 且永不抛出异常，避免阻断构建。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置
 */
export async function generateFeeds(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  if (!app.env.isBuild)
    return

  try {
    await generate(app, options)
  }
  catch (error) {
    logger.error('[feed] failed to generate feeds:', error)
  }
}

export * from './collect.js'
export * from './format.js'
export * from './options.js'
