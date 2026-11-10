import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { getThemeOptions } from '../options.js'
import { perf } from '../utils/index.js'
import { prepareBulletin } from './bulletin.js'
import { prepareCollections } from './collections.js'
import { prepareEncrypt } from './encrypt.js'
import { prepareHomeHeroEffects } from './home-hero-effects.js'
import { prepareIcons } from './icons.js'
import { prepareLinkPreview } from './link-preview.js'
import { preparedPostsData } from './posts-data.js'
import { prepareRelatedPosts } from './related-posts.js'
import { prepareSidebar } from './sidebar.js'
import { prepareArticleTagColors } from './tag-color.js'

/**
 * Prepare all theme data
 *
 * 准备所有主题数据，包括文章标签颜色、文章列表、侧边栏、集合、加密、图标、Hero 动画效果等
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareData(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:data')

  await Promise.all([
    prepareArticleTagColors(app),
    preparedPostsData(app, options),
    prepareRelatedPosts(app, options),
    prepareLinkPreview(app, options),
    prepareSidebar(app, options),
    prepareCollections(app, options),
    prepareEncrypt(app, options),
    prepareIcons(app, options),
    prepareHomeHeroEffects(app),
    prepareBulletin(app),
  ])

  perf.log('prepare:data')
}
