
import { readTemplateList } from './readTpl'
import path from 'path'
import fs from 'fs'
import { upperCase, lowerCase, packageName } from './utils'
import { compile } from 'handlebars'
import type { ConfigOptions } from './getConfig'
import { writeFile } from './writeFile'
import chalk from 'chalk'
import ora from 'ora'
import execa from 'execa'

const packagesRoot = path.join(__dirname, '../../packages')
const spinner = ora()

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'))

const generatorFile = async (config: ConfigOptions): Promise<void> => {
  const templateList = readTemplateList(path.join(__dirname, './template'))

  const { name, client, shared } = config
  const pkgName = packageName(name)
  const targetDir = path.join(packagesRoot, pkgName)
  const data = {
    pkgName,
    upperName: upperCase(name),
    lowerName: lowerCase(name),
    client,
    shared,
    version: pkg.version,
  }
  const include = [!client && 'client', !shared && 'shared'].filter(Boolean).join('|')
  const filterRE = new RegExp(`/(${include})/`)
  const templates = templateList.filter(({ file }) => {
    return !filterRE.test(file)
  }).map(({ file, content }) => {
    return {
      file,
      template: compile(content)
    }
  })
  spinner.start(`${chalk.cyan(pkgName)} generating....`)
  templates.forEach(async ({ file, template }) => {
    try {
      const filepath = path.join(targetDir, file)
      await writeFile(filepath, template(data))
    } catch (e) {
      spinner.fail(`Failed to generate ${chalk.cyan(pkgName)}`)
      throw e
    }
  })
  spinner.succeed(`${chalk.cyan(pkgName)} generated !`)
}

const initPackage = async (config: ConfigOptions): Promise<void> => {
  const { name, client } = config
  const pkgName = packageName(name)
  const targetDir = path.join(packagesRoot, pkgName)
  const dependencies: string[] = [
    '@vuepress/core@next',
    '@vuepress/utils@next',
    '@vuepress/shared@next'
  ]
  client && dependencies.push('@vuepress/client@next')

  spinner.start(chalk.cyan('Installing...'))
  try {
    await execa('pnpm', ['add', ...dependencies], { cwd: targetDir })
    spinner.succeed('Installed.')
  } catch (e) {
    spinner.fail('Failed to Installed')
    throw e
  }
}

export const generator = async (config: ConfigOptions): Promise<void> => {
  await generatorFile(config)
  await initPackage(config)
}
