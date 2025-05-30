/* istanbul ignore file -- @preserve */
/* eslint-disable no-console */
import { colors, ora } from 'vuepress/utils'

type Ora = ReturnType<typeof ora>

/**
 * Logger utils
 */
export class Logger {
  public constructor(
    /**
     * Plugin/Theme name
     */
    private readonly name = '',
  ) {}

  private init(subname: string, text: string): Ora {
    return ora({
      prefixText: colors.blue(`${this.name}${subname ? `:${subname}` : ''}: `),
      text,
    })
  }

  /**
   * Create a loading spinner with text
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

  public info(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.blue(text)).info()

    if (args.length)
      console.info(...args)
  }

  /**
   * Log success msg
   */
  public succeed(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.green(text)).succeed()

    if (args.length)
      console.log(...args)
  }

  /**
   * Log warning msg
   */
  public warn(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.yellow(text)).warn()

    if (args.length)
      console.warn(...args)
  }

  /**
   * Log error msg
   */
  public error(subname: string, text = '', ...args: unknown[]): void {
    this.init(subname, colors.red(text)).fail()

    if (args.length)
      console.error(...args)
  }
}

export const logger: Logger = new Logger('vuepress-plugin-md-power')
