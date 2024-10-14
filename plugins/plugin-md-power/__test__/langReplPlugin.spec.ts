import type { App } from 'vuepress/core'
import type { ReplOptions } from '../src/shared/repl.js'
import { dirname } from 'node:path'
import { path } from '@vuepress/utils'
import { resolveModule } from 'local-pkg'
import MarkdownIt from 'markdown-it'
import { fs, vol } from 'memfs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { langReplPlugin } from '../src/node/container/langRepl.js'

vi.mock('node:fs', () => fs)
vi.mock('node:fs/promises', () => fs.promises)

beforeEach(() => vol.reset())
afterEach(() => vol.reset())

const FENCE = '```'

const themesPath = dirname(resolveModule('tm-themes', {
  paths: [import.meta.url],
}) || '')
const grammarsPath = dirname(resolveModule('tm-grammars', {
  paths: [import.meta.url],
}) || '')

async function createMarkdown(options: ReplOptions = {}) {
  const md = new MarkdownIt()
  md.options.highlight = (str, lang) => `<div class="language-${lang}"><pre><code>${str}</code></pre></div>`
  const app = {
    writeTemp: vi.fn((filepath: string, content: string) => {
      filepath = path.join('/', filepath)
      fs.mkdirSync(dirname(filepath), { recursive: true })
      fs.writeFileSync(filepath, content)
    }),
  } as unknown as App

  await langReplPlugin(app, md, options)

  return { md, app }
}

function initFs() {
  vol.fromJSON({
    [path.join(themesPath, 'themes/github-light.json')]: '{ "theme": "github-light" }',
    [path.join(themesPath, 'themes/github-dark.json')]: '{ "theme": "github-dark" }',
    [path.join(grammarsPath, 'grammars/go.json')]: '{ "language": "go" }',
    [path.join(grammarsPath, 'grammars/kotlin.json')]: '{ "language": "kotlin" }',
    [path.join(grammarsPath, 'grammars/rust.json')]: '{ "language": "rust" }',
  })
}

describe('langReplPlugin', () => {
  const outputFile = '/internal/md-power/replEditorData.js'

  const code = `\
::: go-repl
${FENCE}go
const a = 1
${FENCE}
:::

::: go-repl#editable
${FENCE}go
const a = 1
${FENCE}
:::

::: kotlin-repl
${FENCE}kotlin
const a = 1
${FENCE}
:::

::: kotlin-repl#editable
${FENCE}kotlin
const a = 1
${FENCE}
:::

::: rust-repl
${FENCE}rust
const a = 1
${FENCE}
:::

::: rust-repl#editable
${FENCE}rust
const a = 1
${FENCE}
:::

::: rust-repl title
${FENCE}rust
const a = 1
${FENCE}
:::

::: rust-repl#editable title
${FENCE}rust
const a = 1
${FENCE}
:::

`
  it('should work with default options', async () => {
    initFs()
    const { md, app } = await createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
    expect(app.writeTemp).toBeCalledWith(outputFile.slice(1), expect.any(String))
    expect(fs.readFileSync(outputFile, 'utf-8')).toMatchSnapshot()
  })

  it('should work with custom options', async () => {
    initFs()
    const { md, app } = await createMarkdown({
      go: true,
      kotlin: true,
      rust: true,
    })

    expect(md.render(code)).toMatchSnapshot()
    expect(app.writeTemp).toBeCalledWith(outputFile.slice(1), expect.any(String))
    expect(fs.readFileSync(outputFile, 'utf-8')).toMatchSnapshot()
  })

  it('should work with custom theme', async () => {
    initFs()
    const { md, app } = await createMarkdown({
      go: true,
      kotlin: true,
      rust: true,
      theme: 'vitesse-light',
    })

    expect(md.render(code)).toMatchSnapshot()
    expect(app.writeTemp).toBeCalledWith(outputFile.slice(1), expect.any(String))
    expect(fs.readFileSync(outputFile, 'utf-8')).toMatchSnapshot()
  })
})
