import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { isEmptyObject } from '@pengzhanbo/utils'
import { colors } from 'vuepress/utils'
import { createTranslate, getPackage, getThemePackage, logger } from '../utils/index.js'

const t = createTranslate({
  en: {
    title: 'The following dependencies have version mismatches:',
    footer: 'Please update the dependencies to the correct versions.',
  },
  zh: {
    title: '以下依赖版本不匹配：',
    footer: '请更新依赖至正确的版本。',
  },
})

export function detectVersions(app: App): void {
  detectVuepressVersion()
  detectThemeVersion(app)
}

interface DepVersion {
  name: string
  expected: string
  current: string
}

/**
 * 检查 vuepress 相关依赖，
 * 当依赖不匹配时，可能会导致 vuepress 无法正常运行
 * 比如 某些插件依赖了不同版本的 `@vuepress/helper` ，会导致在浏览器中无法正常运行
 */
function detectVuepressVersion() {
  const themePackage = getThemePackage()
  const userPackage = getPackage()

  const vuepressDeps = Object.entries({
    'vuepress-theme-plume': themePackage.version,
    '@vuepress/bundler-vite': themePackage.peerDependencies?.vuepress,
    '@vuepress/bundler-webpack': themePackage.peerDependencies?.vuepress,
    ...themePackage.dependencies,
    ...themePackage.peerDependencies,
  }).reduce((deps, [name, version]) => {
    if (name.includes('vuepress') && version && version !== 'workspace:*')
      deps[name] = version as string
    return deps
  }, {} as Record<string, string>)

  /**
   * 检查依赖是否匹配
   * TODO: 检查 pnpm catalog
   */
  const detect = (deps?: Record<string, string>) => {
    const results: DepVersion[] = []
    if (!deps || isEmptyObject(deps))
      return results

    for (const [name, version] of Object.entries(deps)) {
      const resolved = resolveVersion(version)
      if (resolved && vuepressDeps[name] && vuepressDeps[name] !== resolved)
        results.push({ name, expected: vuepressDeps[name], current: version as string })
    }
    return results
  }

  const devResults = detect(userPackage.devDependencies)
  const prodResults = detect(userPackage.dependencies)

  if (devResults.length || prodResults.length) {
    const output = (deps: DepVersion[]) => deps
      .map(dep =>
        `  ${colors.green(dep.name)}: ${colors.gray(dep.current)} -> ${colors.cyan(dep.expected)}`)
      .join('  \n')

    logger.warn(`${t('title')}
${
  devResults.length ? `\ndevDependencies:\n${output(devResults)}\n` : ''
}${
  prodResults.length ? `\ndependencies:\n${output(prodResults)}\n` : ''
}
${t('footer')}
`)
  }
}

/**
 * 检查用户是否升级主题版本，
 * 如果升级了主题版本，则清空缓存
 */
function detectThemeVersion(app: App) {
  if (app.env.isBuild)
    return

  try {
    const versionCache = app.dir.cache('.theme-plume-version')
    const themePackage = getThemePackage()
    const current = themePackage.version

    const updateCache = () => {
      fs.mkdirSync(path.dirname(versionCache), { recursive: true })
      fs.writeFileSync(versionCache, current, 'utf-8')
    }

    // 缓存文件不存在时，不做检查
    if (!fs.existsSync(versionCache)) {
      updateCache()
      return
    }

    const cached = fs.readFileSync(versionCache, 'utf-8') || ''

    if (cached === current)
      return

    /**
     * 当主题版本有更新时，清空缓存，
     * 避免由于缓存问题，导致主题的更新内容无法生效
     */
    fs.rmSync(app.dir.cache(), { recursive: true })
    fs.rmSync(app.dir.temp(), { recursive: true })

    updateCache()
  }
  catch {}
}

const RE_FLAG = /^[\^~<>=]+/

function resolveVersion(version: string) {
  if (RE_FLAG.test(version))
    return version.replace(RE_FLAG, '')
  if (/^\d/.test(version))
    return version

  return ''
}
