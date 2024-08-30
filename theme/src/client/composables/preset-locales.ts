import type { PresetLocale } from '../../shared/index.js'

declare const __PLUME_PRESET_LOCALE__: Record<string, PresetLocale>

export const presetLocales = __PLUME_PRESET_LOCALE__

export function getPresetLocaleData(locale: string, name: keyof PresetLocale) {
  return presetLocales[locale]?.[name] || presetLocales['/'][name]
}
