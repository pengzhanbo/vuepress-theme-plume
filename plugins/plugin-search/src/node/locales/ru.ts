/**
 * Russian locale configuration for search plugin.
 *
 * 搜索插件的俄语本地化配置。
 *
 * @module plugin-search/node/locales/ru
 */
import type { SearchLocaleOptions } from '../../shared/index.js'

/**
 * Russian search locale strings.
 *
 * 俄语搜索本地化字符串。
 */
export const ruSearchLocale: Partial<SearchLocaleOptions> = {
  placeholder: 'Поиск по документации',
  resetButtonTitle: 'Сбросить поиск',
  backButtonTitle: 'Закрыть',
  noResultsText: 'Нет результатов поиска:',
  searchIndexErrorText: 'Не удалось загрузить поисковый индекс.',
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
