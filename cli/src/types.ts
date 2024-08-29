import type { DeployType } from './constants.js'

export type Langs = 'zh-CN' | 'en-US'

export interface Locale {
  'question.root': string
  'question.site.name': string
  'question.site.description': string
  'question.multiLanguage': string
  'question.defaultLanguage': string
  'question.bundler': string
  'question.useTs': string
  'question.injectNpmScripts': string
  'question.git': string
  'question.deploy': string
  'question.installDeps': string

  'spinner.start': string
  'spinner.stop': string
  'spinner.git': string
  'spinner.install': string
  'spinner.command': string

  'hint.cancel': string
  'hint.root': string
  'hint.root.illegal': string
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm'
export type Bundler = 'vite' | 'webpack'

export type Options<Value = string, Label = string> = { label: Label, value: Value }[]

export interface File {
  filepath: string
  content: string
}

export interface PromptResult {
  displayLang: string // cli display language
  root: string
  siteName: string
  siteDescription: string
  bundler: Bundler
  multiLanguage: boolean
  defaultLanguage: Langs
  useTs: boolean
  injectNpmScripts: boolean
  deploy: DeployType
  git: boolean
  install: boolean
}

export interface ResolvedData extends PromptResult {
  packageManager: PackageManager
  docsDir: string
}
