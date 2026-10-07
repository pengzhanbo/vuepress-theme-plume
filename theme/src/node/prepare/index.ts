import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { getThemeConfig } from '../loadConfig/index.js'
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
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeConfig()` / 主题配置，默认从 `getThemeConfig()` 读取
 */
export async function prepareData(app: App, options: ThemeOptions = getThemeConfig()): Promise<void> {
  perf.mark('prepare:data')

  await Promise.all([
    prepareArticleTagColors(app),
    preparedPostsData(app, options),
    prepareSidebar(app, options),
    prepareCollections(app, options),
    prepareEncrypt(app, options),
    prepareIcons(app, options),
    prepareHomeHeroEffects(app),
  ])

  perf.log('prepare:data')
}
