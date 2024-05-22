import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import type { CopyCodeOptions } from '../types.js'
import { createCopyCodeButtonRender } from './createCopyCodeButtonRender.js'

/**
 * This plugin should work after `preWrapperPlugin`,
 * and if `preWrapper` is disabled, this plugin should not be called either.
 */
export function copyCodeButtonPlugin(md: Markdown, app: App, options?: boolean | CopyCodeOptions): void {
  const render = createCopyCodeButtonRender(app, options)

  if (!render)
    return

  const fence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [, , , env] = args

    const result = fence(...args)
    const { filePathRelative } = env as MarkdownEnv
    // resolve copy code button
    const copyCodeButton = render(filePathRelative ?? '')

    return result.replace('><pre', `>${copyCodeButton}<pre`)
  }
}
