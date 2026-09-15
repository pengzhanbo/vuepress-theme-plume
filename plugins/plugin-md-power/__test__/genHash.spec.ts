import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { genHash } from '../src/node/utils/genHash.js'

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

describe('genHash', () => {
  it('should hash primitive values', () => {
    expect(genHash('hello')).toBe(sha256('hello'))
    expect(genHash(123)).toBe(sha256('123'))
    expect(genHash(true)).toBe(sha256('true'))
  })

  it('should hash object values with JSON.stringify', () => {
    expect(genHash({ a: 1 })).toBe(sha256(JSON.stringify({ a: 1 })))
    expect(genHash(['a', 'b'])).toBe(sha256(JSON.stringify(['a', 'b'])))
  })

  it('should truncate hash when length is provided', () => {
    expect(genHash('hello', 8)).toHaveLength(8)
    expect(genHash('hello', 8)).toBe(sha256('hello').slice(0, 8))
  })

  it('should not truncate hash when length is undefined', () => {
    expect(genHash('hello', undefined)).toBe(sha256('hello'))
  })
})
