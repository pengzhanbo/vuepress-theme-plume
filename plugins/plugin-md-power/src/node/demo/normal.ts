import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoFile, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import fs from 'node:fs'
import path from 'node:path'
import { compileScript, compileStyle } from './compiler.js'
import { findFile, readFileSync, writeFileSync } from './file.js'
import { insertSetupScript } from './insertScript.js'

interface NormalEmbedCode {
  html?: string
  script?: string
  css?: string
  imports?: string
  jsType: 'ts' | 'js'
  cssType: 'css' | 'scss' | 'less' | 'stylus'
}

const CONFIG_RE = /<script type="config">([\s\S]*?)\n<\/script>/
const SCRIPT_RE = /<script\s?(?:lang="(\w+)")?>([\s\S]*?)\n<\/script>/
const STYLE_RE = /<style\s?(?:lang="(\w+)")?>([\s\S]*?)\n<\/style>/
const scriptSupported = ['ts', 'js']
const styleSupported = ['css', 'scss', 'less', 'stylus', 'styl']
const target = 'md-power/demo/normal'

export function normalEmbed(
  app: App,
  md: Markdown,
  env: MarkdownDemoEnv,
  { url, title, desc, codeSetting = '' }: DemoMeta,
): string {
  const filepath = findFile(app, env, url)
  const code = readFileSync(filepath)

  if (code === false) {
    console.warn('[vuepress-plugin-md-power] Cannot read demo file:', filepath)
    return ''
  }
  const source = parseCode(code)

  const prefix = (env.filePathRelative || '').replace(/\.md$/, '').replace(/\//g, '-')
  const basename = path.basename(filepath).replace(/-|\./g, '_')
  const name = `Demo${basename[0].toUpperCase()}${basename.slice(1)}`
  const demo: DemoFile = { type: 'normal', export: name, path: filepath }
  const output = app.dir.temp(target, `${prefix}-${name}.js`)

  compileCode(source, output)

  env.demoFiles ??= []

  if (!env.demoFiles.some(d => d.path === filepath)) {
    env.demoFiles.push(demo)
    insertSetupScript({ ...demo, path: output }, env)
  }

  return `<VPDemoNormal :config="${name}"${title ? ` title="${title}"` : ''}${desc ? ` desc="${desc}"` : ''}>
    ${codeToHtml(md, source, codeSetting)}
  </VPDemoNormal>`
}

function parseCode(code: string): NormalEmbedCode {
  const res: NormalEmbedCode = { html: '', css: '', script: '', imports: '', jsType: 'js', cssType: 'css' }

  res.html = code
    .replace(CONFIG_RE, (_, config) => {
      res.imports = config
      return ''
    })
    .replace(SCRIPT_RE, (_, lang, script) => {
      res.script = script
      res.jsType = scriptSupported.includes(lang) ? lang : 'js'
      return ''
    })
    .replace(STYLE_RE, (_, lang, style) => {
      res.css = style
      res.cssType = styleSupported.includes(lang) ? lang === 'styl' ? 'stylus' : lang : 'css'
      return ''
    })

  return res
}

function codeToHtml(md: Markdown, source: NormalEmbedCode, info: string): string {
  let content = '::: code-tabs\n'
  if (source.html)
    content += `@tab HTML\n\`\`\`html ${info}\n${source.html.trim()}\n\`\`\`\n`

  if (source.script) {
    const title = source.jsType === 'ts' ? 'Typescript' : 'Javascript'
    content += `@tab ${title}\n\`\`\`${source.jsType} ${info}\n${source.script.trim()}\n\`\`\`\n`
  }

  if (source.css) {
    const title = source.cssType === 'stylus' ? 'Stylus' : source.cssType.toUpperCase()
    content += `@tab ${title}\n\`\`\`${source.cssType} ${info}\n${source.css.trim()}\n\`\`\`\n`
  }

  content += '\n:::'
  return md.render(content, {})
}

async function compileCode(code: NormalEmbedCode, output: string) {
  const res = { jsLib: [], cssLib: [], script: '', css: '', html: '' }
  if (!fs.existsSync(output))
    writeFileSync(output, `import { ref } from "vue"\nexport default ref(${JSON.stringify(res, null, 2)})`)
  try {
    if (code.imports) {
      const imports = JSON.parse(code.imports)
      res.jsLib = imports.jsLib ?? []
      res.cssLib = imports.cssLib ?? []
    }
    if (code.script) {
      res.script = await compileScript(code.script.trim(), code.jsType)
    }
    if (code.css) {
      res.css = await compileStyle(code.css.trim(), code.cssType)
    }
    if (code.html) {
      res.html = code.html.trim()
    }
  }
  catch (e) {
    console.error('[vuepress-plugin-md-power] demo parse error: \n', e)
  }

  writeFileSync(output, `import { ref } from "vue"\nexport default ref(${JSON.stringify(res, null, 2)})`)
}
