import { execaCommand } from 'execa'
import { kebabCase } from '@pengzhanbo/utils'
import { getDependenciesVersion, readJsonFile, resolve } from './utils/index.js'
import type { File, ResolvedData } from './types.js'
import { Mode } from './constants.js'

export async function createPackageJson(
  mode: Mode,
  pkg: Record<string, any>,
  {
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
    const userInfo = await getUserInfo()
    if (userInfo) {
      pkg.author = userInfo.username + (userInfo.email ? ` <${userInfo.email}>` : '')
    }
    pkg.license = 'MIT'
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
      pkg.scripts['vp-update'] = 'vp-update'
    }
  }

  pkg.devDependencies ??= {}

  const context = (await readJsonFile(resolve('package.json')))!
  const meta = context['theme-plume']
  pkg.devDependencies.vuepress = `${meta.vuepress}`
  pkg.devDependencies['vuepress-theme-plume'] = `${context.version}`
  pkg.devDependencies[`@vuepress/bundler-${bundler}`] = `${meta.vuepress}`
  pkg.devDependencies['http-server'] = '^14.1.1'

  const deps: string[] = []
  if (!pkg.dependencies?.vue && !pkg.devDependencies.vue)
    deps.push('vue')
  if (bundler === 'webpack' && !pkg.dependencies?.['sass-loader'] && !pkg.devDependencies['sass-loader'])
    deps.push('sass-loader')

  const dv = await getDependenciesVersion(deps)

  for (const [d, v] of Object.entries(dv))
    pkg.devDependencies[d] = `^${v}`

  return {
    filepath: 'package.json',
    content: JSON.stringify(pkg, null, 2),
  }
}

async function getUserInfo() {
  try {
    const { stdout: username } = await execaCommand('git config --global user.name')
    const { stdout: email } = await execaCommand('git config --global user.email')
    return { username, email }
  }
  catch {
    return null
  }
}
