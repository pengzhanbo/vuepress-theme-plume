import { colors as c, logger } from 'vuepress/utils'
import { customAlphabet } from 'nanoid'
import type { ShikiTransformer } from 'shiki'
import {
  addClassToHast,
  bundledLanguages,
  getHighlighter,
  isPlainLang,
  isSpecialLang,
} from 'shiki'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from '@shikijs/transformers'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import type { HighlighterOptions, ThemeOptions } from './types.js'
import { resolveAttrs } from './resolveAttrs.js'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

const RE_ESCAPE = /\[\\\!code/g
const mustacheRE = /\{\{.*?\}\}/g

export async function highlight(
  theme: ThemeOptions,
  options: HighlighterOptions,
): Promise<(str: string, lang: string, attrs: string) => string> {
  const {
    defaultHighlightLang: defaultLang = '',
    codeTransformers: userTransformers = [],
    whitespace = false,
  } = options

  const highlighter = await getHighlighter({
    themes:
      typeof theme === 'object' && 'light' in theme && 'dark' in theme
        ? [theme.light, theme.dark]
        : [theme],
    langs: [...Object.keys(bundledLanguages), ...(options.languages || [])],
    langAlias: options.languageAlias,
  })

  await options?.shikiSetup?.(highlighter)

  const transformers: ShikiTransformer[] = [
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
      name: 'vuepress-shikiji:remove-escape',
      postprocess: code => code.replace(RE_ESCAPE, '[!code'),
    },
  ]

  return (str: string, lang: string, attrs: string) => {
    lang = lang || defaultLang

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

    const inlineTransformers: ShikiTransformer[] = []

    if (attributes.twoslash) {
      inlineTransformers.push(transformerTwoslash({
        renderer: rendererRich({
          classExtra: 'vp-copy-ignore',
        }),
      }))
    }

    if (
      (whitespace && attributes.whitespace !== false)
      || (!whitespace && attributes.whitespace)
    )
      inlineTransformers.push(transformerRenderWhitespace({ position: 'boundary' }))

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
