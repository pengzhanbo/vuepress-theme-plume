import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const zhLocale: ThemeLocaleText = {
  selectLanguageName: '简体中文',
  selectLanguageText: '选择语言',

  appearanceText: '外观',
  lightModeSwitchTitle: '切换为浅色主题',
  darkModeSwitchTitle: '切换为深色主题',

  outlineLabel: '此页内容',
  returnToTopLabel: '返回顶部',
  editLinkText: '编辑此页',
  contributorsText: '贡献者',
  prevPageLabel: '上一页',
  nextPageLabel: '下一页',
  lastUpdatedText: '最后更新于',

  changelogText: '变更历史',
  changelogOnText: '于',
  changelogButtonText: '查看全部变更历史',

  copyrightText: '版权所有',
  copyrightAuthorText: '版权归属：',
  copyrightCreationOriginalText: '本文链接：',
  copyrightCreationTranslateText: '本文翻译自：',
  copyrightCreationReprintText: '本文转载自：',
  copyrightLicenseText: '许可证：',

  notFound: {
    code: '404',
    title: '页面未找到',
    quote: '但是，如果你不改变方向，并且一直寻找，最终可能会到达你要去的地方。',
    linkText: '返回首页',
  },

  homeText: '首页',
  blogText: '博客',
  tagText: '标签',
  archiveText: '归档',
  categoryText: '分类',
  archiveTotalText: '{count} 篇',

  encryptButtonText: '确认',
  encryptPlaceholder: '请输入密码',
  encryptGlobalText: '本站只允许密码访问',
  encryptPageText: '本页面只允许密码访问',

  footer: {
    message:
      'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const zhPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 通用',
  'CC-BY-4.0': '署名 4.0 国际',
  'CC-BY-NC-4.0': '署名-非商业性 4.0 国际',
  'CC-BY-NC-SA-4.0': '署名-非商业性-相同方式共享 4.0 国际',
  'CC-BY-NC-ND-4.0': '署名-非商业性-禁止演绎 4.0 国际',
  'CC-BY-ND-4.0': '署名-禁止演绎 4.0 国际',
  'CC-BY-SA-4.0': '署名-相同方式共享 4.0 国际',
}
