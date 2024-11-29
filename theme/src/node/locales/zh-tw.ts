/** 繁体中文 */
import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchLocaleOptions } from '@vuepress/plugin-docsearch'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'

export const zhTwLocale: PlumeThemeLocaleData = {
  selectLanguageName: '繁體中文',
  selectLanguageText: '選擇語言',

  appearanceText: '外觀',
  lightModeSwitchTitle: '切換為淺色主題',
  darkModeSwitchTitle: '切換為深色主題',

  outlineLabel: '此頁內容',
  returnToTopLabel: '返回頂部',
  editLinkText: '編輯此頁',
  contributorsText: '貢獻者',
  prevPageLabel: '上一頁',
  nextPageLabel: '下一頁',
  lastUpdatedText: '最後更新於',

  changelogText: '變更歷史',
  changelogOnText: '於',
  changelogButtonText: '查看全部變更歷史',

  copyrightText: '版權所有',
  copyrightAuthorText: '版權歸屬：',
  copyrightCreationOriginalText: '本文連結：',
  copyrightCreationTranslateText: '本文翻譯自：',
  copyrightCreationReprintText: '本文轉載自：',
  copyrightLicenseText: '許可證：',

  notFound: {
    code: '404',
    title: '頁面未找到',
    quote: '但是，如果你不改變方向，並且一直尋找，最終可能會到達你要去的地方。',
    linkText: '返回首頁',
  },

  homeText: '首頁',
  blogText: '博客',
  tagText: '標籤',
  archiveText: '歸檔',
  categoryText: '分類',
  archiveTotalText: '{count} 篇',

  encryptButtonText: '確認',
  encryptPlaceholder: '請輸入密碼',
  encryptGlobalText: '本站只允許密碼訪問',
  encryptPageText: '本頁面只允許密碼訪問',

  footer: {
    message:
      'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const zhTwPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 通用',
  'CC-BY-4.0': '署名 4.0 國際',
  'CC-BY-NC-4.0': '署名-非商業性 4.0 國際',
  'CC-BY-NC-SA-4.0': '署名-非商業性-相同方式共享 4.0 國際',
  'CC-BY-NC-ND-4.0': '署名-非商業性-禁止演繹 4.0 國際',
  'CC-BY-ND-4.0': '署名-禁止演繹 4.0 國際',
  'CC-BY-SA-4.0': '署名-相同方式共享 4.0 國際',
}

export const zhTwDocsearchLocale: DocSearchLocaleOptions = {
  placeholder: '搜索文檔',
  translations: {
    button: {
      buttonText: '搜索文檔',
      buttonAriaLabel: '搜索文檔',
    },
    modal: {
      searchBox: {
        resetButtonTitle: '清除查詢條件',
        resetButtonAriaLabel: '清除查詢條件',
        cancelButtonText: '取消',
        cancelButtonAriaLabel: '取消',
      },
      startScreen: {
        recentSearchesTitle: '搜索歷史',
        noRecentSearchesText: '沒有搜索歷史',
        saveRecentSearchButtonTitle: '保存至搜索歷史',
        removeRecentSearchButtonTitle: '從搜索歷史中移除',
        favoriteSearchesTitle: '收藏',
        removeFavoriteSearchButtonTitle: '從收藏中移除',
      },
      errorScreen: {
        titleText: '無法獲取結果',
        helpText: '你可能需要檢查你的網絡連接',
      },
      footer: {
        selectText: '選擇',
        navigateText: '切換',
        closeText: '關閉',
        searchByText: '搜索提供者',
      },
      noResultsScreen: {
        noResultsText: '無法找到相關結果',
        suggestedQueryText: '你可以嘗試查詢',
        reportMissingResultsText: '你認為該查詢應該有結果？',
        reportMissingResultsLinkText: '點擊反饋',
      },
    },
  },
}

export const zhTwSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: '搜索文檔',
  resetButtonTitle: '重置搜索',
  backButtonTitle: '關閉',
  noResultsText: '無搜索結果：',
  footer: {
    selectText: '選擇',
    selectKeyAriaLabel: '輸入',
    navigateText: '切換',
    navigateUpKeyAriaLabel: '向上',
    navigateDownKeyAriaLabel: '向下',
    closeText: '關閉',
    closeKeyAriaLabel: '退出',
  },
}
