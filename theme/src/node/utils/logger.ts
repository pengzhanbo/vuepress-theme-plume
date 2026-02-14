import { Logger } from '@vuepress/helper'
import { colors } from 'vuepress/utils'
import { THEME_NAME } from './constants.js'

/**
 * Theme logger instance
 * Used for logging messages with the theme name prefix
 *
 * 主题日志记录器实例
 * 用于记录带有主题名称前缀的消息
 */
export const logger: Logger = new Logger(THEME_NAME)

/**
 * Performance monitor class
 * Tracks and logs performance metrics for debugging
 *
 * 性能监控类
 * 跟踪和记录性能指标用于调试
 */
class Perf {
  /** Whether debug mode is enabled / 是否启用调试模式 */
  isDebug: boolean = false
  /** Collection of performance marks / 性能标记集合 */
  collect: Record<string, number> = {}

  /**
   * Initialize performance monitor
   *
   * 初始化性能监控器
   *
   * @param isDebug - Whether to enable debug mode / 是否启用调试模式
   */
  init(isDebug = false): void {
    this.isDebug = isDebug
  }

  /**
   * Mark a performance checkpoint
   * Records the current timestamp for the given mark
   *
   * 标记性能检查点
   * 记录给定标记的当前时间戳
   *
   * @param mark - Name of the performance mark / 性能标记的名称
   */
  mark(mark: string): void {
    this.collect[mark] = performance.now()
  }

  /**
   * Log the time spent since a mark
   * Outputs the elapsed time if debug mode is enabled
   *
   * 记录自标记以来的耗时
   * 如果启用调试模式则输出经过的时间
   *
   * @param mark - Name of the performance mark to log / 要记录的性能标记名称
   */
  log(mark: string): void {
    const startTime = this.collect[mark]
    if (!this.isDebug || !startTime)
      return
    logger.info('[perf spent time] ', `${colors.green(mark)}: ${colors.cyan(`${(performance.now() - startTime).toFixed(2)}ms`)}`)
  }
}

/**
 * Global performance monitor instance
 *
 * 全局性能监控实例
 */
export const perf: Perf = new Perf()
