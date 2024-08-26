import { execaCommandSync } from 'execa'
import type { PackageManager } from '../types.js'

function checkPnpmInstalled(): boolean {
  try {
    return execaCommandSync('pnpm --version', { stdio: 'ignore' }).exitCode === 0
  }
  catch {
    return false
  }
}

function checkYarnInstalled(): boolean {
  try {
    return execaCommandSync('yarn --version', { stdio: 'ignore' }).exitCode === 0
  }
  catch {
    return false
  }
}

const packageManagerList: PackageManager[] = ['npm']

if (checkPnpmInstalled())
  packageManagerList.unshift('pnpm')
if (checkYarnInstalled())
  packageManagerList.unshift('yarn')

export { packageManagerList }
