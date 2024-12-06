import type { Bundler, Langs, PromptResult } from './types.js'
import { createRequire } from 'node:module'
import process from 'node:process'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import { bundlerOptions, deployOptions, DeployType, languageOptions, Mode } from './constants.js'
import { setLang, t } from './translate.js'

const require = createRequire(process.cwd())

const REG_DIR_CHAR = /[<>:"\\|?*[\]]/

export async function prompt(mode: Mode, root?: string): Promise<PromptResult> {
  let hasTs = false
  if (mode === Mode.init) {
    try {
      hasTs = !!require.resolve('typescript')
    }
    catch {}
  }

  const result: PromptResult = await group({
    displayLang: async () => {
      const lang = await select<Langs>({
        message: 'Select a language to display / 选择显示语言',
        options: languageOptions,
      })

      if (typeof lang === 'string')
        setLang(lang)

      return lang
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
    }),

    multiLanguage: () => confirm({
      message: t('question.multiLanguage'),
      initialValue: false,
    }),

    defaultLanguage: () => select<Langs>({
      message: t('question.defaultLanguage'),
      options: languageOptions,
    }),

    useTs: async () => {
      if (mode === Mode.init)
        return hasTs
      if (hasTs)
        return true
      return await confirm({
        message: t('question.useTs'),
        initialValue: true,
      })
    },

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
