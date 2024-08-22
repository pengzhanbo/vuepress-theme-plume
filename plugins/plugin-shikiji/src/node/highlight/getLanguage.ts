import { isPlainLang, isSpecialLang } from 'shiki'
import { colors as c, logger } from 'vuepress/utils'
import { resolveLanguage } from '../utils/index.js'

export function getLanguage(
  loadedLanguages: string[],
  language: string,
  defaultLang: string,
): string {
  let lang = resolveLanguage(language) || defaultLang

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
  return lang
}
