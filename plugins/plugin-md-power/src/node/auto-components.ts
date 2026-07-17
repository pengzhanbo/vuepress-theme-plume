import type { Options } from 'unplugin-vue-components'
import type { App, BundlerOptions } from 'vuepress'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { toArray } from '@pengzhanbo/utils'
import { addViteConfig, configWebpack, getBundlerName } from '@vuepress/helper'

const builtInComponents: string[] = ['Abbreviation', 'Annotation', 'ArtPlayer', 'AudioReader', 'Caniuse', 'CodeEditor', 'CodePen', 'CodeRepl', 'CodeSandbox', 'CodeTabs', 'CodeTree', 'Collapse', 'CollapseItem', 'CopyButton', 'DemoBasic', 'DemoNormal', 'EncryptSnippet', 'Field', 'FileTreeNode', 'JsFiddle', 'Pdf', 'Plot', 'Tabs', 'QRCode', 'Table', 'Timeline', 'TimelineItem', 'VideoEmbed']
const COMPONENT_PREFIX = /^VP/

export async function autoComponents(
  bundlerOptions: BundlerOptions,
  app: App,
  { components = {} }: MarkdownPowerPluginOptions,
) {
  const { resolvers, ...options } = components
  const componentsOptions: Options = {
    dts: app.dir.temp('components.d.ts'),
    include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/, /\.md$/],
    resolvers: [{
      type: 'component',
      resolve: (name) => {
        const componentName = name.replace(COMPONENT_PREFIX, '')
        if (builtInComponents.includes(componentName))
          return `vuepress-plugin-md-power/components/VP${componentName}.vue`
        return undefined
      },
    }, ...toArray(resolvers)],
    ...options,
  }
  const bundler = getBundlerName(app)

  if (bundler === 'vite') {
    const { default: components } = await import('unplugin-vue-components/vite')
    addViteConfig(bundlerOptions, app, {
      plugins: [components(componentsOptions)],
    })
  }
  if (bundler === 'webpack') {
    const { default: components } = await import('unplugin-vue-components/webpack')
    configWebpack(bundlerOptions, app, (config) => {
      config.plugins ??= []
      config.plugins.push(components(componentsOptions))
    })
  }
}
