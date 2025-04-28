import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoContainerRender, DemoFile, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import path from 'node:path'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { findFile, readFileSync, writeFileSync } from './supports/file.js'
import { insertSetupScript } from './supports/insertScript.js'

export function vueEmbed(
  app: App,
  md: Markdown,
  env: MarkdownDemoEnv,
  { url, title, desc, codeSetting = '', expanded = false }: DemoMeta,
): string {
  const filepath = findFile(app, env, url)
  const code = readFileSync(filepath)
  if (code === false) {
    console.warn('[vuepress-plugin-md-power] Cannot read vue file:', filepath)
    return ''
  }

  const basename = path.basename(filepath).replace(/-|\./g, '_')
  const ext = path.extname(filepath).slice(1)
  const name = `Demo${basename[0].toUpperCase()}${basename.slice(1)}`
  const demo: DemoFile = { type: 'vue', export: name, path: filepath }

  env.demoFiles ??= []

  if (!env.demoFiles.some(d => d.path === filepath)) {
    env.demoFiles.push(demo)
    insertSetupScript(demo, env)
  }

  return `<VPDemoBasic${stringifyAttrs({ type: 'vue', title, desc, expanded })}>
    <${name} />
    <template #code>
      ${md.render(`\`\`\`${ext}${codeSetting}\n${code}\n\`\`\``, {})}
    </template>
  </VPDemoBasic>`
}

const target = 'md-power/demo/vue'

export const vueContainerRender: DemoContainerRender = {
  before: (app, md, env, meta, codeMap) => {
    const { url, title, desc, expanded = false } = meta
    const componentName = `DemoContainer${url}`
    const prefix = (env.filePathRelative || '').replace(/\.md$/, '').replace(/\//g, '-')
    env.demoFiles ??= []
    const output = app.dir.temp(path.join(target, `${prefix}-${componentName}`))
    // generate script file
    if (codeMap.vue || codeMap.js || codeMap.ts) {
      let scriptOutput = output
      let content = ''
      if (codeMap.vue) {
        scriptOutput += '.vue'
        content = transformStyle(codeMap.vue)
      }
      else if (codeMap.ts) {
        scriptOutput += '.ts'
        content = codeMap.ts
      }
      else if (codeMap.js) {
        scriptOutput += '.js'
        content = codeMap.js
      }

      content = transformImports(content, env.filePath || '')
      const script: DemoFile = { type: 'vue', export: componentName, path: scriptOutput, gitignore: true }
      writeFileSync(scriptOutput, content)

      if (!env.demoFiles.some(d => d.path === scriptOutput)) {
        env.demoFiles.push(script)
        insertSetupScript(script, env)
      }
    }
    // generate style file
    if (codeMap.css || codeMap.scss || codeMap.less || codeMap.stylus) {
      let styleOutput = output
      let content = ''
      if (codeMap.css) {
        styleOutput += '.css'
        content = codeMap.css
      }
      else if (codeMap.scss) {
        styleOutput += '.scss'
        content = codeMap.scss
      }
      else if (codeMap.less) {
        styleOutput += '.less'
        content = codeMap.less
      }
      else if (codeMap.stylus) {
        styleOutput += '.styl'
        content = codeMap.stylus
      }
      writeFileSync(styleOutput, content)
      const style: DemoFile = { type: 'css', path: styleOutput, gitignore: true }
      if (!env.demoFiles.some(d => d.path === styleOutput)) {
        env.demoFiles.push(style)
        insertSetupScript(style, env)
      }
    }

    return `<VPDemoBasic${stringifyAttrs({ type: 'vue', title, desc, expanded })}>
    <${componentName} />
    <template #code>\n`
  },
  after: () => '</template></VPDemoBasic>',
}

const IMPORT_RE = /import\s+(?:\w+\s+from\s+)?['"]([^'"]+)['"]/g
const STYLE_RE = /<style.*?>/

function transformImports(code: string, filepath: string): string {
  return code.replace(IMPORT_RE, (matched, url) => {
    if (url.startsWith('./') || url.startsWith('../')) {
      return matched.replace(url, `${path.resolve(path.dirname(filepath), url)}`)
    }
    return matched
  })
}

function transformStyle(code: string): string {
  return code.replace(STYLE_RE, (matched) => {
    if (matched.includes('scoped')) {
      return matched
    }
    return matched.replace('<style', '<style scoped')
  })
}
