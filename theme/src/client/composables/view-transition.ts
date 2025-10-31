import type { TransitionOptions } from '../../shared/index.js'

type TransitionMode = Exclude<TransitionOptions['appearance'], boolean>
interface TransitionResult extends PropertyIndexedKeyframes {
  duration?: number
}

type TransitionStrategy = {
  [key in NonNullable<TransitionMode>]: (
    reverse: (effect: string[]) => string[],
    context: { x: number, y: number, isDark: boolean },
  ) => TransitionResult
}

const strategy: TransitionStrategy = {
  // 淡入淡出
  'fade': reverse => ({ opacity: reverse(['0', '1']), duration: 300 }),
  // 圆形裁剪
  'circle-clip': (reverse, { x, y }) => ({
    clipPath: reverse([
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )}px at ${x}px ${y}px)`,
    ]),
    duration: 650,
  }),
  // 横向裁剪
  'horizontal-clip': reverse => ({
    clipPath: reverse([
      `inset(0px ${innerWidth}px 0px 0px)`,
      `inset(0px 0px 0px 0px)`,
    ]),
  }),
  // 纵向裁剪
  'vertical-clip': reverse => ({
    clipPath: reverse([
      `inset(0px 0px ${innerHeight}px 0px)`,
      `inset(0px 0px 0px 0px)`,
    ]),
  }),
  // 倾斜裁剪
  'skew-clip': reverse => ({
    clipPath: reverse([
      'polygon(0px 0px, 0px 0px, 0px 0px)',
      `polygon(0px 0px, ${innerWidth * 2}px 0px, 0px ${innerHeight * 2}px)`,
    ]),
  }),

  // 百叶窗效果 上下展开
  'blinds-vertical': reverse => ({
    clipPath: reverse([
      'inset(50% 0% 50% 0%)',
      'inset(0 0 0 0)',
    ]),
  }),
  // 百叶窗效果 左右展开
  'blinds-horizontal': reverse => ({
    clipPath: reverse([
      'polygon(50% 0, 50% 100%, 50% 100%, 50% 0)',
      'polygon(0 0, 0 100%, 100% 100%, 100% 0)',
    ]),
  }),
  // 模糊淡出
  'soft-blur-fade': reverse => ({
    opacity: reverse(['0', '1']),
    filter: reverse(['blur(10px)', 'blur(0px)']),
    duration: 380,
  }),
  // 菱形裁剪展开
  'diamond-reveal': reverse => ({
    clipPath: reverse([
      `polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)`,
      `polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)`,
    ]),
    duration: 500,
  }),
}

export function resolveTransitionKeyframes(
  x: number,
  y: number,
  mode: TransitionMode,
  isDark: boolean,
): {
  keyframes: PropertyIndexedKeyframes
  duration: number
} {
  if (!mode || !strategy[mode])
    mode = 'fade'

  const reverse = (effect: string[]): string[] => {
    return isDark ? effect.reverse() : effect
  }

  const { duration = 400, ...keyframes } = strategy[mode](reverse, { x, y, isDark })
  return { keyframes, duration }
}
