import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

const require = createRequire(process.cwd())

export function findFile(app: App, env: MarkdownEnv, url: string): string {
  if (url.startsWith('/'))
    return app.dir.source(url.slice(1))

  if (url.startsWith('./') || url.startsWith('../'))
    return app.dir.source(path.dirname(env.filePathRelative!), url)

  if (url.startsWith('@source/')) {
    return app.dir.source(url.slice('@source/'.length))
  }

  try {
    return require.resolve(url)
  }
  catch {
    return url
  }
}

export function readFileSync(filepath: string): string | false {
  try {
    return fs.readFileSync(filepath, 'utf-8')
  }
  catch {
    return false
  }
}

export function writeFileSync(filepath: string, content: string): void {
  const dirname = path.dirname(filepath)
  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filepath, content, 'utf-8')
}
