import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
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
