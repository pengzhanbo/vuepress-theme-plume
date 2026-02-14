import { describe, expect, it } from 'vitest'
import { stringifyProp } from '../src/node/utils/stringifyProp.js'

describe('stringifyProp', () => {
  it('should stringify string', () => {
    expect(stringifyProp('hello')).toBe('"hello"')
    expect(stringifyProp('')).toBe('""')
  })

  it('should stringify number', () => {
    expect(stringifyProp(123)).toBe('123')
    expect(stringifyProp(0)).toBe('0')
    expect(stringifyProp(-1)).toBe('-1')
    expect(stringifyProp(3.14)).toBe('3.14')
  })

  it('should stringify boolean', () => {
    expect(stringifyProp(true)).toBe('true')
    expect(stringifyProp(false)).toBe('false')
  })

  it('should stringify null', () => {
    expect(stringifyProp(null)).toBe('null')
  })

  it('should stringify array', () => {
    expect(stringifyProp([1, 2, 3])).toBe('[1,2,3]')
    expect(stringifyProp(['a', 'b'])).toBe('["a","b"]')
    expect(stringifyProp([])).toBe('[]')
  })

  it('should stringify object', () => {
    expect(stringifyProp({ a: 1 })).toBe('{"a":1}')
    expect(stringifyProp({ a: 'b' })).toBe('{"a":"b"}')
    expect(stringifyProp({})).toBe('{}')
  })

  it('should escape single quotes', () => {
    expect(stringifyProp('it\'s')).toBe('"it&#39s"')
    expect(stringifyProp('\'hello\'')).toBe('"&#39hello&#39"')
    expect(stringifyProp('a\'b\'c')).toBe('"a&#39b&#39c"')
  })

  it('should handle nested objects', () => {
    expect(stringifyProp({ a: { b: 1 } })).toBe('{"a":{"b":1}}')
    expect(stringifyProp({ arr: [1, 2] })).toBe('{"arr":[1,2]}')
  })

  it('should handle special characters', () => {
    expect(stringifyProp('hello\nworld')).toBe('"hello\\nworld"')
    expect(stringifyProp('hello\tworld')).toBe('"hello\\tworld"')
    expect(stringifyProp('hello"world')).toBe('"hello\\"world"')
  })
})
