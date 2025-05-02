import type { MarkdownEnhancePluginOptions } from 'vuepress-plugin-md-enhance'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'
import type { MarkdownOptions, ThemeBuiltinPlugins } from '../../shared/index.js'

export const PLUGINS_SUPPORTED_FIELDS: (keyof ThemeBuiltinPlugins)[] = [
  'search',
  'docsearch',
  'copyCode',
  'shiki',
  'git',
  'nprogress',
  'photoSwipe',
  'markdownEnhance',
  'markdownPower',
  'markdownImage',
  'markdownMath',
  'markdownInclude',
  'comment',
  'sitemap',
  'seo',
  'cache',
  'readingTime',
  'watermark',
  'replaceAssets',
]

export const MARKDOWN_ENHANCE_FIELDS: (keyof MarkdownEnhancePluginOptions)[] = [
  'chartjs',
  'echarts',
  'mermaid',
  'markmap',
  'plantuml',
  'flowchart',
  'revealJs',
  'playground',
  'vuePlayground',
  'kotlinPlayground',
  'sandpack',
]

export const MARKDOWN_POWER_FIELDS: (keyof MarkdownPowerPluginOptions)[] = [
  'abbr',
  'annotation',
  'artPlayer',
  'audioReader',
  'bilibili',
  'caniuse',
  'codeSandbox',
  'codeTabs',
  'codeTree',
  'codepen',
  'demo',
  'fileTree',
  'field',
  'icons',
  'imageSize',
  'jsfiddle',
  'npmTo',
  'pdf',
  'plot',
  'repl',
  'replit',
  'timeline',
  'collapse',
  'chat',
  'youtube',
]

export const MARKDOWN_SUPPORT_FIELDS: (keyof MarkdownOptions)[] = [
  ...(MARKDOWN_ENHANCE_FIELDS as (keyof MarkdownOptions)[]),
  ...MARKDOWN_POWER_FIELDS,
  'oldDemo',
  'image',
  'math',
  'include',
  'hint',
  'alert',
]
