import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export const resolvePath = (...args: string[]): string => {
  return path.resolve(__dirname, '../../', ...args)
}

export const resolveClient = (...args: string[]): string => {
  return resolvePath('client', ...args)
}

export const resolveTemplate = (...args: string[]): string => {
  return resolvePath('../', 'template', ...args)
}
