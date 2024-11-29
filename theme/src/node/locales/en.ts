import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'

export const enLocale: PlumeThemeLocaleData = {
  selectLanguageName: 'English',
  selectLanguageText: 'Languages',

  appearanceText: 'Appearance',
  lightModeSwitchTitle: 'Switch to light theme',
  darkModeSwitchTitle: 'Switch to dark theme',

  editLinkText: 'Edit this page',
  contributorsText: 'Contributors',
  lastUpdatedText: 'Last Updated',
  changelogText: 'Changelog',
  changelogOnText: 'On',
  changelogButtonText: 'View All Changelog',

  copyrightText: 'Copyright',
  copyrightAuthorText: 'Copyright Ownership:',
  copyrightCreationOriginalText: 'This article link:',
  copyrightCreationTranslateText: 'This article is translated from:',
  copyrightCreationReprintText: 'This article is reprint from:',
  copyrightLicenseText: 'License under:',

  encryptButtonText: 'Confirm',
  encryptPlaceholder: 'Enter password',
  encryptGlobalText: 'Only password can access this site',
  encryptPageText: 'Only password can access this page',

  homeText: 'Home',
  blogText: 'Blog',
  tagText: 'Tags',
  archiveText: 'Archives',
  categoryText: 'Categories',
  archiveTotalText: '{count} articles',

  footer: {
    message:
      'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const enPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 Universal',
  'CC-BY-4.0': 'Attribution 4.0 International',
  'CC-BY-NC-4.0': 'Attribution-NonCommercial 4.0 International',
  'CC-BY-NC-SA-4.0': 'Attribution-NonCommercial-ShareAlike 4.0 International',
  'CC-BY-NC-ND-4.0': 'Attribution-NonCommercial-NoDerivatives 4.0 International',
  'CC-BY-ND-4.0': 'Attribution-NoDerivatives 4.0 International',
  'CC-BY-SA-4.0': 'Attribution-ShareAlike 4.0 International',
}

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
