import process from 'node:process'
import path from 'node:path'
import { spinner } from '@clack/prompts'
import { execaCommand } from 'execa'
import colors from 'picocolors'
import { prompt } from './prompt.js'
import { generate } from './generate.js'
import { t } from './translate.js'

export async function run(dir?: string) {
  const cwd = process.cwd()
  const result = await prompt(dir, cwd)
  const progress = spinner()

  progress.start(t('spinner.start'))

  await generate(result)

  if (result.git) {
    progress.message(t('spinner.git'))
    await execaCommand('git init')
  }

  const pm = result.packageManager

  if (result.install) {
    progress.message(t('spinner.install'))
    await execaCommand(pm === 'yarn' ? 'yarn' : `${pm} install`)
  }

  const target = path.relative(cwd, result.targetDir)
  const runCommand = pm === 'yarn' ? 'yarn dev' : `${pm} run dev`
  const installCommand = pm === 'yarn' ? 'yarn' : `${pm} install`

  progress.stop(`${t('spinner.stop')}

    ${t('spinner.command')}

    ${colors.green(`cd ${target}`)}
    ${result.install ? '' : `${colors.green(installCommand)} && `}${colors.green(runCommand)}
`)
}
