import { colors as c, logger } from 'vuepress/utils'
import { customAlphabet } from 'nanoid'
import type { ShikiTransformer } from 'shiki'
import {
  addClassToHast,
  bundledLanguages,
  createHighlighter,
  isPlainLang,
  isSpecialLang,
} from 'shiki'
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
import type { HighlighterOptions, ThemeOptions } from './types.js'
import { LRUCache, attrsToLines, resolveLanguage } from './utils/index.js'
import { defaultHoverInfoProcessor, transformerTwoslash } from './twoslash/rendererTransformer.js'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)
const cache = new LRUCache<string, string>(64)

const vueRE = /-vue$/
const mustacheRE = /\{\{.*?\}\}/g
const decorationsRE = /^\/\/ @decorations:(.*?)\n/

export async function highlight(
  theme: ThemeOptions,
  options: HighlighterOptions,
  isDev: boolean,
): Promise<(str: string, lang: string, attrs: string) => string> {
  const {
    defaultHighlightLang: defaultLang = '',
    codeTransformers: userTransformers = [],
    whitespace = false,
    languages = Object.keys(bundledLanguages),
  } = options

  const highlighter = await createHighlighter({
    themes:
      typeof theme === 'object' && 'light' in theme && 'dark' in theme
        ? [theme.light, theme.dark]
        : [theme],
    langs: languages,
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

  const loadedLanguages = highlighter.getLoadedLanguages()

  return (str: string, language: string, attrs: string) => {
    attrs = attrs || ''
    let lang = resolveLanguage(language) || defaultLang
    const vPre = vueRE.test(lang) ? '' : 'v-pre'

    const key = str + language + attrs

    if (isDev) {
      const rendered = cache.get(key)
      if (rendered)
        return rendered
    }

    if (lang) {
      const langLoaded = loadedLanguages.includes(lang as any)
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
    // const { attrs: attributes, rawAttrs } = resolveAttrs(attrs || '')
    const enabledTwoslash = attrs.includes('twoslash')
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

      if (enabledTwoslash && options.twoslash)
        s = s.replace(/{/g, '&#123;')

      return `${s}\n`
    }

    str = removeMustache(str).trimEnd()

    const inlineTransformers: ShikiTransformer[] = [
      transformerCompactLineOptions(attrsToLines(attrs)),
    ]

    if (enabledTwoslash && options.twoslash) {
      inlineTransformers.push(transformerTwoslash({
        processHoverInfo(info) {
          return defaultHoverInfoProcessor(info)
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

    if (attrs.includes('whitespace') || whitespace)
      inlineTransformers.push(transformerRenderWhitespace({ position: 'boundary' }))

    try {
      const highlighted = highlighter.codeToHtml(str, {
        lang,
        transformers: [
          ...transformers,
          ...inlineTransformers,
          ...userTransformers,
        ],
        meta: { __raw: attrs },
        ...(typeof theme === 'object' && 'light' in theme && 'dark' in theme
          ? { themes: theme, defaultColor: false }
          : { theme }),
      })

      const rendered = restoreMustache(highlighted)

      if (isDev)
        cache.set(key, rendered)

      return rendered
    }
    catch (e) {
      logger.error(e)
      return str
    }
  }
}
