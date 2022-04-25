import chalk from 'chalk'
import inquirer from 'inquirer'
import inc from 'semver/functions/inc.js'
import { getNpmTags, getVersion, versions } from './version.mjs'
import { execa } from 'execa'
import ora from 'ora'
import fs from 'fs'
import path from 'path'

const { green, red } = chalk
const { prompt } = inquirer

const lerna = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lerna.json')))
const { version: currentVersion } = lerna

export const release = async () => {
  const buildSpinner = ora('Building project').start()
  await execa('yarn', ['run', 'lint'])
  await execa('yarn', ['run', 'build'])

  buildSpinner.succeed()

  ora(`Current version: ${green(currentVersion)}`).info()

  const bumps = [
    'prerelease',
    'patch',
    'minor',
    'major',
    'premajor',
  ]

  bumps.forEach((bump) => {
    versions[bump] = inc(currentVersion, bump)
  })

  const bumpChoices = bumps.map((bump) => ({
    name: `${bump} (${versions[bump]})`,
    value: bump,
  }))

  const { bump, customVersion, npmTag } = await prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [...bumpChoices, { name: 'custom', value: 'custom' }],
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: (answers) => answers.bump === 'custom',
    },
    {
      name: 'npmTag',
      message: 'Input npm tag:',
      type: 'list',
      default: answers => getNpmTags(getVersion(answers))[0],
      choices: answers => getNpmTags(getVersion(answers)),
    },
  ])

  const version = customVersion || versions[bump]

  const { confirm } = await prompt([
    {
      name: 'confirm',
      message: `Confirm releasing ${version} (${npmTag})?`,
      type: 'list',
      choices: ['N', 'Y'],
    },
  ])

  if (confirm === 'N') {
    ora(red('Release canceled.')).fail()

    return
  }

  const releaseArguments = [
    'publish',
    version,
    '--dist-tag',
    npmTag,
    '--registry',
    'https://registry.npmjs.org/',
  ]

  await execa(require.resolve('lerna/cli'), releaseArguments, {
    stdio: 'inherit',
  })

  const npmmirrorSpinner = ora('Syncing npmmirror.com').start()

  await sync()

  npmmirrorSpinner.succeed()

  ora('Release complete').succeed()
}
