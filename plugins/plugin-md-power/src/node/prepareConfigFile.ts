import type { App } from 'vuepress/core'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { ensureEndingSlash } from '@vuepress/helper'
import { getDirname, path } from 'vuepress/utils'
import { prepareIcon } from './icon/index.js'

const { url: filepath } = import.meta
const __dirname = getDirname(filepath)

/**
 * Client folder path constant.
 *
 * 客户端文件夹路径常量。
 */
const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname, '../client'),
)

/**
 * Prepare client configuration file for the plugin.
 *
 * 为插件准备客户端配置文件。
 *
 * This function dynamically generates the client config file based on the plugin options.
 * It imports and registers Vue components conditionally based on which features are enabled.
 *
 * 该函数根据插件选项动态生成客户端配置文件。
 * 它根据启用的功能有条件地导入和注册 Vue 组件。
 *
 * @param app - VuePress app instance / VuePress 应用实例
 * @param options - Plugin options / 插件配置选项
 * @returns Path to the generated config file / 生成的配置文件路径
 *
 * @example
 * ```ts
 * const configPath = await prepareConfigFile(app, {
 *   pdf: true,
 *   tabs: true,
 * })
 * ```
 */
export async function prepareConfigFile(app: App, options: MarkdownPowerPluginOptions): Promise<string> {
  const imports = new Set<string>()
  const enhances = new Set<string>()

  options.chat && imports.add(`import '${CLIENT_FOLDER}styles/chat.css'`)

  const setupIcon = prepareIcon(imports, options.icon)
  const setupStmts: string[] = []
  const iconSetup = setupIcon.trim()
  if (iconSetup)
    setupStmts.push(iconSetup)

  imports.add(`import { setupMarkHighlight } from '${CLIENT_FOLDER}composables/mark.js'`)
  setupStmts.push(`setupMarkHighlight(${JSON.stringify(options.mark === 'lazy' ? 'lazy' : 'eager')})`)

  const setupContent = setupStmts.length
    ? `    ${setupStmts.join('\n    ')}\n`
    : ''

  return app.writeTemp(
    'md-power/config.js',
    `\
import { defineClientConfig } from 'vuepress/client'
${Array.from(imports.values()).join('\n')}

import '${CLIENT_FOLDER}styles/index.css'

export default defineClientConfig({
  enhance({ router, app }) {
${Array.from(enhances.values())
  .map(item => `    ${item}`)
  .join('\n')}
  },
  setup() {
    ${setupContent}
  }
})
`,
  )
}
