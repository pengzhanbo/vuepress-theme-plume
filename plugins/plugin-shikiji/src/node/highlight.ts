import { logger } from '@vuepress/utils'
import { customAlphabet } from 'nanoid'
import c from 'picocolors'
import type { ShikijiTransformer } from 'shikiji'
import {
  addClassToHast,
  bundledLanguages,
  getHighlighter,
  isPlaintext as isPlainLang,
  isSpecialLang,
} from 'shikiji'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from 'shikiji-transformers'
import { rendererRich, transformerTwoslash } from 'shikiji-twoslash'
import type { HighlighterOptions, ThemeOptions } from './types.js'
import { resolveAttrs } from './resolveAttrs.js'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

export async function highlight(
  theme: ThemeOptions,
  options: HighlighterOptions,
): Promise<(str: string, lang: string, attrs: string) => string> {
  const {
    defaultHighlightLang: defaultLang = '',
    codeTransformers: userTransformers = [],
  } = options

  const highlighter = await getHighlighter({
    themes:
      typeof theme === 'object' && 'light' in theme && 'dark' in theme
        ? [theme.light, theme.dark]
        : [theme],
    langs: [...Object.keys(bundledLanguages), ...(options.languages || [])],
    langAlias: options.languageAlias,
  })

  await options?.shikijiSetup?.(highlighter)

  const transformers: ShikijiTransformer[] = [
    transformerNotationDiff(),
    transformerNotationFocus({
      classActiveLine: 'has-focus',
      classActivePre: 'has-focused-lines',
    }),
    transformerNotationHighlight(),
    transformerNotationErrorLevel(),
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
  ]

  const vueRE = /-vue$/
  const lineNoStartRE = /=(\d*)/
  const lineNoRE = /:(no-)?line-numbers(=\d*)?$/
  const mustacheRE = /\{\{.*?\}\}/g

  return (str: string, lang: string, attrs: string) => {
    const vPre = vueRE.test(lang) ? '' : 'v-pre'
    lang
      = lang
        .replace(lineNoStartRE, '')
        .replace(lineNoRE, '')
        .replace(vueRE, '')
        .toLowerCase() || defaultLang

    if (lang) {
      const langLoaded = highlighter.getLoadedLanguages().includes(lang as any)
      if (!langLoaded && !isPlainLang(lang) && !isSpecialLang(lang)) {
        logger.warn(
          c.yellow(
            `\nThe language '${lang}' is not loaded, falling back to '${defaultLang || 'txt'
            }' for syntax highlighting.`,
          ),
        )
        lang = defaultLang
      }
    }
    const { attrs: attributes, rawAttrs } = resolveAttrs(attrs || '')
    const mustaches = new Map<string, string>()

    const removeMustache = (s: string) => {
      if (vPre)
        return s
      return s.replace(mustacheRE, (match) => {
        let marker = mustaches.get(match)
        if (!marker) {
          marker = nanoid()
          mustaches.set(match, marker)
        }
        return marker
      })
    }

    const restoreMustache = (s: string) => {
      mustaches.forEach((marker, match) => {
        s = s.replaceAll(marker, match)
      })

      return `${s}\n`
    }

    str = removeMustache(str).trimEnd()

    const inlineTransformers: ShikijiTransformer[] = [
      {
        name: 'vuepress-shikiji:empty-line',
        pre(hast) {
          hast.children.forEach((code) => {
            if (code.type === 'element' && code.tagName === 'code') {
              code.children.forEach((span) => {
                if (
                  span.type === 'element'
                  && span.tagName === 'span'
                  && Array.isArray(span.properties.class)
                  && span.properties.class.includes('line')
                  && span.children.length === 0
                ) {
                  span.children.push({
                    type: 'element',
                    tagName: 'wbr',
                    properties: {},
                    children: [],
                  })
                }
              })
            }
          })
        },
      },
      {
        name: 'vuepress-shikiji:remove-escape',
        postprocess(code) {
          return code.replace(/\[\\\!code/g, '[!code')
        },
      },
    ]

    if (attributes.twoslash) {
      inlineTransformers.push(transformerTwoslash({
        renderer: rendererRich({
          classExtra: 'vp-copy-ignore',
        }),
      }))
    }

    try {
      const highlighted = highlighter.codeToHtml(str, {
        lang,
        transformers: [
          ...transformers,
          ...inlineTransformers,
          ...userTransformers,
        ],
        meta: {
          __raw: rawAttrs,
        },
        ...(typeof theme === 'object' && 'light' in theme && 'dark' in theme
          ? { themes: theme, defaultColor: false }
          : { theme }),
      })

      return restoreMustache(highlighted)
    }
    catch (e) {
      logger.error(e)
      return str
    }
  }
}
