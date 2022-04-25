import fs from 'fs'
import path from 'path'
import { execa } from 'execa'
import ora from 'ora'
import chalk from 'chalk'

const packages = fs.readdirSync(new URL('../packages', import.meta.url))

const dependencies = packages.map(dir => {
  const dirname = new URL(path.join('../packages', dir), import.meta.url)
  const pkg = fs.readFileSync(path.join(dirname.pathname, 'package.json'))
  const { dependencies, devDependencies } = JSON.parse(pkg)
  return {
    dirname: dirname.pathname,
    dependencies: filterVuePress(Object.keys(dependencies || {})),
    devDependencies: filterVuePress(Object.keys(devDependencies || {}))
  }
})

function filterVuePress(dependencies) {
  const vuepress = dependencies.filter(
    dependence => dependence.startsWith('@vuepress/') || dependence.startsWith('vuepress-')
  ).map(dependence => dependence + '@next')
  const includes = ['vue', 'vue-router']
  const vue = dependencies.filter(
    dependence => includes.includes(dependence)
  )
  return [...vue, ...vuepress]
}

const options = []
dependencies.forEach(({ dirname, dependencies, devDependencies }) => {
  if (dependencies.length) {
    options.push(['yarn', ['add', ...dependencies], { cwd: dirname }])
  }
  if (devDependencies.length) {
    options.push(['yarn', ['add', '-D', ...devDependencies], { cwd: dirname }])
  }
})

async function install(index = 0) {
  if (index >= options.length) return
  const opt = options[index]
  console.log(chalk.cyan(opt[2].cwd.split('/').slice(-2).join('/')));
  console.log(chalk.gray(opt[0], opt[1].join(' ')));
  console.log('\n');
  const spinner = ora('installing').start()
  const current = execa(opt[0], opt[1], opt[2])
  current.stdout.pipe(process.stdout)
  try {
    await current;
    spinner.succeed()
    await install(index + 1)
  } catch(e) {
    spinner.fail()
    console.log(e)
  }
}

install()
