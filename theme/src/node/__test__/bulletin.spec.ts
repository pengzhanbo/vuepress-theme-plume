import type { App, Page } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `prepareBulletin` 只负责把公告配置整理成客户端数据，因此这里替换掉所有副作用：
 * 临时文件写入、性能标记与日志。真正的 markdown 渲染由一个可断言的假 app 提供。
 *
 * `prepareBulletin` only turns the bulletin configuration into client data, so all
 * side effects (temp file writes, perf marks and logs) are stubbed. The markdown
 * rendering is provided by a fake app so the call can be asserted.
 */
const hoisted = vi.hoisted(() => ({
  getThemeOptions: vi.fn(),
  writeTemp: vi.fn(),
  warn: vi.fn(),
  configOn: vi.fn(),
  configOff: vi.fn(),
}))

vi.mock('../options.js', () => ({
  getThemeOptions: hoisted.getThemeOptions,
  configLoader: { on: hoisted.configOn, off: hoisted.configOff },
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    perf: { mark: vi.fn(), log: vi.fn() },
    genTempCode: (_app: unknown, { content }: { content: unknown }) => content,
    writeTemp: hoisted.writeTemp,
    logger: { ...actual.logger, warn: hoisted.warn },
  }
})

const { prepareBulletin } = await import('../prepare/bulletin.js')
const { enableBulletin } = await import('../pages/pageBulletin.js')

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'bulletin-'))

beforeEach(() => {
  hoisted.writeTemp.mockClear()
  hoisted.warn.mockClear()
  hoisted.getThemeOptions.mockReset()
})

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

function createApp(): App & { markdown: { render: ReturnType<typeof vi.fn> } } {
  return {
    dir: { source: (file = '') => path.join(tmpDir, file) },
    markdown: {
      render: vi.fn((content: string) => `<rendered>${content}</rendered>`),
    },
  } as unknown as App & { markdown: { render: ReturnType<typeof vi.fn> } }
}

/** 读取最近一次写入的公告数据。 */
function readBulletinData(): Record<string, Record<string, any>> {
  const call = hoisted.writeTemp.mock.calls.at(-1)
  return call?.[2] as Record<string, Record<string, any>>
}

function writeFile(name: string, content: string): string {
  const filepath = path.join(tmpDir, name)
  fs.writeFileSync(filepath, content)
  return filepath
}

describe('prepareBulletin', () => {
  it('renders a markdown content file and strips the build-time fields', async () => {
    const contentFile = writeFile('notice.md', '# Hello')
    const app = createApp()
    const options: ThemeOptions = {
      locales: {
        '/': {
          bulletin: {
            contentFile,
            title: 'Notice',
            enablePage: false,
            contentType: 'markdown',
          },
        },
      },
    }

    const watchFiles = await prepareBulletin(app, false, options)
    const data = readBulletinData()['/']

    expect(data.content).toBe('<rendered># Hello</rendered>')
    expect(data.title).toBe('Notice')
    expect(data.id).toBeTypeOf('string')
    // `contentType` / `enablePage` / `contentFile` 只在构建期使用。
    expect(data).not.toHaveProperty('contentType')
    expect(data).not.toHaveProperty('enablePage')
    expect(data).not.toHaveProperty('contentFile')
    expect(app.markdown.render).toHaveBeenCalledWith('# Hello', expect.objectContaining({
      filepath: contentFile,
      filePathRelative: 'notice.md',
    }))
    // 内容文件需要被监听，修改后重新生成公告数据。
    expect(watchFiles).toEqual([contentFile])
  })

  it('keeps html content files as plain text', async () => {
    const contentFile = writeFile('notice.html', '<b>Hi</b>')
    const app = createApp()
    const options: ThemeOptions = {
      locales: { '/': { bulletin: { contentFile } } },
    }

    await prepareBulletin(app, false, options)
    const data = readBulletinData()['/']

    expect(data.content).toBe('<b>Hi</b>')
    expect(app.markdown.render).not.toHaveBeenCalled()
  })

  it('renders inline markdown content with a synthetic file path', async () => {
    const app = createApp()
    const options: ThemeOptions = {
      locales: {
        '/': { bulletin: { content: '**hi**', contentType: 'markdown' } },
      },
    }

    const watchFiles = await prepareBulletin(app, false, options)
    const data = readBulletinData()['/']

    expect(data.content).toBe('<rendered>**hi**</rendered>')
    expect(app.markdown.render).toHaveBeenCalledWith('**hi**', expect.objectContaining({
      filepath: path.join(tmpDir, '_bulletin.md'),
      filePathRelative: '_bulletin.md',
    }))
    expect(watchFiles).toEqual([])
  })

  it('warns and keeps an empty content when the file cannot be read', async () => {
    const app = createApp()
    const options: ThemeOptions = {
      locales: { '/': { bulletin: { contentFile: path.join(tmpDir, 'missing.md') } } },
    }

    await prepareBulletin(app, false, options)
    const data = readBulletinData()['/']

    expect(hoisted.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to read the bulletin file'),
      expect.anything(),
    )
    expect(data.content).toBe('')
    expect(app.markdown.render).not.toHaveBeenCalled()
  })

  it('writes an empty payload when there are no locales', async () => {
    const app = createApp()

    await prepareBulletin(app, false, {})

    expect(hoisted.writeTemp).toHaveBeenCalledTimes(1)
    expect(hoisted.writeTemp).toHaveBeenCalledWith(app, 'internal/bulletin-data.js', {})
  })

  it('de-duplicates the watched files', async () => {
    const contentFile = writeFile('shared.md', 'Shared')
    const app = createApp()
    const options: ThemeOptions = {
      locales: {
        '/': { bulletin: { contentFile } },
        '/en/': { bulletin: { contentFile } },
      },
    }

    await expect(prepareBulletin(app, false, options)).resolves.toEqual([contentFile])
  })
})

describe('enableBulletin', () => {
  function createPage(pathLocale = '/'): Page {
    return { pathLocale, data: {} } as unknown as Page
  }

  it('enables the bulletin for every page by default', () => {
    hoisted.getThemeOptions.mockReturnValue({ bulletin: { title: 'Notice' } } as ThemeOptions)
    const page = createPage()

    enableBulletin(page)

    expect(page.data.bulletin).toBe(true)
  })

  it('honors a boolean switch', () => {
    hoisted.getThemeOptions.mockReturnValue({ bulletin: { enablePage: false } } as ThemeOptions)
    const page = createPage()

    enableBulletin(page)

    expect(page.data.bulletin).toBe(false)
  })

  it('passes the page to an `enablePage` function', () => {
    const page = createPage()
    hoisted.getThemeOptions.mockReturnValue({
      bulletin: { enablePage: (p: Page) => p === page },
    } as ThemeOptions)

    enableBulletin(page)

    expect(page.data.bulletin).toBe(true)
  })

  it('lets the locale configuration override the global one', () => {
    hoisted.getThemeOptions.mockReturnValue({
      bulletin: { enablePage: true },
      locales: { '/en/': { bulletin: { enablePage: false } } },
    } as ThemeOptions)
    const page = createPage('/en/')

    enableBulletin(page)

    expect(page.data.bulletin).toBe(false)
  })

  it('leaves the page untouched when the bulletin is disabled globally', () => {
    hoisted.getThemeOptions.mockReturnValue({ bulletin: false } as ThemeOptions)
    const page = createPage()

    enableBulletin(page)

    expect(page.data.bulletin).toBeUndefined()
  })
})
