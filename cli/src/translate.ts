import type { Langs, Locale } from './types.js'
import { locales } from './locales/index.js'

interface Translate {
  setLang: (lang: Langs) => void
  t: (key: keyof Locale) => string
}

function createTranslate(lang?: Langs): Translate {
  let current: Langs = lang || 'en-US'

  return {
    setLang: (lang) => {
      current = lang
    },
    t: key => locales[current][key],
  }
}

const translate = createTranslate()

export const t: Translate['t'] = translate.t
export const setLang: Translate['setLang'] = translate.setLang
