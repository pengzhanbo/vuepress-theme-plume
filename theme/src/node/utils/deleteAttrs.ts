export function deleteAttrs<
  T extends Record<string, any> = Record<string, any>,
>(obj: T, ...attrs: (keyof T)[]): Omit<T, keyof T> {
  const res = {} as T

  for (const key in obj) {
    if (!attrs.includes(key)) {
      res[key] = obj[key]
    }
  }
  return res
}
