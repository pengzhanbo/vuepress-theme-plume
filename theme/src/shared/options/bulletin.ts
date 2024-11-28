import type { Page } from 'vuepress'

/**
 * 公告栏配置
 */
export type BulletinOptions<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  /**
   * 公告位置
   * @default 'top-right'
   */
  layout?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

  /**
   * 是否显示渐变边框
   *
   * @default true
   */
  border?: boolean

  /**
   * 在哪些页面显示公告
   *
   * - `true` 表示所有页面
   * - `false` 表示不显示
   * - 传入一个函数，返回 `true` 时显示
   */
  enablePage?: boolean | ((page: Page) => boolean)

  /**
   * 公告持续时间
   *
   * @default 'always'
   *
   * - `'session'` 表示在会话周期内关闭公告后不再显示，在新的会话周期重新显示，刷新页面不会重新显示
   * - `'always'` 表示总是显示，关闭公告后刷新页面会重新显示
   * - `'once'` 表示在仅在当前周期内显示，关闭公告后不再显示，新的会话和刷新页面都不会重新显示
   */
  lifetime?: 'session' | 'always' | 'once'

  /**
   * 公告 ID
   *
   * 公告持续时间 需要根据 `id` 作为唯一标识
   */
  id?: string

  /**
   * 公告标题
   */
  title?: string

  /**
   * 公告内容
   *
   * 可以使用 markdown 语法 或者 使用 html 文本，
   * 使用 markdown 时需要声明 `contentType` 为 `markdown`
   */
  content?: string

  /**
   * 公告内容 类型
   *
   * - `markdown` 表示使用 markdown 语法
   * - `text` 表示使用 普通文本 （可以是 html 内容）
   *
   * @default 'text'
   */
  contentType?: 'markdown' | 'text'

  /**
   * 传入一个 `markdown` 或 `html` 文件路径，并使用文件内容作为公告内容
   *
   * - 使用 `.md` 文件时，将会解析 markdown 语法
   * - 使用 `.html` 文件时，只能包含公告内容，请不要使用 `<html>` `<body>` `<script>` 等标签。
   */
  contentFile?: string
}
