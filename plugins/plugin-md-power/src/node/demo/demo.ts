import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress'
import type { Markdown } from 'vuepress/markdown'
import type { DemoContainerRender, DemoMeta, MarkdownDemoEnv } from '../../shared/demo.js'
import container from 'markdown-it-container'
import { createEmbedRuleBlock } from '../embed/createEmbedRuleBlock.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { markdownContainerRender, markdownEmbed } from './markdown.js'
import { normalContainerRender, normalEmbed } from './normal.js'
import { normalizeAlias } from './supports/alias.js'
import { vueContainerRender, vueEmbed } from './vue.js'

export function demoEmbed(app: App, md: Markdown): void {
  createEmbedRuleBlock<DemoMeta>(md, {
    type: 'demo',
    syntaxPattern: /^@\[demo(?:\s(vue|normal|markdown))?\s?(.*)\]\((.*)\)/,
    meta: ([, type, info, url]) => ({
      type: (type || 'normal') as DemoMeta['type'],
      url,
      ...resolveAttrs(info).attrs,
    }),
    content: (meta, content, env: MarkdownDemoEnv) => {
      const { url, type } = meta
      if (!url) {
        console.warn('[vuepress-plugin-md-power] Invalid demo url: ', url)
        return content
      }
      if (type === 'vue') {
        return vueEmbed(app, md, env, meta)
      }

      if (type === 'normal') {
        return normalEmbed(app, md, env, meta)
      }

      if (type === 'markdown') {
        return markdownEmbed(app, md, env, meta)
      }

      return content
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
  const { attrs } = resolveAttrs(raw)
  return {
    url: '',
    type: (type || 'normal') as DemoMeta['type'],
    ...attrs,
  }
}
