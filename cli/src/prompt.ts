import type { Bundler, CliOptions, Langs, Locale, PromptResult } from './types.js'
import path from 'node:path'
import process from 'node:process'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import osLocale from 'os-locale'
import { bundlerOptions, defaultAnswers, deployOptions, DeployType, languageOptions, Mode } from './constants.js'
import { setLang, t } from './translate.js'

const REG_DIR_CHAR = /[<>:"\\|?*[\]]/

/**
 * Whether the CLI can interact with the user.
 *
 * Both stdout and stdin must be a TTY; otherwise `@clack/prompts` would either
 * throw or block forever (in CI, containers and piped shells).
 *
 * CLI 是否能够与用户交互。
 *
 * stdout 与 stdin 都必须是 TTY，否则 `@clack/prompts` 会抛出错误或永久阻塞
 * （CI、容器与管道环境中）。
 *
 * @returns Whether an interactive terminal is available / 是否存在可用的交互式终端
 */
function isInteractive(): boolean {
  return Boolean(process.stdout.isTTY && process.stdin.isTTY)
}

/**
 * Resolve the display language from the operating system locale.
 *
 * Unlike the interactive flow, this never prompts: unknown locales fall back to
 * English.
 *
 * 从操作系统语言环境解析显示语言。
 *
 * 与交互流程不同，此处不会发起询问：未知语言回退为英文。
 *
 * @returns Resolved language / 解析后的语言
 */
function resolveLangByLocale(): Langs {
  const locale = osLocale()

  if (locale === 'zh-CN' || locale === 'zh-Hans')
    return setLang('zh-CN')

  return setLang('en-US')
}

/**
 * Validate the project root path.
 *
 * The same validation is applied to both the interactive input and the value
 * passed from the command line, so a `..` segment or an absolute path can
 * never escape the current working directory.
 *
 * 校验项目根目录路径。
 *
 * 交互输入与命令行参数使用同一套校验，确保 `..` 路径段或绝对路径
 * 无法越出当前工作目录。
 *
 * @param value - Path to validate / 要校验的路径
 * @returns Locale key of the error message, or `undefined` when valid / 错误信息的本地化键，校验通过时返回 `undefined`
 */
export function validateRoot(value?: string): keyof Locale | undefined {
  if (!value)
    return undefined

  // 拒绝绝对路径与包含 `..` 段的相对路径
  // Reject absolute paths and relative paths containing a `..` segment
  if (path.isAbsolute(value) || value.split(/[\\/]/).includes('..'))
    return 'hint.root'

  if (REG_DIR_CHAR.test(value))
    return 'hint.root.illegal'

  return undefined
}

/**
 * Create the prompt result for the non-interactive mode.
 *
 * All values come from the documented defaults, so `--yes` and the automatic
 * non-TTY fallback behave identically.
 *
 * 构造非交互模式的提示结果。
 *
 * 所有取值均来自约定的默认值，因此 `--yes` 与自动降级的非 TTY 行为完全一致。
 *
 * @param mode - Operation mode / 操作模式
 * @param root - Root directory passed from the command line / 命令行传入的根目录
 * @returns Resolved prompt result / 解析后的提示结果
 */
function createDefaultResult(mode: Mode, root?: string): PromptResult {
  return {
    displayLang: resolveLangByLocale(),
    // 空字符串视为未提供目录，回退到默认目录，与交互分支 `if (root)` 的行为保持一致。
    // An empty string is treated as "not provided" and falls back to the default
    // directory, matching the interactive branch which checks `if (root)`.
    root: root || (mode === Mode.init ? './docs' : './my-project'),
    ...defaultAnswers,
    git: mode === Mode.init ? false : defaultAnswers.git,
    deploy: mode === Mode.init ? DeployType.custom : defaultAnswers.deploy,
  }
}

/**
 * Prompt user for project configuration
 *
 * When `--yes` is passed, or when no interactive terminal is available, every
 * prompt is skipped and the default answers are used instead.
 *
 * 提示用户输入项目配置
 *
 * 传入 `--yes` 或不存在可交互终端时，会跳过全部提示并直接使用默认答案。
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param root - Optional root directory path / 可选的根目录路径
 * @param options - CLI options / CLI 可选配置
 * @returns Resolved prompt result / 解析后的提示结果
 */
export async function prompt(mode: Mode, root?: string, options: CliOptions = {}): Promise<PromptResult> {
  // 非交互模式：`--yes` 显式指定，或当前环境没有可交互终端时自动降级。
  // Non-interactive mode: requested by `--yes`, or degraded automatically when
  // no interactive terminal is available.
  if (options.yes || !isInteractive()) {
    // 先解析出结果（同时确定显示语言），保证后续提示与校验错误使用同一语言。
    // Resolve the result first (which also resolves the display language) so the
    // notice and validation errors share the same language.
    const result = createDefaultResult(mode, root)
    const invalid = validateRoot(result.root)
    if (invalid)
      throw new Error(t(invalid))
    if (!options.yes)
      console.log(t('hint.nonInteractive'))
    return result
  }

  const result: PromptResult = await group({
    displayLang: async () => {
      // 从操作系统中获取语言
      const locale = osLocale()

      if (locale === 'zh-CN' || locale === 'zh-Hans')
        return setLang('zh-CN')

      if (locale === 'en-US')
        return setLang('en-US')

      return setLang(await select<Langs>({
        message: 'Select a language to display / 选择显示语言',
        options: languageOptions,
      }) as Langs)
    },

    root: async () => {
      // 命令行传入的路径也必须经过同一套校验，避免 `..` 越界写入。
      // The path passed from the command line must go through the same validation
      // to prevent writing outside of the current working directory.
      if (root) {
        const invalid = validateRoot(root)
        if (invalid)
          throw new Error(t(invalid))
        return root
      }
      const DEFAULT_ROOT = mode === Mode.init ? './docs' : './my-project'
      return await text({
        message: t('question.root'),
        placeholder: DEFAULT_ROOT,
        validate(value) {
          const invalid = validateRoot(value)
          return invalid ? t(invalid) : undefined
        },
        defaultValue: DEFAULT_ROOT,
      })
    },

    siteName: () => text({
      message: t('question.site.name'),
      placeholder: defaultAnswers.siteName,
      defaultValue: defaultAnswers.siteName,
    }),

    siteDescription: () => text({
      message: t('question.site.description'),
      defaultValue: defaultAnswers.siteDescription,
    }),

    multiLanguage: () => confirm({
      message: t('question.multiLanguage'),
      initialValue: defaultAnswers.multiLanguage,
    }),

    defaultLanguage: () => select<Langs>({
      message: t('question.defaultLanguage'),
      options: languageOptions,
    }),

    injectNpmScripts: async () => {
      if (mode === Mode.create)
        return true
      return await confirm({
        message: t('question.injectNpmScripts'),
        initialValue: defaultAnswers.injectNpmScripts,
      })
    },

    bundler: () => select<Bundler>({
      message: t('question.bundler'),
      options: bundlerOptions,
    }),

    deploy: async () => {
      if (mode === Mode.init) {
        return DeployType.custom
      }
      return await select<DeployType>({
        message: t('question.deploy'),
        options: deployOptions,
        initialValue: defaultAnswers.deploy,
      })
    },

    git: async () => {
      if (mode === Mode.init)
        return false
      return confirm({
        message: t('question.git'),
        initialValue: defaultAnswers.git,
      })
    },

    install: async () => {
      // `--no-install` 已显式指定跳过安装，无需再询问用户。
      // `--no-install` explicitly skips installing dependencies, so the prompt
      // would only offer a choice that cannot take effect.
      if (options.install === false)
        return false
      return confirm({
        message: t('question.installDeps'),
        initialValue: defaultAnswers.install,
      })
    },
  }, {
    onCancel: () => {
      cancel(t('hint.cancel'))
      process.exit(0)
    },
  })

  return result
}
