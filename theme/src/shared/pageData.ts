import type { Nullable } from '@pengzhanbo/utils'
import type { GitPluginPageData } from '@vuepress/plugin-git'
import type { ReadingTime } from '@vuepress/plugin-reading-time'
import type { PostsCategoryItem } from './features/index.js'

export interface ThemePageData extends GitPluginPageData {
  /**
   * 页面布局类型
   * @internal
   */
  type: 'friends' | 'posts' | 'posts-tags' | 'posts-archives' | 'posts-categories'
  /**
   * 博客文章分类列表
   */
  categoryList?: PostsCategoryItem[]
  /**
   * 相对于根目录的文件路径
   */
  filePathRelative: Nullable<string>
  /**
   * 阅读时间
   */
  readingTime?: ReadingTime
  /**
   * 是否启用公告
   */
  bulletin?: boolean
}
