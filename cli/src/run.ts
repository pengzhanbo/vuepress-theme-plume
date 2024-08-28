import { intro, outro, spinner } from '@clack/prompts'
import { execaCommand } from 'execa'
import colors from 'picocolors'
import { prompt } from './prompt.js'
import { generate } from './generate.js'
import { t } from './translate.js'
import { Mode } from './constants.js'
import type { PromptResult, ResolvedData } from './types.js'
import { getPackageManager } from './utils/index.js'

export async function run(mode: Mode, root?: string) {
  intro(colors.cyan('Welcome to VuePress and vuepress-theme-plume !'))

  const result = await prompt(mode, root)
  const data = resolveData(result, mode)

  const progress = spinner()
  progress.start(t('spinner.start'))

  await generate(mode, data)

  if (data.git) {
    progress.message(t('spinner.git'))
    await execaCommand('git init')
  }

  const pm = data.packageManager

  if (data.install) {
    progress.message(t('spinner.install'))
    await execaCommand(pm === 'yarn' ? 'yarn' : `${pm} install`)
  }

  const cdCommand = mode === Mode.create ? colors.green(`cd ${data.docsDir}`) : ''
  const runCommand = colors.green(pm === 'yarn' ? 'yarn dev' : `${pm} run dev`)
  const installCommand = colors.green(pm === 'yarn' ? 'yarn' : `${pm} install`)

  progress.stop(t('spinner.stop'))

  if (mode === Mode.create) {
    outro(`${t('spinner.command')}
      ${cdCommand}
      ${data.install ? '' : `${installCommand} && `}${runCommand}`)
  }
}

function resolveData(result: PromptResult, mode: Mode): ResolvedData {
  return {
    ...result,
    packageManager: getPackageManager(),
    docsDir: mode === Mode.create ? 'docs' : result.root.replace(/^\.\//, '').replace(/\/$/, ''),
    siteDescription: result.siteDescription || '',
  }
}
