import process from 'node:process'
import path from 'node:path'
import { createRequire } from 'node:module'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import { setLang, t } from './translate.js'
import type { Bundler, Langs, Options, PromptResult } from './types.js'
import { DeployType, Mode, bundlerOptions, deployOptions, languageOptions } from './constants.js'

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
      const lang = await select<Options<Langs>, Langs>({
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

    defaultLanguage: () => select<Options<Langs>, Langs>({
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

    bundler: () => select<Options<Bundler>, Bundler>({
      message: t('question.bundler'),
      options: bundlerOptions,
    }),

    deploy: async () => {
      if (mode === Mode.init) {
        return DeployType.custom
      }
      return await select<Options<DeployType>, DeployType>({
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

export async function getTargetDir(cwd: string, dir?: string) {
  if (dir === '.')
    return cwd

  if (typeof dir === 'string' && dir) {
    return path.resolve(cwd, dir)
  }

  const DEFAULT_DIR = 'my-project'

  const dirPath = await text({
    message: t('question.root'),
    placeholder: DEFAULT_DIR,
    validate(value) {
      if (value && REG_DIR_CHAR.test(value))
        return t('hint.root.illegal')

      return undefined
    },
    defaultValue: DEFAULT_DIR,
  })

  if (typeof dirPath === 'string') {
    if (dirPath === '.')
      return cwd

    return path.join(cwd, dirPath || DEFAULT_DIR)
  }
  return dirPath
}
