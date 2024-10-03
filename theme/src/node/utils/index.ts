import { Logger } from '@vuepress/helper'

export const THEME_NAME = 'vuepress-theme-plume'

export const logger = new Logger(THEME_NAME)

export * from './createFsCache.js'
export * from './deleteAttrs.js'
export * from './hash.js'
export * from './interopDefault.js'
export * from './package.js'
export * from './path.js'
export * from './resolveContent.js'
export * from './writeTemp.js'
