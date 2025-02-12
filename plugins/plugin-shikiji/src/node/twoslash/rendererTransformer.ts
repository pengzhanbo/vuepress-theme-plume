import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { ShikiTransformer } from 'shiki'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { TwoslashFloatingVueRendererOptions } from './renderer-floating-vue.js'
import process from 'node:process'
import { createTransformerFactory } from '@shikijs/twoslash/core'
import { removeTwoslashNotations } from 'twoslash'
import { createTwoslasher } from 'twoslash-vue'
import { rendererFloatingVue } from './renderer-floating-vue.js'

export * from './renderer-floating-vue.js'

interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}

export interface VuePressTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger']
}

/**
 * Create a Shiki transformer for VuePress to enable twoslash integration
 */
export function transformerTwoslash(options: VuePressTwoslashOptions = {}): ShikiTransformer {
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
    createTwoslasher(options.twoslashOptions),
  )({
    langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'vue'],
    renderer: rendererFloatingVue(options),
    onTwoslashError: onError,
    onShikiError: onError,
    ...options,
    explicitTrigger,
  })

  const trigger = explicitTrigger instanceof RegExp
    ? explicitTrigger
    : /\btwoslash\b/

  return {
    ...twoslash,
    name: '@shiki/vuepress-twoslash',
    preprocess(code, options) {
      const cleanup = options.transformers?.find(i => i.name === 'vuepress:clean-up')
      if (cleanup)
        options.transformers?.splice(options.transformers.indexOf(cleanup), 1)

      // Disable v-pre for twoslash, because we need render it with FloatingVue
      if (!explicitTrigger || options.meta?.__raw?.match(trigger)) {
        const vPre = options.transformers?.find(i => i.name === 'vuepress:v-pre')
        if (vPre)
          options.transformers?.splice(options.transformers.indexOf(vPre), 1)
      }

      return twoslash.preprocess!.call(this, code, options)
    },
    postprocess(html) {
      if (this.meta.twoslash)
        return html.replace(/\{/g, '&#123;')

      return html
    },
  }
}
