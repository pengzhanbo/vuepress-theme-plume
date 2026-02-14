import type markdownIt from 'markdown-it'
import type { App } from 'vuepress/core'
import type { ReplEditorData, ReplOptions } from '../../shared/index.js'
import { promises as fs } from 'node:fs'
import { resolveModule } from 'local-pkg'
import { colors, logger, path } from 'vuepress/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Code REPL metadata
 *
 * 代码 REPL 元数据
 */
interface CodeReplMeta {
  editable?: boolean
  title?: string
}

/**
 * Language REPL plugin - Enable interactive code playgrounds
 *
 * 语言 REPL 插件 - 启用交互式代码游乐场
 *
 * Supports: kotlin, go, rust, python
 *
 * @param app - VuePress app / VuePress 应用
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param options - REPL options / REPL 选项
 * @param options.theme - Editor theme / 编辑器主题
 * @param options.go - Enable Go playground / 启用 Go 游乐场
 * @param options.kotlin - Enable Kotlin playground / 启用 Kotlin 游乐场
 * @param options.rust - Enable Rust playground / 启用 Rust 游乐场
 * @param options.python - Enable Python playground / 启用 Python 游乐场
 */
export async function langReplPlugin(app: App, md: markdownIt, {
  theme,
  go = false,
  kotlin = false,
  rust = false,
  python = false,
}: ReplOptions): Promise<void> {
  /**
   * Create container for specific language
   *
   * 为特定语言创建容器
   */
  const container = (lang: string): void => createContainerPlugin(md, `${lang}-repl`, {
    before(info) {
      const { attrs } = resolveAttrs<CodeReplMeta>(info)
      const { editable, title } = attrs
      return `<CodeRepl${stringifyAttrs({ editable, title: title || `${lang} playground` })}>`
    },
    after: () => '</CodeRepl>',
  })

  if (kotlin)
    container('kotlin')

  if (go)
    container('go')

  if (rust)
    container('rust')

  if (python)
    container('python')

  theme ??= { light: 'github-light', dark: 'github-dark' }

  const data: ReplEditorData = { grammars: {} } as ReplEditorData

  try {
    const themesPath = path.dirname(resolveModule('tm-themes')!)
    const grammarsPath = path.dirname(resolveModule('tm-grammars')!)

    const readTheme = (theme: string) => read(path.join(themesPath, 'themes', `${theme}.json`))
    const readGrammar = (grammar: string) => read(path.join(grammarsPath, 'grammars', `${grammar}.json`))

    if (typeof theme === 'string') {
      data.theme = await readTheme(theme)
    }
    else {
      data.theme = await Promise.all([
        readTheme(theme.light),
        readTheme(theme.dark),
      ]).then(([light, dark]) => ({ light, dark }))
    }

    if (kotlin)
      data.grammars.kotlin = await readGrammar('kotlin')

    if (go)
      data.grammars.go = await readGrammar('go')

    if (rust)
      data.grammars.rust = await readGrammar('rust')

    if (python)
      data.grammars.python = await readGrammar('python')
  }
  catch {
    /* istanbul ignore next -- @preserve */
    logger.error('[vuepress-plugin-md-power]', `Failed to load packages: ${colors.green('tm-themes')}, ${colors.green('tm-grammars')}, Please install them manually.`)
  }

  await app.writeTemp(
    'internal/md-power/replEditorData.js',
    `export default ${JSON.stringify(data, null, 2)}`,
  )
}

/**
 * Read JSON file
 *
 * 读取 JSON 文件
 *
 * @param file - File path / 文件路径
 * @returns Parsed JSON / 解析后的 JSON
 */
async function read(file: string): Promise<any> {
  try {
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content)
  }
  catch {}
  return undefined
}
