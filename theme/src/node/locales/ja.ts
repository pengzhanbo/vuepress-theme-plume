/** 日语 */
import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchLocaleOptions } from '@vuepress/plugin-docsearch'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'

export const jaLocale: PlumeThemeLocaleData = {
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

export const jaDocsearchLocale: DocSearchLocaleOptions = {
  placeholder: 'ドキュメントを検索',
  translations: {
    button: {
      buttonText: 'ドキュメントを検索',
      buttonAriaLabel: 'ドキュメントを検索',
    },
    modal: {
      searchBox: {
        resetButtonTitle: 'クエリをクリア',
        resetButtonAriaLabel: 'クエリをクリア',
        cancelButtonText: 'キャンセル',
        cancelButtonAriaLabel: 'キャンセル',
      },
      startScreen: {
        recentSearchesTitle: '最近の検索',
        noRecentSearchesText: '最近の検索はありません',
        saveRecentSearchButtonTitle: '最近の検索に保存',
        removeRecentSearchButtonTitle: '最近の検索から削除',
        favoriteSearchesTitle: 'お気に入り',
        removeFavoriteSearchButtonTitle: 'お気に入りから削除',
      },
      errorScreen: {
        titleText: '結果を取得できません',
        helpText: 'ネットワーク接続を確認する必要があるかもしれません',
      },
      footer: {
        selectText: '選択',
        navigateText: '切り替え',
        closeText: '閉じる',
        searchByText: '検索提供者',
      },
      noResultsScreen: {
        noResultsText: '関連する結果が見つかりません',
        suggestedQueryText: 'クエリを試すことができます',
        reportMissingResultsText: 'このクエリに結果があると思いますか？',
        reportMissingResultsLinkText: 'フィードバックを送信',
      },
    },
  },
}

export const jaSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'ドキュメントを検索',
  resetButtonTitle: '検索をリセット',
  backButtonTitle: '閉じる',
  noResultsText: '検索結果がありません：',
  footer: {
    selectText: '選択',
    selectKeyAriaLabel: '入力',
    navigateText: '切り替え',
    navigateUpKeyAriaLabel: '上へ',
    navigateDownKeyAriaLabel: '下へ',
    closeText: '閉じる',
    closeKeyAriaLabel: '終了',
  },
}
