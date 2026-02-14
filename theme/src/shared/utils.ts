/**
 * A literal type that supports custom further strings but preserves autocompletion in IDEs.
 *
 * 支持自定义字符串字面量的类型，同时保留 IDE 中的自动补全功能。
 *
 * @see [copied from issue](https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609)
 *
 * @template Union - The union type of allowed literal values / 允许的字符串字面量联合类型
 * @template Base - The base type, defaults to string / 基础类型，默认为 string
 */
export type LiteralUnion<Union extends Base, Base = string>
  = | Union
    | (Base & { zz_IGNORE_ME?: never })

/**
 * Convert union type to intersection type
 * Uses distributive conditional types and function parameter inference
 *
 * 将联合类型转换为交叉类型
 * 使用分配条件类型和函数参数推断
 *
 * @template U - The union type to convert / 要转换的联合类型
 */
type UnionToIntersection<U>
  = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

/**
 * Convert union type to tuple type
 * Recursively extracts each member of the union into a tuple
 *
 * 将联合类型转换为元组类型
 * 递归地将联合类型的每个成员提取到元组中
 *
 * @template T - The union type to convert / 要转换的联合类型
 */
export type UnionToTuple<T>
  = UnionToIntersection<
    T extends any ? () => T : never
  > extends () => infer R
    ? [...UnionToTuple<Exclude<T, R>>, R]
    : []
