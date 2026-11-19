import type { Markdown } from 'vuepress/markdown'
import type { MarkdownEnvPreset } from '../../shared/index.js'
import { isEmptyObject, objectMap } from '@pengzhanbo/utils'

/**
 * Environment preset plugin - Inject preset references to markdown env
 *
 * 环境预设插件 - 向 Markdown 环境注入预设引用
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 * @param env - Environment preset configuration / 环境预设配置
 */
export function envPresetPlugin(md: Markdown, env: MarkdownEnvPreset = {}): void {
  if (isEmptyObject(env))
    return

  const references = objectMap(env.references || {}, (key, value) => {
    return [md.utils.normalizeReference(key), value]
  })

  const defaultRender = md.render
  md.render = (source, env) => {
    env ??= {}
    env.references = {
      ...references,
      ...env.references,
    }
    return defaultRender(source, env)
  }

  const defaultRenderInline = md.renderInline
  md.renderInline = (source, env) => {
    env ??= {}
    env.references = {
      ...references,
      ...env.references,
    }
    return defaultRenderInline(source, env)
  }
}
