/**
 * Type for values that can be either a value or a Promise of that value
 *
 * 可以是值或该值 Promise 的类型
 *
 * @typeParam T - The type of the value / 值的类型
 */
export type Awaitable<T> = T | Promise<T>

/**
 * Get the default export from a module, or the module itself if no default export
 *
 * 从模块获取默认导出，如果没有默认导出则返回模块本身
 *
 * @param m - Module or Promise of module / 模块或模块的 Promise
 * @returns Default export or module itself / 默认导出或模块本身
 * @typeParam T - Module type / 模块类型
 */
export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}
