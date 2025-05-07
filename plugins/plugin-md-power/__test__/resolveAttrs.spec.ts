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
})

describe('resolveAttr(info, key)', () => {
  it('should resolve attr', () => {
    expect(resolveAttr('a="1"', 'a')).toEqual('1')
    expect(resolveAttr('a="1"', 'b')).toEqual(undefined)
    expect(resolveAttr('a=1', 'a')).toEqual('1')
    expect(resolveAttr('a=\'1\'', 'a')).toEqual('1')
    expect(resolveAttr('a', 'a')).toEqual(undefined)
  })
})
