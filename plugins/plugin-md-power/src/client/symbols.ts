import { createSymbol } from './utils/symbol.js'

/**
 * Injection key for timeline component communication.
 *
 * 时间线组件通信的注入键。
 */
export const INJECT_TIMELINE_KEY: symbol = createSymbol('timeline')

/**
 * Injection key for collapse component communication.
 *
 * 折叠面板组件通信的注入键。
 */
export const INJECT_COLLAPSE_KEY: symbol = createSymbol('collapse')
