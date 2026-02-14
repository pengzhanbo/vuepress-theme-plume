import type { Nullable } from '@pengzhanbo/utils'
import type { GitPluginPageData } from '@vuepress/plugin-git'
import type { ReadingTime } from '@vuepress/plugin-reading-time'
import type { PostsCategoryItem } from './features/index.js'

/**
 * Theme page data interface
 * Extends GitPluginPageData with theme-specific properties
 *
 * 主题页面数据接口
 * 扩展 GitPluginPageData，添加主题特定的属性
 */
export interface ThemePageData extends GitPluginPageData {
  /**
   * Page layout type
   * 页面布局类型
   *
   * @internal
   */
  type: 'friends' | 'posts' | 'posts-tags' | 'posts-archives' | 'posts-categories'
  /**
   * Blog post category list
   * 博客文章分类列表
   */
  categoryList?: PostsCategoryItem[]
  /**
   * File path relative to root directory
   * 相对于根目录的文件路径
   */
  filePathRelative: Nullable<string>
  /**
   * Reading time information
   * 阅读时间
   */
  readingTime?: ReadingTime
  /**
   * Whether to enable bulletin
   * 是否启用公告
   */
  bulletin?: boolean
}
