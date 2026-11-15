import type { ReaderScriptLocale } from './options.js'

/**
 * Media query of the screens that can use the desktop-only controls.
 *
 * Must stay in sync with `READER_DESKTOP_QUERY` in
 * `client/utils/reader.ts`: the inline script runs before any module, so it
 * carries its own copy instead of importing the client one.
 *
 * 能使用桌面专属控件的屏幕宽度。
 *
 * 必须与 `client/utils/reader.ts` 中的 `READER_DESKTOP_QUERY` 保持一致：
 * 内联脚本先于任何模块执行，因此自带一份常量而不是从客户端引入。
 */
const DESKTOP_QUERY = '(min-width: 769px)'

/**
 * Placeholder of the reader script in `build.html`.
 *
 * `build.html` 中阅读偏好脚本的占位符。
 */
export const READER_SCRIPT_PLACEHOLDER = '<!--vuepress-theme-plume-reader-->'

/**
 * Escape a value before embedding it into an inline `<script>`.
 *
 * `<` is the only character that can terminate the script block, so it is the
 * only one that has to be escaped. JSON already escapes quotes and backslashes.
 *
 * 在嵌入内联 `<script>` 前转义取值。
 *
 * `<` 是唯一可能提前终止脚本块的字符，因此只需转义它；引号与反斜杠已由 JSON 处理。
 *
 * @param value - Value to embed / 待嵌入的取值
 */
function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003C')
}

/**
 * 生成在首帧前应用阅读偏好的内联脚本。
 *
 * @param locales - Locales that enabled the feature / 启用了该功能的语言
 * @param base - Site base / 站点 `base`
 * @returns The inline script, or `null` when nothing is enabled / 内联脚本，全部关闭时为 `null`
 */
export function generateReaderScript(
  locales: ReaderScriptLocale[],
  base: string,
): string | null {
  if (!locales.length)
    return null

  const enableWidth = locales.some(({ options }) => options.width)
  const enableTheme = locales.some(({ options }) => options.theme)
  const enableBrand = locales.some(({ options }) => options.brand)
  const enableFocus = locales.some(({ options }) => options.focusMode)

  // `default` 表示「不覆盖」，不写入属性，因此不进白名单
  const paletteNames = (palettes: { name: string }[] | undefined): string[] =>
    (palettes ?? []).map(palette => palette.name).filter(name => name !== 'default')

  const data = locales.map(({ prefix, options }) => ({
    p: prefix,
    k: `${options.storagePrefix}:reader:prefs`,
    ...(options.width ? { w: options.width.presets } : {}),
    ...(options.theme ? { t: paletteNames(options.theme.presets) } : {}),
    ...(options.brand ? { b: paletteNames(options.brand.presets) } : {}),
    ...(options.focusMode ? { f: 1 } : {}),
  }))

  const parts = [
    ';(function(){try{',
    'var d=document.documentElement,',
    `b=${serialize(base)},`,
    'p=location.pathname;',
    `if(b!=='/'&&p.indexOf(b)===0)p='/'+p.slice(b.length);`,
    `var L=${serialize(data)},e=null,i;`,
    'for(i=0;i<L.length;i++){if(p.indexOf(L[i].p)===0){e=L[i];break}}',
    'if(!e)return;',
    'var r=localStorage.getItem(e.k),v=r?JSON.parse(r):null;',
    `if(!v||typeof v!=='object')v={};`,
    // 小屏上宽度与专注模式会被禁用，首帧也不写入，避免先闪一次宽布局
    `var q=window.matchMedia,dk=!q||q(${serialize(DESKTOP_QUERY)}).matches;`,
  ]

  if (enableWidth)
    parts.push(`if(dk&&e.w&&e.w.indexOf(v.width)>-1)d.setAttribute('data-reader-width',v.width);`)

  if (enableTheme) {
    parts.push(
      `if(e.t&&e.t.indexOf(v.theme)>-1){`,
      `var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,c=d.dataset.theme;`,
      `if(!(c==='dark'||(c!=='light'&&m)))d.setAttribute('data-reader-theme',v.theme)}`,
    )
  }

  // 品牌色与深色 / 浅色无关，两种模式下都能生效
  if (enableBrand)
    parts.push(`if(e.b&&e.b.indexOf(v.brand)>-1)d.setAttribute('data-reader-brand',v.brand);`)

  if (enableFocus)
    parts.push(`if(dk&&e.f&&v.focus===true)d.setAttribute('data-reader-focus','true');`)

  parts.push('}catch(x){}})();')

  return parts.join('')
}

/**
 * Wrap the inline script into its `<script>` tag.
 *
 * 将内联脚本包装为 `<script>` 标签。
 *
 * @param script - Inline script / 内联脚本
 */
export function wrapReaderScript(script: string): string {
  return `<script id="plume-reader">${script}</script>`
}
