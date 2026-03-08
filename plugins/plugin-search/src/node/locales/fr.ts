/**
 * French locale configuration for search plugin.
 *
 * 搜索插件的法语本地化配置。
 *
 * @module plugin-search/node/locales/fr
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * French search locale strings.
 *
 * 法语搜索本地化字符串。
 */
export const frSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Rechercher dans la documentation',
  resetButtonTitle: 'Réinitialiser la recherche',
  backButtonTitle: 'Fermer',
  noResultsText: 'Aucun résultat trouvé :',
  footer: {
    selectText: 'sélectionner',
    selectKeyAriaLabel: 'Entrée',
    navigateText: 'naviguer',
    navigateUpKeyAriaLabel: 'haut',
    navigateDownKeyAriaLabel: 'bas',
    closeText: 'fermer',
    closeKeyAriaLabel: 'sortie',
  },
}
