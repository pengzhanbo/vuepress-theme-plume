import { Logger } from '@vuepress/helper'
import { colors } from 'vuepress/utils'
import { THEME_NAME } from './constants.js'

export const logger: Logger = new Logger(THEME_NAME)

class Perf {
  isDebug: boolean = false
  collect: Record<string, number> = {}

  init(isDebug = false): void {
    this.isDebug = isDebug
  }

  mark(mark: string): void {
    this.collect[mark] = performance.now()
  }

  log(mark: string): void {
    const startTime = this.collect[mark]
    if (!this.isDebug || !startTime)
      return
    logger.info('[perf spent time] ', `${colors.green(mark)}: ${colors.cyan(`${(performance.now() - startTime).toFixed(2)}ms`)}`)
  }
}

export const perf: Perf = new Perf()
