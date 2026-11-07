import type { AutoFrontmatterData } from '../../shared/index.js'
import type { MarkdownInfo } from '../features/markdown-source.js'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `genAutoFrontmatterRules` reads the `getThemeOptions()` singleton and the node utils
 * barrel (deterministic `nanoid`, no pinyin). `generateMarkdownFrontmatter` is the
 * `write` hook of the markdown source: it receives the parsed markdown info and mutates
 * its frontmatter data. Both are stubbed so the generated rule handlers can be driven
 * without touching the real file system.
 *
 * `genAutoFrontmatterRules` 从 `getThemeOptions()` 单例与 node utils barrel 读取
 * （确定性的 `nanoid`、不启用拼音）。`generateMarkdownFrontmatter` 是 markdown source
 * 的 `write` 钩子：接收解析后的 markdown 信息并改写其中的 frontmatter 数据。
 * 这里将两者桩化，从而在不需要真实文件系统的情况下直接驱动生成的规则处理器。
 */
const hoisted = vi.hoisted(() => ({
  themeConfig: {} as any,
  seq: 0,
}))

vi.mock('../options.js', () => ({
  getThemeOptions: () => hoisted.themeConfig,
}))

vi.mock('../utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  nanoid: () => `id${++hoisted.seq}`,
  getPinyin: async () => null,
  hasPinyin: false,
}))

const { genAutoFrontmatterRules } = await import('../features/autoFrontmatter/rules.js')
const { generateMarkdownFrontmatter } = await import('../features/autoFrontmatter/generate.js')

const TIME_RE = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/

beforeEach(() => {
  hoisted.themeConfig = {}
  hoisted.seq = 0
})

function markdownInfo(
  relativePath: string,
  data: AutoFrontmatterData = {} as AutoFrontmatterData,
): MarkdownInfo {
  return {
    filepath: path.join('/abs', relativePath),
    relativePath,
    raw: '',
    content: '',
    data,
    eol: '\n',
  }
}

/** Run the `write` hook on a fake file and return the generated frontmatter. */
async function generate(
  file: string,
  data: AutoFrontmatterData = {} as AutoFrontmatterData,
): Promise<AutoFrontmatterData> {
  const info = markdownInfo(file, data)
  await generateMarkdownFrontmatter(info)
  return info.data as AutoFrontmatterData
}

describe('generateWithPost', () => {
  beforeEach(() => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [
            { type: 'post', dir: 'blog', title: 'Blog', linkPrefix: '/blog/' },
          ],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()
  })

  it('derives the title, createTime and filepath permalink', async () => {
    const data = await generate('blog/01.Post.md')

    expect(data.title).toBe('Post')
    expect(data.createTime).toMatch(TIME_RE)
    expect(data.permalink).toBe('/blog/post/')
  })

  it('uses the collection title for the README of a post collection', async () => {
    const data = await generate('blog/README.md')

    expect(data.title).toBe('Blog')
    expect(data.permalink).toBe('/blog/readme/')
  })

  it('keeps the frontmatter that already exists', async () => {
    const data = await generate('blog/Post.md', {
      title: 'Custom',
      createTime: '2020/01/01 00:00:00',
      permalink: '/custom/',
    })

    expect(data).toEqual({
      title: 'Custom',
      createTime: '2020/01/01 00:00:00',
      permalink: '/custom/',
    })
  })

  it('generates a random permalink when configured with `true`', async () => {
    hoisted.themeConfig.autoFrontmatter = { permalink: true }
    genAutoFrontmatterRules()

    const data = await generate('blog/Post.md')

    expect(data.permalink).toBe('/blog/id1/')
  })

  it('skips the permalink when it is disabled', async () => {
    hoisted.themeConfig.autoFrontmatter = { permalink: false }
    genAutoFrontmatterRules()

    const data = await generate('blog/Post.md')

    expect(data.permalink).toBeUndefined()
    expect(data.title).toBe('Post')
  })

  it('applies the collection transform to the generated data', async () => {
    hoisted.themeConfig.locales['/'].collections[0].autoFrontmatter = {
      transform: (data: AutoFrontmatterData) => ({ ...data, extra: true }),
    }
    genAutoFrontmatterRules()

    const data = await generate('blog/Post.md')

    expect(data.extra).toBe(true)
  })

  // Note: `generateWithPost` re-checks `(collection.autoFrontmatter ?? fm) === false`, but
  // rules with that flag are already skipped during generation, so the early return is
  // unreachable through the public API.
  // 说明：`generateWithPost` 会再次判断 `(collection.autoFrontmatter ?? fm) === false`，
  // 但该标记的规则在生成阶段就被跳过，因此这个提前返回无法通过公开 API 触达。
})

describe('generateWithDoc', () => {
  it('builds the permalink from the collection link prefix without a sidebar', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{ type: 'doc', dir: 'guide', title: 'Guide', linkPrefix: '/guide/' }],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    const data = await generate('guide/basics/b.md')

    expect(data.permalink).toBe('/guide/basics/b/')
  })

  it('uses the sidebar link of the parent directory', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{
            type: 'doc',
            dir: 'guide',
            title: 'Guide',
            linkPrefix: '/guide/',
            sidebar: [{ dir: 'basics', link: '/basics/', items: ['a'] }],
          }],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    expect((await generate('guide/basics/b.md')).permalink).toBe('/guide/basics/b/')
  })

  it('drops the trailing segment for a readme inside a sidebar directory', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{
            type: 'doc',
            dir: 'guide',
            title: 'Guide',
            linkPrefix: '/guide/',
            sidebar: [{ dir: 'basics', link: '/basics/', items: ['a'] }],
          }],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    expect((await generate('guide/basics/index.md')).permalink).toBe('/guide/basics/')
  })

  it('falls back to the root link when the directory is not in the sidebar', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{
            type: 'doc',
            dir: 'guide',
            title: 'Guide',
            linkPrefix: '/guide/',
            sidebar: [{ dir: 'other', link: '/other/', items: ['a'] }],
          }],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    expect((await generate('guide/basics/b.md')).permalink).toBe('/guide/basics/b/')
  })

  it('uses the collection link prefix for a doc collection README', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{ type: 'doc', dir: 'guide', title: 'Guide', linkPrefix: '/guide/' }],
        },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    const data = await generate('guide/README.md')

    expect(data.permalink).toBe('/guide/')
    expect(data.title).toBe('Guide')
  })
})

describe('generateWithRemain', () => {
  beforeEach(() => {
    hoisted.themeConfig = {
      locales: {
        '/': { collections: [{ type: 'doc', dir: 'blog', title: 'Blog' }] },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()
  })

  it('generates frontmatter for files outside any collection', async () => {
    const data = await generate('about.md')

    // 标题取自文件名（保留原始大小写）。
    expect(data.title).toBe('about')
    expect(data.createTime).toMatch(TIME_RE)
    expect(data.permalink).toBe('/about/')
  })

  it('turns the root README into a home page without permalink or createTime', async () => {
    const data = await generate('README.md')

    expect(data.pageLayout).toBe('home')
    expect(data.title).toBe('Home')
    expect(data.createTime).toBeUndefined()
    expect(data.permalink).toBeUndefined()
  })

  it('applies the global transform to the remaining files', async () => {
    hoisted.themeConfig.autoFrontmatter = {
      permalink: 'filepath',
      transform: (data: AutoFrontmatterData) => ({ ...data, transformed: true }),
    }
    genAutoFrontmatterRules()

    expect((await generate('about.md')).transformed).toBe(true)
  })

  it('handles remaining files of a non-root locale', async () => {
    hoisted.themeConfig = {
      locales: {
        '/': { collections: [{ type: 'doc', dir: 'blog', title: 'Blog' }] },
        '/en/': { collections: [{ type: 'doc', dir: 'docs', title: 'Docs' }] },
      },
      autoFrontmatter: { permalink: 'filepath' },
    }
    genAutoFrontmatterRules()

    const data = await generate('en/other.md')

    // 非根语言未归属集合的文件命中该语言的兜底规则。
    expect(data.title).toBe('other')
    expect(data.permalink).toBe('/en/other/')
  })

  it('leaves the data untouched when autoFrontmatter is disabled globally', async () => {
    hoisted.themeConfig.autoFrontmatter = false
    genAutoFrontmatterRules()

    // 全局关闭时，兜底规则直接返回原始数据。
    await expect(generate('about.md')).resolves.toEqual({})
  })

  it('leaves the data untouched when no rule matches the file', async () => {
    // `node_modules` 被所有规则排除，因此没有任何处理器生效。
    await expect(generate('node_modules/pkg/a.md')).resolves.toEqual({})
  })
})
