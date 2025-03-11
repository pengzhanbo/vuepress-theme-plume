import { Logger } from '@vuepress/helper'
import { colors } from 'vuepress/utils'
import { THEME_NAME } from './constants.js'

export const logger = new Logger(THEME_NAME)

class Perf {
  isDebug: boolean = false
  collect: Record<string, number> = {}

  init(isDebug = false) {
    this.isDebug = isDebug
  }

  mark(mark: string) {
    this.collect[mark] = performance.now()
  }

  log(mark: string) {
    const startTime = this.collect[mark]
    if (!this.isDebug || !startTime)
      return
    logger.info('[perf spent time] ', `${colors.green(mark)}: ${colors.cyan(`${(performance.now() - startTime).toFixed(2)}ms`)}`)
  }
}

export const perf = new Perf()
