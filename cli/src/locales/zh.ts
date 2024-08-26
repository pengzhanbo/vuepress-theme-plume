import type { Locale } from '../types.js'

export const zh: Locale = {
  'question.projectName': '请输入您的项目名',
  'question.packageManager': '请选择包管理器',
  'question.bundler': '请选择打包工具',
  'question.multiLanguage': '是否使用多语言？',
  'question.defaultLanguage': '请选择站点默认语言',
  'question.deploy': '您想使用哪种部署方式？',
  'question.git': '是否初始化 git 仓库？',
  'question.installDeps': '是否安装依赖？',

  'spinner.start': '🚀 正在创建...',
  'spinner.stop': '🎉 创建成功!',
  'spinner.git': '📄 初始化 git 仓库...',
  'spinner.install': '📦 安装依赖...',
  'spinner.command': '🔨 执行以下命令即可启动：',

  'hint.cancel': '操作已取消。',
  'hint.targetDir': '项目名称不能包含特殊字符。',
}
