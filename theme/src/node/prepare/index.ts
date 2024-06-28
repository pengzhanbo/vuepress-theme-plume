import type { App } from 'vuepress'
import { watch } from 'chokidar'
import { prepareArticleTagColors, updateArticleTagColor } from './prepareArticleTagColor.js'

export async function setupPrepare(app: App): Promise<void> {
  await prepareArticleTagColors(app)
}

export function watchPrepare(app: App, watchers: any[]): void {
  const watcher = watch('pages/**', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })

  watcher.on('change', () => updateArticleTagColor(app))
  watcher.on('add', () => updateArticleTagColor(app))
  watcher.on('unlink', () => updateArticleTagColor(app))

  watchers.push(watcher)
}
