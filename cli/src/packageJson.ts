import sortPackage from 'sort-package-json'
import { execaCommand } from 'execa'
import type { PromptResult } from './prompt.js'
import { getDependenciesVersion, normalizeName, readJsonFile, resolve } from './utils/index.js'
import type { File } from './types.js'

export async function createPackageJson({
  targetDir,
  bundler,
}: PromptResult): Promise<File> {
  const pkg: Record<string, any> = {}

  pkg.name = normalizeName(targetDir)
  pkg.version = '1.0.0'
  pkg.type = 'module'
  pkg.description = 'The site generate by vuepress and vuepress-theme-plume'
  pkg.license = 'MIT'

  const userInfo = await getUserInfo()
  if (userInfo) {
    pkg.author = userInfo.username + (userInfo.email ? ` <${userInfo.email}>` : '')
  }

  const context = (await readJsonFile(resolve('package.json')))!
  const meta = context['theme-plume']
  pkg.devDependencies = {
    'vuepress': `${meta.vuepress}`,
    'vuepress-theme-plume': `${context.version}`,
    [`@vuepress/bundler-${bundler}`]: `${meta.vuepress}`,
    'http-server': '^14.1.1',
  }
  const deps: string[] = ['vue']
  if (bundler === 'webpack')
    deps.push('sass-loader')

  const dv = await getDependenciesVersion(deps)

  for (const [d, v] of Object.entries(dv))
    pkg.devDependencies[d] = `^${v}`

  pkg.scripts = {
    'dev': 'vuepress dev docs',
    'dev:clean': 'vuepress dev docs --clean-cache --clean-temp',
    'build': 'vuepress build docs --clean-cache --clean-temp',
    'preview': 'http-server docs/.vuepress/dist',
    'vp-update': 'vp-update',
  }

  return {
    filepath: 'package.json',
    content: JSON.stringify(sortPackage(pkg, {
      sortOrder: ['name', 'type', 'version', 'packageManager', 'description', 'author', 'license'],
    }), null, 2),
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
