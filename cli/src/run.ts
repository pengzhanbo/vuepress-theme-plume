import type { PromptResult, ResolvedData } from './types.js'
import path from 'node:path'
import process from 'node:process'
import { intro, outro, spinner } from '@clack/prompts'
import { sleep } from '@pengzhanbo/utils'
import { execaCommand } from 'execa'
import colors from 'picocolors'
import { Mode } from './constants.js'
import { generate } from './generate.js'
import { prompt } from './prompt.js'
import { t } from './translate.js'
import { getPackageManager } from './utils/index.js'

export async function run(mode: Mode, root?: string) {
  intro(colors.cyan('Welcome to VuePress and vuepress-theme-plume !'))

  const result = await prompt(mode, root)
  const data = resolveData(result, mode)

  const progress = spinner()
  progress.start(t('spinner.start'))

  try {
    await generate(mode, data)
  }
  catch (e) {
    console.error(`${colors.red('generate files error: ')}\n`, e)
    process.exit(1)
  }

  // Delay for some time, I/O may not be completed yet,
  // executing subsequent tasks at this point may cause issues.
  await sleep(200)

  const cwd = path.join(process.cwd(), data.root)
  if (data.git) {
    progress.message(t('spinner.git'))
    try {
      await execaCommand('git init', { cwd })
    }
    catch (e) {
      console.error(`${colors.red('git init error: ')}\n`, e)
      process.exit(1)
    }
  }

  const pm = data.packageManager

  if (data.install) {
    progress.message(t('spinner.install'))
    try {
      await execaCommand(`${pm} install`, { cwd })
    }
    catch (e) {
      console.error(`${colors.red('install dependencies error: ')}\n`, e)
      process.exit(1)
    }
  }

  const cdCommand = mode === Mode.create ? colors.green(`cd ${data.root}`) : ''
  const runCommand = colors.green(`${pm} run docs:dev`)
  const installCommand = colors.green(`${pm} install`)

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
