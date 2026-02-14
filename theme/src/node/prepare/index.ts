import type { App } from 'vuepress'
import { watch } from 'chokidar'
import { perf } from '../utils/index.js'
import { prepareArticleTagColors } from './prepareArticleTagColor.js'
import { prepareCollections } from './prepareCollections.js'
import { prepareEncrypt } from './prepareEncrypt.js'
import { prepareHomeHeroEffects } from './prepareHomeHeroEffects.js'
import { prepareIcons } from './prepareIcons.js'
import { preparedPostsData } from './preparePostsData.js'
import { prepareSidebar } from './prepareSidebar.js'

/**
 * Prepare all theme data
 *
 * 准备所有主题数据，包括文章标签颜色、文章列表、侧边栏、集合、加密、图标、Hero 动画效果等
 */
export async function prepareData(app: App): Promise<void> {
  perf.mark('prepare:data')

  await Promise.all([
    prepareArticleTagColors(app),
    preparedPostsData(app),
    prepareSidebar(app),
    prepareCollections(app),
    prepareEncrypt(app),
    prepareIcons(app),
    prepareHomeHeroEffects(app),
  ])

  perf.log('prepare:data')
}

/**
 * Watch for changes in prepared data and re-prepare when needed
 *
 * 监听准备数据的变化，并在需要时重新准备数据
 */
export function watchPrepare(
  app: App,
  watchers: any[],
): void {
  const pagesWatcher = watch('pages', {
    cwd: app.dir.temp(),
    ignoreInitial: true,
    ignored: (filepath, stats) => Boolean(stats?.isFile()) && !filepath.endsWith('.js'),
  })
  watchers.push(pagesWatcher)

  pagesWatcher.on('change', () => prepareData(app))
  pagesWatcher.on('add', () => prepareData(app))
  pagesWatcher.on('unlink', () => prepareData(app))
}
