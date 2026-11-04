import type { App } from 'vuepress'
import type { ThemeOptions, ThemeSidebarData } from '../../shared/index.js'
import { getAllSidebar, getSidebarData } from '../features/sidebar.js'
import { getThemeOptions } from '../options.js'
import { genTempCode, perf, writeTemp } from '../utils/index.js'

/**
 * Prepare sidebar data
 *
 * 准备侧边栏数据，处理所有语言环境的侧边栏配置并生成临时文件
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareSidebar(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:sidebar')
  const locales = getAllSidebar(options)

  const { auto, home } = getSidebarData(app, locales, options)
  const data: ThemeSidebarData = { locales, auto, home }
  await writeTemp(app, 'internal/sidebar.js', genTempCode(app, { name: 'sidebar', content: data }))

  perf.log('prepare:sidebar')
}
