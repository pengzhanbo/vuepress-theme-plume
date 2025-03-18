import type { MarkdownHintPluginOptions } from '@vuepress/plugin-markdown-hint'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { PluginConfig } from 'vuepress'
import type { MarkdownEnhancePluginOptions } from 'vuepress-plugin-md-enhance'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'
import type { MarkdownOptions, ThemeBuiltinPlugins } from '../../shared/index.js'
import { isPlainObject } from '@vuepress/helper'
import { markdownHintPlugin } from '@vuepress/plugin-markdown-hint'
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { markdownIncludePlugin } from '@vuepress/plugin-markdown-include'
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import { markdownPowerPlugin } from 'vuepress-plugin-md-power'
import { MARKDOWN_ENHANCE_FIELDS, MARKDOWN_POWER_FIELDS } from '../detector/index.js'
import { getThemeConfig } from '../loadConfig/index.js'

export function markdownPlugins(pluginOptions: ThemeBuiltinPlugins): PluginConfig {
  const options = getThemeConfig()
  const plugins: PluginConfig = []
  let { hint, image, include, math, mdEnhance, mdPower } = splitMarkdownOptions(options.markdown ?? {})

  plugins.push(markdownHintPlugin({
    hint: hint.hint ?? true,
    alert: hint.alert ?? true,
    injectStyles: false,
  }))

  if (pluginOptions.markdownEnhance !== false) {
    plugins.push(mdEnhancePlugin({
      ...pluginOptions.markdownEnhance,
      ...mdEnhance,
    }))
  }

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
  mdEnhance: MarkdownEnhancePluginOptions
  mdPower: MarkdownPowerPluginOptions
  image?: false | MarkdownImagePluginOptions
  include?: boolean | MarkdownIncludePluginOptions
  math?: false | MarkdownMathPluginOptions
  hint: MarkdownHintPluginOptions
} {
  const { hint, alert, oldDemo, image, include, math, ...restOptions } = options
  const mdEnhance: MarkdownEnhancePluginOptions = { demo: oldDemo }
  const mdPower: MarkdownPowerPluginOptions = {}

  for (const key in restOptions) {
    if (MARKDOWN_ENHANCE_FIELDS.includes(key as keyof MarkdownEnhancePluginOptions)) {
      mdEnhance[key] = restOptions[key]
    }
    else if (MARKDOWN_POWER_FIELDS.includes(key as keyof MarkdownPowerPluginOptions)) {
      mdPower[key] = restOptions[key]
    }
  }

  return {
    hint: { hint, alert },
    image,
    include,
    math,
    mdEnhance,
    mdPower,
  }
}
