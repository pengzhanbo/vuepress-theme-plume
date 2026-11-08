import type { ComputedRef } from 'vue'
import type { RelatedPostsOptions, ThemeRelatedPostItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useCollection } from './collections.js'
import { useData } from './data.js'

/**
 * Related posts result
 *
 * 相关文章 composable 的返回值
 */
export interface UseRelatedPostsResult {
  /**
   * Whether the block should render
   *
   * 是否渲染相关文章区块
   */
  enabled: ComputedRef<boolean>
  /**
   * Related posts resolved at build time
   *
   * 构建期计算出的相关文章
   */
  relatedPosts: ComputedRef<ThemeRelatedPostItem[]>
  /**
   * Title of the block
   *
   * 区块标题
   */
  title: ComputedRef<string>
  /**
   * Accessible name of the block
   *
   * 区块的无障碍名称
   */
  label: ComputedRef<string>
}

/**
 * Use related posts
 *
 * 读取构建期计算的相关文章数据。
 *
 */
export function useRelatedPosts(): UseRelatedPostsResult {
  const { theme, page, frontmatter } = useData()
  const collection = useCollection()

  // 集合级配置优先于主题级；`true` 表示按默认配置启用
  const options = computed<RelatedPostsOptions | null>(() => {
    const value = collection.value?.relatedPosts ?? theme.value.relatedPosts
    if (!value)
      return null

    return typeof value === 'object' ? value : {}
  })

  const enabled = computed(() =>
    !!options.value && frontmatter.value.relatedPosts !== false,
  )

  const relatedPosts = computed<ThemeRelatedPostItem[]>(() => page.value.relatedPosts ?? [])

  const title = computed(() =>
    options.value?.title || theme.value.relatedPostsText || 'Related Posts',
  )

  const label = computed(() =>
    theme.value.relatedPostsLabel || title.value,
  )

  return { enabled, relatedPosts, title, label }
}
