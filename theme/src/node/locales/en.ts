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
  lastUpdated: {
    text: 'Last Updated',
  },

  encryptButtonText: 'Confirm',
  encryptPlaceholder: 'Enter password',
  encryptGlobalText: 'Only password can access this site',
  encryptPageText: 'Only password can access this page',

  footer: {
    message:
      'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const enPresetLocale: PresetLocale = {
  home: 'Home',
  blog: 'Blog',
  tag: 'Tags',
  archive: 'Archives',
  category: 'Categories',
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
