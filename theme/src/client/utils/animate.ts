/**
 * @method 缓动算法
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 */
export function tween(t: number, b: number, c: number, d: number): number {
  return c * (t /= d) * t * t + b
}

export function linear(t: number, b: number, c: number, d: number): number {
  return (c * t) / d + b
}
