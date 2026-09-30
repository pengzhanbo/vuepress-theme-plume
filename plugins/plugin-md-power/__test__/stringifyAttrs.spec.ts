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

  it('should handle like json string values with force stringify', () => {
    expect(stringifyAttrs({ id: '{ "foo": "bar", baz: 1 }', class: '["a", "b"]' }, false, ['class'])).toBe(' :id="{ \'foo\': \'bar\', baz: 1 }" class="[\'a\', \'b\']"')
  })

  it('should handle kebabCase keys', () => {
    expect(stringifyAttrs({ 'data-foo': 'bar', 'data-baz': 1, 'fooBaz': 'bar' })).toBe(' data-foo="bar" :data-baz="1" foo-baz="bar"')
  })

  it('should handle empty string values', () => {
    expect(stringifyAttrs({ id: '' })).toBe(' id=""')
  })

  it('should handle special characters in values', () => {
    expect(stringifyAttrs({ 'data-value': '<script>alert(1)</script>' }))
      .toBe(' data-value="&lt;script&gt;alert(1)&lt;/script&gt;"')
  })

  it('should escape quotes to prevent attribute breakout', () => {
    expect(stringifyAttrs({ title: 'a" onmouseover="alert(1)' }))
      .toBe(' title="a&quot; onmouseover=&quot;alert(1)"')
  })

  it('should escape quotes in dynamic attribute values', () => {
    expect(stringifyAttrs({ ':title': 'a" onmouseover="alert(1)' }))
      .toBe(' :title="a&quot; onmouseover=&quot;alert(1)"')
  })

  it('should escape ampersands', () => {
    expect(stringifyAttrs({ title: 'a & b' })).toBe(' title="a &amp; b"')
  })

  it('should escape like json string values', () => {
    expect(stringifyAttrs({ id: '{ "a": "<b>" }' })).toBe(' :id="{ \'a\': \'&lt;b&gt;\' }"')
  })

  it('should handle unicode values', () => {
    expect(stringifyAttrs({ title: '你好世界' })).toBe(' title="你好世界"')
    expect(stringifyAttrs({ 'data-emoji': '🎉🎊' })).toBe(' data-emoji="🎉🎊"')
  })

  it('should handle zero values', () => {
    expect(stringifyAttrs({ width: 0, height: 0 })).toBe(' :width="0" :height="0"')
  })

  it('should handle negative numbers', () => {
    expect(stringifyAttrs({ offset: -1 })).toBe(' :offset="-1"')
  })

  it('should handle float numbers', () => {
    expect(stringifyAttrs({ ratio: 1.5 })).toBe(' :ratio="1.5"')
  })
})
