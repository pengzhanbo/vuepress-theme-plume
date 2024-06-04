import type { App } from 'vuepress'
import { watch } from 'chokidar'
import { prepareArticleTagColors } from './prepareArticleTagColor.js'

export async function setupPrepare(app: App): Promise<void> {
  await prepareArticleTagColors(app)
}

export function watchPrepare(app: App, watchers: any[]): void {
  const watcher = watch('pages/**', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })

  watcher.on('change', () => prepareArticleTagColors(app))
  watcher.on('add', () => prepareArticleTagColors(app))
  watcher.on('unlink', () => prepareArticleTagColors(app))

  watchers.push(watcher)
}
