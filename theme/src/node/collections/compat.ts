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
          // `notes.notes` 可能未配置（只配了 `blog`），`toArray` 会归一化为空数组，
          // 避免展开 `undefined` 直接抛出 TypeError。
          ...toArray(notes.notes).map(note => removeLeadingSlash(path.join(notes.dir, note.dir))),
        ],
      })
    }

    if (options.notes) {
      const { dir, link, notes } = options.notes as any
      collections.push(...toArray(notes).map(note => ({
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
        // 与根级配置保持一致：该语言环境可能没有配置 `notes`。
        const notes = opt.notes as any
        collections.push({
          type: 'post',
          dir: '/',
          linkPrefix: options.article,
          ...options.blog as any,
          exclude: [
            ...toArray((options.blog as any).exclude),
            ...toArray(notes?.notes).map(note => removeLeadingSlash(path.join(notes?.dir, note.dir))),
          ],
        })
      }
      if (opt.notes) {
        const { dir, link, notes } = opt.notes as any
        collections.push(...toArray(notes).map(note => ({
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
