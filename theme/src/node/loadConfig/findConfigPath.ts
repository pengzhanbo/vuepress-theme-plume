import type { App } from 'vuepress'
import fs, { constants, promises as fsp } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { colors } from 'vuepress/utils'
import { logger } from '../utils/index.js'

const CONFIG_FILE_NAME = 'plume.config'
const extensions: string[] = ['ts', 'js', 'mjs', 'cjs', 'mts', 'cts']

export async function findConfigPath(app: App, configPath?: string): Promise<string | undefined> {
  const cwd = process.cwd()
  const source = app.dir.source('.vuepress')

  const paths: string[] = []

  if (configPath) {
    const path = resolve(cwd, configPath)
    if (existsSync(path) && (await fsp.stat(path)).isFile()) {
      return path
    }
  }
  extensions.forEach(ext =>
    paths.push(
      resolve(cwd, `${source}/${CONFIG_FILE_NAME}.${ext}`),
      resolve(cwd, `./${CONFIG_FILE_NAME}.${ext}`),
      resolve(cwd, `./.vuepress/${CONFIG_FILE_NAME}.${ext}`),
    ),
  )
  let current: string | undefined
  for (const path of paths) {
    if (existsSync(path) && (await fsp.stat(path)).isFile()) {
      current = path
      break
    }
  }
  if (configPath && current) {
    logger.warn(`Can not find config file: ${colors.gray(configPath)}\nUse config file: ${colors.gray(current)}`)
  }
  return current
}

function existsSync(fp: string) {
  try {
    fs.accessSync(fp, constants.R_OK)
    return true
  }
  catch {
    return false
  }
}
