import type { FeedAuthor } from '../../../shared/index.js'
import type { FeedChannel, FeedEntry } from './collect.js'
import type { FeedRenderContext } from './format.js'
import { formatRfc3339, resolveAssetUrl, resolveFeedFileUrl, toAbsoluteUrl, uniqueStrings } from './format.js'

/**
 * JSON Feed version identifier.
 *
 * JSON Feed 版本标识。
 */
const JSON_FEED_VERSION = 'https://jsonfeed.org/version/1.1'

function toJsonAuthors(authors: FeedAuthor[]): Array<Record<string, string>> {
  return authors.map((author) => {
    const item: Record<string, string> = {}
    if (author.name)
      item.name = author.name
    if (author.url)
      item.url = author.url
    if (author.email)
      item.email = author.email
    return item
  }).filter(item => Object.keys(item).length > 0)
}

/**
 * Render a channel as JSON Feed 1.1.
 *
 * The object is built explicitly with a fixed key order, then serialized with
 * two-space indentation and a trailing newline.
 *
 * 将频道渲染为 JSON Feed 1.1：显式构造固定键顺序的对象，使用两空格缩进并保留末尾换行。
 *
 * @param channel - Channel / 频道
 * @param entries - Entries / 条目
 * @param ctx - Render context / 渲染上下文
 */
export function renderJson(channel: FeedChannel, entries: FeedEntry[], ctx: FeedRenderContext): string {
  const feed: Record<string, unknown> = {
    version: JSON_FEED_VERSION,
    title: channel.title,
    home_page_url: toAbsoluteUrl(ctx.hostname, ctx.base, channel.link),
    feed_url: resolveFeedFileUrl(channel.dir, ctx),
  }

  if (channel.description)
    feed.description = channel.description

  if (channel.language)
    feed.language = channel.language

  const icon = resolveAssetUrl(channel.icon, ctx.hostname, ctx.base)
  if (icon)
    feed.icon = icon

  const authors = toJsonAuthors(channel.author)
  if (authors.length)
    feed.authors = authors

  feed.items = entries.map((entry) => {
    const item: Record<string, unknown> = {
      id: entry.id,
      url: entry.url,
      title: entry.title,
    }

    if (entry.summary)
      item.summary = entry.summary

    if (channel.content === 'full' && entry.html) {
      item.content_html = entry.html
    }
    else {
      // JSON Feed 1.1 要求 `content_html` 或 `content_text` 至少存在一个
      item.content_text = entry.summary
    }

    item.date_published = formatRfc3339(entry.published)
    item.date_modified = formatRfc3339(entry.updated)

    const tags = uniqueStrings([...entry.tags, ...entry.categories])
    if (tags.length)
      item.tags = tags

    return item
  })

  return `${JSON.stringify(feed, null, 2)}\n`
}
