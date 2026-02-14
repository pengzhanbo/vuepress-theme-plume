import type { MarkdownChartPluginOptions } from '@vuepress/plugin-markdown-chart'
import type { MarkdownHintPluginOptions } from '@vuepress/plugin-markdown-hint'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { PluginConfig } from 'vuepress'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'
import type { MarkdownOptions, ThemeBuiltinPlugins } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart'
import { markdownHintPlugin } from '@vuepress/plugin-markdown-hint'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include'
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { markdownPowerPlugin } from 'vuepress-plugin-md-power'
import { MARKDOWN_CHART_FIELDS, MARKDOWN_POWER_FIELDS } from '../detector/index.js'
import { getThemeConfig } from '../loadConfig/index.js'

/**
 * Setup markdown plugins
 *
 * 设置 Markdown 增强插件，包括提示、图像、数学公式、图表等功能
 */
export function markdownPlugins(pluginOptions: ThemeBuiltinPlugins): PluginConfig {
  const options = getThemeConfig()
  const plugins: PluginConfig = []
  let { hint, image, include, math, mdChart, mdPower } = splitMarkdownOptions(options.markdown ?? {})

  plugins.push(markdownHintPlugin({
    hint: hint.hint ?? true,
    alert: hint.alert ?? true,
    injectStyles: false,
  }))

  if (pluginOptions.markdownPower !== false) {
    const shikiOptions = options.codeHighlighter ?? pluginOptions.shiki

    const shikiTheme = shikiOptions && 'theme' in shikiOptions
      ? shikiOptions.theme
      : shikiOptions && 'themes' in shikiOptions
        ? shikiOptions.themes
        : { light: 'vitesse-light', dark: 'vitesse-dark' }

    const repl = mdPower?.repl ?? pluginOptions.markdownPower?.repl
    plugins.push(markdownPowerPlugin({
      fileTree: true,
      plot: true,
      icons: true,
      ...pluginOptions.markdownPower || {},
      ...mdPower,
      repl: repl ? { theme: shikiTheme as any, ...repl } : repl,
    }))
  }

  mdChart ??= pluginOptions.markdownChart
  if (mdChart) {
    plugins.push(markdownChartPlugin({
      DANGEROUS_ALLOW_SCRIPT_EXECUTION: true,
      DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: '*',
      ...mdChart,
    }))
  }

  math ??= pluginOptions.markdownMath
  if (math !== false) {
    plugins.push(markdownMathPlugin(math ?? { type: 'katex' }))
  }

  image ??= pluginOptions.markdownImage
  if (image) {
    plugins.push(markdownImagePlugin(image))
  }

  include ??= pluginOptions.markdownInclude
  if (include !== false) {
    plugins.push(markdownIncludePlugin(isPlainObject(include) ? include : {}))
  }

  return plugins
}

function splitMarkdownOptions(options: MarkdownOptions): {
  mdPower: MarkdownPowerPluginOptions
  mdChart?: false | MarkdownChartPluginOptions
  image?: false | MarkdownImagePluginOptions
  include?: boolean | MarkdownIncludePluginOptions
  math?: false | MarkdownMathPluginOptions
  hint: MarkdownHintPluginOptions
} {
  const { hint, alert, oldDemo, image, include, math, ...restOptions } = options
  const mdChart: MarkdownChartPluginOptions = {}
  const mdPower: MarkdownPowerPluginOptions = {}

  for (const key in restOptions) {
    if (MARKDOWN_CHART_FIELDS.includes(key as keyof MarkdownChartPluginOptions)) {
      mdChart[key] = restOptions[key]
    }
    else if (MARKDOWN_POWER_FIELDS.includes(key as keyof MarkdownPowerPluginOptions)) {
      mdPower[key] = restOptions[key]
    }
  }

  const mdChartKeys = Object.keys(mdChart)

  return {
    hint: { hint, alert },
    image,
    include,
    math,
    mdChart: mdChartKeys.length && mdChartKeys.some(key => mdChart[key] !== false) ? mdChart : false,
    mdPower,
  }
}
