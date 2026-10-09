/**
 * Whether the home hero background effect should be deferred.
 *
 * 首页 Hero 背景动画是否应降级。
 *
 * The hero effects are full-screen `requestAnimationFrame` render loops (three,
 * ogl, gsap), which the global `prefers-reduced-motion` CSS fallback can not
 * reach, so the effect is skipped and degraded to the static background when:
 *
 * - the user prefers reduced motion (accessibility),
 * - the browser is in data-saver mode,
 * - a low-end touch device is detected (few logical cores + coarse pointer),
 *   where the loop keeps the GPU busy and causes jank and heat.
 *
 * Hero 动画是由 `requestAnimationFrame` 驱动的全屏 WebGL / Canvas 渲染循环
 * （three、ogl、gsap），全局的 `prefers-reduced-motion` CSS 兜底无法覆盖它们。
 * 因此在上述场景下统一跳过动画，回退为静态背景。
 *
 * @returns `true` when the effect should be skipped / 应跳过动画时返回 `true`
 */
export function shouldDeferHeroEffect(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false

  const matches = (query: string): boolean => window.matchMedia(query).matches

  if (matches('(prefers-reduced-motion: reduce)'))
    return true

  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } }
  if (connection?.saveData)
    return true

  const cores = navigator.hardwareConcurrency

  return typeof cores === 'number' && cores > 0 && cores <= 4
    && matches('(pointer: coarse)')
}
