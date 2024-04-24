import { getDirname, path } from 'vuepress/utils'
import { ensureEndingSlash } from '@vuepress/helper'
import type { App } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'

const { url: filepath } = import.meta
const __dirname = getDirname(filepath)

const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname, '../client'),
)

export async function prepareConfigFile(app: App, options: MarkdownPowerPluginOptions) {
  const imports = new Set<string>()
  const enhances = new Set<string>()

  imports.add(`import '@internal/md-power/icons.css'`)

  if (options.pdf) {
    imports.add(`import PDFViewer from '${CLIENT_FOLDER}components/PDFViewer.vue'`)
    enhances.add(`app.component('PDFViewer', PDFViewer)`)
  }

  if (options.bilibili) {
    imports.add(`import Bilibili from '${CLIENT_FOLDER}components/Bilibili.vue'`)
    enhances.add(`app.component('VideoBilibili', Bilibili)`)
  }

  if (options.youtube) {
    imports.add(`import Youtube from '${CLIENT_FOLDER}components/Youtube.vue'`)
    enhances.add(`app.component('VideoYoutube', Youtube)`)
  }

  if (options.replit) {
    imports.add(`import Replit from '${CLIENT_FOLDER}components/Replit.vue'`)
    enhances.add(`app.component('ReplitViewer', Replit)`)
  }

  if (options.codeSandbox) {
    imports.add(`import CodeSandbox from '${CLIENT_FOLDER}components/CodeSandbox.vue'`)
    enhances.add(`app.component('CodeSandboxViewer', CodeSandbox)`)
  }

  if (options.plot) {
    imports.add(`import Plot from '${CLIENT_FOLDER}components/Plot.vue'`)
    enhances.add(`app.component('Plot', Plot)`)
  }

  if (options.repl) {
    imports.add(`import LanguageRepl from '${CLIENT_FOLDER}components/LanguageRepl.vue'`)
    enhances.add(`app.component('LanguageRepl', LanguageRepl)`)
  }

  enhances.add(`if (__VUEPRESS_SSR__) return`)

  if (options.caniuse) {
    imports.add(`import { setupCanIUse } from '${CLIENT_FOLDER}composables/setupCanIUse.js'`)
    enhances.add(`router.afterEach(() => setupCanIUse())`)
  }

  return app.writeTemp(
    'md-power/config.js',
    `\
import { defineClientConfig } from 'vuepress/client'
${Array.from(imports.values()).join('\n')}

export default defineClientConfig({
  enhance({ router, app }) {
${Array.from(enhances.values())
      .map(item => `    ${item}`)
      .join('\n')}
  }
})
`,
  )
}
