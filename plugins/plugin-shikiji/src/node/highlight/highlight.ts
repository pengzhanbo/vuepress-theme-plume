import type { HighlighterOptions, ThemeOptions } from '../types.js'
import { customAlphabet } from 'nanoid'
import { bundledLanguages, createHighlighter } from 'shiki'
import { colors, logger } from 'vuepress/utils'
import { getLanguage } from './getLanguage.js'
import { baseTransformers, getInlineTransformers } from './transformers.js'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)
const mustacheRE = /\{\{.*?\}\}/g

export async function highlight(
  theme: ThemeOptions,
  options: HighlighterOptions,
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

  await options.shikiSetup?.(highlighter)

  const loadedLanguages = highlighter.getLoadedLanguages()

  return (str: string, language: string, attrs: string = '') => {
    const lang = getLanguage(loadedLanguages, language, defaultLang)

    const enabledTwoslash = attrs.includes('twoslash') && !!options.twoslash

    const mustaches = new Map<string, string>()
    str = removeMustache(str, mustaches).trimEnd()

    try {
      const highlighted = highlighter.codeToHtml(str, {
        lang,
        transformers: [
          ...baseTransformers,
          ...getInlineTransformers({
            attrs,
            lang,
            enabledTwoslash,
            whitespace,
            twoslash: options.twoslash,
          }),
          ...userTransformers,
        ],
        meta: { __raw: attrs },
        ...(typeof theme === 'object' && 'light' in theme && 'dark' in theme
          ? { themes: theme, defaultColor: false }
          : { theme }),
      })

      const rendered = restoreMustache(highlighted, mustaches, enabledTwoslash)

      return rendered
    }
    catch (e) {
      logger.error(
        (e as Error)?.message,
        '\n',
        (e as Error)?.stack ? colors.gray(String((e as Error)?.stack)) : '',
      )
      return str
    }
  }
}

function removeMustache(s: string, mustaches: Map<string, string>) {
  return s.replace(mustacheRE, (match) => {
    let marker = mustaches.get(match)
    if (!marker) {
      marker = nanoid()
      mustaches.set(match, marker)
    }
    return marker
  })
}

function restoreMustache(s: string, mustaches: Map<string, string>, twoslash: boolean) {
  mustaches.forEach((marker, match) => {
    s = s.replaceAll(marker, match)
  })

  if (twoslash)
    s = s.replace(/\{/g, '&#123;')

  return `${s}\n`
}
