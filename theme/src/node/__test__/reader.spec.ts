import type { App } from 'vuepress'
import type { TemplateRendererContext } from 'vuepress/utils'
import type { ReaderPreferencesOptions } from '../../shared/index.js'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

/**
 * Theme options are read through `getThemeOptions()`, which is stubbed here so
 * the renderer can be exercised without booting VuePress.
 *
 * 主题配置通过 `getThemeOptions()` 读取，这里用 stub 替换，无需启动 VuePress。
 */
const hoisted = vi.hoisted(() => ({ options: {} as Record<string, any> }))

vi.mock('../options.js', () => ({
  getThemeOptions: () => hoisted.options,
}))

// `theme-data` 依赖该插件的两个导出，这里用 stub 替换，无需其 `dist` 已构建。
vi.mock('vuepress-plugin-md-power', () => ({
  getImageOriginalSize: vi.fn(),
  resolveImagePath: vi.fn(),
}))

const { templateBuildRenderer } = await import('../config/templateBuildRenderer.js')
const { collectReaderLocales, generateReaderPaletteStyle, generateReaderScript, mergeReaderPreferences, resolveLocaleReaderOptions, resolveReaderOptions } = await import('../features/reader/index.js')

const PLACEHOLDERS = '<!--vuepress-theme-plume-appearance--><!--vuepress-theme-plume-reader-->'

const context: TemplateRendererContext = {
  content: '',
  head: '',
  lang: 'en',
  prefetch: '',
  preload: '',
  scripts: '',
  styles: '',
  version: '2.0.0',
}

/**
 * Render the build template with the given theme options.
 *
 * 用给定的主题配置渲染构建模板。
 */
async function render(options: Record<string, any>, base = '/'): Promise<string> {
  hoisted.options = options
  return await Promise.resolve(templateBuildRenderer({ options: { base } } as App, PLACEHOLDERS, context))
}

/**
 * Extract the reader script from the rendered template.
 *
 * 从渲染结果中取出阅读偏好脚本。
 */
function extractScript(html: string): string {
  const match = html.match(/<script id="plume-reader">([\s\S]*?)<\/script>/)
  return match ? match[1] : ''
}

describe('reader script injection', () => {
  it('injects nothing when the feature is off', async () => {
    const html = await render({})

    expect(html).not.toContain('plume-reader')
    expect(html).not.toContain('data-reader-')
  })

  it('injects every attribute when the feature is on', async () => {
    const script = extractScript(await render({ readerPreferences: true }))

    expect(script).toContain('plume:reader:prefs')
    expect(script).toContain('data-reader-width')
    expect(script).toContain('data-reader-theme')
    expect(script).toContain('data-reader-focus')
  })

  it('uses the configured storage prefix', async () => {
    const script = extractScript(await render({
      readerPreferences: { storagePrefix: 'site-b' },
    }))

    expect(script).toContain('site-b:reader:prefs')
  })

  it('emits no width code when width is disabled', async () => {
    const script = extractScript(await render({
      readerPreferences: { width: false },
    }))

    expect(script).not.toContain('data-reader-width')
    expect(script).toContain('data-reader-theme')
  })

  it('keeps a disabled locale as a stop marker instead of falling back', async () => {
    const script = extractScript(await render({
      readerPreferences: true,
      locales: {
        '/': { readerPreferences: true },
        '/en/': { readerPreferences: false },
      },
    }))

    expect(script).toContain('"/"')
    // 关闭的语言保留前缀标记，脚本命中后立即停止，不会回退到根语言
    expect(script).toContain('{"p":"/en/"}')
    expect(script).toContain('if(!e||!e.k)return;')
  })

  it('injects nothing when every locale is off', async () => {
    const html = await render({
      locales: {
        '/': { readerPreferences: false },
        '/en/': { readerPreferences: false },
      },
    })

    expect(html).not.toContain('plume-reader')
    expect(generateReaderScript([], '/')).toBeNull()
  })

  it('strips the site base before matching a locale prefix', async () => {
    const script = extractScript(await render({
      readerPreferences: true,
      locales: {
        '/': { readerPreferences: true },
        '/en/': { readerPreferences: true },
      },
    }, '/docs/'))

    expect(script).toContain('"/docs/"')
    // `/en/` 必须排在根路径之前，否则永远不会命中
    expect(script.indexOf('"/en/"')).toBeLessThan(script.indexOf('"/"'))
  })

  it('is deterministic', async () => {
    const options = { readerPreferences: { width: { presets: ['wide'] } } }

    expect(await render(options)).toBe(await render(options))
  })

  it('sets the locale-scoped palette value', async () => {
    const script = extractScript(await render({
      readerPreferences: {
        theme: { presets: [{ name: 'paper', tokens: { 'vp-c-bg': '#fdf6e3' } }] },
      },
      locales: {
        '/': {},
        '/en/': {
          readerPreferences: {
            theme: { presets: [{ name: 'paper', tokens: { 'vp-c-bg': '#111' } }] },
          },
        },
      },
    }))

    // 同名调色板在非根语言下使用带语言作用域的值，避免与根语言互相覆盖
    expect(script).toContain('["paper","paper@/en/"]')
  })

  it('never applies the width or the focus mode on small screens', async () => {
    const script = extractScript(await render({ readerPreferences: true }))

    // 首帧同样遵守「小屏禁用」的规则，避免先闪一次宽布局或专注模式
    expect(script).toContain('(min-width: 769px)')
    expect(script).toContain('if(dk&&e.w')
    expect(script).toContain('if(dk&&e.f')
    // 护眼背景与屏幕宽度无关，不受该守卫影响
    expect(script).not.toContain('if(dk&&e.t')
  })
})

describe('resolveReaderOptions', () => {
  it('returns null when disabled or unset', () => {
    expect(resolveReaderOptions(undefined)).toBeNull()
    expect(resolveReaderOptions(false)).toBeNull()
  })

  it('applies defaults and clamps the ranges', () => {
    const options = resolveReaderOptions({
      resume: { ttl: 0, max: 10_000, minPercent: 2 },
    })!

    expect(options.width).toEqual({ presets: ['narrow', 'wide', 'full'] })
    expect(options.theme!.presets.map(palette => palette.name)).toEqual(['default', 'warm', 'sepia'])
    expect(options.brand).toBeNull()
    expect(options.focusMode).toBe(true)
    expect(options.resume).toEqual({ prompt: true, ttl: 1, max: 1000, minPercent: 1 })
    expect(options.storagePrefix).toBe('plume')
  })

  it('resolves the reading aid options', () => {
    expect(resolveReaderOptions({ readAid: false })!.readAid).toBeNull()
    expect(resolveReaderOptions(true)!.readAid)
      .toEqual({ modes: ['mask', 'left', 'right'], default: null })
    expect(resolveReaderOptions({ readAid: 'left' })!.readAid)
      .toEqual({ modes: ['mask', 'left', 'right'], default: 'left' })
    expect(resolveReaderOptions({ readAid: { modes: ['mask', 'right', 'trace' as any] } })!.readAid)
      .toEqual({ modes: ['mask', 'right'], default: null })
    // 显式 `default: null` 表示默认关闭辅助线
    expect(resolveReaderOptions({ readAid: { default: null } })!.readAid)
      .toEqual({ modes: ['mask', 'left', 'right'], default: null })
  })

  it('resolves user defined palettes', () => {
    const options = resolveReaderOptions({
      theme: {
        presets: [
          'warm',
          {
            name: 'paper',
            label: 'Paper',
            tokens: { 'vp-c-bg': '#fdf6e3', '--vp-c-bg-alt': '#f7efd9' },
          },
          // 非法名称会被丢弃
          { name: 'bad name', tokens: { 'vp-c-bg': '#000' } },
        ],
      },
      brand: {
        presets: [{ name: 'ocean', tokens: { 'vp-c-brand-1': '#0ea5e9' } }],
      },
    })!

    const paper = options.theme!.presets.find(palette => palette.name === 'paper')!

    expect(options.theme!.presets.map(palette => palette.name)).toEqual(['default', 'warm', 'paper'])
    expect(paper.tokens).toEqual({ '--vp-c-bg': '#fdf6e3', '--vp-c-bg-alt': '#f7efd9' })
    // 色块颜色默认取背景令牌
    expect(paper.color).toBe('#fdf6e3')
    expect(options.brand!.presets.map(palette => palette.name)).toEqual(['default', 'ocean'])
  })

  it('emits a stylesheet for the custom palettes only', () => {
    const options = {
      readerPreferences: {
        theme: { presets: ['warm', { name: 'paper', tokens: { 'vp-c-bg': '#fdf6e3' } }] },
      },
      locales: {
        '/': {},
        '/en/': {
          readerPreferences: {
            theme: { presets: [{ name: 'paper', tokens: { 'vp-c-bg': '#fdf6e3' } }] },
          },
        },
      },
    } as any

    const style = generateReaderPaletteStyle([
      { prefix: '/', options: resolveLocaleReaderOptions(options, '/')! },
      { prefix: '/en/', options: resolveLocaleReaderOptions(options, '/en/')! },
    ])

    expect(style).toContain('html[data-reader-theme="paper"] {\n  --vp-c-bg: #fdf6e3;\n}')
    // 内置档位不重复输出
    expect(style).not.toContain('data-reader-theme="warm"')
    // 同名调色板带语言作用域，各自使用所在语言的令牌
    expect(style).toContain('html[data-reader-theme="paper@/en/"] {\n  --vp-c-bg: #fdf6e3;\n}')
    expect(style.split('data-reader-theme="paper"').length - 1).toBe(1)
  })

  it('keeps only the known presets, in canonical order', () => {
    const options = resolveReaderOptions({
      width: { presets: ['wide', 'huge' as any, 'narrow'] },
      theme: { presets: ['sepia'] },
    })!

    // 只保留给定且受支持的档位，并按固定顺序排列
    expect(options.width).toEqual({ presets: ['narrow', 'wide'] })
    // 自定义调色板按给定顺序追加在「不覆盖」之后
    expect(options.theme!.presets.map(palette => palette.name)).toEqual(['default', 'sepia'])
  })
})

describe('mergeReaderPreferences', () => {
  const base = {
    theme: {
      presets: [
        'default',
        'warm',
        {
          name: 'forest',
          tokens: { '--vp-c-bg': '#eef5ec' },
        },
      ],
    },
    brand: {
      presets: [{ name: 'ocean', tokens: { '--vp-c-brand-1': '#0e7490' } }],
    },
    readAid: 'left' as const,
  } as ReaderPreferencesOptions

  it('lets a locale relabel a palette without repeating its tokens', () => {
    const merged = mergeReaderPreferences(base, {
      theme: { presets: [{ name: 'forest', label: 'Forest' }] },
      brand: { presets: [{ name: 'ocean', label: 'Ocean' }] },
    }) as any

    // 主题级的顺序与内置档位保留
    expect(merged.theme.presets.map((preset: any) => typeof preset === 'string' ? preset : preset.name))
      .toEqual(['default', 'warm', 'forest'])
    expect(merged.theme.presets[2]).toEqual({
      name: 'forest',
      label: 'Forest',
      tokens: { '--vp-c-bg': '#eef5ec' },
    })
    expect(merged.brand.presets[0]).toEqual({
      name: 'ocean',
      label: 'Ocean',
      tokens: { '--vp-c-brand-1': '#0e7490' },
    })
    // 其它配置项不会被语言级配置覆盖掉
    expect(merged.readAid).toBe('left')
  })

  it('appends palettes that only exist in the locale', () => {
    const merged = mergeReaderPreferences(base, {
      brand: { presets: [{ name: 'violet', label: '紫罗兰', tokens: { '--vp-c-brand-1': '#7c3aed' } }] },
    }) as any

    expect(merged.brand.presets.map((preset: any) => preset.name)).toEqual(['ocean', 'violet'])
    expect(merged.brand.presets[1].tokens).toEqual({ '--vp-c-brand-1': '#7c3aed' })
  })

  it('keeps the implicit presets when the locale only declares one', () => {
    // 主题级未声明 presets 时，语言级配置不能裁掉隐式默认档位
    const theme = mergeReaderPreferences({ theme: {} }, { theme: { presets: ['sepia'] } }) as any
    expect(theme.theme.presets).toEqual(['default', 'warm', 'sepia'])

    // 品牌组没有隐式档位
    const brand = mergeReaderPreferences(
      { brand: {} },
      { brand: { presets: [{ name: 'ocean', tokens: { '--vp-c-brand-1': '#0ea5e9' } }] } },
    ) as any
    expect(brand.brand.presets.map((preset: any) => preset.name)).toEqual(['ocean'])
  })

  it('keeps the resolved shape when the locale disables a group', () => {
    const merged = mergeReaderPreferences(base, { theme: false }) as any

    expect(merged.theme).toBe(false)
    expect(merged.brand.presets).toHaveLength(1)
  })

  it('passes booleans through', () => {
    expect(mergeReaderPreferences(undefined, true)).toBe(true)
    expect(mergeReaderPreferences(base, false)).toBe(false)
    expect(mergeReaderPreferences(base, undefined)).toBe(base)
  })
})

describe('resolveLocaleReaderOptions', () => {
  const options = {
    readerPreferences: {
      theme: {
        presets: [
          'warm',
          { name: 'forest', tokens: { 'vp-c-bg': '#eef5ec' } },
        ],
      },
    },
    locales: {
      '/': {},
      '/en/': {
        readerPreferences: {
          theme: { presets: [{ name: 'forest', label: 'Forest' }] },
        },
      },
    },
  } as any

  it('resolves the theme level options for the root locale', () => {
    const resolved = resolveLocaleReaderOptions(options, '/')!

    expect(resolved.theme!.presets.map(palette => palette.name)).toEqual(['default', 'warm', 'forest'])
    expect(resolved.theme!.presets[2]).toEqual({
      name: 'forest',
      color: '#eef5ec',
      tokens: { '--vp-c-bg': '#eef5ec' },
    })
  })

  it('merges the locale palettes by name, tokens stay at the theme level', () => {
    const resolved = resolveLocaleReaderOptions(options, '/en/')!

    expect(resolved.theme!.presets[2]).toEqual({
      name: 'forest',
      label: 'Forest',
      color: '#eef5ec',
      tokens: { '--vp-c-bg': '#eef5ec' },
      // 非根语言的自定义调色板带语言作用域的属性值
      attribute: 'forest@/en/',
    })
  })
})

describe('resolveThemeData', () => {
  it('injects the resolved reader options instead of the raw ones', async () => {
    const { resolveThemeData } = await import('../features/theme-data.js')

    const data = resolveThemeData({} as any, {
      readerPreferences: {
        width: { presets: ['wide'] },
        theme: { presets: [{ name: 'forest', tokens: { 'vp-c-bg': '#eef5ec' } }] },
      },
      locales: {
        '/': {},
        '/en/': {
          readerPreferences: {
            theme: { presets: [{ name: 'forest', label: 'Forest' }] },
          },
        },
      },
    } as any)

    expect(data.readerPreferences).toEqual(resolveReaderOptions({
      width: { presets: ['wide'] },
      theme: { presets: [{ name: 'forest', tokens: { 'vp-c-bg': '#eef5ec' } }] },
    }))
    expect(data.readerPreferences!.width!.presets).toEqual(['wide'])
    expect(data.locales!['/en/'].readerPreferences!.theme!.presets[1]).toEqual({
      name: 'forest',
      label: 'Forest',
      color: '#eef5ec',
      tokens: { '--vp-c-bg': '#eef5ec' },
      attribute: 'forest@/en/',
    })
  })

  it('injects null when the feature is disabled', async () => {
    const { resolveThemeData } = await import('../features/theme-data.js')

    const data = resolveThemeData({} as any, { locales: { '/': {} } } as any)

    expect(data.readerPreferences).toBeNull()
    expect(data.locales!['/'].readerPreferences).toBeNull()
  })
})

describe('collectReaderLocales', () => {
  it('keeps the disabled locales as stop markers, longest prefix first', () => {
    const locales = collectReaderLocales({
      readerPreferences: true,
      locales: {
        '/': { readerPreferences: true },
        '/en/': { readerPreferences: true },
        '/ja/': { readerPreferences: false },
      },
    } as any)

    expect(locales.map(locale => locale.prefix)).toEqual(['/en/', '/ja/', '/'])
    // 关闭的语言保留标记（`options` 为 `null`），脚本命中后不会回退到根语言
    expect(locales.find(locale => locale.prefix === '/ja/')!.options).toBeNull()
  })
})

describe('build artifacts', () => {
  it('does not create pages', () => {
    const source = readFileSync(
      new URL('../pages/createPages.ts', import.meta.url),
      'utf-8',
    )

    expect(source).not.toContain('reader')
  })
})
