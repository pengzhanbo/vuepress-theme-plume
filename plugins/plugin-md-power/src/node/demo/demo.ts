import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoContainerRender, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import container from 'markdown-it-container'
import { createEmbedRuleBlock } from '../embed/createEmbedRuleBlock.js'
import { logger } from '../utils/logger.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { markdownContainerRender, markdownEmbed } from './markdown.js'
import { normalContainerRender, normalEmbed } from './normal.js'
import { normalizeAlias } from './supports/alias.js'
import { vueContainerRender, vueEmbed } from './vue.js'

const embedMap: Record<
  DemoMeta['type'],
  (app: App, md: Markdown, env: MarkdownDemoEnv, meta: DemoMeta) => string
> = {
  vue: vueEmbed,
  normal: normalEmbed,
  markdown: markdownEmbed,
}

/**
 * 嵌入语法
 * @[demo type info](url)
 */
export function demoEmbed(app: App, md: Markdown): void {
  createEmbedRuleBlock<DemoMeta>(md, {
    type: 'demo',
    meta: (info, url) => {
      const { vue, normal, markdown, ...attrs } = resolveAttrs(info)
      const type = vue ? 'vue' : markdown ? 'markdown' : 'normal'
      return { type, url, ...attrs }
    },
    content: (meta, env: MarkdownDemoEnv) => {
      const { url, type } = meta
      if (!url) {
        logger.warn(`demo-${type}`, `filepath is empty`)
        return `<p style="color:red;">@[demo ${type}] filepath is empty</p>`
      }

      if (embedMap[type]) {
        return embedMap[type](app, md, env, meta)
      }

      logger.warn(`demo-${type}`, `Invalid Demo Type: ${type}`)
      return `<p style="color:red;">@[demo ${type}](${url}) Invalid Demo Type</p>`
    },
  })
}

const INFO_RE = /(vue|normal|markdown)?\s?(.*)/
const renderMap: Record<string, DemoContainerRender> = {
  vue: vueContainerRender,
  normal: normalContainerRender,
  markdown: markdownContainerRender,
}

export function demoContainer(app: App, md: Markdown): void {
  let currentRender: DemoContainerRender | undefined
  const render: RenderRule = (
    tokens: Token[],
    index: number,
    _,
    env: MarkdownDemoEnv,
  ): string => {
    const token = tokens[index]

    if (token.nesting === 1) {
      const meta = getContainerMeta(token.info)
      meta.url = `${index}`
      currentRender = renderMap[meta.type]
      return currentRender?.before(
        app,
        md,
        env,
        meta,
        parseCodeMapping(tokens, index, currentRender.token),
      ) || ''
    }
    else {
      const res = currentRender?.after() || ''
      currentRender = undefined
      return res
    }
  }

  md.use(container, 'demo', { render })
}

function parseCodeMapping(
  tokens: Token[],
  index: number,
  cb?: (token: Token, tokens: Token[], index: number) => void,
) {
  const codeMap: Record<string, string> = {}
  for (
    let i = index + 1;
    !(tokens[i].nesting === -1
      && tokens[i].type === 'container_demo_close');
    ++i
  ) {
    const token = tokens[i]
    if (token.type === 'fence') {
      codeMap[normalizeAlias(token.info)] = token.content.trim()
      cb?.(token, tokens, i)
    }
  }
  return codeMap
}

function getContainerMeta(info: string): DemoMeta {
  const [, type, raw] = (info.trim().slice(4).trim() || '').match(INFO_RE) || []
  const attrs = resolveAttrs(raw)
  return {
    url: '',
    type: (type || 'normal') as DemoMeta['type'],
    ...attrs,
  }
}
