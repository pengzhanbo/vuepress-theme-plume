import type { App } from 'vuepress'
import { isEmptyObject, uniq } from '@pengzhanbo/utils'
import { getUserAgent, resolveCommand } from 'package-manager-detector'
import { colors } from 'vuepress/utils'
import { effectMapping, getEffectsByFrontmatter, getMissingDeps } from '../features/home-hero-effects.js'
import { createTranslate, logger, perf, writeTemp } from '../utils/index.js'

const t = createTranslate({
  en: {
    unknown: `[Home hero background effect] Unknown effect: {{ effect }}`,
    uninstall: `[Home hero background effect] The following effect is missing necessary dependencies: {{ deps }}`,
    install: `Run the installation command: {{ command }}`,
  },
  zh: {
    unknown: `[首页 hero 背景效果] 未知的 effect: {{ effect }}`,
    uninstall: `[首页 hero 背景效果] 以下效果缺少必要依赖: {{ deps }}`,
    install: `运行安装命令:  {{ command }}`,
  },
})

/**
 * Prepare home page hero effects
 *
 * 准备首页 Hero 动画效果，从 frontmatter 收集效果配置并写入临时文件，同时检测缺失的依赖
 */
export async function prepareHomeHeroEffects(app: App): Promise<void> {
  perf.mark('prepare:home-hero-effects')

  const { effects, unknownEffects } = getEffectsByFrontmatter(app)

  if (unknownEffects.length)
    logger.warn(t('unknown', { effect: colors.cyan(unknownEffects.join(', ')) }))

  await writeToInternalTemp(app, effects)

  const missingDeps = getMissingDeps(effects)
  if (!isEmptyObject(missingDeps)) {
    const dependencies = uniq(Object.values(missingDeps).flat())
    logger.warn(t('uninstall', { deps: colors.bold(JSON.stringify(missingDeps)) }))
    const agent = getUserAgent()
    if (agent) {
      const { command = '', args = [] } = resolveCommand(agent, 'add', dependencies) || {}
      logger.info(t('install', { command: colors.cyan(`${command} ${args.join(' ')}`) }))
    }
  }

  perf.log('prepare:home-hero-effects')
}

async function writeToInternalTemp(app: App, effects: string[]) {
  let exports: string = 'export const effectComponents = {\n'

  for (const effect of effects) {
    const component = effectMapping[effect]
    exports += `  '${effect}': () => import('@theme/background/${component}.vue'),\n`
  }
  exports += '}\n\nexport const effects = Object.keys(effectComponents)\n'

  await writeTemp(app, 'internal/home-hero-effects.js', exports)
}
