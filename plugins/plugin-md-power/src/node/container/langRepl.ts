import type markdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress/core'
import type { ReplEditorData, ReplOptions } from '../../shared/index.js'
import { promises as fs } from 'node:fs'
import { resolveModule } from 'local-pkg'
import container from 'markdown-it-container'
import { path } from 'vuepress/utils'

const RE_INFO = /^(#editable)?(.*)$/

function createReplContainer(md: markdownIt, lang: string) {
  const type = `${lang}-repl`
  const validate = (info: string): boolean => info.trim().startsWith(type)

  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    const info = token.info.trim().slice(type.length).trim() || ''
    // :::lang-repl#editable title
    const [, editable, title] = info.match(RE_INFO)!

    if (token.nesting === 1)
      return `<CodeRepl ${editable ? 'editable' : ''} title="${title || `${lang} playground`}">`

    else
      return '</CodeRepl>'
  }

  md.use(container, type, { validate, render })
}

export async function langReplPlugin(app: App, md: markdownIt, {
  theme,
  go = false,
  kotlin = false,
  rust = false,
}: ReplOptions) {
  if (kotlin) {
    createReplContainer(md, 'kotlin')
  }
  if (go) {
    createReplContainer(md, 'go')
  }
  if (rust) {
    createReplContainer(md, 'rust')
  }
  theme ??= { light: 'github-light', dark: 'github-dark' }

  const data: ReplEditorData = { grammars: {} } as ReplEditorData

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
