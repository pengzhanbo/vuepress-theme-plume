import type { CliOptions, ResolvedData } from './types.js'
import path from 'node:path'
import process from 'node:process'
import { intro, outro, spinner } from '@clack/prompts'
import { attemptAsync, sleep } from '@pengzhanbo/utils'
import spawn from 'nano-spawn'
import colors from 'picocolors'
import { Mode } from './constants.js'
import { generate } from './generate.js'
import { prompt } from './prompt.js'
import { t } from './translate.js'
import { getPackageManager } from './utils/index.js'

/**
 * Run the CLI workflow for VuePress project initialization or creation
 *
 * 执行 VuePress 项目初始化或创建的 CLI 工作流程
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param root - Root directory path / 根目录路径
 * @param options - CLI options / CLI 可选配置
 */
export async function run(mode: Mode, root?: string, options: CliOptions = {}): Promise<void> {
  intro(colors.cyan('Welcome to VuePress and vuepress-theme-plume !\n欢迎使用 VuePress 和 vuepress-theme-plume !'))

  const [promptErr, result] = await attemptAsync(() => prompt(mode, root, options))
  if (promptErr || !result) {
    if (promptErr)
      console.error(colors.red(promptErr.message))
    process.exit(1)
  }
  const data = {
    ...result,
    packageManager: getPackageManager(),
    docsDir: mode === Mode.create ? 'docs' : result.root.replace(/^\.\//, '').replace(/\/$/, ''),
  } as ResolvedData

  // `--no-install` 显式跳过依赖安装。
  // `--no-install` explicitly skips installing dependencies.
  if (options.install === false)
    data.install = false

  const progress = spinner()
  progress.start(t('spinner.start'))

  // Generate VuePress project files
  const [err, writeResult] = await attemptAsync(generate, mode, data, options)
  if (err) {
    progress.error(colors.red('generate files error: '))
    console.error(err)
    process.exit(1)
  }

  // Delay for some time, I/O may not be completed yet,
  // executing subsequent tasks at this point may cause issues.
  await sleep(200)

  const cwd = path.join(process.cwd(), data.root)

  // Init git
  if (data.git) {
    progress.message(t('spinner.git'))
    const [err] = await attemptAsync(() => spawn('git', ['init'], { cwd }))
    if (err) {
      progress.error(colors.red('git init error: '))
      console.error(err)
      process.exit(1)
    }
  }

  const pm = data.packageManager

  // Install dependencies
  if (data.install) {
    progress.message(t('spinner.install'))
    const [err] = await attemptAsync(() => spawn(pm, ['install'], { cwd }))
    if (err) {
      progress.error(colors.red('install dependencies error: '))
      console.error(err)
      process.exit(1)
    }
  }

  const cdCommand = mode === Mode.create ? colors.green(`cd ${data.root}`) : ''
  const runCommand = colors.green(`${pm} run docs:dev`)
  const installCommand = colors.green(`${pm} install`)

  progress.stop(t('spinner.stop'))

  // Summarize the existing files that were skipped, so the user is aware of
  // what was not overwritten and can re-run with `--force` if needed.
  // Printed after `progress.stop()`, otherwise the spinner would overwrite the list.
  if (writeResult?.skipped.length) {
    console.log(colors.yellow(`${t('hint.files.skipped')}\n${
      writeResult.skipped.map(file => `  - ${path.relative(process.cwd(), file)}`).join('\n')
    }`))
  }

  if (mode === Mode.create) {
    outro(`${t('spinner.command')}
      ${cdCommand}
      ${data.install ? '' : `${installCommand} && `}${runCommand}`)
  }
}
