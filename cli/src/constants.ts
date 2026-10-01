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

/**
 * Packages allowed to run their lifecycle scripts in the generated project.
 *
 * pnpm blocks dependency `postinstall` scripts by default since v10. The
 * whitelist is written to `package.json#pnpm.onlyBuiltDependencies` for
 * pnpm 10, and to the `allowBuilds` field of `pnpm-workspace.yaml` for pnpm 11+.
 *
 * 生成工程中允许运行生命周期脚本的依赖包。
 *
 * pnpm 自 v10 起默认禁止依赖的 `postinstall` 脚本。该白名单在 pnpm 10 下写入
 * `package.json#pnpm.onlyBuiltDependencies`，在 pnpm 11+ 下写入
 * `pnpm-workspace.yaml` 的 `allowBuilds` 字段。
 */
export const BUILD_SCRIPT_PACKAGES = ['@parcel/watcher']

/**
 * Default answers used by the non-interactive mode.
 *
 * The values must stay in sync with the defaults of the interactive prompts.
 *
 * 非交互模式下使用的默认答案。
 *
 * 这些取值需与交互式提示的默认值保持一致。
 */
export const defaultAnswers = {
  siteName: 'My Vuepress Site',
  siteDescription: '',
  multiLanguage: false,
  defaultLanguage: 'en-US',
  injectNpmScripts: true,
  bundler: 'vite',
  deploy: DeployType.custom,
  git: true,
  install: true,
} as const
