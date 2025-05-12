import type markdownIt from 'markdown-it'
import type { App } from 'vuepress/core'
import type { ReplEditorData, ReplOptions } from '../../shared/index.js'
import { promises as fs } from 'node:fs'
import { resolveModule } from 'local-pkg'
import { colors, logger, path } from 'vuepress/utils'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

interface CodeReplMeta {
  editable?: boolean
  title?: string
}

export async function langReplPlugin(app: App, md: markdownIt, {
  theme,
  go = false,
  kotlin = false,
  rust = false,
}: ReplOptions): Promise<void> {
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

async function read(file: string): Promise<any> {
  try {
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content)
  }
  catch {}
  return undefined
}
