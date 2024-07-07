import process from 'node:process'
import { fs, path } from 'vuepress/utils'
import { resolve } from './path.js'

export function getPackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch { }
  return pkg
}

export function getThemePackage() {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(resolve('.../../package.json'), 'utf-8')
    pkg = JSON.parse(content)
  }
  catch {}
  return pkg
}
