import type { FeedChannel, FeedEntry } from './collect.js'
import type { FeedRenderContext } from './format.js'
import { cdata, escapeXml, FEED_GENERATOR, formatRfc822, resolveFeedFileUrl, toAbsoluteUrl, uniqueStrings } from './format.js'

/**
 * Resolve the latest updated date of the entries.
 *
 * 解析条目的最大更新时间。
 *
 * @param entries - Entries / 条目
 */
export function resolveLatestUpdated(entries: FeedEntry[]): Date | undefined {
  let latest: Date | undefined
  for (const entry of entries) {
    if (!latest || entry.updated.getTime() > latest.getTime())
      latest = entry.updated
  }
  return latest
}

/**
 * Render a channel as RSS 2.0.
 *
 * 将频道渲染为 RSS 2.0。
 *
 * @param channel - Channel / 频道
 * @param entries - Entries / 条目
 * @param ctx - Render context / 渲染上下文
 */
export function renderRss(channel: FeedChannel, entries: FeedEntry[], ctx: FeedRenderContext): string {
  const home = toAbsoluteUrl(ctx.hostname, ctx.base, channel.link)
  const self = resolveFeedFileUrl(channel.dir, ctx)
  const latest = resolveLatestUpdated(entries)

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(home)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
  ]

  if (channel.language)
    lines.push(`    <language>${escapeXml(channel.language)}</language>`)

  if (latest)
    lines.push(`    <lastBuildDate>${formatRfc822(latest)}</lastBuildDate>`)

  lines.push(`    <generator>${FEED_GENERATOR}</generator>`)

  if (channel.copyright)
    lines.push(`    <copyright>${escapeXml(channel.copyright)}</copyright>`)

  if (channel.ttl !== undefined)
    lines.push(`    <ttl>${channel.ttl}</ttl>`)

  lines.push(`    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />`)

  if (channel.hub)
    lines.push(`    <atom:link href="${escapeXml(channel.hub)}" rel="hub" />`)

  for (const entry of entries) {
    lines.push('    <item>')
    lines.push(`      <title>${escapeXml(entry.title)}</title>`)
    lines.push(`      <link>${escapeXml(entry.url)}</link>`)
    lines.push(`      <guid isPermaLink="${entry.id === entry.url ? 'true' : 'false'}">${escapeXml(entry.id)}</guid>`)
    lines.push(`      <pubDate>${formatRfc822(entry.published)}</pubDate>`)

    if (entry.summary)
      lines.push(`      <description>${escapeXml(entry.summary)}</description>`)

    if (entry.html)
      lines.push(`      <content:encoded>${cdata(entry.html)}</content:encoded>`)

    for (const category of uniqueStrings([...entry.tags, ...entry.categories]))
      lines.push(`      <category>${escapeXml(category)}</category>`)

    const author = entry.author[0]
    if (author?.name)
      lines.push(`      <dc:creator>${escapeXml(author.name)}</dc:creator>`)

    lines.push('    </item>')
  }

  lines.push('  </channel>', '</rss>')

  return `${lines.join('\n')}\n`
}
