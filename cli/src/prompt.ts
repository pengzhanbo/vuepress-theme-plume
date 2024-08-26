import process from 'node:process'
import path from 'node:path'
import { cancel, confirm, group, select, text } from '@clack/prompts'
import { setLang, t } from './translate.js'
import type { Bundler, Langs, Options, PackageManager } from './types.js'
import { packageManagerList } from './utils/index.js'
import { languageOptions } from './constants.js'

export interface PromptResult {
  lang: string
  targetDir: string
  packageManager: PackageManager
  bundler: Bundler
  multiLanguage: boolean
  defaultLanguage: Langs
  git: boolean
  install: boolean
}

export async function prompt(dir: string | undefined, cwd: string): Promise<PromptResult> {
  const result: PromptResult = await group({
    lang: () => selectDisplayLang(),
    targetDir: () => getTargetDir(cwd, dir),
    packageManager: () => select<Options<PackageManager>, PackageManager>({
      message: t('question.packageManager'),
      options: packageManagerList.map(pm => ({ label: pm, value: pm })),
    }),
    bundler: () => select<Options<Bundler>, Bundler>({
      message: t('question.bundler'),
      options: [
        { label: 'Vite', value: 'vite' },
        { label: 'Webpack', value: 'webpack' },
      ],
    }),
    multiLanguage: () => confirm({
      message: t('question.multiLanguage'),
      initialValue: false,
    }),
    defaultLanguage: () => select<Options<Langs>, Langs>({
      message: t('question.defaultLanguage'),
      options: languageOptions,
    }),
    git: () => confirm({
      message: t('question.git'),
      initialValue: true,
    }),
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

export async function selectDisplayLang() {
  const lang = await select<Options<Langs>, Langs>({
    message: 'Select a language to display / 选择显示语言',
    options: languageOptions,
  })

  if (typeof lang === 'string') {
    setLang(lang)
  }

  return lang
}

const REG_DIR_CHAR = /[<>:"\\|?*[\]]/

export async function getTargetDir(cwd: string, dir?: string) {
  if (dir === '.')
    return cwd

  if (typeof dir === 'string' && dir) {
    return path.resolve(cwd, dir)
  }

  const DEFAULT_DIR = 'my-project'

  const dirPath = await text({
    message: t('question.projectName'),
    placeholder: DEFAULT_DIR,
    validate(value) {
      if (value && REG_DIR_CHAR.test(value))
        return t('hint.targetDir')

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
