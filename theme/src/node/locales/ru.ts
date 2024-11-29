/** 俄语 */
import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchLocaleOptions } from '@vuepress/plugin-docsearch'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'

export const ruLocale: PlumeThemeLocaleData = {
  selectLanguageName: 'Русский',
  selectLanguageText: 'Выберите язык',

  appearanceText: 'Внешний вид',
  lightModeSwitchTitle: 'Переключить на светлую тему',
  darkModeSwitchTitle: 'Переключить на темную тему',

  outlineLabel: 'Содержание страницы',
  returnToTopLabel: 'Вернуться наверх',
  editLinkText: 'Редактировать страницу',
  contributorsText: 'Авторы',
  prevPageLabel: 'Предыдущая страница',
  nextPageLabel: 'Следующая страница',
  lastUpdatedText: 'Последнее обновление',

  changelogText: 'История изменений',
  changelogOnText: 'от',
  changelogButtonText: 'Посмотреть все изменения',

  copyrightText: 'Все права защищены',
  copyrightAuthorText: 'Авторские права принадлежат:',
  copyrightCreationOriginalText: 'Ссылка на статью:',
  copyrightCreationTranslateText: 'Перевод статьи:',
  copyrightCreationReprintText: 'Перепечатано из:',
  copyrightLicenseText: 'Лицензия:',

  notFound: {
    code: '404',
    title: 'Страница не найдена',
    quote: 'Но если вы не меняете курс и продолжаете искать, в конечном итоге вы можете добраться до места назначения.',
    linkText: 'Вернуться на главную',
  },

  homeText: 'Главная',
  blogText: 'Блог',
  tagText: 'Теги',
  archiveText: 'Архив',
  categoryText: 'Категории',
  archiveTotalText: '{count} статей',

  encryptButtonText: 'Подтвердить',
  encryptPlaceholder: 'Введите пароль',
  encryptGlobalText: 'Доступ к сайту только по паролю',
  encryptPageText: 'Доступ к странице только по паролю',

  footer: {
    message:
      'Работает на <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const ruPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 Универсальная',
  'CC-BY-4.0': 'Атрибуция 4.0 Международный',
  'CC-BY-NC-4.0': 'Атрибуция-Некоммерческое 4.0 Международный',
  'CC-BY-NC-SA-4.0': 'Атрибуция-Некоммерческое-С сохранением условий 4.0 Международный',
  'CC-BY-NC-ND-4.0': 'Атрибуция-Некоммерческое-Без производных 4.0 Международный',
  'CC-BY-ND-4.0': 'Атрибуция-Без производных 4.0 Международный',
  'CC-BY-SA-4.0': 'Атрибуция-С сохранением условий 4.0 Международный',
}

export const ruDocsearchLocale: DocSearchLocaleOptions = {
  placeholder: 'Поиск по документации',
  translations: {
    button: {
      buttonText: 'Поиск по документации',
      buttonAriaLabel: 'Поиск по документации',
    },
    modal: {
      searchBox: {
        resetButtonTitle: 'Очистить условия поиска',
        resetButtonAriaLabel: 'Очистить условия поиска',
        cancelButtonText: 'Отмена',
        cancelButtonAriaLabel: 'Отмена',
      },
      startScreen: {
        recentSearchesTitle: 'История поиска',
        noRecentSearchesText: 'Нет истории поиска',
        saveRecentSearchButtonTitle: 'Сохранить в историю поиска',
        removeRecentSearchButtonTitle: 'Удалить из истории поиска',
        favoriteSearchesTitle: 'Избранное',
        removeFavoriteSearchButtonTitle: 'Удалить из избранного',
      },
      errorScreen: {
        titleText: 'Не удалось получить результаты',
        helpText: 'Возможно, вам нужно проверить подключение к интернету',
      },
      footer: {
        selectText: 'Выбрать',
        navigateText: 'Переключить',
        closeText: 'Закрыть',
        searchByText: 'Поиск предоставлен',
      },
      noResultsScreen: {
        noResultsText: 'Не найдено соответствующих результатов',
        suggestedQueryText: 'Вы можете попробовать запрос',
        reportMissingResultsText: 'Считаете, что этот запрос должен вернуть результаты?',
        reportMissingResultsLinkText: 'Нажмите, чтобы сообщить',
      },
    },
  },
}

export const ruSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Поиск по документации',
  resetButtonTitle: 'Сбросить поиск',
  backButtonTitle: 'Закрыть',
  noResultsText: 'Нет результатов поиска:',
  footer: {
    selectText: 'Выбрать',
    selectKeyAriaLabel: 'Ввод',
    navigateText: 'Переключить',
    navigateUpKeyAriaLabel: 'Вверх',
    navigateDownKeyAriaLabel: 'Вниз',
    closeText: 'Закрыть',
    closeKeyAriaLabel: 'Выход',
  },
}
