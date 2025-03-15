/**
 * A literal type that supports custom further strings but preserves autocompletion in IDEs.
 *
 * @see [copied from issue](https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609)
 */
export type LiteralUnion<Union extends Base, Base = string> =
  | Union
  | (Base & { zz_IGNORE_ME?: never })

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

export type UnionToTuple<T> =
  UnionToIntersection<
    T extends any ? () => T : never
  > extends () => infer R
    ? [...UnionToTuple<Exclude<T, R>>, R]
    : []
