import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type { ShikiTransformer } from 'shiki'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { WhitespacePosition } from '../utils/index.js'
import process from 'node:process'
import {
  transformerCompactLineOptions,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveNotationEscape,
  transformerRenderWhitespace,
} from '@shikijs/transformers'
import { defaultTwoslashOptions } from '@shikijs/twoslash/core'
import { addClassToHast } from 'shiki'
import { isPlainObject } from 'vuepress/shared'
import { defaultHoverInfoProcessor, transformerTwoslash } from '../twoslash/rendererTransformer.js'
import { attrsToLines, resolveWhitespacePosition } from '../utils/index.js'

const decorationsRE = /^\/\/ @decorations:(.*)\n/

export const baseTransformers: ShikiTransformer[] = [
  transformerNotationDiff(),
  transformerNotationFocus({
    classActiveLine: 'has-focus',
    classActivePre: 'has-focused-lines',
  }),
  transformerNotationHighlight(),
  transformerNotationErrorLevel(),
  transformerNotationWordHighlight(),
  {
    name: 'vuepress:add-class',
    pre(node) {
      addClassToHast(node, 'vp-code')
    },
  },
  {
    name: 'vuepress:clean-up',
    pre(node) {
      delete node.properties.tabindex
      delete node.properties.style
    },
  },
  {
    name: 'shiki:inline-decorations',
    preprocess(code, options) {
      code = code.replace(decorationsRE, (match, decorations) => {
        options.decorations ||= []
        options.decorations.push(...JSON.parse(decorations))
        return ''
      })
      return code
    },
  },
  transformerRemoveNotationEscape(),
]

const vueRE = /-vue$/
export function getInlineTransformers({ attrs, lang, enabledTwoslash, whitespace, twoslash }: {
  attrs: string
  lang: string
  enabledTwoslash: boolean
  whitespace: boolean | WhitespacePosition
  twoslash?: boolean | TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions
}): ShikiTransformer[] {
  const vPre = vueRE.test(lang) ? '' : 'v-pre'
  const inlineTransformers: ShikiTransformer[] = [
    transformerCompactLineOptions(attrsToLines(attrs)),
  ]

  if (enabledTwoslash) {
    const { compilerOptions, ...twoslashOptions } = isPlainObject(twoslash) ? twoslash : {}
    const defaultOptions = defaultTwoslashOptions()
    inlineTransformers.push(transformerTwoslash({
      processHoverInfo(info) {
        return defaultHoverInfoProcessor(info)
      },
      twoslashOptions: {
        ...defaultOptions,
        ...twoslashOptions,
        compilerOptions: {
          baseUrl: process.cwd(),
          ...compilerOptions,
        },
      },
    }))
  }
  else {
    inlineTransformers.push({
      name: 'vuepress:v-pre',
      pre(node) {
        if (vPre)
          node.properties['v-pre'] = ''
      },
    })
  }

  const position = resolveWhitespacePosition(attrs, whitespace)
  if (position)
    inlineTransformers.push(transformerRenderWhitespace({ position }))

  return inlineTransformers
}
