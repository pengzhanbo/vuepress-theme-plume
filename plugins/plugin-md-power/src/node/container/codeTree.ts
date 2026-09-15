/**
 * Code tree container plugin
 *
 * code-tree 容器
 * ````md
 * ::: code-tree title="Project Name" height="400px" entry="filepath"
 * ``` lang :active title="filepath"
 * ```
 * <!-- more code block -->
 * :::
 * ````
 *
 * Embed syntax
 *
 * `@[code-tree title="Project Name" height="400px" entry="filepath"](dir_path)`
 */

import type { App, Page } from 'vuepress/core'
import type { Markdown } from 'vuepress/markdown'
import type { CodeTreeFile, CodeTreeFileLoader, CodeTreeMeta, CodeTreeOptions, FileTreeIconMode, FileTreeNode } from '../../shared/index.js'
import type { FileTreeNodeProps } from './fileTree.js'
import path from 'node:path'
import { attempt, escape, isFunction, slash } from '@pengzhanbo/utils'
import { bundledLanguagesInfo } from 'shiki'
import { ensureEndingSlash, ensureLeadingSlash, removeLeadingSlash } from 'vuepress/shared'
import { colors, fs, tinyglobby } from 'vuepress/utils'
import { findFile } from '../demo/supports/file.js'
import { createEmbedRuleBlock } from '../embed/createEmbedRuleBlock.js'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { createMatcher } from '../utils/createMatcher.js'
import { logger } from '../utils/logger.js'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttr, resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * File extensions supported by Shiki for syntax highlighting.
 *
 * Shiki 支持语法高亮的文件扩展名列表。
 *
 * Includes both language IDs and their aliases, used to determine whether a
 * file can be rendered as a fenced code block with syntax highlighting.
 *
 * 包含语言 ID 及其别名，用于判断文件是否可以作为带语法高亮的围栏代码块渲染。
 */
const supportedTextExts = bundledLanguagesInfo
  .map(({ id, aliases = [] }) => [id, ...aliases])
  .flat()

/** Six backticks, used as the fence delimiter for code blocks. / 六个反引号，用作代码块的围栏分隔符。 */
const FENCE = '`'.repeat(6)

/**
 * Browser-supported image file name extensions.
 *
 * 浏览器支持的图片文件名扩展名。
 */
export const EXTENSION_IMAGES: string[] = ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'apng', 'jfif', 'pjpeg', 'pjp', 'xbm']

/**
 * Generate a fenced code block string for a file.
 *
 * 为文件生成围栏代码块字符串。
 *
 * Uses six backticks as the fence delimiter to avoid conflicts with the
 * standard three-backtick fences. The filename is included in the info
 * string via the `[filename]` syntax so the code-tree can identify it.
 *
 * 使用六个反引号作为围栏分隔符，以避免与标准的三反引号围栏冲突。
 * 文件名通过 `[文件名]` 语法包含在信息字符串中，以便代码树识别。
 *
 * @param file - The file descriptor / 文件描述符
 * @param lang - Optional language override / 可选的语言覆盖
 * @returns Fenced code block string / 围栏代码块字符串
 */
export function loadCodeContent(file: CodeTreeFile, lang?: string) {
  return `${FENCE}${lang ?? file.extname} title="${escape(file.path)}"\n${fs.readFileSync(file.absolutePath, 'utf-8').trim()}\n${FENCE}\n`
}

/**
 * Built-in file loaders used by the embed syntax.
 *
 * 嵌入语法使用的内置文件加载器。
 *
 * These loaders handle common file types and are merged after user-provided
 * loaders, so custom loaders take precedence. The built-in loaders cover:
 *
 * - `.editorconfig`: Rendered as TOML
 * - Dot files (`.git*`, `.env*`, `.*ignore`, `.npmrc`): Rendered as plain text
 * - `.XXXrc` config files (e.g. `.eslintrc`): Rendered as JSON
 * - Image files: Rendered as `<img>` tags with proper `src` resolution
 * - Source files supported by Shiki: Rendered as fenced code blocks
 *
 * 这些加载器处理常见文件类型，并合并到用户提供的加载器之后，因此自定义加载器具有更高优先级。
 * 内置加载器覆盖：
 *
 * - `.editorconfig`：以 TOML 格式渲染
 * - 点文件（`.git*`、`.env*`、`.*ignore`、`.npmrc`）：以纯文本渲染
 * - `.XXXrc` 配置文件（如 `.eslintrc`）：以 JSON 格式渲染
 * - 图片文件：渲染为 `<img>` 标签，并正确解析 `src`
 * - Shiki 支持的源文件：渲染为围栏代码块
 */
const defaultLoader: CodeTreeFileLoader[] = [
  {
    filter: ({ basename }) => basename === '.editorconfig',
    load: file => loadCodeContent(file, 'toml'),
  },
  // Load dot files / 加载点文件
  {
    filter: ['.git*', '.env*', '.*ignore', '.npmrc'].map(item => `**/${item}`),
    load: file => loadCodeContent(file, 'txt'),
  },
  // .XXXrc config files (e.g. .eslintrc), typically treated as JSON
  // .XXXrc 格式的配置文件，比如 .eslintrc， 此类文件通常被当做 json 处理
  {
    filter: ({ basename }) => basename[0] === '.' && basename.endsWith('rc'),
    load: file => loadCodeContent(file, 'json'),
  },
  // Image files / 图片文件
  {
    filter: ({ extname }) => EXTENSION_IMAGES.includes(extname),
    load: (file, app) => {
      const publicDir = ensureEndingSlash(app.dir.public())
      // Resolve image src: use public path if in public dir, otherwise relative path
      const src = file.absolutePath.startsWith(publicDir) ? ensureLeadingSlash(file.absolutePath.replace(publicDir, '')) : file.relativePath
      return `<img src="${escape(slash(src))}" alt="${escape(file.basename)}" data-title="${escape(file.path)}">\n`
    },
  },
  // Known file types supported by Shiki syntax highlighting
  // 已知的能被 shiki 语法高亮的文件类型
  {
    filter: ({ extname }) => supportedTextExts.includes(extname),
    load: file => loadCodeContent(file),
  },
]

/**
 * Initialize loaders by merging user-provided loaders with built-in defaults.
 *
 * 通过合并用户提供的加载器和内置默认加载器来初始化加载器。
 *
 * User loaders are placed before built-in loaders so they take precedence.
 * Each loader's `filter` is normalized into either a `filter` function or a
 * `matcher` (glob matcher), depending on whether it was provided as a
 * function or a string pattern.
 *
 * 用户加载器位于内置加载器之前，因此具有更高优先级。
 * 每个加载器的 `filter` 会被标准化为 `filter` 函数或 `matcher`（glob 匹配器），
 * 取决于它是以函数还是字符串模式提供。
 *
 * @param loaders - User-provided loaders / 用户提供的加载器
 * @returns Merged and normalized loaders / 合并并标准化后的加载器
 */
export function initLoaders(loaders?: CodeTreeFileLoader[]) {
  return [...loaders || [], ...defaultLoader].map(item => ({
    filter: isFunction(item.filter) ? item.filter : undefined,
    matcher: !isFunction(item.filter) ? createMatcher(item.filter) : undefined,
    load: item.load,
  }))
}

/**
 * Parse file paths to file tree node structure
 *
 * 将文件路径数组解析为文件树节点结构
 *
 * @param files - File path array / 文件路径数组
 * @returns File tree node array / 文件树节点数组
 */
function parseFileNodes(files: string[]): FileTreeNode[] {
  const nodes: FileTreeNode[] = []
  for (const file of files) {
    const parts = removeLeadingSlash(file).split('/')
    let node = nodes
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      let child = node.find(n => n.filename === part)
      if (!child) {
        child = {
          level: i + 1,
          filename: part,
          filepath: isFile ? file : undefined,
          children: isFile ? undefined : [],
        }
        node.push(child)
      }
      if (!isFile && child.children)
        node = child.children
    }
  }

  return nodes
}

/**
 * Code tree plugin - Register code-tree container and embed syntax
 *
 * 注册 code-tree 容器和嵌入语法的 markdown 插件
 *
 * @param md - Markdown-it instance / markdown-it 实例
 * @param app - VuePress app instance / vuepress app 实例
 * @param options - Code tree options / code-tree 配置项
 */
export function codeTreePlugin(md: Markdown, app: App, options: CodeTreeOptions = {}): void {
  /**
   * Get file or folder icon
   *
   * 获取文件或文件夹的图标
   */
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  /**
   * Render file tree nodes to component string
   *
   * 渲染文件树节点为组件字符串
   */
  function renderFileTree(nodes: FileTreeNode[], mode?: FileTreeIconMode): string {
    return nodes.map((node) => {
      const props: FileTreeNodeProps & { filepath?: string } = {
        filename: node.filename,
        level: node.level,
        type: node.children?.length ? 'folder' : 'file',
        expanded: true,
        filepath: node.filepath,
      }
      return `<FileTreeNode${stringifyAttrs(props, false, ['filename', 'filepath'])}>
  <template #icon><VPIcon provider="iconify" name="${getIcon(node.filename, props.type, mode)}" /></template>
  ${node.children?.length ? renderFileTree(node.children, mode) : ''}
</FileTreeNode>`
    })
      .join('\n')
  }

  // Register ::: code-tree container
  createContainerPlugin(md, 'code-tree', {
    before: (info, tokens, index) => {
      // Collect filenames and active file in code-tree container
      const files: string[] = []
      let activeFile: string | undefined
      for (
        let i = index + 1;
        !(
          tokens[i].nesting === -1
          && tokens[i].type === 'container_code-tree_close'
        );
        i++
      ) {
        const token = tokens[i]
        if (token.type === 'fence' && token.tag === 'code') {
          const fenceInfo = md.utils.unescapeAll(token.info)
          const title = resolveAttr(fenceInfo, 'title')
          if (title) {
            files.push(title)
            if (fenceInfo.includes(':active'))
              activeFile = title
          }
        }
      }

      const attrs = resolveAttrs<CodeTreeMeta>(info)
      const { title, icon, height, entry } = attrs
      const fileTreeNodes = parseFileNodes(files)
      const entryFile = activeFile || entry || files[0]
      const h = height || String(options.height)
      return `<VPCodeTree${stringifyAttrs({ title, entryFile, height: h ? parseRect(h) : undefined })}><template #file-tree>${renderFileTree(fileTreeNodes, icon)}</template>`
    },
    after: () => '</VPCodeTree>',
  })

  const loaders = initLoaders(options.loaders)

  // Register @[code-tree](dir) syntax
  createEmbedRuleBlock(md, {
    type: 'code-tree',
    meta: (info, dir) => {
      const attrs = resolveAttrs<CodeTreeMeta>(info)
      const h = attrs.height || String(options.height)
      return {
        title: attrs.title,
        entryFile: attrs.entry,
        icon: attrs.icon,
        showSidebar: attrs.showSidebar,
        height: h ? parseRect(h) : undefined,
        dir,
      }
    },
    content: ({ dir, icon, ...props }, env) => {
      // codeTreeFiles for page dependency collection
      const codeTreeFiles = ((env as any).codeTreeFiles ??= []) as string[]
      const root = findFile(app, env, dir)
      if (!fs.existsSync(root)) {
        logger.warn(`Invalid code-tree target directory ${colors.yellow(dir)}, in ${colors.gray(env.filePathRelative!)}`)
        return `<p>@[code-tree](${dir}) <em>Invalid target directory</em></p>`
      }
      // Get all files in directory
      const files = loadFiles(root, options.ignores)

      // Generate code block content for all files
      const codeContent = files.map((file) => {
        const extname = path.extname(file).slice(1)
        const basename = path.basename(file)
        const absolutePath = path.join(root, file)
        const relativePath = path.relative(path.dirname(env.filePath!), absolutePath)
        const item: CodeTreeFile = { path: file, absolutePath, relativePath, extname, basename }
        const filepath = path.join(root, file)

        codeTreeFiles.push(filepath)
        for (const { filter, matcher, load } of loaders) {
          if (filter?.(item) ?? matcher?.(file)) {
            const [error, res] = attempt(load, item, app)
            if (error) {
              logger.error('[code-tree container]', `Error loading file ${colors.yellow(file)}, in ${colors.gray(env.filePathRelative!)}`)
              return ''
            }
            return res
          }
        }
        return ''
      }).filter(Boolean).join('\n')

      props.entryFile ||= files[0]
      const fileTreeNodes = parseFileNodes(files)
      return `<VPCodeTree${stringifyAttrs(props)}><template #file-tree>${
        renderFileTree(fileTreeNodes, icon)
      }</template>${md.render(codeContent, cleanMarkdownEnv(env))}</VPCodeTree>`
    },
  })
}

/**
 * Extend page dependencies with codeTreeFiles
 *
 * 扩展页面依赖，将 codeTreeFiles 添加到页面依赖中
 *
 * @param page - VuePress page object / vuepress 页面对象
 */
export function extendsPageWithCodeTree(page: Page): void {
  const markdownEnv = page.markdownEnv
  const codeTreeFiles = (markdownEnv.codeTreeFiles ?? []) as string[]
  if (codeTreeFiles.length)
    page.deps.push(...codeTreeFiles)
}

/**
 * Load all files from a directory, sorted by depth (deepest first).
 *
 * 从目录加载所有文件，按深度排序（最深的在前）。
 *
 * Hidden files (dotfiles) are included. `node_modules` and `.DS_Store` are
 * always ignored, plus any additional glob patterns passed via `ignores`.
 * The depth-first sort ensures files are grouped by their parent directories
 * when building the file tree structure.
 *
 * 包含隐藏文件（以点开头的文件）。`node_modules` 和 `.DS_Store` 始终被忽略，
 * 此外还会忽略通过 `ignores` 传入的额外 glob 模式。深度优先排序确保在构建
 * 文件树结构时，文件能按其父目录分组。
 *
 * @param cwd - The directory to scan / 要扫描的目录
 * @param ignores - Additional glob patterns to ignore / 额外忽略的 glob 模式
 * @returns Array of file paths relative to `cwd` / 相对于 `cwd` 的文件路径数组
 */
function loadFiles(cwd: string, ignores: string[] = []): string[] {
  return tinyglobby.globSync('**/*', {
    cwd,
    ignore: ['**/node_modules/**', '**/.DS_Store', ...ignores],
    onlyFiles: true,
    dot: true,
  }).sort((a, b) => {
    const al = a.split('/').length
    const bl = b.split('/').length
    return bl - al
  })
}
