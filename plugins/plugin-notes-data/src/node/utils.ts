import { createHash } from 'node:crypto'

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

export function hash(content: string): string {
  return createHash('md5').update(content).digest('hex')
}
