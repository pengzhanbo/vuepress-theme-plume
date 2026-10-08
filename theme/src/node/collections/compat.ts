import type { ThemeCollectionItem, ThemeDocCollection, ThemeLocaleData, ThemeOptions } from '../../shared/index.js'
import { deleteKey, toArray } from '@pengzhanbo/utils'
import { removeLeadingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'

/**
 * 兼容旧的 blog 、 notes 配置，将它们转换为 collections
 *
 * 根级 legacy 配置在所有缺少自身 collections 的语言环境中生效；
 * 语言环境自身声明的 blog / notes 优先于根级配置（`blog: false` 表示禁用）。
 *
 * `rawLocales` 必须是**用户原始声明**的多语言配置，而不是 `initThemeOptions` 合并
 * 根级选项之后的结果。合并后的语言环境会带上从根级继承的 `collections`，
 * 无法据此判断该语言环境是否真的已经迁移过，从而会把语言环境自身的 legacy
 * 配置当作"已被 collections 取代"而静默丢弃。
 */
export function compatBlogAndNotesToCollections(
  options: ThemeOptions,
  rawLocales: Record<string, ThemeLocaleData> = options.locales ?? {},
): void {
  // 根级 legacy 配置需要在清理前取出，供语言环境回退使用。
  const rootBlog = options.blog as any
  const rootNotes = options.notes as any
  const rootArticle = options.article
  const rootSidebarScrollbar = options.sidebarScrollbar

  // 已存在 collections 时，根级 legacy 配置按约定被忽略。此时它也不应再作用于语言环境，
  // 否则会出现"根级已忽略、语言环境仍生效"的不一致行为。
  const rootLegacyMigrated = !options.collections?.length

  if (rootLegacyMigrated) {
    const collections = (options.collections ||= [])
    if (rootBlog)
      collections.push(createPostCollection(rootBlog, rootArticle, rootNotes))
    if (rootNotes)
      collections.push(...createDocCollections(rootNotes, rootSidebarScrollbar))
  }

  deleteKey(options, ['blog', 'notes'])

  for (const [locale, opt] of Object.entries(options.locales || {})) {
    const raw = rawLocales[locale] as any

    // 只有该语言环境自身声明了 collections，才意味着它已经完成迁移，
    // 其 legacy 配置才按约定被忽略。
    if (raw?.collections?.length) {
      deleteKey(opt, ['notes', 'blog'] as any)
      continue
    }

    // 语言环境自身声明的 blog / notes 优先；未声明时回退到根级 legacy 配置
    // （旧的 `blog` / `notes` 是全局配置，在所有语言环境中共享）。
    const blog = raw?.blog ?? (rootLegacyMigrated ? rootBlog : undefined)
    const notes = raw?.notes ?? (rootLegacyMigrated ? rootNotes : undefined)

    const migrated: ThemeCollectionItem[] = []
    if (blog)
      migrated.push(createPostCollection(blog, raw?.article ?? rootArticle, notes))
    if (notes)
      migrated.push(...createDocCollections(notes, opt.sidebarScrollbar ?? rootSidebarScrollbar))

    // 语言环境可能是"继承"根级 collections 而非自身声明，此时要在继承的集合之上
    // **追加**迁移结果，直接替换会丢失根级集合。
    if (migrated.length)
      opt.collections = [...(opt.collections || []), ...migrated]

    deleteKey(opt, 'notes')
  }
}

/**
 * 由旧的 `blog` 配置生成 post 集合。
 *
 * `notes` 用于把笔记目录追加到 `exclude`，避免笔记文章被博客列表收录。
 */
function createPostCollection(blog: any, linkPrefix: string | undefined, notes: any): ThemeCollectionItem {
  return {
    type: 'post',
    dir: '/',
    linkPrefix,
    ...blog,
    exclude: [
      ...toArray(blog.exclude),
      // `notes.notes` 可能未配置（只配了 `blog`），`toArray` 会归一化为空数组，
      // 避免展开 `undefined` 直接抛出 TypeError。
      ...toArray(notes?.notes).map((note: any) => removeLeadingSlash(path.join(notes?.dir, note.dir))),
    ],
  } as ThemeCollectionItem
}

/**
 * 由旧的 `notes` 配置生成 doc 集合。
 */
function createDocCollections(notes: any, sidebarScrollbar: boolean | undefined): ThemeDocCollection[] {
  const { dir, link, notes: list } = notes
  return toArray(list).map(note => ({
    type: 'doc',
    dir: path.join(dir, note.dir),
    linkPrefix: path.join(link, note.link),
    sidebar: note.sidebar,
    sidebarScrollbar,
  }) as ThemeDocCollection)
}
