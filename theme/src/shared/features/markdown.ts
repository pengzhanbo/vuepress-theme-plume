import type { MarkdownHintPluginOptions } from '@vuepress/plugin-markdown-hint'
import type { MarkdownImagePluginOptions } from '@vuepress/plugin-markdown-image'
import type { MarkdownIncludePluginOptions } from '@vuepress/plugin-markdown-include'
import type { MarkdownMathPluginOptions } from '@vuepress/plugin-markdown-math'
import type { MarkdownEnhancePluginOptions } from 'vuepress-plugin-md-enhance'
import type { MarkdownPowerPluginOptions } from 'vuepress-plugin-md-power'

export interface MarkdownOptions extends MarkdownPowerPluginOptions,
  Pick<
    MarkdownEnhancePluginOptions,
    'chartjs' | 'echarts' | 'mermaid' | 'markmap' | 'plantuml' | 'flowchart' |
    'revealJs' | 'playground' | 'vuePlayground' | 'kotlinPlayground' | 'sandpack'
  >,
  Pick<MarkdownHintPluginOptions, 'alert' | 'hint'> {
  /**
   * 此项为 `vuepress-plugin-md-enhance` 的 `demo` 选项，已弃用
   * @deprecated use `demo` instead
   */
  oldDemo?: MarkdownEnhancePluginOptions['demo']

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
