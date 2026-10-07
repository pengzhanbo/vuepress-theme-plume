import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * `pinyin.ts` reads package availability at module load time and caches the resolved
 * `pinyin` function in a module-level variable. Both facts are exercised here by
 * re-importing the module after re-stubbing `local-pkg` and the optional packages.
 *
 * `pinyin.ts` 在模块加载时读取依赖可用性，并把解析后的 `pinyin` 函数缓存在模块级变量中。
 * 因此这里通过重置 `local-pkg` 与可选包的桩来重新导入模块，覆盖这两种事实。
 */
async function loadPinyinModule(
  installed: boolean,
  withData: boolean,
  addDict: ReturnType<typeof vi.fn> = vi.fn(),
) {
  vi.doMock('local-pkg', () => ({
    isPackageExists: (name: string) =>
      name === 'pinyin-pro' ? installed : name === '@pinyin-pro/data',
  }))
  vi.doMock('pinyin-pro', () => ({
    pinyin: (str: string) => `py:${str}`,
    addDict,
  }))
  vi.doMock('@pinyin-pro/data/complete', () => ({ default: { big: 'dict' } }))
  vi.resetModules()
  return await import('../src/node/utils/pinyin.js')
}

afterEach(() => {
  vi.doUnmock('local-pkg')
  vi.doUnmock('pinyin-pro')
  vi.doUnmock('@pinyin-pro/data/complete')
  vi.resetModules()
})

describe('hasPinyin', () => {
  it('reflects whether pinyin-pro is installed', async () => {
    expect((await loadPinyinModule(true, false)).hasPinyin).toBe(true)
    expect((await loadPinyinModule(false, false)).hasPinyin).toBe(false)
  })
})

describe('getPinyin', () => {
  it('returns null when pinyin-pro is not installed', async () => {
    const { getPinyin, hasPinyin } = await loadPinyinModule(false, false)

    expect(hasPinyin).toBe(false)
    await expect(getPinyin()).resolves.toBeNull()
  })

  it('resolves and caches the pinyin function', async () => {
    const { getPinyin } = await loadPinyinModule(true, false)

    const pinyin = await getPinyin()
    expect(pinyin).toBeTypeOf('function')
    expect(pinyin!('中文')).toBe('py:中文')

    // 第二次调用命中模块级缓存，返回同一引用。
    expect(await getPinyin()).toBe(pinyin)
  })

  it('registers the extended dictionary when available', async () => {
    const addDict = vi.fn()
    const { getPinyin } = await loadPinyinModule(true, true, addDict)

    await getPinyin()

    expect(addDict).toHaveBeenCalledWith({ big: 'dict' })
  })
})
