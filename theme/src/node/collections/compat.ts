import type { ThemeDocCollection, ThemeOptions } from '../../shared'
import { path } from 'vuepress/utils'

/**
 * 兼容旧的 blog 、 notes 配置，将它们转换为 collections
 */
export function compatBlogAndNotesToCollections(options: ThemeOptions): void {
  // 已存在 collections，直接删除旧的 blog 、 notes 配置，不做兼容
  if (!options.collections?.length) {
    const collections = (options.collections ||= [])

    if (options.blog) {
      collections.push({ type: 'post', dir: '/blog/', linkPrefix: options.article, ...options.blog as any })
    }

    if (options.notes) {
      const { dir, link, notes } = options.notes as any
      collections.push(...notes.map(note => ({
        type: 'doc',
        dir: path.join(dir, note.dir),
        linkPrefix: path.join(link, note.link),
        sidebar: note.sidebar,
        sidebarScrollbar: options.sidebarScrollbar,
      }) as ThemeDocCollection))
    }
  }

  for (const [, opt] of Object.entries(options.locales || {})) {
    if (!opt.collections?.length) {
      const collections = (opt.collections ||= [])
      if (options.blog) {
        collections.push({ type: 'post', dir: '/blog/', linkPrefix: options.article, ...options.blog as any })
      }
      if (opt.notes) {
        const { dir, link, notes } = opt.notes as any
        collections.push(...notes.map(note => ({
          type: 'doc',
          dir: path.join(dir, note.dir),
          linkPrefix: path.join(link, note.link),
          sidebar: note.sidebar,
          sidebarScrollbar: opt.sidebarScrollbar ?? options.sidebarScrollbar,
        }) as ThemeDocCollection))
      }
    }

    delete opt.notes
  }

  delete options.blog
  delete options.notes
}
