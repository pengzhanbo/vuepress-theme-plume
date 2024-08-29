import type { Locale } from '../types.js'

export const zh: Locale = {
  'question.root': '您想在哪里初始化 VuePress？',
  'question.site.name': '站点名称：',
  'question.site.description': '站点描述信息：',
  'question.bundler': '请选择打包工具',
  'question.multiLanguage': '是否使用多语言？',
  'question.defaultLanguage': '请选择站点默认语言',
  'question.useTs': '是否使用 TypeScript？',
  'question.injectNpmScripts': '是否注入 npm 脚本？',
  'question.deploy': '部署方式：',
  'question.git': '是否初始化 git 仓库？',
  'question.installDeps': '是否安装依赖？',

  'spinner.start': '🚀 正在创建...',
  'spinner.stop': '🎉 创建成功!',
  'spinner.git': '📄 初始化 git 仓库...',
  'spinner.install': '📦 安装依赖...',
  'spinner.command': '🔨 执行以下命令即可启动：',

  'hint.cancel': '操作已取消。',
  'hint.root': '文件路径不能是绝对路径，不能包含父路径。',
  'hint.root.illegal': '文件夹不能包含特殊字符。',
}
