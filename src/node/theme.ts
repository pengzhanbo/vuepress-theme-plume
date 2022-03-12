import type { Theme, ThemeConfig } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import { createBlogPage } from './createBlogPage'
import { extendsPage } from './extendsPage'
import { globFormatFrontmatter, watchNewMarkdown } from './formatFrontmatter'
import { preparedPostIndex, watchPostIndex } from './preparedPostIndex'
import { resolveActiveHeaderLinksPluginOptions } from './utils'

export interface BlogThemeOption extends ThemeConfig {
  a?: string
}

export const blogTheme: Theme<BlogThemeOption> = (
  { themePlugins = {}, ...localeOptions },
  app
) => {
  if (app.options.bundler.endsWith('vite')) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    app.options.bundlerConfig.viteOptions = require('vite').mergeConfig(
      app.options.bundlerConfig.viteOptions,
      {
        css: {
          postcss: {
            plugins: [
              // require('postcss-simple-vars'),
              require('postcss-each'),
              require('postcss-import')({
                plugins: [
                  require('postcss-at-rules-variables'),
                  require('postcss-import'),
                ],
              }),
              require('tailwindcss/nesting'),
              require('tailwindcss')(
                path.resolve(__dirname, '../../tailwind.config.js')
              ),
              require('postcss-preset-env')({
                stage: 0,
                features: {
                  'nesting-rules': false,
                  'custom-media-queries': true,
                },
              }),
              require('autoprefixer'),
            ],
          },
        },
      }
    )
  }
  globFormatFrontmatter(app.options.source)
  return {
    name: '@pengzhanbo/vuepress-theme-blog',
    templateBuild: path.resolve(__dirname, '../template/index.build.html'),
    layouts: path.resolve(__dirname, '../client/layouts'),
    clientAppEnhanceFiles: path.resolve(
      __dirname,
      '../client/clientAppEnhanceFiles.js'
    ),
    clientAppSetupFiles: path.resolve(__dirname, '../client/clientAppSetup.js'),
    // use alias to make all components replaceable
    alias: Object.fromEntries(
      fs
        .readdirSync(path.resolve(__dirname, '../client/component'))
        .filter((file) => file.endsWith('.vue'))
        .map((file) => [
          `@theme/${file}`,
          path.resolve(__dirname, '../client/component', file),
        ])
    ),
    onInitialized: async (app) => {
      await createBlogPage(app)
    },
    onPrepared: (app) => {
      preparedPostIndex(app)
    },
    onWatched: (app, watchers) => {
      watchPostIndex(app, watchers)
      watchNewMarkdown(app, watchers)
    },
    extendsPage,
    plugins: [
      [
        '@vuepress/active-header-links',
        resolveActiveHeaderLinksPluginOptions(themePlugins),
      ],
      ['@vuepress/prismjs', themePlugins.prismjs !== false],
      ['@vuepress/nprogress', themePlugins.nprogress !== false],
      [
        '@vuepress/medium-zoom',
        {
          selector: '.post-content > img, .post-content :not(a) > img',
          zoomOptions: {},
          // should greater than page transition duration
          delay: 300,
        },
      ],
      ['@vuepress/theme-data', { themeData: localeOptions }],
    ],
  }
}
