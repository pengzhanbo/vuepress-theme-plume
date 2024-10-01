import type { App } from 'vuepress'
import { watch } from 'chokidar'
import { getThemeConfig } from '../loadConfig/index.js'
import { logger } from '../utils/index.js'
import { prepareArticleTagColors } from './prepareArticleTagColor.js'
import { preparedBlogData } from './prepareBlogData.js'
import { prepareEncrypt } from './prepareEncrypt.js'
import { prepareIcons } from './prepareIcons.js'
import { prepareSidebar } from './prepareSidebar.js'

export async function prepareData(
  app: App,
): Promise<void> {
  const start = performance.now()
  const { localeOptions, encrypt } = getThemeConfig()
  await Promise.all([
    prepareArticleTagColors(app),
    preparedBlogData(app, localeOptions, encrypt),
    prepareSidebar(app, localeOptions),
    prepareEncrypt(app, encrypt),
    prepareIcons(app, localeOptions),
  ])

  if (app.env.isDebug) {
    logger.info(`Prepare data: ${(performance.now() - start).toFixed(2)}ms`)
  }
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
