import type { App } from 'vuepress'
import type { ThemeHomeConfig } from '../../shared/index.js'
import { isEmptyObject, uniq } from '@pengzhanbo/utils'
import { isPackageExists } from 'local-pkg'
import { getUserAgent, resolveCommand } from 'package-manager-detector'
import { colors } from 'vuepress/utils'
import { createTranslate, logger, perf, writeTemp } from '../utils/index.js'

const effectDeps: Record<string, string[]> = {
  'prism': ['ogl'],
  'pixel-blast': ['three', 'postprocessing'],
  'hyper-speed': ['three', 'postprocessing'],
  'liquid-ether': ['three'],
  'dot-grid': ['gsap'],
  'iridescence': ['ogl'],
  'orb': ['ogl'],
  'beams': ['three'],
  'dark-veil': ['ogl'],
}

const effectMapping: Record<string, string> = {
  'tint-plate': 'TintPlate',
  'prism': 'Prism',
  'pixel-blast': 'PixelBlast',
  'hyper-speed': 'HyperSpeed',
  'liquid-ether': 'LiquidEther',
  'dot-grid': 'DotGrid',
  'iridescence': 'Iridescence',
  'orb': 'Orb',
  'beams': 'Beams',
  'lightning': 'Lightning',
  'dark-veil': 'DarkVeil',
}

const allEffects = Object.keys(effectMapping)

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
  detectMissingDeps(effects)

  perf.log('prepare:home-hero-effects')
}

async function writeToInternalTemp(app: App, effects: string[]) {
  let imports: string = ''
  let exports: string = 'export const effectComponents = {\n'

  for (const effect of effects) {
    const component = effectMapping[effect]
    imports += `import ${component} from '@theme/background/${component}.vue'\n`
    exports += `  '${effect}': ${component},\n`
  }
  exports += '}\n\nexport const effects = Object.keys(effectComponents)\n'
  const content = `${imports}\n${exports}`

  await writeTemp(app, 'internal/home-hero-effects.js', content)
}

function getEffectsByFrontmatter(app: App) {
  const effects: string[] = []
  const unknownEffects: string[] = []

  for (const page of app.pages) {
    const fm = page.frontmatter
    const config = fm.config as ThemeHomeConfig[]
    if (!(fm.home || fm.pageLayout === 'home') || !config?.length)
      continue

    for (const item of config) {
      if (item.type === 'hero') {
        const effect = item.effect
        if (effect) {
          if (allEffects.includes(effect)) {
            effects.push(effect)
          }
          else {
            unknownEffects.push(effect)
          }
        }
        // compatibility
        if (item.background) {
          if (allEffects.includes(item.background))
            effects.push(item.background)
        }
      }
    }
  }
  return { effects: uniq(effects), unknownEffects: uniq(unknownEffects) }
}

function detectMissingDeps(effects: string[]) {
  const missingDeps: Record<string, string[]> = {}
  for (const effect of effects) {
    const deps = effectDeps[effect]
    if (deps?.length) {
      const uninstall = deps.filter(dep => !isPackageExists(dep))
      if (uninstall.length)
        missingDeps[effect] = uninstall
    }
  }
  if (isEmptyObject(missingDeps))
    return
  const dependencies = uniq(Object.values(missingDeps).flat())

  logger.warn(t('uninstall', { deps: colors.bold(JSON.stringify(missingDeps)) }))
  const agent = getUserAgent()
  if (agent) {
    const { command = '', args = [] } = resolveCommand(agent, 'add', dependencies) || {}
    logger.info(t('install', { command: colors.cyan(`${command} ${args.join(' ')}`) }))
  }
}
