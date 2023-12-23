import type { Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { CopyCodeLocaleOption, CopyCodeOptions } from '../shared/index.js'

const __dirname = getDirname(import.meta.url)

const defaultOptions: CopyCodeOptions = {
  selector: '.theme-default-content div[class*="language-"] pre',
  duration: 1500,
  delay: 500,
  showInMobile: false,
}

const defaultLocalesOption: CopyCodeLocaleOption = {
  '/zh/': {
    hint: '复制成功',
    copy: '复制代码',
  },
  '/en/': {
    hint: 'Copied successfully',
    copy: 'Copy code',
  },
}

export const copyCodePlugin = (options: CopyCodeOptions): Plugin => {
  const locales = options.locales || {}
  delete options.locales

  options = Object.assign({}, defaultOptions, options)
  const localesOption = Object.assign({}, defaultLocalesOption, locales)

  return {
    name: '@vuepress-plume/plugin-copy-code',

    define: (): Record<string, unknown> => ({
      __COPY_CODE_OPTIONS__: options,
      __COPY_CODE_LOCALES_OPTIONS__: localesOption,
    }),

    clientConfigFile: path.resolve(__dirname, '../client/clientConfig.js'),
  }
}
