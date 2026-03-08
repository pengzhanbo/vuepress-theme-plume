import type { File, ResolvedData } from './types.js'
import { attemptAsync, kebabCase } from '@pengzhanbo/utils'
import spawn from 'nano-spawn'
import _sortPackageJson from 'sort-package-json'
import { Mode } from './constants.js'
import { readJsonFile, resolve } from './utils/index.js'

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

        // pnpm@10 should add `onlyBuiltDependencies`
        if (packageManager === 'pnpm' && version.startsWith('10')) {
          pkg.pnpm = {
            onlyBuiltDependencies: ['@parcel/watcher', 'esbuild'],
          }
        }
      }
    }

    const [, userInfo] = await attemptAsync(getUserInfo)
    if (userInfo) {
      pkg.author = userInfo.username + (userInfo.email ? ` <${userInfo.email}>` : '')
    }
    pkg.license = 'MIT'
    pkg.engines = { node: '^20.19.0 || >=22.0.0' }
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

  const context = (await readJsonFile(resolve('package.json')))!
  const meta = context['plume-deps']

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

/**
 * Get the version of a package manager.
 *
 * 获取包管理器的版本。
 *
 * @param pkg - Package manager name (npm, yarn, pnpm) / 包管理器名称
 * @returns Version string of the package manager / 包管理器的版本字符串
 * @throws Error if package manager command fails / 如果包管理器命令失败则抛出错误
 */
async function getPackageManagerVersion(pkg: string) {
  const { output } = await spawn(pkg, ['--version'])
  return output
}
