import fs from 'node:fs'
import dayjs from 'dayjs'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `helper.ts` reads `hasPinyin` / `getPinyin` from the node utils barrel. Both are
 * stubbed through getters so the pinyin-enabled path can be exercised on demand.
 *
 * `helper.ts` 从 node utils barrel 读取 `hasPinyin` / `getPinyin`，
 * 这里以 getter 替换两者，以便按需覆盖启用拼音的分支。
 */
const hoisted = vi.hoisted(() => ({
  hasPinyin: false,
  pinyin: undefined as undefined | ((str: string) => string),
}))

vi.mock('../src/node/utils/index.js', () => ({
  get hasPinyin() {
    return hoisted.hasPinyin
  },
  get getPinyin() {
    return async () => hoisted.pinyin
  },
}))

const {
  EXCLUDE,
  getCurrentName,
  getFileCreateTime,
  getPermalinkByFilepath,
  isReadme,
  normalizeTitle,
} = await import('../src/node/autoFrontmatter/helper.js')

const TIME_RE = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/

beforeEach(() => {
  hoisted.hasPinyin = false
  hoisted.pinyin = undefined
})

describe('eXCLUDE', () => {
  it('excludes vuepress internals with the negated glob form', () => {
    // `!**/xxx/**` 形式是必需的：带尾斜杠的模式无法排除目录内的文件。
    expect(EXCLUDE).toEqual(['!**/.vuepress/**', '!**/node_modules/**'])
  })
})

describe('isReadme', () => {
  it('recognizes README / index / readme files', () => {
    expect(isReadme('blog/README.md')).toBe(true)
    expect(isReadme('blog/index.md')).toBe(true)
    expect(isReadme('blog/readme.md')).toBe(true)
    expect(isReadme('blog/post.md')).toBe(false)
  })
})

describe('normalizeTitle', () => {
  it('strips a leading numeric ordering prefix', () => {
    // 文件名常带有 `01.` 之类的前缀用于排序，标题中应被去掉。
    expect(normalizeTitle('01.intro')).toBe('intro')
    expect(normalizeTitle('  ！  ')).toBe('！')
    expect(normalizeTitle('12.hello world')).toBe('hello world')
  })

  it('keeps titles without a numeric prefix', () => {
    expect(normalizeTitle('intro')).toBe('intro')
    // 不带 `.` 的数字前缀不应被移除。
    expect(normalizeTitle('2024 report')).toBe('2024 report')
  })
})

describe('getCurrentName', () => {
  it('uses the parent directory name for readme files', () => {
    expect(getCurrentName('blog/guide/README.md')).toBe('guide')
    expect(getCurrentName('blog/index.md')).toBe('blog')
  })

  it('falls back to `Home` when the parent directory has no name', () => {
    // 根目录下的 README 没有可用的目录名。
    expect(getCurrentName('/README.md')).toBe('Home')
  })

  it('uses the file name for regular files', () => {
    expect(getCurrentName('blog/Post.md')).toBe('Post')
    // 数字前缀会被去掉。
    expect(getCurrentName('blog/01.setup.md')).toBe('setup')
  })
})

describe('getFileCreateTime', () => {
  it('formats the birthtime of an existing file', async () => {
    const filepath = new URL('.tmp', import.meta.url)
    fs.mkdirSync(filepath, { recursive: true })
    const target = new URL('.tmp/create-time.md', import.meta.url)
    fs.writeFileSync(target, 'content')

    await expect(getFileCreateTime(target.pathname)).resolves.toMatch(TIME_RE)

    fs.rmSync(target)
  })

  it('falls back to atime when birthtime is unavailable (epoch)', async () => {
    const atime = new Date('2020-01-02T03:04:05Z')
    const stat = vi.spyOn(fs.promises, 'stat').mockResolvedValue({
      birthtime: new Date(0),
      atime,
    } as unknown as fs.Stats)

    await expect(getFileCreateTime('virtual.md'))
      .resolves
      .toBe(dayjs(atime).format('YYYY/MM/DD HH:mm:ss'))

    stat.mockRestore()
  })

  it('falls back to the current time when stat fails', async () => {
    const stat = vi.spyOn(fs.promises, 'stat').mockRejectedValue(new Error('ENOENT'))

    await expect(getFileCreateTime('missing.md')).resolves.toMatch(TIME_RE)

    stat.mockRestore()
  })
})

describe('getPermalinkByFilepath', () => {
  it('slugifies the path segments without pinyin', async () => {
    await expect(getPermalinkByFilepath('blog/Hello World.md')).resolves.toBe('blog/hello-world')
    // 数字前缀同样会被移除。
    await expect(getPermalinkByFilepath('blog/01.Getting Started.md', '/'))
      .resolves
      .toBe('blog/getting-started')
  })

  it('strips the base path before slugifying', async () => {
    await expect(getPermalinkByFilepath('blog/a/Post.md', '/blog/')).resolves.toBe('a/post')
  })

  it('converts Chinese segments through pinyin when available', async () => {
    hoisted.hasPinyin = true
    hoisted.pinyin = (str: string) => (str === '博客' ? 'blog' : 'rumen')

    await expect(getPermalinkByFilepath('博客/入门.md')).resolves.toBe('blog/rumen')
  })

  it('falls back to the raw segment when pinyin yields nothing', async () => {
    hoisted.hasPinyin = true
    hoisted.pinyin = () => ''

    await expect(getPermalinkByFilepath('blog/Intro.md')).resolves.toBe('blog/intro')
  })
})

afterAll(() => {
  fs.rmSync(new URL('.tmp/create-time.md', import.meta.url), { force: true })
})
