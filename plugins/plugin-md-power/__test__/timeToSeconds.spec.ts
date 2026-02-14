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

  it('should handle zero values', () => {
    expect(timeToSeconds('0')).toBe(0)
    expect(timeToSeconds('0:0')).toBe(0)
    expect(timeToSeconds('0:0:0')).toBe(0)
  })

  it('should handle large values', () => {
    expect(timeToSeconds('100:00:00')).toBe(360000)
    expect(timeToSeconds('99:59:59')).toBe(359999)
  })

  it('should handle decimal seconds', () => {
    expect(timeToSeconds('1.5')).toBe(1.5)
    expect(timeToSeconds('1:30.5')).toBe(90.5)
    expect(timeToSeconds('1:1:1.999')).toBe(3661.999)
  })

  it('should handle leading zeros', () => {
    expect(timeToSeconds('01:02:03')).toBe(3723)
    expect(timeToSeconds('001:002:003')).toBe(3723)
  })

  it('should handle trailing zeros', () => {
    expect(timeToSeconds('10:20:30')).toBe(37230)
  })

  it('should handle whitespace', () => {
    expect(timeToSeconds(' 1:2:3 ')).toBe(3723)
    expect(timeToSeconds('1 : 2 : 3')).toBe(3723)
  })
})
