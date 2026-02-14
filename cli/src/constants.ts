import type { Bundler, Langs, Options } from './types.js'

/**
 * Language options for VuePress configuration
 *
 * 语言选项，用于 VuePress 配置
 */
export const languageOptions: Options<Langs> = [
  { label: 'English', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' },
]

/**
 * Bundler options for VuePress build tool
 *
 * 构建器选项，用于 VuePress 构建工具
 */
export const bundlerOptions: Options<Bundler> = [
  { label: 'Vite', value: 'vite' },
  { label: 'Webpack', value: 'webpack' },
]

/**
 * Operation mode for VuePress CLI
 *
 * VuePress CLI 操作模式
 * @readonly
 * @enum {number}
 */
export enum Mode {
  /**
   * Initialize existing directory
   *
   * 初始化现有目录
   */
  init,
  /**
   * Create new project
   *
   * 创建新项目
   */
  create,
}

/**
 * Deployment type for VuePress site
 *
 * VuePress 站点部署类型
 * @readonly
 * @enum {string}
 */
export enum DeployType {
  /**
   * GitHub Pages deployment
   *
   * GitHub Pages 部署
   */
  github = 'github',
  /**
   * Vercel deployment
   *
   * Vercel 部署
   */
  vercel = 'vercel',
  /**
   * Netlify deployment
   *
   * Netlify 部署
   */
  netlify = 'netlify',
  /**
   * Custom deployment
   *
   * 自定义部署
   */
  custom = 'custom',
}

/**
 * Deployment options for hosting platforms
 *
 * 部署选项，用于托管平台
 */
export const deployOptions: Options<DeployType> = [
  { label: 'Custom', value: DeployType.custom },
  { label: 'GitHub Pages', value: DeployType.github },
  { label: 'Vercel', value: DeployType.vercel },
  { label: 'Netlify', value: DeployType.netlify },
]
