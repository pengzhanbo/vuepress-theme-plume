import type { FeedChannel, FeedEntry } from './collect.js'
import type { FeedRenderContext } from './format.js'
import { escapeXml, FEED_GENERATOR, FEED_GENERATOR_URI, formatRfc3339, resolveAssetUrl, resolveFeedFileUrl, toAbsoluteUrl, uniqueStrings } from './format.js'
import { resolveLatestUpdated } from './rss.js'

/**
 * `updated` value of an empty channel: a fixed epoch keeps the output deterministic.
 *
 * 空频道的 `updated` 值：固定 epoch 以保证输出确定性。
 */
const EMPTY_UPDATED = '1970-01-01T00:00:00Z'

/**
 * Render a channel as Atom 1.0.
 *
 * 将频道渲染为 Atom 1.0。
 *
 * @param channel - Channel / 频道
 * @param entries - Entries / 条目
 * @param ctx - Render context / 渲染上下文
 */
export function renderAtom(channel: FeedChannel, entries: FeedEntry[], ctx: FeedRenderContext): string {
  const home = toAbsoluteUrl(ctx.hostname, ctx.base, channel.link)
  const self = resolveFeedFileUrl(channel.dir, ctx)
  const latest = resolveLatestUpdated(entries)

  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom"${channel.language ? ` xml:lang="${escapeXml(channel.language)}"` : ''}>`,
    `  <id>${escapeXml(`${home}#feed`)}</id>`,
    `  <title>${escapeXml(channel.title)}</title>`,
  ]

  if (channel.description)
    lines.push(`  <subtitle>${escapeXml(channel.description)}</subtitle>`)

  lines.push(`  <updated>${latest ? formatRfc3339(latest) : EMPTY_UPDATED}</updated>`)
  lines.push(`  <link href="${escapeXml(self)}" rel="self" type="application/atom+xml" />`)
  lines.push(`  <link href="${escapeXml(home)}" />`)
  lines.push(`  <generator uri="${FEED_GENERATOR_URI}">${FEED_GENERATOR}</generator>`)

  if (channel.copyright)
    lines.push(`  <rights>${escapeXml(channel.copyright)}</rights>`)

  const icon = resolveAssetUrl(channel.icon, ctx.hostname, ctx.base)
  if (icon)
    lines.push(`  <icon>${escapeXml(icon)}</icon>`)

  const image = resolveAssetUrl(channel.image, ctx.hostname, ctx.base)
  if (image)
    lines.push(`  <logo>${escapeXml(image)}</logo>`)

  const author = channel.author[0]
  if (author) {
    lines.push('  <author>')
    if (author.name)
      lines.push(`    <name>${escapeXml(author.name)}</name>`)
    if (author.email)
      lines.push(`    <email>${escapeXml(author.email)}</email>`)
    if (author.url)
      lines.push(`    <uri>${escapeXml(author.url)}</uri>`)
    lines.push('  </author>')
  }

  for (const entry of entries) {
    lines.push('  <entry>')
    lines.push(`    <id>${escapeXml(entry.id)}</id>`)
    lines.push(`    <title>${escapeXml(entry.title)}</title>`)
    lines.push(`    <link href="${escapeXml(entry.url)}" />`)
    lines.push(`    <published>${formatRfc3339(entry.published)}</published>`)
    lines.push(`    <updated>${formatRfc3339(entry.updated)}</updated>`)

    if (entry.summary)
      lines.push(`    <summary type="text">${escapeXml(entry.summary)}</summary>`)

    if (entry.html)
      lines.push(`    <content type="html">${escapeXml(entry.html)}</content>`)

    for (const category of uniqueStrings([...entry.tags, ...entry.categories]))
      lines.push(`    <category term="${escapeXml(category)}" />`)

    lines.push('  </entry>')
  }

  lines.push('</feed>')

  return `${lines.join('\n')}\n`
}
