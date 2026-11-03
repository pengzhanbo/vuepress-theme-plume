import { clamp } from '@pengzhanbo/utils'
/**
 * Color helpers used by the build pipeline.
 *
 * 构建流程中使用的颜色工具。
 */

/**
 * RGB color, each channel is in the range `0-255`.
 *
 * RGB 颜色，每个通道的取值范围为 `0-255`。
 */
export type RGBColor = readonly [red: number, green: number, blue: number]

/**
 * Convert an HSL color to an RGB color.
 *
 * 将 HSL 颜色转换为 RGB 颜色。
 *
 * @param hue - Hue in degrees, `0-360` / 色相，单位为度，`0-360`
 * @param saturation - Saturation, `0-1` / 饱和度，`0-1`
 * @param lightness - Lightness, `0-1` / 亮度，`0-1`
 * @returns RGB color / RGB 颜色
 */
export function hslToRgb(hue: number, saturation: number, lightness: number): RGBColor {
  const h = ((hue % 360) + 360) % 360
  const s = clamp(saturation, 0, 1)
  const l = clamp(lightness, 0, 1)

  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - chroma / 2

  let channels: [number, number, number]
  if (h < 60)
    channels = [chroma, x, 0]
  else if (h < 120)
    channels = [x, chroma, 0]
  else if (h < 180)
    channels = [0, chroma, x]
  else if (h < 240)
    channels = [0, x, chroma]
  else if (h < 300)
    channels = [x, 0, chroma]
  else
    channels = [chroma, 0, x]

  return [
    (channels[0] + m) * 255,
    (channels[1] + m) * 255,
    (channels[2] + m) * 255,
  ]
}

/**
 * Round the channels of a color to integers, which is how the browser renders it.
 *
 * 将颜色通道取整，与浏览器渲染的结果保持一致。
 *
 * @param color - Color to round / 要取整的颜色
 * @returns Rounded RGB color / 取整后的 RGB 颜色
 */
export function roundColor(color: RGBColor): RGBColor {
  const [red, green, blue] = color
  return [
    Math.round(clamp(red, 0, 255)),
    Math.round(clamp(green, 0, 255)),
    Math.round(clamp(blue, 0, 255)),
  ]
}

/**
 * Format an RGB color as a `rgb()` / `rgba()` color string.
 *
 * 将 RGB 颜色格式化为 `rgb()` / `rgba()` 颜色字符串。
 *
 * @param color - RGB color / RGB 颜色
 * @param alpha - Alpha channel, `0-1`, omit it for `rgb()` / 透明度，`0-1`，省略时输出 `rgb()`
 * @returns `rgb()` or `rgba()` color / `rgb()` 或 `rgba()` 颜色
 */
export function toRgbColor(color: RGBColor, alpha?: number): string {
  const [red, green, blue] = roundColor(color)
  return alpha === undefined
    ? `rgb(${red}, ${green}, ${blue})`
    : `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

/**
 * Composite a translucent color over an opaque background.
 *
 * 将半透明颜色叠加到不透明背景色上。
 *
 * @param foreground - Translucent color / 半透明颜色
 * @param alpha - Alpha channel of the foreground, `0-1` / 前景色的透明度，`0-1`
 * @param background - Opaque background color / 不透明背景色
 * @returns Composited RGB color / 叠加后的 RGB 颜色
 */
export function compositeColor(
  foreground: RGBColor,
  alpha: number,
  background: RGBColor,
): RGBColor {
  const [fr, fg, fb] = foreground
  const [br, bg, bb] = background
  const a = clamp(alpha, 0, 1)
  return [
    fr * a + br * (1 - a),
    fg * a + bg * (1 - a),
    fb * a + bb * (1 - a),
  ]
}

/**
 * Convert a single sRGB channel to the linear color space.
 *
 * 将单个 sRGB 通道转换为线性颜色空间。
 *
 * @param channel - sRGB channel, `0-255` / sRGB 通道值，`0-255`
 */
function channelToLinear(channel: number): number {
  const c = clamp(channel, 0, 255) / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/**
 * Resolve the relative luminance defined by WCAG 2.x.
 *
 * 计算 WCAG 2.x 定义的相对亮度。
 *
 * @param color - RGB color / RGB 颜色
 * @returns Relative luminance, `0-1` / 相对亮度，`0-1`
 */
export function relativeLuminance(color: RGBColor): number {
  const [red, green, blue] = roundColor(color)
  return (
    0.2126 * channelToLinear(red)
    + 0.7152 * channelToLinear(green)
    + 0.0722 * channelToLinear(blue)
  )
}

/**
 * Resolve the contrast ratio defined by WCAG 2.x, in the range `1-21`.
 *
 * 计算 WCAG 2.x 定义的对比度，取值范围为 `1-21`。
 *
 * @param a - First color / 第一个颜色
 * @param b - Second color / 第二个颜色
 * @returns Contrast ratio / 对比度
 */
export function contrastRatio(a: RGBColor, b: RGBColor): number {
  const luminanceA = relativeLuminance(a)
  const luminanceB = relativeLuminance(b)
  const lighter = Math.max(luminanceA, luminanceB)
  const darker = Math.min(luminanceA, luminanceB)
  return (lighter + 0.05) / (darker + 0.05)
}
