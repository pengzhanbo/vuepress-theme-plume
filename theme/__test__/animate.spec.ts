import { describe, expect, it } from 'vitest'
import { linear, tween } from '../src/client/utils/animate.js'

describe('tween', () => {
  it('starts at the beginning value and ends at the target', () => {
    expect(tween(0, 10, 90, 100)).toBe(10)
    expect(tween(100, 10, 90, 100)).toBe(100)
  })

  it('eases with a cubic curve', () => {
    // c * (t / d)^3 + b
    expect(tween(50, 0, 100, 100)).toBe(12.5)
    expect(tween(50, 0, 100, 100)).toBeLessThan(linear(50, 0, 100, 100))
  })

  it('supports a negative change for scrolling upwards', () => {
    expect(tween(0, 100, -100, 100)).toBe(100)
    expect(tween(100, 100, -100, 100)).toBe(0)
  })
})

describe('linear', () => {
  it('moves at a constant speed', () => {
    expect(linear(0, 0, 100, 100)).toBe(0)
    expect(linear(50, 0, 100, 100)).toBe(50)
    expect(linear(100, 0, 100, 100)).toBe(100)
  })

  it('applies the beginning value as an offset', () => {
    expect(linear(25, 10, 20, 100)).toBe(15)
  })
})
