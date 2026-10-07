import type { App } from 'vuepress'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setContentHash, writeTemp } from '../src/node/utils/writeTemp.js'

function createApp(): App & { writeTemp: ReturnType<typeof vi.fn> } {
  return { writeTemp: vi.fn(async () => {}) } as unknown as App & {
    writeTemp: ReturnType<typeof vi.fn>
  }
}

// `contentHash` 是模块级单例，逐个用例清理避免相互影响。
beforeEach(() => {
  setContentHash('a.js', '')
  setContentHash('b.js', '')
})

describe('writeTemp', () => {
  it('writes the content and remembers its hash', async () => {
    const app = createApp()

    await writeTemp(app, 'a.js', 'content')

    expect(app.writeTemp).toHaveBeenCalledTimes(1)
    expect(app.writeTemp).toHaveBeenCalledWith('a.js', 'content')
  })

  it('skips the write when the content is unchanged', async () => {
    const app = createApp()

    await writeTemp(app, 'a.js', 'content')
    await writeTemp(app, 'a.js', 'content')

    // 相同内容不应重复写入。
    expect(app.writeTemp).toHaveBeenCalledTimes(1)
  })

  it('writes again when the content changes', async () => {
    const app = createApp()

    await writeTemp(app, 'a.js', 'content')
    await writeTemp(app, 'a.js', 'updated')

    expect(app.writeTemp).toHaveBeenCalledTimes(2)
    expect(app.writeTemp).toHaveBeenLastCalledWith('a.js', 'updated')
  })

  it('tracks the hash per file path', async () => {
    const app = createApp()

    await writeTemp(app, 'a.js', 'shared')
    await writeTemp(app, 'b.js', 'shared')

    // 不同文件即使内容相同也必须各自写入。
    expect(app.writeTemp).toHaveBeenCalledTimes(2)
  })
})

describe('setContentHash', () => {
  it('seeds the hash so the next identical write is skipped', async () => {
    const app = createApp()
    setContentHash('a.js', 'content')

    await writeTemp(app, 'a.js', 'content')

    expect(app.writeTemp).not.toHaveBeenCalled()
  })

  it('clears the hash so the next write is forced', async () => {
    const app = createApp()
    await writeTemp(app, 'a.js', 'content')
    expect(app.writeTemp).toHaveBeenCalledTimes(1)

    // 传入空内容会删除缓存，下一次写入不再被跳过。
    setContentHash('a.js', '')
    await writeTemp(app, 'a.js', 'content')

    expect(app.writeTemp).toHaveBeenCalledTimes(2)
  })
})
