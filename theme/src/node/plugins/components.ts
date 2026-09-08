import type { ComponentResolver } from 'vuepress-plugin-md-power'

const COMPONENT_PREFIX = /^VP/

// 全局组件
const GLOBAL_COMPONENTS: string[] = [
  'Badge',
  'Card',
  'CardGrid',
  'LinkCard',
  'ImageCard',
  'CardMasonry',
]

// 功能组件
const FEATURE_COMPONENTS: string[] = [
  'NpmBadge',
  'NpmBadgeGroup',
  'RepoCard',
  'Swiper',
]

export const componentResolver: ComponentResolver = {
  type: 'component',
  resolve: (name) => {
    const componentName = name.replace(COMPONENT_PREFIX, '')
    if (GLOBAL_COMPONENTS.includes(componentName)) {
      return { from: `@theme/global/VP${componentName}.vue` }
    }
    if (FEATURE_COMPONENTS.includes(componentName)) {
      return { from: `vuepress-theme-plume/features/${componentName}.vue` }
    }
    return void 0
  },
}
