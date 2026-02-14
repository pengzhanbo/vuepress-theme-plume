import { describe, expect, it } from 'vitest'
import { resolveAttr, resolveAttrs } from '../src/node/utils/resolveAttrs.js'

describe('resolveAttrs(info)', () => {
  it('should resolve attrs', () => {
    expect(resolveAttrs('')).toEqual({ rawAttrs: '', attrs: {} })

    expect(resolveAttrs('a="1"')).toEqual({
      rawAttrs: 'a="1"',
      attrs: { a: '1' },
    })

    expect(resolveAttrs('a=1 b=2 c d=""')).toEqual({
      rawAttrs: 'a=1 b=2 c d=""',
      attrs: { a: '1', b: '2', c: true, d: '' },
    })

    expect(resolveAttrs('a=1 b=true c=false')).toEqual({
      rawAttrs: 'a=1 b=true c=false',
      attrs: { a: '1', b: true, c: false },
    })

    expect(resolveAttrs('a="1" b="2"')).toMatchObject({
      rawAttrs: 'a="1" b="2"',
      attrs: { a: '1', b: '2' },
    })

    expect(resolveAttrs('a="1" b="2" c')).toEqual({
      rawAttrs: 'a="1" b="2" c',
      attrs: { a: '1', b: '2', c: true },
    })

    expect(resolveAttrs('a b="true" c="false"')).toEqual({
      rawAttrs: 'a b="true" c="false"',
      attrs: { a: true, b: true, c: false },
    })
  })

  it('should resolve attrs with include `-`', () => {
    expect(resolveAttrs('foo-bar="1" fizz-buzz')).toEqual({
      rawAttrs: 'foo-bar="1" fizz-buzz',
      attrs: { fooBar: '1', fizzBuzz: true },
    })
  })

  it('should handle single quotes', () => {
    expect(resolveAttrs('a=\'1\'')).toEqual({
      rawAttrs: 'a=\'1\'',
      attrs: { a: '1' },
    })
  })

  it('should handle mixed quotes', () => {
    expect(resolveAttrs('a="1" b=\'2\'')).toEqual({
      rawAttrs: 'a="1" b=\'2\'',
      attrs: { a: '1', b: '2' },
    })
  })

  it('should handle values with spaces in quotes', () => {
    expect(resolveAttrs('title="hello world"')).toEqual({
      rawAttrs: 'title="hello world"',
      attrs: { title: 'hello world' },
    })
  })

  it('should handle special characters in values', () => {
    expect(resolveAttrs('data-value="<script>"')).toEqual({
      rawAttrs: 'data-value="<script>"',
      attrs: { dataValue: '<script>' },
    })
  })

  it('should handle unicode values', () => {
    expect(resolveAttrs('title="你好世界"')).toEqual({
      rawAttrs: 'title="你好世界"',
      attrs: { title: '你好世界' },
    })
  })

  it('should handle numeric string values', () => {
    expect(resolveAttrs('width="100" height="200"')).toEqual({
      rawAttrs: 'width="100" height="200"',
      attrs: { width: '100', height: '200' },
    })
  })

  it('should handle empty value with quotes', () => {
    expect(resolveAttrs('a=""')).toEqual({
      rawAttrs: 'a=""',
      attrs: { a: '' },
    })
  })

  it('should handle multiple spaces between attrs', () => {
    expect(resolveAttrs('a="1"   b="2"')).toEqual({
      rawAttrs: 'a="1"   b="2"',
      attrs: { a: '1', b: '2' },
    })
  })
})

describe('resolveAttr(info, key)', () => {
  it('should resolve attr', () => {
    expect(resolveAttr('a="1"', 'a')).toEqual('1')
    expect(resolveAttr('a="1"', 'b')).toEqual(undefined)
    expect(resolveAttr('a=1', 'a')).toEqual('1')
    expect(resolveAttr('a=\'1\'', 'a')).toEqual('1')
    expect(resolveAttr('a', 'a')).toEqual(undefined)
  })

  it('should return undefined for missing key', () => {
    expect(resolveAttr('', 'a')).toEqual(undefined)
    expect(resolveAttr('b="1"', 'a')).toEqual(undefined)
  })

  it('should return first match for duplicate keys', () => {
    expect(resolveAttr('a="1" a="2"', 'a')).toEqual('1')
  })
})
