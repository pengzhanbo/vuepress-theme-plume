import { describe, expect, it } from 'vitest'
import { parseRect } from '../src/node/utils/parseRect.js'

describe('parseRect(str)', () => {
  it('should parse rect', () => {
    expect(parseRect('')).toBe('')
    expect(parseRect('1')).toBe('1px')
    expect(parseRect('1px')).toBe('1px')
    expect(parseRect('1%')).toBe('1%')
    expect(parseRect('1em')).toBe('1em')
    expect(parseRect('1cm')).toBe('1cm')
  })

  it('should parse rect with unit', () => {
    expect(parseRect('1', 'px')).toBe('1px')
    expect(parseRect('1px', 'px')).toBe('1px')
    expect(parseRect('1%', 'px')).toBe('1%')
    expect(parseRect('1em', 'px')).toBe('1em')
  })
})
