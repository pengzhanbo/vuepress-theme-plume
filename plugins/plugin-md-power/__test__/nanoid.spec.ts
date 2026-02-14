import { describe, expect, it } from 'vitest'
import { nanoid } from '../src/node/utils/nanoid.js'

describe('nanoid', () => {
  it('should generate id with default length', () => {
    const id = nanoid()
    expect(id).toHaveLength(5)
    expect(id).toMatch(/^[a-z]+$/)
  })

  it('should generate id with custom length', () => {
    expect(nanoid(10)).toHaveLength(10)
    expect(nanoid(1)).toHaveLength(1)
    expect(nanoid(20)).toHaveLength(20)
  })

  it('should generate unique ids', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(nanoid())
    }
    expect(ids.size).toBe(100)
  })

  it('should only contain lowercase letters', () => {
    const id = nanoid(100)
    expect(id).toMatch(/^[a-z]+$/)
  })
})
