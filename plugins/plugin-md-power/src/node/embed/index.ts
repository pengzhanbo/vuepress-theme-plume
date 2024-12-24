import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { audioReaderPlugin } from './audio/reader.js'
import { caniusePlugin, legacyCaniuse } from './caniuse.js'
import { codepenPlugin } from './code/codepen.js'
import { codeSandboxPlugin } from './code/codeSandbox.js'
import { jsfiddlePlugin } from './code/jsfiddle.js'
import { replitPlugin } from './code/replit.js'
import { pdfPlugin } from './pdf.js'
import { artPlayerPlugin } from './video/artPlayer.js'
import { bilibiliPlugin } from './video/bilibili.js'
import { youtubePlugin } from './video/youtube.js'

export function embedSyntaxPlugin(md: Markdown, options: MarkdownPowerPluginOptions) {
  if (options.caniuse) {
    const caniuse = options.caniuse === true ? {} : options.caniuse
    // @[caniuse](feature_name)
    md.use(caniusePlugin, caniuse)
    // 兼容旧语法
    legacyCaniuse(md, caniuse)
  }

  if (options.pdf) {
    // @[pdf](url)
    md.use(pdfPlugin)
  }

  if (options.bilibili) {
    // @[bilibili](bvid aid cid)
    md.use(bilibiliPlugin)
  }

  if (options.youtube) {
    // @[youtube](id)
    md.use(youtubePlugin)
  }

  if (options.artPlayer) {
    // @[artPlayer](url)
    md.use(artPlayerPlugin)
  }

  if (options.audioReader) {
    // @[audioReader](url)
    md.use(audioReaderPlugin)
  }

  if (options.codepen) {
    // @[codepen](user/slash)
    md.use(codepenPlugin)
  }

  if (options.replit) {
    // @[replit](user/repl-name)
    md.use(replitPlugin)
  }

  if (options.codeSandbox) {
    // @[codesandbox](id)
    md.use(codeSandboxPlugin)
  }

  if (options.jsfiddle) {
    // @[jsfiddle](user/id)
    md.use(jsfiddlePlugin)
  }
}
