import type { Page } from 'vuepress'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'

export function resolvePageHead(page: Page, localeOptions: PlumeThemeLocaleOptions) {
  page.frontmatter.head ??= []
  if (localeOptions.appearance ?? true) {
    const appearance = typeof localeOptions.appearance === 'string'
      ? localeOptions.appearance
      : 'auto'

    page.frontmatter.head.push([
      'script',
      { id: 'check-dark-mode' },
      appearance === 'force-dark'
        ? `document.documentElement.dataset.theme = 'dark'`
        : `;(function () {
        const um= localStorage.getItem('vuepress-theme-appearance') || '${appearance}';
        const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = um === 'dark' || (um !== 'light' && sm);
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
      })();`.replace(/^\s+|\s+$/gm, '').replace(/\n/g, ''),
    ])
  }

  page.frontmatter.head?.push([
    'script',
    { id: 'check-mac-os' },
    `document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))`,
  ])
}
