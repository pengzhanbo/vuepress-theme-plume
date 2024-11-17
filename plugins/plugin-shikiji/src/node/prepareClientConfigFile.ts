import type { App } from 'vuepress'
import { ensureEndingSlash } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname, '../client'),
)

export async function prepareClientConfigFile(app: App, {
  copyCode,
  twoslash,
}: { copyCode: boolean, twoslash: boolean }): Promise<string> {
  return await app.writeTemp(
    'internal/plugin-shiki/client.js',
    `\
${twoslash ? `import { enhanceTwoslash } from '${CLIENT_FOLDER}composables/twoslash.js'` : ''}
${copyCode ? `import { useCopyCode } from '${CLIENT_FOLDER}composables/copy-code.js'` : ''}
import { useCollapsedLines } from '${CLIENT_FOLDER}composables/collapsed-lines.js'

export default {
  ${twoslash
    ? `enhance({ app }) {
    enhanceTwoslash(app)
  },`
    : ''}
  setup() {
    ${copyCode
      ? `useCopyCode({
      selector: __CC_SELECTOR__,
      duration: __CC_DURATION__,
    })`
      : ''}
    useCollapsedLines()
  },
}
`,
  )
}
