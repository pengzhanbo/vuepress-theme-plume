/* eslint-disable node/prefer-global/process */
import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import { createTwoslasher } from 'twoslash-vue'
import type { ShikiTransformer } from 'shiki'
import { removeTwoslashNotations } from 'twoslash'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue.js'
import { rendererFloatingVue } from './renderer-floating-vue.js'

export * from './renderer-floating-vue.js'

export interface VitePressPluginTwoslashOptions extends TransformerTwoslashOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']
}

/**
 * Create a Shiki transformer for VitePress to enable twoslash integration
 *
 * Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
 */
export function transformerTwoslash(options: VitePressPluginTwoslashOptions = {}): ShikiTransformer {
  const {
    explicitTrigger = true,
  } = options

  const onError = (error: any, code: string) => {
    const isCI = typeof process !== 'undefined' && process?.env?.CI
    const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development'
    const shouldThrow = (options.throws || isCI || !isDev) && options.throws !== false
    console.error(`\n\n--------\nTwoslash error in code:\n--------\n${code.split(/\n/g).slice(0, 15).join('\n').trim()}\n--------\n`)
    if (shouldThrow)
      throw error
    else
      console.error(error)
    return removeTwoslashNotations(code)
  }

  const twoslash = createTransformerFactory(
    createTwoslasher(),
  )({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    renderer: rendererFloatingVue(options),
    onTwoslashError: onError,
    onShikiError: onError,
    ...options,
    explicitTrigger,
  })

  return {
    ...twoslash,
    name: '@shikijs/vuepress-twoslash',
    preprocess(code, options) {
      const cleanup = options.transformers?.find(i => i.name === 'vuepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      return twoslash.preprocess!.call(this, code, options)
    },
    postprocess(html) {
      if (this.meta.twoslash)
        return html.replace(/{/g, '&#123;')

      return html
    },
  }
}
