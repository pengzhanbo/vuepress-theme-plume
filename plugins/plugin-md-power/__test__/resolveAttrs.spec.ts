import { describe, expect, it } from 'vitest'
import { resolveAttrs } from '../src/node/utils/resolveAttrs.js'

describe('resolveAttrs(info)', () => {
  it('should resolve attrs', () => {
    expect(resolveAttrs('')).toEqual({ rawAttrs: '', attrs: {} })

    expect(resolveAttrs('a="1"')).toEqual({
      rawAttrs: 'a="1"',
      attrs: { a: '1' },
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
