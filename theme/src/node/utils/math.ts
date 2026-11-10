/**
 * Numeric helpers shared by the option normalizers.
 *
 * 配置归一化共用的数值工具。
 */

/**
 * Clamp a number into the `[min, max]` range.
 *
 * 将数值收敛到 `[min, max]` 区间。
 *
 * @param value - Raw value, non finite values fall back to `min` / 原始值，非有限数回退为 `min`
 * @param min - Lower bound / 下界
 * @param max - Upper bound / 上界
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value))
    return min

  return Math.min(Math.max(value, min), max)
}

/**
 * Clamp a number into the `[min, max]` range and round it into an integer.
 *
 * 将数值收敛到 `[min, max]` 区间并取整。
 *
 * @param value - Raw value / 原始值
 * @param min - Lower bound / 下界
 * @param max - Upper bound / 上界
 */
export function clampInteger(value: number, min: number, max: number): number {
  return Math.round(clamp(value, min, max))
}
