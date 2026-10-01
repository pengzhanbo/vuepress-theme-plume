import type { File, ResolvedData } from './types.js'
import { attemptAsync, kebabCase } from '@pengzhanbo/utils'
import spawn from 'nano-spawn'
import _sortPackageJson from 'sort-package-json'
import { BUILD_SCRIPT_PACKAGES, Mode } from './constants.js'
import { getPackageManagerVersion, readJsonFile, resolve } from './utils/index.js'

/**
 * Sort package.json fields in a consistent order.
 *
 * 按一致顺序排序 package.json 字段。
 *
 * @param json - Package.json object to sort / 要排序的 package.json 对象
 * @returns Sorted package.json object / 排序后的 package.json 对象
 */
function sortPackageJson(json: Record<any, any>) {
  return _sortPackageJson(json, {
    sortOrder: ['name', 'type', 'version', 'private', 'description', 'packageManager', 'author', 'license', 'scripts', 'devDependencies', 'dependencies', 'pnpm'],
  })
}

/**
 * Create package.json file for VuePress project
 *
 * 为 VuePress 项目创建 package.json 文件
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param pkg - Existing package.json data / 现有的 package.json 数据
 * @param data - Resolved configuration data / 解析后的配置数据
 * @param data.packageManager - Package manager to use / 要使用的包管理器
 * @param data.siteName - Site name / 站点名称
 * @param data.siteDescription - Site description / 站点描述
 * @param data.docsDir - Documentation directory path / 文档目录路径
 * @param data.bundler - Bundler to use / 要使用的打包器
 * @param data.injectNpmScripts - Whether to inject npm scripts / 是否注入 npm 脚本
 *
 * @returns File object with package.json content / 包含 package.json 内容的文件对象
 */
export async function createPackageJson(
  mode: Mode,
  pkg: Record<string, any>,
  {
    packageManager,
    docsDir,
    siteName,
    siteDescription,
    bundler,
    injectNpmScripts,
  }: ResolvedData,
): Promise<File> {
  // CLI 自身的 package.json：`plume-deps` 提供生成工程的依赖版本，
  // `engines.node` 提供生成工程的 Node 版本要求，避免多处硬编码不一致。
  // The CLI's own package.json: `plume-deps` provides dependency versions for
  // the generated project, and `engines.node` its Node requirement, so the
  // version ranges have a single source of truth.
  const context = (await readJsonFile(resolve('package.json')))!
  const meta = context['plume-deps']
  const nodeEngines: string | undefined = context.engines?.node

  if (mode === Mode.create) {
    pkg.name = kebabCase(siteName)
    pkg.type = 'module'
    pkg.version = '1.0.0'
    pkg.description = siteDescription

    if (packageManager !== 'npm') {
      let [, version] = await attemptAsync(getPackageManagerVersion, packageManager)
      if (version) {
        if (packageManager === 'yarn' && version.startsWith('1')) {
          version = '4.10.3'
        }
        pkg.packageManager = `${packageManager}@${version}`

        // pnpm 10 从 `package.json#pnpm` 读取构建脚本白名单；
        // pnpm 11+ 改为只从 `pnpm-workspace.yaml` 的 `allowBuilds` 读取。
        // pnpm 10 reads the build script allowlist from `package.json#pnpm`;
        // pnpm 11+ only reads `allowBuilds` from `pnpm-workspace.yaml`.
        if (packageManager === 'pnpm' && version.startsWith('10')) {
          pkg.pnpm = {
            onlyBuiltDependencies: [...BUILD_SCRIPT_PACKAGES],
          }
        }
      }
    }

    const [, userInfo] = await attemptAsync(getUserInfo)
    if (userInfo) {
      pkg.author = userInfo.username + (userInfo.email ? ` <${userInfo.email}>` : '')
    }
    pkg.license = 'MIT'
    if (nodeEngines)
      pkg.engines = { node: nodeEngines }
  }

  if (injectNpmScripts) {
    pkg.scripts ??= {}
    pkg.scripts = {
      ...pkg.scripts,
      'docs:dev': `vuepress dev ${docsDir}`,
      'docs:dev-clean': `vuepress dev ${docsDir} --clean-cache --clean-temp`,
      'docs:build': `vuepress build ${docsDir} --clean-cache --clean-temp`,
      'docs:preview': `http-server ${docsDir}/.vuepress/dist`,
    }
    if (mode === Mode.create) {
      pkg.scripts['vp-update'] = `${packageManager === 'npm' ? 'npx' : `${packageManager} dlx`} vp-update`
    }
  }

  pkg.devDependencies ??= {}

  const hasDep = (dep: string) => pkg.devDependencies?.[dep] || pkg.dependencies?.[dep]

  pkg.devDependencies[`@vuepress/bundler-${bundler}`] = `${meta.vuepress}`
  pkg.devDependencies.vuepress = `${meta.vuepress}`
  pkg.devDependencies['vuepress-theme-plume'] = `${context.version}`

  const deps: string[] = ['http-server']
  if (!hasDep('vue'))
    deps.push('vue')

  deps.push('typescript')

  for (const dep of deps)
    pkg.devDependencies[dep] = meta[dep]

  return {
    filepath: 'package.json',
    // init 模式下与用户既有的 package.json 合并写入，而非替换。
    // In init mode, merge into the user's existing package.json instead of replacing it.
    overwrite: mode === Mode.init,
    content: JSON.stringify(sortPackageJson(pkg), null, 2),
  }
}

/**
 * Get user information from git global configuration.
 *
 * 从 git 全局配置获取用户信息。
 *
 * @returns User information object with username and email / 包含用户名和邮箱的用户信息对象
 * @throws Error if git command fails / 如果 git 命令失败则抛出错误
 */
async function getUserInfo() {
  const { output: username } = await spawn('git', ['config', '--global', 'user.name'])
  const { output: email } = await spawn('git', ['config', '--global', 'user.email'])
  return { username, email }
}
