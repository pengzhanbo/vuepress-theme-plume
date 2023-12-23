import type { Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { CopyCodeOptions } from '../shared/index.js'

const __dirname = getDirname(import.meta.url)

const defaultOptions: CopyCodeOptions = {
  selector: '.theme-default-content div[class*="language-"] pre',
  duration: 1500,
  delay: 500,
  showInMobile: false,
}


export const copyCodePlugin = (options: CopyCodeOptions): Plugin => {

  options = Object.assign({}, defaultOptions, options)

  return {
    name: '@vuepress-plume/plugin-copy-code',

    define: (): Record<string, unknown> => ({
      __COPY_CODE_OPTIONS__: options,
    }),

    clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
  }
}
