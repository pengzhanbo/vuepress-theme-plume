import type { File, ResolvedData } from './types.js'
import { kebabCase } from '@pengzhanbo/utils'
import { execaCommand } from 'execa'
import { Mode } from './constants.js'
import { readJsonFile, resolve } from './utils/index.js'

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
    useTs,
  }: ResolvedData,
): Promise<File> {
  if (mode === Mode.create) {
    pkg.name = kebabCase(siteName)
    pkg.type = 'module'
    pkg.version = '1.0.0'
    pkg.description = siteDescription

    if (packageManager !== 'npm') {
      let version = await getPackageManagerVersion(packageManager)
      if (version) {
        if (packageManager === 'yarn' && version.startsWith('1'))
          version = '4.5.0'
        pkg.packageManager = `${packageManager}@${version}`
      }
    }

    const userInfo = await getUserInfo()
    if (userInfo) {
      pkg.author = userInfo.username + (userInfo.email ? ` <${userInfo.email}>` : '')
    }
    pkg.license = 'MIT'
    pkg.engines = { node: '^18.20.0 || >=20.0.0' }
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

  if (bundler === 'webpack' && !hasDep('sass-loader'))
    deps.push('sass-loader')

  if (!hasDep('sass-embedded'))
    deps.push('sass-embedded')

  if (useTs)
    deps.push('typescript')

  for (const dep of deps)
    pkg.devDependencies[dep] = meta[dep]

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

async function getPackageManagerVersion(pkg: string) {
  try {
    const { stdout } = await execaCommand(`${pkg} -v`)
    return stdout
  }
  catch {
    return null
  }
}
