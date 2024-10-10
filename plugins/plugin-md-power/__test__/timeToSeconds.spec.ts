import { describe, expect, it } from 'vitest'
import { timeToSeconds } from '../src/node/utils/timeToSeconds.js'

describe('timeToSeconds(timeLike)', () => {
  it('should return seconds', () => {
    expect(timeToSeconds('')).toBe(0)
    expect(timeToSeconds('1')).toBe(1)
    expect(timeToSeconds('69')).toBe(69)
  })

  it('should return seconds with h:m:s', () => {
    expect(timeToSeconds('1:2')).toBe(62)
    expect(timeToSeconds('1:2:3')).toBe(3723)
    expect(timeToSeconds('1:2:3.4')).toBe(3723.4)
    expect(timeToSeconds('1:2:')).toBe(3720)
    expect(timeToSeconds(':2:3')).toBe(123)
    expect(timeToSeconds('::3')).toBe(3)
  })

  it('show return seconds with include incorrect char', () => {
    expect(timeToSeconds('1:a:b')).toBe(3600)
    expect(timeToSeconds('1:2:a')).toBe(3720)
    expect(timeToSeconds('a:b')).toBe(0)
    expect(timeToSeconds('a : b : c')).toBe(0)
  })
})
