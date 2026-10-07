/**
 * Minimal shape required to resolve a post's sticky priority.
 *
 * 解析文章置顶优先级所需的最小结构。
 */
interface StickyPost {
  sticky?: boolean | number
}

/**
 * Resolve the numeric priority of a post's `sticky` frontmatter value.
 *
 * - `true` → `Number.MAX_SAFE_INTEGER`, so a plain `sticky: true` always ranks
 *   above any number.
 * - A finite positive number → the number itself (larger ranks first).
 * - Anything else (`false`, `undefined`, `0`, negative or non-finite numbers) → `0`,
 *   which means "not sticky".
 *
 * Normalizing to a single comparable number keeps the sort total and stable when
 * `true` and numbers are mixed, and makes `sticky: 0` behave as "not sticky".
 *
 * 解析文章 `sticky` frontmatter 的数值优先级。
 *
 * - `true` → `Number.MAX_SAFE_INTEGER`，使 `sticky: true` 始终排在任意数字之前；
 * - 有限正数 → 数值本身（越大越靠前）；
 * - 其他（`false`、`undefined`、`0`、负数或非有限数）→ `0`，表示不置顶。
 *
 * 统一归一化为可比较的数值，可以在 `true` 与数字混用时保持排序完整且稳定，
 * 并让 `sticky: 0` 表现为不置顶。
 */
export function resolveSticky(sticky: boolean | number | undefined | null): number {
  if (sticky === true)
    return Number.MAX_SAFE_INTEGER
  if (typeof sticky === 'number' && Number.isFinite(sticky) && sticky > 0)
    return sticky
  return 0
}

/**
 * Sort posts by sticky priority (descending) without mutating the input.
 *
 * Sticky posts are moved to the front, ordered by descending priority; the
 * remaining posts keep their original relative order. Because
 * `Array.prototype.sort` is stable, posts sharing the same priority preserve
 * the order they were provided in.
 *
 * Note that the sorted list is paginated afterwards, so sticky posts are only
 * pinned on the first page.
 *
 * 按置顶优先级降序排列文章，且不修改入参。
 *
 * 置顶文章被移动到最前并按优先级降序排列，其余文章保持原有相对顺序。由于
 * `Array.prototype.sort` 是稳定的，优先级相同的文章会保持传入顺序。
 *
 * 注意：排序后的列表会再进行分页切片，因此置顶文章仅在第 1 页置顶。
 */
export function sortPostsBySticky<T extends StickyPost>(posts: readonly T[]): T[] {
  return [...posts].sort(
    (prev, next) => resolveSticky(next.sticky) - resolveSticky(prev.sticky),
  )
}
