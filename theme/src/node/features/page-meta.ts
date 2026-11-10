/**
 * Page metadata readers shared by the data pipeline.
 *
 * 数据流水线共用的页面元信息读取工具：日期、标签等字段的解析与归一化。
 */

import type { Page } from 'vuepress'
import type { ThemePageData } from '../../shared/index.js'
import dayjs from 'dayjs'
import { POST_DATE_FORMAT } from '../utils/index.js'

/**
 * Format a date with the post date format used by the client.
 *
 * 使用客户端展示文章时间的格式格式化日期。
 *
 * @param value - Date, timestamp or date string / 日期、时间戳或日期字符串
 */
export function formatPostDate(value: Date | number | string): string {
  return dayjs(new Date(value)).format(POST_DATE_FORMAT)
}

/**
 * Parse a frontmatter date value.
 *
 * 解析 frontmatter 中的日期值，缺失或非法时返回 `undefined`。
 *
 * @param value - Raw value / 原始值
 */
export function toDate(value: unknown): Date | undefined {
  if (!value)
    return undefined

  // VuePress 对缺失的日期使用 `0000-00-00` 作为初始值
  if (value === '0000-00-00')
    return undefined

  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? undefined : value

  if (typeof value !== 'string' && typeof value !== 'number')
    return undefined

  const date = dayjs(value)
  return date.isValid() ? date.toDate() : undefined
}

/**
 * Read the create time declared by the page.
 *
 * 读取页面声明的创建时间：`frontmatter.createTime` → `frontmatter.date` → `page.date`。
 *
 * @param page - Page / 页面
 */
export function resolvePageCreateTime(page: Page<ThemePageData>): Date | undefined {
  return toDate(page.frontmatter.createTime)
    ?? toDate(page.frontmatter.date)
    ?? toDate(page.date)
}

/**
 * Resolve the published and updated date of a page, the git plugin provides the fallback.
 *
 * 解析页面的发布时间与更新时间，缺失时回退到 git 插件提供的文件时间。
 *
 * @param page - Page / 页面
 * @returns Dates, `undefined` when the page has no date at all / 日期，完全没有日期时为 `undefined`
 */
export function resolvePageDates(page: Page<ThemePageData>): { published: Date, updated: Date } | undefined {
  const git = page.data.git

  const published = toDate(page.frontmatter.createTime)
    ?? toDate(page.frontmatter.date)
    ?? toDate(git?.createdTime)
    ?? toDate(git?.updatedTime)

  if (!published)
    return undefined

  return {
    published,
    updated: toDate(git?.updatedTime) ?? published,
  }
}

/**
 * Read the non empty tags of a page.
 *
 * 读取页面的标签，过滤掉空值与非字符串项。
 *
 * @param page - Page / 页面
 * @param limit - Max items, `0` means unlimited / 最多保留的条数，`0` 表示不限制
 */
export function resolvePageTags(page: Page<ThemePageData>, limit = 0): string[] {
  const tags = (page.frontmatter as Record<string, unknown>).tags
  if (!Array.isArray(tags))
    return []

  const list = tags.filter((item): item is string => typeof item === 'string' && !!item)
  return limit > 0 ? list.slice(0, limit) : list
}
