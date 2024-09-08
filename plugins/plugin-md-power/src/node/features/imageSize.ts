import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { isLinkExternal } from '@vuepress/helper'
import { fs, path } from '@vuepress/utils'
import imageSize from 'image-size'

export function imageSizePlugin(app: App, md: Markdown): void {
  if (!app.env.isBuild)
    return

  const cache = new Map<string, { width: number, height: number }>()

  const imageRule = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env: MarkdownEnv, self) => {
    if (!env.filePathRelative || !env.filePath)
      return imageRule(tokens, idx, options, env, self)

    const token = tokens[idx]
    const src = token.attrGet('src')

    if (!src || src.startsWith('data:') || isLinkExternal(src))
      return imageRule(tokens, idx, options, env, self)

    const width = token.attrGet('width')
    const height = token.attrGet('height')
    if (width && height)
      return imageRule(tokens, idx, options, env, self)

    const filepath = resolveImageUrl(src, env)

    if (!cache.has(filepath)) {
      if (!filepath || !fs.existsSync(filepath))
        return imageRule(tokens, idx, options, env, self)

      const { width: w, height: h } = imageSize(filepath)
      if (!w || !h)
        return imageRule(tokens, idx, options, env, self)
      cache.set(filepath, { width: w, height: h })
    }

    const { width: originalWidth, height: originalHeight } = cache.get(filepath)!

    const ratio = originalWidth / originalHeight

    if (width && !height) {
      const w = Number.parseInt(width, 10)
      token.attrSet('width', `${w}`)
      token.attrSet('height', `${Math.round(w / ratio)}`)
    }
    else if (height && !width) {
      const h = Number.parseInt(height, 10)
      token.attrSet('width', `${Math.round(h * ratio)}`)
      token.attrSet('height', `${h}`)
    }
    else {
      token.attrSet('width', `${originalWidth}`)
      token.attrSet('height', `${originalHeight}`)
    }

    return imageRule(tokens, idx, options, env, self)
  }

  function resolveImageUrl(src: string, env: MarkdownEnv): string {
    if (src[0] === '/')
      return app.dir.public(src.slice(1))

    if (env.filePathRelative)
      return app.dir.source(path.join(path.dirname(env.filePathRelative), src))

    if (env.filePath)
      return path.resolve(env.filePath, src)

    return ''
  }
}
