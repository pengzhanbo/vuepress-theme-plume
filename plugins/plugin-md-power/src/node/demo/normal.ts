import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoContainerRender, DemoFile, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import fs from 'node:fs'
import path from 'node:path'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { compileScript, compileStyle } from './supports/compiler.js'
import { findFile, readFileSync, writeFileSync } from './supports/file.js'
import { insertSetupScript } from './supports/insertScript.js'
import { addTask, checkDemoRender, markDemoRender } from './watcher.js'

interface NormalCode {
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
const FENCE = '```'

export function parseEmbedCode(code: string): NormalCode {
  const res: NormalCode = { html: '', css: '', script: '', imports: '', jsType: 'js', cssType: 'css' }

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

function codeToHtml(md: Markdown, source: NormalCode, info: string): string {
  let content = '::: code-tabs\n'
  if (source.html)
    content += `@tab HTML\n${FENCE}html ${info}\n${source.html.trim()}\n${FENCE}\n`

  if (source.script) {
    const title = source.jsType === 'ts' ? 'Typescript' : 'Javascript'
    content += `@tab ${title}\n${FENCE}${source.jsType} ${info}\n${source.script.trim()}\n${FENCE}\n`
  }

  if (source.css) {
    const title = source.cssType === 'stylus' ? 'Stylus' : source.cssType.toUpperCase()
    content += `@tab ${title}\n${FENCE}${source.cssType} ${info}\n${source.css.trim()}\n${FENCE}\n`
  }

  content += '\n:::'
  return md.render(content, {})
}

export async function compileCode(code: NormalCode, output: string): Promise<void> {
  markDemoRender()
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
  checkDemoRender()
}

export function normalEmbed(
  app: App,
  md: Markdown,
  env: MarkdownDemoEnv,
  { url, title, desc, codeSetting = '', expanded = false }: DemoMeta,
): string {
  const filepath = findFile(app, env, url)
  const code = readFileSync(filepath)

  if (code === false) {
    console.warn('[vuepress-plugin-md-power] Cannot read demo file:', filepath)
    return ''
  }
  const source = parseEmbedCode(code)

  const prefix = (env.filePathRelative || '').replace(/\.md$/, '').replace(/\//g, '-')
  const basename = path.basename(filepath).replace(/-|\./g, '_')
  const name = `Demo${basename[0].toUpperCase()}${basename.slice(1)}`
  const demo: DemoFile = { type: 'normal', export: name, path: filepath }
  const output = app.dir.temp(target, `${prefix}-${name}.js`)

  compileCode(source, output)
  addTask(app, filepath, output)

  env.demoFiles ??= []

  if (!env.demoFiles.some(d => d.path === filepath)) {
    env.demoFiles.push(demo)
    insertSetupScript({ ...demo, path: output }, env)
  }
  return `<VPDemoNormal${stringifyAttrs({ ':config': name, title, desc, expanded })}>
    ${codeToHtml(md, source, codeSetting)}
  </VPDemoNormal>`
}

export const normalContainerRender: DemoContainerRender = {
  before(app, md, env, meta, codeMap) {
    const { url, title, desc, expanded = false } = meta
    const name = `DemoContainer${url}`
    const prefix = (env.filePathRelative || '').replace(/\.md$/, '').replace(/\//g, '-')
    const output = app.dir.temp(path.join(target, `${prefix}-${name}.js`))

    env.demoFiles ??= []
    if (!env.demoFiles.some(d => d.path === output)) {
      const demo: DemoFile = { type: 'normal', export: name, gitignore: true, path: output }
      env.demoFiles.push(demo)
      insertSetupScript(demo, env)
    }

    const source = parseContainerCode(codeMap)
    compileCode(source, output)
    return `<VPDemoNormal${stringifyAttrs({ ':config': name, title, desc, expanded })}>`
  },

  after: () => '</VPDemoNormal>',

  token(token) {
    if (token.info.trim().startsWith('json')) {
      token.hidden = true
      token.type = 'text'
      token.content = ''
    }
  },
}

function parseContainerCode(map: Record<string, string>): NormalCode {
  const res: NormalCode = { html: '', css: '', script: '', imports: '', jsType: 'js', cssType: 'css' }

  if (map.html) {
    res.html = map.html
  }
  if (map.js) {
    res.script = map.js
    res.jsType = 'js'
  }
  if (map.ts) {
    res.script = map.ts
    res.jsType = 'ts'
  }
  if (map.css) {
    res.css = map.css
    res.cssType = 'css'
  }
  if (map.less) {
    res.css = map.less
    res.cssType = 'less'
  }
  if (map.scss) {
    res.css = map.scss
    res.cssType = 'scss'
  }
  if (map.styl || map.stylus) {
    res.css = map.styl || map.stylus
    res.cssType = 'stylus'
  }
  if (map.json) {
    res.imports = map.json
  }

  return res
}
