/** 繁体中文 */
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const zhTwLocale: ThemeLocaleText = {
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
