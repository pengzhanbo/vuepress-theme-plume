export function ensureArray<T>(thing: T | T[] | null | undefined): T[] {
  if (Array.isArray(thing))
    return thing
  if (thing === null || thing === undefined)
    return []
  return [thing]
}

export function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0
}
