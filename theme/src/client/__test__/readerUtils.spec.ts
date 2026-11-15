import type { ResolvedReaderOptions, ResolvedReaderPalette } from '../../shared/index.js'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  computeReadingProgress,
  hasReaderControls,
  normalizeReaderPreferences,
  pruneRecords,
  resolveEffectiveAid,
  resolveEffectiveBrand,
  resolveEffectiveFocus,
  resolveEffectiveTheme,
  resolveEffectiveWidth,
  resolveReaderAidConfig,
  setReaderAttr,
  shouldOfferResume,
} from '../utils/reader.js'

const DAY = 24 * 60 * 60 * 1000

/**
 * Built-in background palettes, mirroring what the build produces.
 *
 * 内置背景调色板，与构建期产物一致。
 */
const BUILTIN_THEMES: ResolvedReaderPalette[] = [
  { name: 'default', color: null, tokens: {} },
  { name: 'warm', color: '#fbf8f3', tokens: {} },
  { name: 'sepia', color: '#f4ecd8', tokens: {} },
]

/**
 * Build a resolved options object, the shape injected by `theme-data`.
 *
 * 构造一份已解析的配置，即 `theme-data` 注入的形状。
 *
 * @param patch - Fields to override / 需要覆盖的字段
 */
function makeOptions(patch: Partial<ResolvedReaderOptions> = {}): ResolvedReaderOptions {
  return {
    width: { presets: ['narrow', 'wide', 'full'] },
    theme: { presets: BUILTIN_THEMES },
    brand: null,
    readAid: { modes: ['mask', 'left', 'right'], default: null },
    focusMode: true,
    resume: { prompt: true, ttl: 90, max: 300, minPercent: 0.05 },
    storagePrefix: 'plume',
    ...patch,
  }
}

const fullOptions = makeOptions()

describe('small screens', () => {
  it('always uses the standard width', () => {
    const options = makeOptions()

    expect(resolveEffectiveWidth('wide', options, true)).toBeNull()
    expect(resolveEffectiveWidth('wide', options, false)).toBe('wide')
  })

  it('never enables the focus mode', () => {
    expect(resolveEffectiveFocus(true, true)).toBe(false)
    expect(resolveEffectiveFocus(true, false)).toBe(true)
    expect(resolveEffectiveFocus(undefined, false)).toBe(false)
  })

  it('never enables the reading aid', () => {
    const config = resolveReaderAidConfig(makeOptions({ readAid: { modes: ['mask'], default: 'mask' } }), undefined)

    expect(resolveEffectiveAid(config, undefined, true)).toBeNull()
    expect(resolveEffectiveAid(config, undefined, false)).toBe('mask')
  })
})

describe('reading aid', () => {
  it('prefers the new configuration over the legacy option', () => {
    const options = makeOptions({ readAid: { modes: ['mask'], default: 'mask' } })

    expect(resolveReaderAidConfig(options, 'left')?.default).toBe('mask')
  })

  it('falls back to the legacy option, where `true` means `left`', () => {
    expect(resolveReaderAidConfig(null, true)).toEqual({
      modes: ['mask', 'left', 'right'],
      default: 'left',
    })
    expect(resolveReaderAidConfig(null, 'right')?.default).toBe('right')
    expect(resolveReaderAidConfig(null, false)).toBeNull()
    expect(resolveReaderAidConfig(null, undefined)).toBeNull()
  })

  it('keeps a legacy guide line as the default of the new config', () => {
    // 新配置没有默认形态 → 沿用旧配置
    expect(resolveReaderAidConfig(makeOptions(), 'left')?.default).toBe('left')
    // 旧形态不在可选范围内 → 不生效
    expect(resolveReaderAidConfig(makeOptions({ readAid: { modes: ['mask'], default: null } }), 'left')?.default).toBeNull()
    // 新配置显式指定了默认形态 → 以新配置为准
    expect(resolveReaderAidConfig(makeOptions({ readAid: { modes: ['mask', 'left'], default: 'right' } }), 'left')?.default).toBe('right')
  })

  it('resolves the effective mode', () => {
    const config = { modes: ['mask', 'left'] as const, default: 'left' as const }

    expect(resolveEffectiveAid({ modes: [...config.modes], default: config.default }, undefined)).toBe('left')
    expect(resolveEffectiveAid({ modes: [...config.modes], default: config.default }, 'mask')).toBe('mask')
    expect(resolveEffectiveAid({ modes: [...config.modes], default: config.default }, 'off')).toBeNull()
    // 不在可选范围内 → 回落默认值
    expect(resolveEffectiveAid({ modes: [...config.modes], default: config.default }, 'right')).toBe('left')
    expect(resolveEffectiveAid(null, 'mask')).toBeNull()
  })

  it('keeps an explicitly disabled config instead of the legacy option', () => {
    expect(resolveReaderAidConfig(makeOptions({ readAid: null }), 'left')).toBeNull()
  })
})

describe('hasReaderControls', () => {
  it('is false when the panel would be empty', () => {
    expect(hasReaderControls(null)).toBe(false)
    expect(hasReaderControls(makeOptions({
      width: null,
      theme: null,
      readAid: null,
      focusMode: false,
    }))).toBe(false)
  })

  it('only counts the reading background on small screens', () => {
    // 宽度、辅助线、专注模式在小屏上被禁用，只有护眼背景还能用
    const desktopOnly = makeOptions({ theme: null })

    expect(hasReaderControls(desktopOnly, true)).toBe(false)
    expect(hasReaderControls(desktopOnly, false)).toBe(true)
    expect(hasReaderControls(fullOptions, true)).toBe(true)
    expect(hasReaderControls(null, true)).toBe(false)
  })

  it('is true as soon as one control exists', () => {
    expect(hasReaderControls(makeOptions({ width: null, theme: null }))).toBe(true)
    expect(hasReaderControls(makeOptions({ width: null, theme: null, focusMode: false, readAid: { modes: ['mask'], default: null } }))).toBe(true)
    expect(hasReaderControls(fullOptions)).toBe(true)
  })

  it('counts the brand palettes on both viewports', () => {
    // 只启用品牌色时，桌面与移动端都应保留设置入口
    const brandOnly = makeOptions({
      width: null,
      theme: null,
      readAid: null,
      focusMode: false,
      brand: { presets: [{ name: 'default', color: null, tokens: {} }] },
    })

    expect(hasReaderControls(brandOnly, false)).toBe(true)
    expect(hasReaderControls(brandOnly, true)).toBe(true)
  })
})

describe('normalizeReaderPreferences', () => {
  it('drops a width that the config did not enable', () => {
    const options = makeOptions({ width: { presets: ['narrow'] } })

    expect(normalizeReaderPreferences({ width: 'wide' }, options)).toEqual({})
    expect(normalizeReaderPreferences({ width: 'narrow' }, options)).toEqual({ width: 'narrow' })
  })

  it('drops a theme that the config did not enable', () => {
    const options = makeOptions({ theme: { presets: [BUILTIN_THEMES[0], BUILTIN_THEMES[1]] } })

    expect(normalizeReaderPreferences({ theme: 'sepia' }, options)).toEqual({})
    expect(normalizeReaderPreferences({ theme: 'warm' }, options)).toEqual({ theme: 'warm' })
  })

  it('drops unknown values and unknown fields', () => {
    expect(normalizeReaderPreferences({ width: 'huge' }, fullOptions)).toEqual({})
    expect(normalizeReaderPreferences({ width: 1 }, fullOptions)).toEqual({})
    expect(normalizeReaderPreferences({ focus: 'yes' }, fullOptions)).toEqual({})
    expect(normalizeReaderPreferences({ foo: 1 }, fullOptions)).toEqual({})
  })

  it('keeps a reading aid mode that the config offers', () => {
    const options = makeOptions({ readAid: { modes: ['mask'], default: null } })

    expect(normalizeReaderPreferences({ aid: 'mask' }, options)).toEqual({ aid: 'mask' })
    expect(normalizeReaderPreferences({ aid: 'off' }, options)).toEqual({ aid: 'off' })
    expect(normalizeReaderPreferences({ aid: 'left' }, options)).toEqual({})
    expect(normalizeReaderPreferences({ aid: 1 }, options)).toEqual({})
  })

  it('drops the reading aid when the config disabled it', () => {
    const options = makeOptions({ readAid: null })

    expect(normalizeReaderPreferences({ aid: 'mask' }, options)).toEqual({})
  })

  it('accepts a user defined palette name', () => {
    const options = makeOptions({
      theme: { presets: [{ name: 'paper', color: '#fdf6e3', tokens: { '--vp-c-bg': '#fdf6e3' } }] },
      brand: { presets: [{ name: 'ocean', color: '#0ea5e9', tokens: { '--vp-c-brand-1': '#0ea5e9' } }] },
    })

    expect(normalizeReaderPreferences({ theme: 'paper', brand: 'ocean' }, options))
      .toEqual({ theme: 'paper', brand: 'ocean' })
    expect(normalizeReaderPreferences({ theme: 'sepia', brand: 'neon' }, options)).toEqual({})
  })

  it('survives broken payloads', () => {
    expect(normalizeReaderPreferences(null, fullOptions)).toEqual({})
    expect(normalizeReaderPreferences('{', fullOptions)).toEqual({})
    expect(normalizeReaderPreferences('[]', fullOptions)).toEqual({})
    expect(normalizeReaderPreferences({}, null)).toEqual({})
  })

  it('parses a JSON string', () => {
    expect(normalizeReaderPreferences('{"focus":true}', fullOptions)).toEqual({ focus: true })
  })

  it('drops the focus preference when the focus mode is disabled', () => {
    // 关闭专注模式后，该偏好不应继续同步到 DOM 属性
    expect(normalizeReaderPreferences({ focus: true }, makeOptions({ focusMode: false }))).toEqual({})
  })
})

describe('resolveEffectiveTheme', () => {
  const presets = makeOptions().theme!.presets

  it('is disabled in dark mode', () => {
    expect(resolveEffectiveTheme(presets, 'sepia', false)).toBe('sepia')
    expect(resolveEffectiveTheme(presets, 'sepia', true)).toBeNull()
    expect(resolveEffectiveTheme(presets, undefined, false)).toBeNull()
    expect(resolveEffectiveTheme(presets, 'default', false)).toBeNull()
    expect(resolveEffectiveTheme(null, 'sepia', false)).toBeNull()
  })

  it('drops a palette that the config does not offer', () => {
    const narrow = makeOptions({ theme: { presets: [BUILTIN_THEMES[0], BUILTIN_THEMES[1]] } }).theme!.presets

    expect(resolveEffectiveTheme(narrow, 'sepia', false)).toBeNull()
    expect(resolveEffectiveTheme(narrow, 'warm', false)).toBe('warm')
  })

  it('uses the locale-scoped attribute value of a custom palette', () => {
    const presets = makeOptions({
      theme: {
        presets: [
          BUILTIN_THEMES[0],
          { name: 'paper', color: '#fdf6e3', tokens: { '--vp-c-bg': '#fdf6e3' }, attribute: 'paper@/en/' },
        ],
      },
    }).theme!.presets

    expect(resolveEffectiveTheme(presets, 'paper', false)).toBe('paper@/en/')
  })
})

describe('resolveEffectiveBrand', () => {
  const presets = makeOptions({
    brand: {
      presets: [
        { name: 'default', color: null, tokens: {} },
        { name: 'ocean', color: '#0ea5e9', tokens: { '--vp-c-brand-1': '#0ea5e9' } },
      ],
    },
  }).brand!.presets

  it('works in dark mode too', () => {
    expect(resolveEffectiveBrand(presets, 'ocean')).toBe('ocean')
    expect(resolveEffectiveBrand(presets, undefined)).toBeNull()
    expect(resolveEffectiveBrand(presets, 'default')).toBeNull()
    expect(resolveEffectiveBrand(null, 'ocean')).toBeNull()
  })

  it('ships the built-in "default" entry first', () => {
    expect(presets.map(palette => palette.name)).toEqual(['default', 'ocean'])
  })
})

describe('computeReadingProgress', () => {
  const base = { docTop: 100, docHeight: 3000, viewportHeight: 800 }

  it('is relative to the document body content', () => {
    expect(computeReadingProgress({ ...base, scrollY: 100 })).toBe(0)
    expect(computeReadingProgress({ ...base, scrollY: 1200 })).toBe(0.5)
    expect(computeReadingProgress({ ...base, scrollY: 2300 })).toBe(1)
  })

  it('clamps out of range values', () => {
    expect(computeReadingProgress({ ...base, scrollY: 5000 })).toBe(1)
    expect(computeReadingProgress({ ...base, scrollY: 0 })).toBe(0)
  })

  it('returns 0 when the content is shorter than the viewport', () => {
    expect(computeReadingProgress({ docTop: 0, docHeight: 700, viewportHeight: 800, scrollY: 0 })).toBe(0)
  })

  it('returns 0 for non finite measurements', () => {
    expect(computeReadingProgress({ docTop: 0, docHeight: Number.NaN, viewportHeight: 800, scrollY: 0 })).toBe(0)
  })
})

describe('shouldOfferResume', () => {
  const now = 1_000 * DAY
  const stored = { p: 0.62, t: now - DAY }
  const base = { stored, hasHash: false, cameFromPopState: false, minPercent: 0.05, maxPercent: 0.95, ttlDays: 90, now }

  it('offers a normal record', () => {
    expect(shouldOfferResume(base)).toBe(true)
  })

  it('stays silent on hash navigation', () => {
    expect(shouldOfferResume({ ...base, hasHash: true })).toBe(false)
  })

  it('stays silent after a browser back/forward', () => {
    expect(shouldOfferResume({ ...base, cameFromPopState: true })).toBe(false)
  })

  it('stays silent without a record', () => {
    expect(shouldOfferResume({ ...base, stored: undefined })).toBe(false)
  })

  it('stays silent when the record expired', () => {
    expect(shouldOfferResume({ ...base, stored: { p: 0.62, t: now - 91 * DAY } })).toBe(false)
  })

  it('stays silent below the minimum', () => {
    expect(shouldOfferResume({ ...base, stored: { p: 0.02, t: now } })).toBe(false)
  })

  it('stays silent above the maximum', () => {
    expect(shouldOfferResume({ ...base, stored: { p: 0.99, t: now } })).toBe(false)
  })
})

describe('pruneRecords', () => {
  const now = 1_000 * DAY

  it('drops expired records', () => {
    const result = pruneRecords({
      fresh: { t: now - DAY },
      stale: { t: now - 100 * DAY },
    }, 10, 90, now)

    expect(Object.keys(result)).toEqual(['fresh'])
  })

  it('keeps the newest N records', () => {
    const result = pruneRecords({
      a: { t: now - 3 * DAY },
      b: { t: now - 2 * DAY },
      c: { t: now - DAY },
    }, 2, 90, now)

    expect(Object.keys(result)).toEqual(['c', 'b'])
  })

  it('does not mutate the input', () => {
    const input = { a: { t: now }, b: { t: now - 100 * DAY } }
    pruneRecords(input, 1, 90, now)

    expect(Object.keys(input)).toEqual(['a', 'b'])
  })
})

describe('setReaderAttr', () => {
  it('removes the attribute for null', () => {
    const calls: string[] = []
    const el = {
      setAttribute: (name: string) => calls.push(`set:${name}`),
      removeAttribute: (name: string) => calls.push(`remove:${name}`),
    }

    setReaderAttr(el, 'width', null)
    setReaderAttr(el, 'width', 'wide')

    expect(calls).toEqual(['remove:data-reader-width', 'set:data-reader-width'])
  })
})

describe('attribute names stay in sync with the stylesheet', () => {
  const css = readFileSync(new URL('../styles/reader.css', import.meta.url), 'utf-8')

  it('declares every attribute used by the client', () => {
    expect(css).toContain('[data-reader-width="narrow"]')
    expect(css).toContain('[data-reader-width="wide"]')
    expect(css).toContain('[data-reader-theme="warm"]')
    expect(css).toContain('[data-reader-theme="sepia"]')
    expect(css).toContain('[data-reader-focus="true"]')
  })

  it('never touches typography', () => {
    expect(css).not.toContain('--vp-doc-scale')
    expect(css).not.toContain('font-size')
  })
})
