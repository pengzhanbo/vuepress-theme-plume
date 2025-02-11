import type { SearchLocaleOptions } from '../../shared/index.js'

export const enSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Search',
  resetButtonTitle: 'Reset search',
  backButtonTitle: 'Close search',
  noResultsText: 'No results for',
  footer: {
    selectText: 'to select',
    selectKeyAriaLabel: 'enter',
    navigateText: 'to navigate',
    navigateUpKeyAriaLabel: 'up arrow',
    navigateDownKeyAriaLabel: 'down arrow',
    closeText: 'to close',
    closeKeyAriaLabel: 'escape',
  },
}
