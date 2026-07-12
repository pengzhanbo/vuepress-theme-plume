import type { Bundler, Langs, PromptResult } from './types.js'
import process from 'node:process'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import osLocale from 'os-locale'
import { bundlerOptions, deployOptions, DeployType, languageOptions, Mode } from './constants.js'
import { setLang, t } from './translate.js'

const REG_DIR_CHAR = /[<>:"\\|?*[\]]/

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
      if (root)
        return root
      const DEFAULT_ROOT = mode === Mode.init ? './docs' : './my-project'
      return await text({
        message: t('question.root'),
        placeholder: DEFAULT_ROOT,
        validate(value) {
          // not absolute path or parent path
          if (value?.startsWith('/') || value?.startsWith('..'))
            return t('hint.root')

          // not contains illegal characters
          if (value && REG_DIR_CHAR.test(value))
            return t('hint.root.illegal')

          return undefined
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
