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

  it('should handle zero value', () => {
    expect(parseRect('0')).toBe('0px')
    expect(parseRect('0px')).toBe('0px')
    expect(parseRect('0%')).toBe('0%')
  })

  it('should handle decimal values', () => {
    expect(parseRect('1.5')).toBe('1.5px')
    expect(parseRect('0.5em')).toBe('0.5em')
    expect(parseRect('50.5%')).toBe('50.5%')
  })

  it('should handle negative values', () => {
    expect(parseRect('-1')).toBe('-1px')
    expect(parseRect('-10px')).toBe('-10px')
    expect(parseRect('-5%')).toBe('-5%')
  })

  it('should handle large values', () => {
    expect(parseRect('10000')).toBe('10000px')
    expect(parseRect('9999px')).toBe('9999px')
  })

  it('should handle various units', () => {
    expect(parseRect('1rem')).toBe('1rem')
    expect(parseRect('1vh')).toBe('1vh')
    expect(parseRect('1vw')).toBe('1vw')
    expect(parseRect('1pt')).toBe('1pt')
    expect(parseRect('1mm')).toBe('1mm')
    expect(parseRect('1in')).toBe('1in')
  })

  it('should handle non-numeric values', () => {
    expect(parseRect('auto')).toBe('auto')
    expect(parseRect('abc')).toBe('abc')
  })

  it('should handle calc expressions', () => {
    expect(parseRect('calc(100% - 20px)')).toBe('calc(100% - 20px)')
  })
})
