/**
 * German locale configuration for search plugin.
 *
 * 搜索插件的德语本地化配置。
 *
 * @module plugin-search/node/locales/de
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * German search locale strings.
 *
 * 德语搜索本地化字符串。
 */
export const deSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Dokumente durchsuchen',
  resetButtonTitle: 'Suche zurücksetzen',
  backButtonTitle: 'Schließen',
  noResultsText: 'Keine Suchergebnisse:',
  footer: {
    selectText: 'Auswählen',
    selectKeyAriaLabel: 'Eingabe',
    navigateText: 'Wechseln',
    navigateUpKeyAriaLabel: 'Nach oben',
    navigateDownKeyAriaLabel: 'Nach unten',
    closeText: 'Schließen',
    closeKeyAriaLabel: 'Beenden',
  },
}
