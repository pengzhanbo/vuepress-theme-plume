import type { SeriesOptions } from 'vuepress-theme-plume/shared'

export const zhSeries: SeriesOptions = {
  page: true,
  autoCreate: true,
  index: true,
  items: {
    'features': {
      title: '主题功能',
      description: '主题功能列表，详细介绍主题提供的各类功能，以及如何在配置中开启和配置它们。',
    },
    'version-update': {
      title: '版本更新',
      description: '主题的版本更新记录，包括新特性、Bug 修复和改动等。',
    },
  },
}

export const enSeries: SeriesOptions = {
  page: true,
  autoCreate: true,
  index: true,
  items: {
    'features': {
      title: 'Theme Features',
      description: 'List of theme features, with detailed explanations of how to enable and configure them.',
    },
    'version-update': {
      title: 'Version Update',
      description: 'Version update log, including new features, bug fixes, and changes.',
    },
  },
}
