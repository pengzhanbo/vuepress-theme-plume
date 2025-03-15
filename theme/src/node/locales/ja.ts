/** 日语 */
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const jaLocale: ThemeLocaleText = {
  selectLanguageName: '日本語',
  selectLanguageText: '言語を選択',

  appearanceText: '外観',
  lightModeSwitchTitle: 'ライトモードに切り替え',
  darkModeSwitchTitle: 'ダークモードに切り替え',

  outlineLabel: 'このページの内容',
  returnToTopLabel: 'トップに戻る',
  editLinkText: 'このページを編集',
  contributorsText: '貢献者',
  prevPageLabel: '前のページ',
  nextPageLabel: '次のページ',
  lastUpdatedText: '最終更新日',

  changelogText: '変更履歴',
  changelogOnText: 'に',
  changelogButtonText: 'すべての変更履歴を見る',

  copyrightText: '著作権',
  copyrightAuthorText: '著作権者：',
  copyrightCreationOriginalText: '本文リンク：',
  copyrightCreationTranslateText: '本文の翻訳元：',
  copyrightCreationReprintText: '本文の転載元：',
  copyrightLicenseText: 'ライセンス：',

  notFound: {
    code: '404',
    title: 'ページが見つかりません',
    quote: 'しかし、方向を変えずに探し続ければ、最終的には行きたい場所にたどり着くかもしれません。',
    linkText: 'ホームに戻る',
  },

  homeText: 'ホーム',
  blogText: 'ブログ',
  tagText: 'タグ',
  archiveText: 'アーカイブ',
  categoryText: 'カテゴリー',
  archiveTotalText: '{count} 件',

  encryptButtonText: '確認',
  encryptPlaceholder: 'パスワードを入力してください',
  encryptGlobalText: 'このサイトはパスワードでのみアクセス可能です',
  encryptPageText: 'このページはパスワードでのみアクセス可能です',

  footer: {
    message:
      '<a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a> によって提供されています',
  },
}

export const jaPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 パブリックドメイン',
  'CC-BY-4.0': '表示 4.0 国際',
  'CC-BY-NC-4.0': '表示-非営利 4.0 国際',
  'CC-BY-NC-SA-4.0': '表示-非営利-継承 4.0 国際',
  'CC-BY-NC-ND-4.0': '表示-非営利-改変禁止 4.0 国際',
  'CC-BY-ND-4.0': '表示-改変禁止 4.0 国際',
  'CC-BY-SA-4.0': '表示-継承 4.0 国際',
}
