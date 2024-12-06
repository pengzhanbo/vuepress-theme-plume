import { Logger } from '@vuepress/helper'
import { colors } from 'vuepress/utils'
import { THEME_NAME } from './constants.js'

export const logger = new Logger(THEME_NAME)

// { mark: startTime }
const perf: Record<string, number> = {}

export function perfMark(mark: string): void {
  perf[mark] = performance.now()
}

export function perfLog(mark: string, isDebug = false): void {
  const startTime = perf[mark]
  if (!startTime || !isDebug)
    return

  logger.info(`${colors.magenta('[perf spent time]')} ${colors.green(mark)}: ${colors.cyan(`${(performance.now() - startTime).toFixed(2)}ms`)}`)
}
