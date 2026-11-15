import type { ReaderPalette, ReaderPreferencesOptions } from 'vuepress-theme-plume/shared'

/**
 * 护眼背景调色板。
 *
 * 除内置的 `default` / `warm` / `sepia`，文档站再演示 5 组自定义色系。
 * 每个调色板是一组一起生效的 CSS 变量，面板中渲染为纯色块，
 * 色块颜色默认取 `--vp-c-bg`。
 */
const forest: ReaderPalette = {
  name: 'forest',
  label: '护眼绿',
  tokens: {
    'vp-c-bg': '#eef5ec',
    'vp-c-bg-alt': '#e6efe3',
    'vp-c-bg-soft': '#e2ecdf',
    'vp-c-bg-elv': '#f5faf3',
    'vp-c-text-1': '#2b3529',
    'vp-c-text-2': 'rgb(43 53 41 / 0.78)',
    'vp-c-text-3': 'rgb(43 53 41 / 0.6)',
    'vp-c-divider': '#d8e4d3',
    'vp-c-gutter': '#d5e2d0',
    'vp-code-block-bg': '#eaf2e7',
    'vp-code-line-highlight-color': 'rgb(214 230 208 / 0.7)',
  },
}

const mist: ReaderPalette = {
  name: 'mist',
  label: '雾蓝',
  tokens: {
    'vp-c-bg': '#edf1f7',
    'vp-c-bg-alt': '#e5ebf3',
    'vp-c-bg-soft': '#e0e8f1',
    'vp-c-bg-elv': '#f5f8fc',
    'vp-c-text-1': '#2b333f',
    'vp-c-text-2': 'rgb(43 51 63 / 0.78)',
    'vp-c-text-3': 'rgb(43 51 63 / 0.6)',
    'vp-c-divider': '#d5dee9',
    'vp-c-gutter': '#d1dbe7',
    'vp-code-block-bg': '#e8eef6',
    'vp-code-line-highlight-color': 'rgb(212 224 240 / 0.7)',
  },
}

const blush: ReaderPalette = {
  name: 'blush',
  label: '樱粉',
  tokens: {
    'vp-c-bg': '#fbf0f2',
    'vp-c-bg-alt': '#f6e7ea',
    'vp-c-bg-soft': '#f4e2e6',
    'vp-c-bg-elv': '#fdf6f7',
    'vp-c-text-1': '#382b2e',
    'vp-c-text-2': 'rgb(56 43 46 / 0.78)',
    'vp-c-text-3': 'rgb(56 43 46 / 0.6)',
    'vp-c-divider': '#ecd7da',
    'vp-c-gutter': '#e9d2d6',
    'vp-code-block-bg': '#f7ebed',
    'vp-code-line-highlight-color': 'rgb(240 212 217 / 0.7)',
  },
}

const lavender: ReaderPalette = {
  name: 'lavender',
  label: '薰衣草',
  tokens: {
    'vp-c-bg': '#f2effa',
    'vp-c-bg-alt': '#ebe7f5',
    'vp-c-bg-soft': '#e6e1f2',
    'vp-c-bg-elv': '#f8f6fd',
    'vp-c-text-1': '#2f2a3c',
    'vp-c-text-2': 'rgb(47 42 60 / 0.78)',
    'vp-c-text-3': 'rgb(47 42 60 / 0.6)',
    'vp-c-divider': '#ddd6ec',
    'vp-c-gutter': '#d9d1e9',
    'vp-code-block-bg': '#eeeaf8',
    'vp-code-line-highlight-color': 'rgb(223 215 240 / 0.7)',
  },
}

const teal: ReaderPalette = {
  name: 'teal',
  label: '青碧',
  tokens: {
    'vp-c-bg': '#eaf4f3',
    'vp-c-bg-alt': '#e2eeee',
    'vp-c-bg-soft': '#dcebea',
    'vp-c-bg-elv': '#f3faf9',
    'vp-c-text-1': '#253432',
    'vp-c-text-2': 'rgb(37 52 50 / 0.78)',
    'vp-c-text-3': 'rgb(37 52 50 / 0.6)',
    'vp-c-divider': '#d2e3e1',
    'vp-c-gutter': '#cee0dd',
    'vp-code-block-bg': '#e6f1f0',
    'vp-code-line-highlight-color': 'rgb(205 226 222 / 0.7)',
  },
}

/**
 * 品牌色调色板。
 *
 * 只覆盖 `--vp-c-brand-*`，深浅色模式下都可用，色块颜色默认取 `--vp-c-brand-1`。
 */
const ocean: ReaderPalette = {
  name: 'ocean',
  label: '海蓝',
  tokens: {
    'vp-c-brand-1': '#0e7490',
    'vp-c-brand-2': '#0891b2',
    'vp-c-brand-3': '#06b6d4',
    'vp-c-brand-soft': 'rgb(6 182 212 / 0.14)',
  },
}

const violet: ReaderPalette = {
  name: 'violet',
  label: '紫罗兰',
  tokens: {
    'vp-c-brand-1': '#7c3aed',
    'vp-c-brand-2': '#8b5cf6',
    'vp-c-brand-3': '#a78bfa',
    'vp-c-brand-soft': 'rgb(139 92 246 / 0.14)',
  },
}

const emerald: ReaderPalette = {
  name: 'emerald',
  label: '翡翠绿',
  tokens: {
    'vp-c-brand-1': '#047857',
    'vp-c-brand-2': '#059669',
    'vp-c-brand-3': '#10b981',
    'vp-c-brand-soft': 'rgb(16 185 129 / 0.14)',
  },
}

const amber: ReaderPalette = {
  name: 'amber',
  label: '琥珀',
  tokens: {
    'vp-c-brand-1': '#b45309',
    'vp-c-brand-2': '#d97706',
    'vp-c-brand-3': '#f59e0b',
    'vp-c-brand-soft': 'rgb(245 158 11 / 0.16)',
  },
}

const rose: ReaderPalette = {
  name: 'rose',
  label: '玫红',
  tokens: {
    'vp-c-brand-1': '#be123c',
    'vp-c-brand-2': '#e11d48',
    'vp-c-brand-3': '#f43f5e',
    'vp-c-brand-soft': 'rgb(244 63 94 / 0.14)',
  },
}

const indigo: ReaderPalette = {
  name: 'indigo',
  label: '靛蓝',
  tokens: {
    'vp-c-brand-1': '#4338ca',
    'vp-c-brand-2': '#4f46e5',
    'vp-c-brand-3': '#6366f1',
    'vp-c-brand-soft': 'rgb(99 102 241 / 0.16)',
  },
}

const lime: ReaderPalette = {
  name: 'lime',
  label: '青柠',
  tokens: {
    'vp-c-brand-1': '#4d7c0f',
    'vp-c-brand-2': '#65a30d',
    'vp-c-brand-3': '#84cc16',
    'vp-c-brand-soft': 'rgb(132 204 22 / 0.16)',
  },
}

/**
 * 阅读偏好（主题级配置）。
 *
 * 中文标签直接写在调色板的 `label` 上，其它语言在 `locales` 中补充文案即可。
 */
export const readerPreferences: ReaderPreferencesOptions = {
  readAid: 'left',
  resume: true,
  focusMode: true,
  theme: {
    presets: ['default', 'warm', 'sepia', forest, mist, blush, lavender, teal],
  },
  brand: {
    presets: [ocean, violet, emerald, amber, rose, indigo, lime],
  },
}

/**
 * 阅读偏好（英文站）。
 *
 * 只覆盖调色板文案，颜色与主题级定义共用。
 */
export const enReaderPreferences: ReaderPreferencesOptions = {
  theme: {
    presets: [
      { name: 'forest', label: 'Forest' },
      { name: 'mist', label: 'Mist' },
      { name: 'blush', label: 'Blush' },
      { name: 'lavender', label: 'Lavender' },
      { name: 'teal', label: 'Teal' },
    ],
  },
  brand: {
    presets: [
      { name: 'ocean', label: 'Ocean' },
      { name: 'violet', label: 'Violet' },
      { name: 'emerald', label: 'Emerald' },
      { name: 'amber', label: 'Amber' },
      { name: 'rose', label: 'Rose' },
      { name: 'indigo', label: 'Indigo' },
      { name: 'lime', label: 'Lime' },
    ],
  },
}
