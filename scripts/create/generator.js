import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import handlebars from 'handlebars'
import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import { readTemplateList } from './readTpl.js'
import { lowerCase, packageName, upperCase } from './utils.js'
import { writeFile } from './writeFile.js'

const compile = handlebars.compile

const _dirname
  = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const packagesRoot = path.join(_dirname, '../../packages')
const spinner = ora()

const pkg = JSON.parse(
  fs.readFileSync(path.join(_dirname, '../../package.json'), 'utf-8'),
)

async function generatorFile(config) {
  const templateList = readTemplateList(path.join(_dirname, './template'))

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
  const include = [
    !client && 'client',
    !shared && 'shared',
    !shared && 'client/index.js',
  ]
    .filter(Boolean)
    .join('|')
  const filterRE = new RegExp(`/(${include})/`)
  const templates = templateList
    .filter(({ file }) => {
      return !filterRE.test(file)
    })
    .map(({ file, content }) => {
      return {
        file,
        template: compile(content),
      }
    })
  spinner.start(`${chalk.cyan(pkgName)} generating....`)
  templates.forEach(async ({ file, template }) => {
    try {
      const filepath = path.join(targetDir, file)
      await writeFile(filepath, template(data))
    }
    catch (e) {
      spinner.fail(`Failed to generate ${chalk.cyan(pkgName)}`)
      throw e
    }
  })
  spinner.succeed(`${chalk.cyan(pkgName)} generated !`)
}

async function initPackage(config) {
  const { name, client } = config
  const pkgName = packageName(name)
  const targetDir = path.join(packagesRoot, pkgName)
  const dependencies = [
    '@vuepress/core@next',
    '@vuepress/utils@next',
    '@vuepress/shared@next',
  ]
  client && dependencies.push('@vuepress/client@next')

  spinner.start(chalk.cyan('Installing...'))
  try {
    await execa('pnpm', ['add', ...dependencies], { cwd: targetDir })
    spinner.succeed('Installed.')
  }
  catch (e) {
    spinner.fail('Failed to Installed')
    throw e
  }
}

export async function generator(config) {
  await generatorFile(config)
  await initPackage(config)
}
