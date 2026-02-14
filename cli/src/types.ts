import type { DeployType } from './constants.js'

/**
 * Supported language codes for VuePress site
 *
 * VuePress 站点支持的语言代码
 */
export type Langs = 'zh-CN' | 'en-US'

/**
 * Locale configuration for CLI prompts and messages
 *
 * CLI 提示和消息的国际化配置
 */
export interface Locale {
  /**
   * Question: Project root directory name
   *
   * 问题：项目根目录名称
   */
  'question.root': string
  /**
   * Question: Site name
   *
   * 问题：站点名称
   */
  'question.site.name': string
  /**
   * Question: Site description
   *
   * 问题：站点描述
   */
  'question.site.description': string
  /**
   * Question: Enable multi-language support
   *
   * 问题：启用多语言支持
   */
  'question.multiLanguage': string
  /**
   * Question: Default language
   *
   * 问题：默认语言
   */
  'question.defaultLanguage': string
  /**
   * Question: Build tool bundler
   *
   * 问题：构建工具
   */
  'question.bundler': string
  /**
   * Question: Use TypeScript
   *
   * 问题：使用 TypeScript
   */
  'question.useTs': string
  /**
   * Question: Inject npm scripts
   *
   * 问题：注入 npm 脚本
   */
  'question.injectNpmScripts': string
  /**
   * Question: Initialize git repository
   *
   * 问题：初始化 git 仓库
   */
  'question.git': string
  /**
   * Question: Deployment type
   *
   * 问题：部署类型
   */
  'question.deploy': string
  /**
   * Question: Install dependencies
   *
   * 问题：安装依赖
   */
  'question.installDeps': string

  /**
   * Spinner: Start message
   *
   * 加载动画：开始消息
   */
  'spinner.start': string
  /**
   * Spinner: Stop message
   *
   * 加载动画：停止消息
   */
  'spinner.stop': string
  /**
   * Spinner: Git init message
   *
   * 加载动画：Git 初始化消息
   */
  'spinner.git': string
  /**
   * Spinner: Install message
   *
   * 加载动画：安装消息
   */
  'spinner.install': string
  /**
   * Spinner: Command hint message
   *
   * 加载动画：命令提示消息
   */
  'spinner.command': string

  /**
   * Hint: Cancel operation
   *
   * 提示：取消操作
   */
  'hint.cancel': string
  /**
   * Hint: Root directory
   *
   * 提示：根目录
   */
  'hint.root': string
  /**
   * Hint: Illegal root directory name
   *
   * 提示：非法的根目录名称
   */
  'hint.root.illegal': string
}

/**
 * Package manager types
 *
 * 包管理器类型
 */
export type PackageManager = 'npm' | 'yarn' | 'pnpm'

/**
 * Build tool bundler types
 *
 * 构建工具类型
 */
export type Bundler = 'vite' | 'webpack'

/**
 * Generic options type for CLI prompts
 *
 * CLI 提示的通用选项类型
 *
 * @template Value - The value type for options
 * @template Label - The label type for options
 */
export type Options<Value = string, Label = string> = { label: Label, value: Value }[]

/**
 * File structure for generated project
 *
 * 生成项目的文件结构
 */
export interface File {
  /**
   * File path relative to project root
   *
   * 相对于项目根目录的文件路径
   */
  filepath: string
  /**
   * File content
   *
   * 文件内容
   */
  content: string
}

/**
 * Result from CLI prompts
 *
 * CLI 提示结果
 */
export interface PromptResult {
  /**
   * CLI display language
   *
   * CLI 显示语言
   */
  displayLang: string
  /**
   * Project root directory name
   *
   * 项目根目录名称
   */
  root: string
  /**
   * Site name
   *
   * 站点名称
   */
  siteName: string
  /**
   * Site description
   *
   * 站点描述
   */
  siteDescription: string
  /**
   * Build tool bundler
   *
   * 构建工具
   */
  bundler: Bundler
  /**
   * Enable multi-language support
   *
   * 启用多语言支持
   */
  multiLanguage: boolean
  /**
   * Default language
   *
   * 默认语言
   */
  defaultLanguage: Langs
  /**
   * Use TypeScript
   *
   * 使用 TypeScript
   */
  useTs: boolean
  /**
   * Inject npm scripts
   *
   * 注入 npm 脚本
   */
  injectNpmScripts: boolean
  /**
   * Deployment type
   *
   * 部署类型
   */
  deploy: DeployType
  /**
   * Initialize git repository
   *
   * 初始化 git 仓库
   */
  git: boolean
  /**
   * Install dependencies
   *
   * 安装依赖
   */
  install: boolean
}

/**
 * Resolved data after processing prompts
 *
 * 处理提示后的解析数据
 */
export interface ResolvedData extends PromptResult {
  /**
   * Selected package manager
   *
   * 选择的包管理器
   */
  packageManager: PackageManager
  /**
   * Documentation directory name
   *
   * 文档目录名称
   */
  docsDir: string
}
