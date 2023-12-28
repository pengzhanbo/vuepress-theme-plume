import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export function getPackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch { }
  return pkg
}

const RE_SLASH = /\\+/g
export function normalizePath(dir: string) {
  return dir.replace(RE_SLASH, '/')
}

export function pathJoin(...args: string[]) {
  return normalizePath(path.join(...args))
}

const RE_START_END_SLASH = /^\/|\/$/g
export function getCurrentDirname(basePath: string | undefined, filepath: string) {
  const dirList = normalizePath(basePath || path.dirname(filepath))
    .replace(RE_START_END_SLASH, '')
    .split('/')
  return dirList.length > 0 ? dirList[dirList.length - 1] : ''
}
