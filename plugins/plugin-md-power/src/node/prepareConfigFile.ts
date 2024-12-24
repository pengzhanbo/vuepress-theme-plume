import type { App } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { ensureEndingSlash } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'

const { url: filepath } = import.meta
const __dirname = getDirname(filepath)

const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname, '../client'),
)

export async function prepareConfigFile(app: App, options: MarkdownPowerPluginOptions) {
  const imports = new Set<string>()
  const enhances = new Set<string>()

  imports.add(`import Tabs from '${CLIENT_FOLDER}components/Tabs.vue'`)
  enhances.add(`app.component('Tabs', Tabs)`)

  imports.add(`import CodeTabs from '${CLIENT_FOLDER}components/CodeTabs.vue'`)
  enhances.add(`app.component('CodeTabs', CodeTabs)`)

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
    imports.add(`import CodeRepl from '${CLIENT_FOLDER}components/CodeRepl.vue'`)
    enhances.add(`app.component('CodeRepl', CodeRepl)`)
  }

  if (options.caniuse) {
    imports.add(`import CanIUse from '${CLIENT_FOLDER}components/CanIUse.vue'`)
    enhances.add(`app.component('CanIUseViewer', CanIUse)`)
  }

  if (options.fileTree) {
    imports.add(`import FileTreeItem from '${CLIENT_FOLDER}components/FileTreeItem.vue'`)
    enhances.add(`app.component('FileTreeItem', FileTreeItem)`)
  }

  if (options.artPlayer) {
    imports.add(`import ArtPlayer from '${CLIENT_FOLDER}components/ArtPlayer.vue'`)
    enhances.add(`app.component('ArtPlayer', ArtPlayer)`)
  }

  if (options.audioReader) {
    imports.add(`import AudioReader from '${CLIENT_FOLDER}components/AudioReader.vue'`)
    enhances.add(`app.component('AudioReader', AudioReader)`)
  }

  return app.writeTemp(
    'md-power/config.js',
    `\
import { defineClientConfig } from 'vuepress/client'
${Array.from(imports.values()).join('\n')}

import '${CLIENT_FOLDER}styles/index.css'

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
