import type { ComputedRef, Ref } from 'vue'
import type { ThemeSeries, ThemeSeriesChapter, ThemeSeriesData } from '../../shared/index.js'
import { seriesData as seriesDataRaw } from '@internal/seriesData'
import { computed, ref } from 'vue'
import { useRoute, useRouteLocale } from 'vuepress/client'
import { isSamePath, resolveSeriesPage } from '../utils/index.js'
import { useData } from './data.js'

/**
 * Series index reference, shared by every consumer.
 *
 * 系列索引引用，所有消费者共用。
 */
export const seriesData: Ref<ThemeSeriesData> = ref(seriesDataRaw)

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSeriesData = (data: ThemeSeriesData) => {
    seriesData.value = data
  }
}

/**
 * Series composable result
 *
 * 系列 composable 的返回值
 */
export interface UseSeriesResult {
  /**
   * Series of the current page, `null` when the page belongs to no series
   *
   * 当前页所属的系列，不属于任何系列时为 `null`
   */
  series: ComputedRef<ThemeSeries | null>
  /**
   * Chapter matching the current route
   *
   * 与当前路由匹配的章节
   */
  chapter: ComputedRef<ThemeSeriesChapter | null>
  /**
   * Whether the in-page links should render
   *
   * 是否渲染页内互链（文首 + 文末）
   */
  enabled: ComputedRef<boolean>
  /**
   * Next chapter, `null` on the last chapter
   *
   * 下一篇，末篇为 `null`
   */
  next: ComputedRef<ThemeSeriesChapter | null>
  /** Series name with the locale quotes / 带书名号的系列名 */
  name: ComputedRef<string>
  /** `3 of 12` / 第 3 / 共 12 篇 */
  chapterText: ComputedRef<string>
  /** Label of the head hint / 文首提示的前缀 */
  includedLabel: ComputedRef<string>
  /** Label of the next chapter / 「下一篇」标签 */
  nextLabel: ComputedRef<string>
  /** Label of the last chapter / 「已完结」标签 */
  finishedLabel: ComputedRef<string>
  /** Accessible name of the tail block / 文末区块的无障碍名称 */
  navLabel: ComputedRef<string>
}

function findSeriesById(locale: string, id: string): ThemeSeries | null {
  return seriesData.value[locale]?.[id]
    // `permalink` 可能让页面落在别的语言前缀下，退化为全局查找
    ?? Object.values(seriesData.value).find(item => !!item[id])?.[id]
    ?? null
}

/**
 * Use series
 *
 * 读取构建期生成的系列索引，得到当前页所属的系列、章节与下一篇。
 */
export function useSeries(): UseSeriesResult {
  const route = useRoute()
  const routeLocale = useRouteLocale()
  const { theme, frontmatter } = useData()

  const series = computed<ThemeSeries | null>(() => {
    const id = frontmatter.value.series
    if (typeof id !== 'string' || !id)
      return null
    return findSeriesById(routeLocale.value, id)
  })

  const index = computed(() => {
    const chapters = series.value?.chapters
    if (!chapters)
      return -1
    return chapters.findIndex(item => isSamePath(item.path, route.path))
  })

  const chapter = computed(() =>
    index.value < 0 ? null : series.value!.chapters[index.value]!,
  )

  // 三重条件：属于系列 + 当前页是其中一章 + 系列与当前页都开启了互链
  const enabled = computed(() =>
    !!series.value
    && series.value.nav !== false
    && !!chapter.value
    && frontmatter.value.seriesNav !== false,
  )

  const next = computed(() => {
    const chapters = series.value?.chapters
    if (!chapters || index.value < 0 || index.value + 1 >= chapters.length)
      return null
    return chapters[index.value + 1]!
  })

  const name = computed(() =>
    (theme.value.seriesNameText || '“{title}”').replace('{title}', series.value?.title ?? ''),
  )

  const chapterText = computed(() =>
    (theme.value.seriesChapterText || '{index} of {total}')
      .replace('{index}', String(chapter.value?.order ?? 0))
      .replace('{total}', String(series.value?.chapters.length ?? 0)),
  )

  const includedLabel = computed(() => theme.value.seriesIncludedText || 'This post is part of')
  const nextLabel = computed(() => theme.value.seriesNextText || 'Next')
  const finishedLabel = computed(() => theme.value.seriesFinishedText || 'Completed')
  const navLabel = computed(() => theme.value.seriesNavLabel || 'Series navigation')

  return { series, chapter, enabled, next, name, chapterText, includedLabel, nextLabel, finishedLabel, navLabel }
}

/**
 * Use the series list of the current locale, used by the overview page.
 *
 * 获取当前语言下的全部系列，供系列总览页使用。
 *
 * @returns Series of the current locale / 当前语言的系列列表
 */
export function useSeriesList(): ComputedRef<ThemeSeries[]> {
  const routeLocale = useRouteLocale()

  return computed(() => Object.values(seriesData.value[routeLocale.value] ?? {}))
}

/**
 * Use the series of the current landing page.
 *
 * 获取当前系列落地页对应的系列
 *
 * @returns Series of the landing page, `null` when it cannot be resolved
 *          落地页对应的系列，无法解析时为 `null`
 */
export function useSeriesPage(): ComputedRef<ThemeSeries | null> {
  const route = useRoute()
  const routeLocale = useRouteLocale()
  const { frontmatter } = useData()

  return computed<ThemeSeries | null>(() => resolveSeriesPage(
    seriesData.value,
    routeLocale.value,
    route.path,
    (frontmatter.value as Record<string, unknown>).seriesId,
  ))
}
