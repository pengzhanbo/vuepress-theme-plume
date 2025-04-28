import { describe, expect, it } from 'vitest'
import { stringifyAttrs } from '../src/node/utils/stringifyAttrs.js'

describe('stringifyAttrs', () => {
  it('should handle empty attributes', () => {
    expect(stringifyAttrs({})).toBe('')
  })

  it('should handle single attribute', () => {
    expect(stringifyAttrs({ id: 'test' })).toBe(' id="test"')
  })

  it('should handle multiple attributes', () => {
    expect(stringifyAttrs({ id: 'test', class: 'my-class' })).toBe(' id="test" class="my-class"')
  })

  it('should handle boolean attributes', () => {
    expect(stringifyAttrs({ disabled: true, readonly: false, checked: 'true', selected: 'false' })).toBe(' disabled checked')
  })

  it('should handle dymamic attributes', () => {
    expect(stringifyAttrs({ ':id': 'test' })).toBe(' :id="test"')
  })

  it('should handle null and undefined values', () => {
    expect(stringifyAttrs({ id: null, class: undefined })).toBe('')
    expect(stringifyAttrs({ id: null, class: undefined, foo: 'undefined', bar: 'null' }, true)).toBe(' :id="null" :class="undefined" :foo="undefined" :bar="null"')
  })

  it('should handle mixed attribute types', () => {
    expect(stringifyAttrs({ id: 'test', disabled: true, title: 'hello' })).toBe(' id="test" disabled title="hello"')
  })

  it('should ignore prototype properties', () => {
    const attrs = Object.create({ prototypeProp: 'value' })
    attrs.id = 'test'
    expect(stringifyAttrs(attrs)).toBe(' id="test"')
  })

  it('should handle number attributes', () => {
    expect(stringifyAttrs({ id: 1, class: 2 })).toBe(' :id="1" :class="2"')
  })

  it('should handle like json string values', () => {
    expect(stringifyAttrs({ id: '{ "foo": "bar", baz: 1 }', class: '["a", "b"]' })).toBe(' :id="{ \'foo\': \'bar\', baz: 1 }" :class="[\'a\', \'b\']"')
  })

  it('should handle kebabCase keys', () => {
    expect(stringifyAttrs({ 'data-foo': 'bar', 'data-baz': 1, 'fooBaz': 'bar' })).toBe(' data-foo="bar" :data-baz="1" foo-baz="bar"')
  })
})
