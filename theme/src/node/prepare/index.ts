import type { App } from 'vuepress'
import { watch } from 'chokidar'
import { perfLog, perfMark } from '../utils/index.js'
import { prepareArticleTagColors } from './prepareArticleTagColor.js'
import { preparedBlogData } from './prepareBlogData.js'
import { prepareEncrypt } from './prepareEncrypt.js'
import { prepareIcons } from './prepareIcons.js'
import { prepareSidebar } from './prepareSidebar.js'

export async function prepareData(app: App): Promise<void> {
  perfMark('prepare:data')

  await Promise.all([
    prepareArticleTagColors(app),
    preparedBlogData(app),
    prepareSidebar(app),
    prepareEncrypt(app),
    prepareIcons(app),
  ])

  perfLog('prepare:data', app.env.isDebug)
}

export function watchPrepare(
  app: App,
  watchers: any[],
): void {
  const pagesWatcher = watch('pages/**/*.js', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })
  watchers.push(pagesWatcher)

  pagesWatcher.on('change', () => prepareData(app))
  pagesWatcher.on('add', () => prepareData(app))
  pagesWatcher.on('unlink', () => prepareData(app))
}
