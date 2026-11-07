import type { App } from 'vuepress'
import type { ThemeBuiltinPlugins, ThemeOptions } from '../../shared/index.js'

import { filterDraftNavbar } from '../features/draft.js'
import { processProfileImageSize, resolveThemeData } from '../features/theme-data.js'
import { getThemeOptions } from '../options.js'
import { genTempCode, perf, writeTemp } from '../utils/index.js'

/**
 * Prepare theme data
 *
 * 准备主题数据，解析主题配置、处理头像尺寸、解析公告栏并更新主题数据
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param plugins - Built-in theme plugins / 主题内置插件
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareThemeData(
  app: App,
  plugins: ThemeBuiltinPlugins,
  options: ThemeOptions = getThemeOptions(),
): Promise<void> {
  perf.mark('prepare:theme-data')
  const resolvedThemeData = resolveThemeData(app, options)

  // 草稿页面在生产构建中不存在，指向它们的导航项需要同步移除
  if (app.env.isBuild)
    filterDraftNavbar(resolvedThemeData, app.options.base)

  // 用户头像添加尺寸
  await processProfileImageSize(app, resolvedThemeData, plugins, options)

  const content = genTempCode(app, { name: 'themeData', content: resolvedThemeData })
  await writeTemp(app, 'internal/themePlumeData.js', content)

  perf.log('prepare:theme-data')
}
