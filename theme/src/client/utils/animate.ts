/**
 * Tweening algorithm for smooth animation
 * Implements cubic easing function for natural motion
 *
 * 缓动算法，用于平滑动画
 * 实现立方缓动函数以获得自然的运动效果
 *
 * @param t - Current time (progress from 0 to d) / 当前时间（从 0 到 d 的进度）
 * @param b - Beginning value (initial value) / 初始值
 * @param c - Change in value (target - initial) / 变化量（目标值 - 初始值）
 * @param d - Duration (total time) / 持续时间（总时间）
 * @returns The current value at time t / 时间 t 时的当前值
 */
export function tween(t: number, b: number, c: number, d: number): number {
  return c * (t /= d) * t * t + b
}

/**
 * Linear interpolation for animation
 * Provides constant speed motion without easing
 *
 * 线性插值动画
 * 提供匀速运动，无缓动效果
 *
 * @param t - Current time (progress from 0 to d) / 当前时间（从 0 到 d 的进度）
 * @param b - Beginning value (initial value) / 初始值
 * @param c - Change in value (target - initial) / 变化量（目标值 - 初始值）
 * @param d - Duration (total time) / 持续时间（总时间）
 * @returns The current value at time t / 时间 t 时的当前值
 */
export function linear(t: number, b: number, c: number, d: number): number {
  return (c * t) / d + b
}
