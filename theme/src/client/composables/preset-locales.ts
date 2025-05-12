import type { PresetLocale } from '../../shared/index.js'

interface PresetLocales {
  [locale: string]: PresetLocale
}

declare const __PLUME_PRESET_LOCALE__: PresetLocales

export const presetLocales: PresetLocales = __PLUME_PRESET_LOCALE__

export function getPresetLocaleData(locale: string, name: keyof PresetLocale): string {
  return presetLocales[locale]?.[name] || presetLocales['/'][name]
}
