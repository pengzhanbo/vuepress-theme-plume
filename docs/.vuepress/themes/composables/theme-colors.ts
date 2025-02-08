import type { InjectionKey, Ref } from 'vue'
import { useSessionStorage, useStyleTag } from '@vueuse/core'
import { inject, provide, watch } from 'vue'

export interface ThemeColor {
  name: string
  key: string
  value: string
  desc: string
}
export type ThemeColors = ThemeColor[]
export interface ThemeColorsGroup {
  name: string
  group: ThemeColors
}

const DEFAULT_PRESET = {
  light: {
    '--vp-c-brand-1': '#5086a1',
    '--vp-c-brand-2': '#6aa1b7',
    '--vp-c-brand-3': '#8cccd5',
    '--vp-c-brand-soft': 'rgba(131, 208, 218, 0.314)',

    '--vp-c-text-1': 'rgba(60, 60, 67)',
    '--vp-c-text-2': 'rgba(60, 60, 67, 0.78)',
    '--vp-c-text-3': 'rgba(60, 60, 67, 0.56)',

    '--vp-c-bg': '#fff',
    '--vp-nav-bg-color': '#fff',
    '--vp-nav-screen-bg-color': '#fff',
    '--vp-local-nav-bg-color': '#fff',
    '--vp-sidebar-bg-color': '#f6f6f7',
    '--vp-code-block-bg': '#f6f8fa',
  },
  dark: {
    '--vp-c-brand-1': '#8cccd5',
    '--vp-c-brand-2': '#6aa1b7',
    '--vp-c-brand-3': '#5086a1',
    '--vp-c-brand-soft': 'rgba(131, 208, 218, 0.314)',

    '--vp-c-text-1': 'rgba(255, 255, 245, 0.86)',
    '--vp-c-text-2': 'rgba(235, 235, 245, 0.6)',
    '--vp-c-text-3': 'rgba(235, 235, 245, 0.38)',

    '--vp-c-bg': '#1b1b1f',
    '--vp-nav-bg-color': '#1b1b1f',
    '--vp-nav-screen-bg-color': '#1b1b1f',
    '--vp-local-nav-bg-color': '#1b1b1f',
    '--vp-sidebar-bg-color': '#161618',
    '--vp-code-block-bg': '#202127',
  },
}

const preset: ThemeColorsGroup[] = [
  {
    name: '主题色',
    group: [
      { name: 'brand-1', key: '--vp-c-brand-1', value: '', desc: '链接颜色、强调色' },
      { name: 'brand-2', key: '--vp-c-brand-2', value: '', desc: '链接、按钮 hover 颜色' },
      { name: 'brand-3', key: '--vp-c-brand-3', value: '', desc: '背景色、边框色' },
      { name: 'brand-soft', key: '--vp-c-brand-soft', value: '', desc: '辅助色' },
    ],
  },
  {
    name: '文本颜色',
    group: [
      { name: 'text-1', key: '--vp-c-text-1', value: '', desc: '主要文本' },
      { name: 'text-2', key: '--vp-c-text-2', value: '', desc: '次要文本' },
      { name: 'text-3', key: '--vp-c-text-3', value: '', desc: '辅助文本' },
    ],
  },
  {
    name: '背景色',
    group: [
      { name: 'bg', key: '--vp-c-bg', value: '', desc: '主体背景' },
      { name: 'nav-bg', key: '--vp-nav-bg-color', value: '', desc: '导航栏背景' },
      { name: 'nav-screen-bg', key: '--vp-nav-screen-bg-color', value: '', desc: '移动端导航栏' },
      { name: 'local-nav-bg', key: '--vp-local-nav-bg-color', value: '', desc: '页面内导航栏' },
      { name: 'sidebar-bg', key: '--vp-sidebar-bg-color', value: '', desc: '侧边栏背景' },
      { name: 'code-block-bg', key: '--vp-code-block-bg', value: '', desc: '代码块背景' },
    ],
  },
]

const themeColorSymbol: InjectionKey<{
  lightColors: Ref<ThemeColorsGroup[]>
  darkColors: Ref<ThemeColorsGroup[]>
  css: Ref<string>
  reset: () => void
}> = Symbol(__VUEPRESS_DEV__ ? 'theme-color' : '')

export function setupThemeColors() {
  const lightColors = useSessionStorage<ThemeColorsGroup[]>('custom-theme-colors-light', resolveDefaultColors('light'))
  const darkColors = useSessionStorage<ThemeColorsGroup[]>('custom-theme-colors-dark', resolveDefaultColors('dark'))

  const { css, load } = useStyleTag('')

  watch([lightColors, darkColors], () => {
    const content = `${resolveContent(lightColors.value, 'light')}\n${resolveContent(darkColors.value, 'dark')}`
    css.value = content
    load()
  }, { deep: true, immediate: true })

  function resolveContent(colors: ThemeColorsGroup[], type: 'light' | 'dark') {
    const name = type === 'light' ? ':root' : '[data-theme="dark"]'
    let content = `${name} {\n`
    colors.forEach(({ name, group }) => {
      content += `\n  /**\n   * ${name}\n   * -------------------------------------------------------------------------- */\n\n`
      group.forEach((item) => {
        const str = `  ${item.key}: ${item.value};`
        content += `${str}${' '.repeat(54 - str.length)}/* ${item.desc} */\n`
      })
    })
    content += '}\n'
    return content
  }

  function reset() {
    lightColors.value = resolveDefaultColors('light')
    darkColors.value = resolveDefaultColors('dark')
  }

  provide(themeColorSymbol, {
    lightColors,
    darkColors,
    css,
    reset,
  })
}

function resolveDefaultColors(type: 'light' | 'dark') {
  return preset.map(group => ({
    name: group.name,
    group: group.group.map(item => ({
      ...item,
      value: DEFAULT_PRESET[type][item.key],
    })),
  }))
}

export function useThemeColors() {
  const result = inject(themeColorSymbol)

  if (!result) {
    throw new Error('useThemeColors() can only be used inside `setupThemeColors()`.')
  }

  return result
}
