import type { ThemeDocCollection, ThemeOptions } from '../../shared/index.js'
import { deleteKey, toArray } from '@pengzhanbo/utils'
import { removeLeadingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'

/**
 * 兼容旧的 blog 、 notes 配置，将它们转换为 collections
 */
export function compatBlogAndNotesToCollections(options: ThemeOptions): void {
  // 已存在 collections，直接删除旧的 blog 、 notes 配置，不做兼容
  if (!options.collections?.length) {
    const collections = (options.collections ||= [])

    if (options.blog) {
      const notes = (options.notes || {}) as any
      collections.push({
        type: 'post',
        dir: '/',
        linkPrefix: options.article,
        ...options.blog as any,
        exclude: [
          ...toArray((options.blog as any).exclude),
          ...notes.notes?.map(note => removeLeadingSlash(path.join(notes.dir, note.dir))),
        ],
      })
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
        const notes = opt.notes as any
        collections.push({
          type: 'post',
          dir: '/',
          linkPrefix: options.article,
          ...options.blog as any,
          exclude: [
            ...toArray((options.blog as any).exclude),
            ...notes.notes?.map(note => removeLeadingSlash(path.join(notes.dir, note.dir))),
          ],
        })
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
    deleteKey(opt, 'notes')
  }

  deleteKey(options, ['blog', 'notes'])
}
