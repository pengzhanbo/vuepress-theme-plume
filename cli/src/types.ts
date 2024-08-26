export type Langs = 'zh-CN' | 'en-US'

export interface Locale {
  'question.projectName': string
  'question.packageManager': string
  'question.bundler': string
  'question.multiLanguage': string
  'question.defaultLanguage': string
  'question.git': string
  'question.deploy': string
  'question.installDeps': string

  'spinner.start': string
  'spinner.stop': string
  'spinner.git': string
  'spinner.install': string
  'spinner.command': string

  'hint.cancel': string
  'hint.targetDir': string
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm'
export type Bundler = 'vite' | 'webpack'

export type Options<Value = string, Label = string> = { label: Label, value: Value }[]

export interface File {
  filepath: string
  content: string
}
