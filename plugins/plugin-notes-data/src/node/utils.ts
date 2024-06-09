export function ensureArray<T>(thing: T | T[] | null | undefined): T[] {
  if (Array.isArray(thing))
    return thing
  if (thing === null || thing === undefined)
    return []
  return [thing]
}

export function normalizePath(str: string) {
  return str.replace(/\\+/g, '/')
}

export function wait(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}
