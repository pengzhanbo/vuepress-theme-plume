import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoContainerRender, DemoFile, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { findFile, readFileSync } from './supports/file.js'

export function markdownEmbed(
  app: App,
  md: Markdown,
  env: MarkdownDemoEnv,
  { url, title, desc, codeSetting = '', expanded = false }: DemoMeta,
): string {
  const filepath = findFile(app, env, url)
  const code = readFileSync(filepath)
  if (code === false) {
    console.warn('[vuepress-plugin-md-power] Cannot read markdown file:', filepath)
    return ''
  }
  const demo: DemoFile = { type: 'markdown', path: filepath }

  env.demoFiles ??= []

  if (!env.demoFiles.some(d => d.path === filepath)) {
    env.demoFiles.push(demo)
  }

  return `<VPDemoBasic${stringifyAttrs({ type: 'markdown', title, desc, expanded })}>
    ${md.render(code, { filepath: env.filePath, filepathRelative: env.filePathRelative })}
    <template #code>
      ${md.render(`\`\`\`md ${codeSetting}\n${code}\n\`\`\``, {})}
    </template>
  </VPDemoBasic>`
}

export const markdownContainerRender: DemoContainerRender = {
  before(app, md, env, meta, codeMap) {
    const { title, desc, expanded = false } = meta
    const code = codeMap.md || ''
    return `<VPDemoBasic${stringifyAttrs({ type: 'markdown', title, desc, expanded })}>
      ${md.render(code, { filepath: env.filePath, filepathRelative: env.filePathRelative })}
      <template #code>`
  },
  after: () => '</template></VPDemoBasic>',
}
