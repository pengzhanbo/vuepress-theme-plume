import type { App } from 'vuepress/core'
import type { FileTreeIconMode } from './fileTree'

export interface CodeTreeOptions {
  icon?: FileTreeIconMode
  height?: string | number
  ignores?: string[]
  loaders?: CodeTreeFileLoader[]
}

/**
 * File descriptor used by loaders when processing embedded directories.
 *
 * 文件描述符，在处理嵌入目录时由加载器使用。
 *
 * @example
 * ```ts
 * const file: CodeTreeFile = {
 *   path: 'src/index.ts',
 *   absolutePath: '/project/src/index.ts',
 *   relativePath: '../src/index.ts',
 *   extname: 'ts',
 *   basename: 'index.ts',
 * }
 * ```
 */
export interface CodeTreeFile {
  /** Path relative to the embedded directory. / 相对于嵌入目录的路径。 */
  path: string
  /** Absolute path on the filesystem. / 文件系统上的绝对路径。 */
  absolutePath: string
  /** Path relative to the current markdown file. / 相对于当前 markdown 文件的路径。 */
  relativePath: string
  /** File extension without the leading dot. / 文件扩展名（不含前导点）。 */
  extname: string
  /** File name including extension. / 包含扩展名的文件名。 */
  basename: string
}

/**
 * Custom file loader for the embed syntax.
 *
 * 嵌入语法的自定义文件加载器。
 *
 * Each loader declares a filter (glob pattern, array of patterns, or predicate
 * function) and a `load` function that returns markdown content for matching files.
 *
 * 每个加载器声明一个 filter（glob 模式、模式数组或断言函数）和一个 `load` 函数，
 * 后者为匹配的文件返回 markdown 内容。
 *
 * @example
 * ```ts
 * const loader: CodeTreeFileLoader = {
 *   filter: ['**\/*.md'],
 *   load: (file) => `\`\`\`md [${file.path}]\n${fs.readFileSync(file.absolutePath, 'utf-8')}\n\`\`\``,
 * }
 * ```
 */
export interface CodeTreeFileLoader {
  /**
   * Filter that determines which files this loader handles.
   *
   * 决定该加载器处理哪些文件的过滤器。
   *
   * - `string`: A glob pattern / glob 模式
   * - `string[]`: Multiple glob patterns / 多个 glob 模式
   * - `function`: A predicate receiving a `CodeTreeFile` / 接收 `CodeTreeFile` 的断言函数
   */
  filter: string | string[] | ((file: CodeTreeFile) => boolean)

  /**
   * Load function that returns markdown content for the matched file.
   *
   * 为匹配的文件返回 markdown 内容的加载函数。
   *
   * The returned string should be valid markdown (e.g. a fenced code block)
   * so it can be rendered by markdown-it.
   *
   * 返回的字符串应为合法的 markdown（如围栏代码块），以便被 markdown-it 渲染。
   */
  load: (file: CodeTreeFile, app: App) => string
}

/**
 * Code tree metadata
 *
 * code-tree 容器元信息
 */
export interface CodeTreeMeta {
  title?: string
  /**
   * File icon type
   *
   * 文件图标类型
   */
  icon?: FileTreeIconMode
  /**
   * Code tree container height
   *
   * 代码树容器高度
   */
  height?: string

  /**
   * Entry file, opened by default
   *
   * 入口文件，默认打开
   */
  entry?: string

  /**
   * Show sidebar
   *
   * 是否显示侧边栏
   */
  showSidebar?: boolean
}

/**
 * File tree node type
 *
 * 文件树节点类型
 */
export interface FileTreeNode {
  level: number
  children?: FileTreeNode[]
  filename: string
  filepath?: string
}
