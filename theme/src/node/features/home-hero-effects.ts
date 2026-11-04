import type { App } from 'vuepress'
import type { ThemeHomeConfig } from '../../shared/index.js'
import { objectKeys, uniq } from '@pengzhanbo/utils'
import { isPackageExists } from 'local-pkg'

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
  'light-fall': ['ogl'],
}

export const effectMapping: Record<string, string> = {
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
  'light-fall': 'LightFall',
}

const allEffects = objectKeys(effectMapping)

export function getEffectsByFrontmatter(app: App) {
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

export function getMissingDeps(effects: string[]): Record<string, string[]> {
  const missingDeps: Record<string, string[]> = {}
  for (const effect of effects) {
    const deps = effectDeps[effect]
    if (deps?.length) {
      const uninstall = deps.filter(dep => !isPackageExists(dep))
      if (uninstall.length)
        missingDeps[effect] = uninstall
    }
  }
  return missingDeps
}
