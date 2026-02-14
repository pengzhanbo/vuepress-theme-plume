/* istanbul ignore file -- @preserve */
/* eslint-disable no-console */
import { colors, ora } from 'vuepress/utils'

type Ora = ReturnType<typeof ora>

/**
 * Logger utility class for plugin
 *
 * 插件日志工具类
 */
export class Logger {
  /**
   * Create a logger instance
   *
   * 创建日志记录器实例
   *
   * @param name - Plugin/Theme name / 插件/主题名称
   */
  public constructor(
    private readonly name = '',
  ) {}

  /**
   * Initialize spinner
   *
   * 初始化加载动画
   *
   * @param subname - Subname / 子名称
   * @param text - Loading text / 加载文本
   * @returns Ora spinner instance / Ora 加载动画实例
   */
  private init(subname: string, text: string): Ora {
    return ora({
      prefixText: colors.blue(`${this.name}${subname ? `:${subname}` : ''}: `),
      text,
    })
  }

  /**
   * Create a loading spinner with text
   *
   * 创建带文本的加载动画
   *
   * @param subname - Subname / 子名称
   * @param msg - Message / 消息
   * @returns Object with succeed and fail methods / 包含 succeed 和 fail 方法的对象
   */
  public load(subname: string, msg: string): {
    succeed: (text?: string) => void
    fail: (text?: string) => void
  } {
    const instance = this.init(subname, msg)

    return {
      succeed: (text?: string) => instance.succeed(text),
      fail: (text?: string) => instance.succeed(text),
    }
  }

  /**
   * Log info message
   *
   * 记录信息消息
   *
   * @param subname - Subname / 子名称
   * @param text - Message text / 消息文本
   * @param args - Additional arguments / 额外参数
   */
  public info(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.blue(text)).info()

    if (args.length)
      console.info(...args)
  }

  /**
   * Log success message
   *
   * 记录成功消息
   *
   * @param subname - Subname / 子名称
   * @param text - Message text / 消息文本
   * @param args - Additional arguments / 额外参数
   */
  public succeed(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.green(text)).succeed()

    if (args.length)
      console.log(...args)
  }

  /**
   * Log warning message
   *
   * 记录警告消息
   *
   * @param subname - Subname / 子名称
   * @param text - Message text / 消息文本
   * @param args - Additional arguments / 额外参数
   */
  public warn(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.yellow(text)).warn()

    if (args.length)
      console.warn(...args)
  }

  /**
   * Log error message
   *
   * 记录错误消息
   *
   * @param subname - Subname / 子名称
   * @param text - Message text / 消息文本
   * @param args - Additional arguments / 额外参数
   */
  public error(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.red(text)).fail()

    if (args.length)
      console.error(...args)
  }
}

/**
 * Default logger instance for vuepress-plugin-md-power
 *
 * vuepress-plugin-md-power 的默认日志记录器实例
 */
export const logger: Logger = new Logger('vuepress-plugin-md-power')
