import type { Bundler, Langs, Locale, PromptResult } from './types.js'
import path from 'node:path'
import process from 'node:process'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import osLocale from 'os-locale'
import { bundlerOptions, deployOptions, DeployType, languageOptions, Mode } from './constants.js'
import { setLang, t } from './translate.js'

const REG_DIR_CHAR = /[<>:"\\|?*[\]]/

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
 * Prompt user for project configuration
 *
 * 提示用户输入项目配置
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param root - Optional root directory path / 可选的根目录路径
 * @returns Resolved prompt result / 解析后的提示结果
 */
export async function prompt(mode: Mode, root?: string): Promise<PromptResult> {
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
      placeholder: 'My Vuepress Site',
      defaultValue: 'My Vuepress Site',
    }),

    siteDescription: () => text({
      message: t('question.site.description'),
      defaultValue: '',
    }),

    multiLanguage: () => confirm({
      message: t('question.multiLanguage'),
      initialValue: false,
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
        initialValue: true,
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
        initialValue: DeployType.custom,
      })
    },

    git: async () => {
      if (mode === Mode.init)
        return false
      return confirm({
        message: t('question.git'),
        initialValue: true,
      })
    },

    install: () => confirm({
      message: t('question.installDeps'),
      initialValue: true,
    }),
  }, {
    onCancel: () => {
      cancel(t('hint.cancel'))
      process.exit(0)
    },
  })

  return result
}
