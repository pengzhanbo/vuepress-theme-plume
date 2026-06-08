import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { fieldPlugin, parseFieldContent } from '../src/node/container/field.js'

describe('parseFieldContent', () => {
  it('should use info as default name when no @name tag', () => {
    const result = parseFieldContent('some description', 'fieldName')
    expect(result.name).toBe('fieldName')
    expect(result.description).toBe('some description')
  })

  it('should override name with @name tag', () => {
    const result = parseFieldContent('@name overriddenName\nsome description', 'original')
    expect(result.name).toBe('overriddenName')
  })

  it('should parse @type tag', () => {
    const result = parseFieldContent('@type string', 'field')
    expect(result.type).toBe('string')
  })

  it('should parse @default tag', () => {
    const result = parseFieldContent('@default 42', 'field')
    expect(result.default).toBe('42')
  })

  it('should parse @required tag', () => {
    const result = parseFieldContent('@required', 'field')
    expect(result.required).toBe(true)
  })

  it('should parse @deprecated tag', () => {
    const result = parseFieldContent('@deprecated', 'field')
    expect(result.deprecated).toBe(true)
  })

  it('should parse @optional tag', () => {
    const result = parseFieldContent('@optional', 'field')
    expect(result.optional).toBe(true)
  })

  it('should parse @description tag', () => {
    const result = parseFieldContent('@description This is a description', 'field')
    expect(result.description).toBe('This is a description')
  })

  it('should treat unknown @tag as description text', () => {
    const result = parseFieldContent('@unknown some value', 'field')
    expect(result.description).toBe('@unknown some value')
  })

  it('should handle @tag without space (tag only, no value)', () => {
    const result = parseFieldContent('@type', 'field')
    // @type with no value, rest is empty, so type is not set
    expect(result.type).toBeUndefined()
  })

  it('should handle @name/@type/@default with empty value (not set)', () => {
    const result = parseFieldContent('@name\n@type\n@default', 'originalName')
    expect(result.name).toBe('originalName') // @name with empty rest doesn't override
    expect(result.type).toBeUndefined()
    expect(result.default).toBeUndefined()
  })

  it('should handle multiple known tags together', () => {
    const content = `\
@type number
@required
@default 0
@description The count value`
    const result = parseFieldContent(content, 'count')
    expect(result.name).toBe('count')
    expect(result.type).toBe('number')
    expect(result.required).toBe(true)
    expect(result.default).toBe('0')
    expect(result.description).toBe('The count value')
  })

  it('should handle plain text lines as description', () => {
    const result = parseFieldContent('line one\nline two', 'field')
    expect(result.description).toBe('line one\nline two')
  })

  it('should ignore empty lines and not break description', () => {
    const content = `\
first line

second line`
    const result = parseFieldContent(content, 'field')
    // Empty line is trimmed to '', and since currentDesc is truthy, it appends '\n' + ''
    // which results in 'first line\n\nsecond line'
    expect(result.description).toBe('first line\n\nsecond line')
  })

  it('should separate description paragraphs when a known tag appears between them', () => {
    const content = `\
first paragraph
@type string
second paragraph`
    const result = parseFieldContent(content, 'field')
    expect(result.type).toBe('string')
    // Known tag flushes current description, then new description starts
    expect(result.description).toBe('first paragraph\nsecond paragraph')
  })

  it('should handle mixed known tags, unknown tags, and plain text', () => {
    const content = `\
@type boolean
@required
some description here
@unknownTag extra info
more text`
    const result = parseFieldContent(content, 'field')
    expect(result.type).toBe('boolean')
    expect(result.required).toBe(true)
    expect(result.description).toBe('some description here\n@unknownTag extra info\nmore text')
  })

  it('should handle @description tag followed by plain text', () => {
    const content = `\
@description explicit desc
continued text`
    const result = parseFieldContent(content, 'field')
    expect(result.description).toBe('explicit desc\ncontinued text')
  })

  it('should handle empty content', () => {
    const result = parseFieldContent('', 'field')
    expect(result.name).toBe('field')
    expect(result.description).toBe('')
  })

  it('should handle content with only whitespace lines', () => {
    const result = parseFieldContent('   \n   \n   ', 'field')
    expect(result.name).toBe('field')
    // Whitespace-only lines are trimmed to '', and empty strings are appended
    expect(result.description).toBe('')
  })

  it('should handle @tag with multiple spaces after tag name', () => {
    const result = parseFieldContent('@type   number', 'field')
    expect(result.type).toBe('number')
  })

  it('should handle all boolean flags together', () => {
    const result = parseFieldContent('@required\n@optional\n@deprecated', 'field')
    expect(result.required).toBe(true)
    expect(result.optional).toBe(true)
    expect(result.deprecated).toBe(true)
  })

  it('should handle unknown @tag with no space', () => {
    const result = parseFieldContent('@unknownTag', 'field')
    expect(result.description).toBe('@unknownTag')
  })

  it('should handle consecutive unknown @tags', () => {
    const result = parseFieldContent('@foo bar\n@baz qux', 'field')
    expect(result.description).toBe('@foo bar\n@baz qux')
  })

  it('should handle @description with empty value then plain text', () => {
    const result = parseFieldContent('@description\ntext after', 'field')
    expect(result.description).toBe('text after')
  })

  it('should trim info parameter for name', () => {
    const result = parseFieldContent('', '  trimmedName  ')
    expect(result.name).toBe('trimmedName')
  })
})

describe('fieldPlugin', () => {
  const md = new MarkdownIt().use(fieldPlugin)

  it('::: field with attribute-style syntax (legacy)', () => {
    const code = `\
::: field name="foo" type="string" required
description
:::

::: field name="bar" type="string" optional
description
:::

::: field name="bar" type="string" deprecated default="baz"
description
:::

::: field name="foo" default="undefined"
description
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('::: field-group', () => {
    const code = `\
:::: field-group
::: field name="foo" type="string" required
description
:::

::: field name="bar" type="string" optional
description
:::
::::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('::: field with @tag syntax', () => {
    const code = `\
::: field count
@type number
@required
@default 0
@description The count value
:::
`
    const html = md.render(code)
    expect(html).toContain('name="count"')
    expect(html).toContain('required')
    expect(html).toContain('type="number"')
    expect(html).toContain('default-value="0"')
    expect(html).toContain('The count value')
  })

  it('::: field with info containing "=" uses empty name from parseFieldContent', () => {
    const code = `\
::: field name="fromAttr" type="string"
description
:::
`
    const html = md.render(code)
    // When info contains "=", parseFieldContent gets '' as info, so name comes from meta
    expect(html).toContain('name="fromAttr"')
  })

  it('::: field with @name override', () => {
    const code = `\
::: field originalName
@name overriddenName
@type string
:::
`
    const html = md.render(code)
    expect(html).toContain('name="overriddenName"')
  })

  it('::: field without type should not render type attribute', () => {
    const code = `\
::: field simpleField
simple description
:::
`
    const html = md.render(code)
    expect(html).not.toContain('type=')
  })

  it('::: field without default should not render default-value attribute', () => {
    const code = `\
::: field noDefault
@type string
:::
`
    const html = md.render(code)
    expect(html).not.toContain('default-value=')
  })

  it('::: field with type containing special characters should be encoded', () => {
    const code = `\
::: field specialType
@type string & number
:::
`
    const html = md.render(code)
    expect(html).toContain('type="string%20%26%20number"')
  })

  it('::: field with default containing special characters should be encoded', () => {
    const code = `\
::: field specialDefault
@default hello & world
:::
`
    const html = md.render(code)
    expect(html).toContain('default-value="hello%20%26%20world"')
  })

  it('::: field with description renders markdown', () => {
    const code = `\
::: field mdField
@type string
This is **bold** and *italic* text.
:::
`
    const html = md.render(code)
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
  })

  it('::: field without description should not render inner content', () => {
    const code = `\
::: field emptyField
@type string
@required
:::
`
    const html = md.render(code)
    // No description content between VPField tags
    expect(html).toContain('<VPField')
    expect(html).toContain('</VPField>')
    // The content between tags should be empty (no <p> tag)
    const match = html.match(/<VPField[^>]*>([\s\S]*?)<\/VPField>/)
    expect(match?.[1]?.trim()).toBe('')
  })

  it('::: field with @deprecated flag', () => {
    const code = `\
::: field oldField
@deprecated
@type string
:::
`
    const html = md.render(code)
    expect(html).toContain('deprecated')
  })

  it('::: field with @optional flag', () => {
    const code = `\
::: field optField
@optional
@type string
:::
`
    const html = md.render(code)
    expect(html).toContain('optional')
  })

  it('::: field with unknown @tag in description', () => {
    const code = `\
::: field customField
@type string
@customTag some custom info
:::
`
    const html = md.render(code)
    expect(html).toContain('@customTag some custom info')
  })

  it('should warn when using legacy attribute-style syntax with multiple attrs', async () => {
    const { logger } = await import('../src/node/utils/logger.js')
    const spy = vi.spyOn(logger, 'warn')

    const warnMd = new MarkdownIt().use(fieldPlugin)
    const code = `\
::: field name="warnField" type="string" required
description
:::
`
    warnMd.render(code, { filePathRelative: 'test.md' })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('::: field with only info name and plain description', () => {
    const code = `\
::: field myField
This is a plain description.
:::
`
    const html = md.render(code)
    expect(html).toContain('name="myField"')
    expect(html).toContain('This is a plain description.')
  })

  it('::: field-group with @tag syntax fields', () => {
    const code = `\
:::: field-group
::: field count
@type number
@required
@default 0
The count value
:::

::: field label
@type string
@optional
The label value
:::
::::
`
    const html = md.render(code)
    expect(html).toContain('vp-field-group')
    expect(html).toContain('name="count"')
    expect(html).toContain('name="label"')
  })
})
