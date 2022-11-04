import type { Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import chokidar from 'chokidar'
import globToRegexp from 'glob-to-regexp'
import { preparedBlogData } from './prepareBlogData.js'
import type { BlogDataPluginOptions } from './index.js'

const __dirname = getDirname(import.meta.url)

export interface PluginOption
  extends Omit<BlogDataPluginOptions, 'include' | 'exclude'> {
  include: {
    (filepath: string): boolean
  }[]
  exclude: {
    (filepath: string): boolean
  }[]
}

const globOptions = {
  globstar: true,
  extended: true,
}

export const blogDataPlugin = ({
  include,
  exclude,
  ...pluginOptions
}: BlogDataPluginOptions = {}): Plugin => {
  const options: PluginOption = {
    include: toArray(include)
      .map((str) => globToRegexp(str, globOptions))
      .map((regexp) => (filepath: string) => regexp.test(filepath)),

    exclude: toArray(exclude)
      .map((str) => globToRegexp(str, globOptions))
      .map((regexp) => (filepath: string) => !regexp.test(filepath)),
    ...pluginOptions,
  }

  return {
    name: '@vuepress-plume/vuepress-plugin-blog-data',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    extendsPage(page) {
      if (
        page.filePathRelative &&
        options.exclude.every((filter) => filter(page.filePathRelative!)) &&
        options.include.some((filter) => filter(page.filePathRelative!))
      ) {
        ;(page.data as any).isBlogPost = true
      }
    },
    onPrepared: async (app) => await preparedBlogData(app, options),
    onWatched(app, watchers) {
      const watcher = chokidar.watch('pages/**/*', {
        cwd: app.dir.temp(),
        ignoreInitial: true,
      })

      watcher.on('add', async () => await preparedBlogData(app, options))
      watcher.on('change', async () => await preparedBlogData(app, options))
      watcher.on('unlink', async () => await preparedBlogData(app, options))

      watchers.push(watcher)
    },
  }
}

function toArray(likeArr: string | string[] | undefined): string[] {
  if (Array.isArray(likeArr)) return likeArr
  return likeArr ? [likeArr] : []
}
