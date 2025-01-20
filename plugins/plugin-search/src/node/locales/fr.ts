/** 法语 */
import type { SearchLocaleOptions } from '../../shared/index.js'

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
