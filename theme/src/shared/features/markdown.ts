import type { MarkdownChartPluginOptions } from '@vuepress/plugin-markdown-chart'
import type { MarkdownHintPluginOptions } from '@vuepress/plugin-markdown-hint'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'

export interface MarkdownOptions extends MarkdownPowerPluginOptions,
  MarkdownChartPluginOptions,
  Pick<MarkdownHintPluginOptions, 'alert' | 'hint'> {
  /**
   * 已弃用
   * @deprecated use `demo` instead
   */
  oldDemo?: never

  /**
   * markdown image enhance
   */
  image?: false | MarkdownImagePluginOptions

  /**
   * 在 markdown 中包含其他文件
   */
  include?: false | MarkdownIncludePluginOptions

  /**
   * markdown 数学公式
   */
  math?: false | MarkdownMathPluginOptions
}
