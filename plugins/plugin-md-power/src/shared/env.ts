/* eslint-disable jsdoc/no-multi-asterisks */
export interface MarkdownEnvPreset {
  /**
   * markdown reference preset, use in any markdown file
   *
   * markdown 引用链接预设，可在任何 markdown 文件中使用
   *
   * @see https://www.markdownguide.org/basic-syntax/#reference-style-links
   *
   * @example
   * ```ts
   * // config
   * {
   *   'label-1': 'http://example.com/',
   *   'label-2': { href: 'http://example.com/', title: 'title' }
   * }
   * ```
   * use `*.md`:
   * ```markdown
   * [link][label-1]
   * [link][label-2]
   * ```
   * same as 等价于
   * ```markdown
   * [label-1]: http://example.com/
   * [label-2]: http://example.com/ "title"
   *
   * [link][label-1]
   * [link][label-2]
   * ```
   */
  references?: Record<string, string | { title?: string, href: string }>
  /**
   * markdown abbreviation preset, use in any markdown file
   *
   * markdown 缩写词预设，可在任何 markdown 文件中使用
   *
   * @example
   * ```ts
   * // config
   * {
   *   'HTML': 'HyperText Markup Language',
   *   'W3C': 'World Wide Web Consortium',
   * }
   * ```
   * use `*.md`:
   * ```markdown
   * The HTML specification is maintained by the W3C.
   * ```
   * same as 等价于
   * ```markdown
   * *[HTML]: Hyper Text Markup Language
   * *[W3C]: World Wide Web Consortium
   *
   * The HTML specification is maintained by the W3C.
   * ```
   */
  abbreviations?: Record<string, string>
  /**
   * markdown annotation preset, use in any markdown file
   *
   * markdown 内容注释预设，可在任何 markdown 文件中使用
   *
   * @example
   * ```ts
   * // config
   * {
   *   'vuepress': 'vuepress is a Vue.js based documentation generator',
   *   'vuepress-theme-plume': 'vuepress-theme-plume is a theme for vuepress',
   * }
   * ```
   * use `*.md`:
   * ```markdown
   * [+vuepress-theme-plume] is a theme for [+vuepress]
   * ```
   * same as 等价于
   * ```markdown
   * [+vuepress]: vuepress is a Vue.js based documentation generator
   * [+vuepress-theme-plume]: vuepress-theme-plume is a theme for vuepress
   *
   * [+vuepress-theme-plume] is a theme for [+vuepress]
   * ```
   */
  annotations?: Record<string, string | string[]>
}
