import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { fieldPlugin, parseFieldContent } from '../src/node/container/field.js'

describe('parseFieldContent', () => {
  it('should use info as default name when no @name tag', () => {
    const result = parseFieldContent('some description', 'fieldName')
    expect(result.name).toBe('fieldName')
    expect(result.description).toBe('some description')
  })

  it('should trim info when deriving the default name', () => {
    const result = parseFieldContent('', '  trimmedName  ')
    expect(result.name).toBe('trimmedName')
  })

  it('should return empty description for empty content', () => {
    const result = parseFieldContent('', 'field')
    expect(result.name).toBe('field')
    expect(result.description).toBe('')
  })

  it('should ignore whitespace-only lines', () => {
    const result = parseFieldContent('   \n   \n   ', 'field')
    expect(result.description).toBe('')
  })

  it('should override the name with @name tag', () => {
    const result = parseFieldContent('@name overriddenName\nsome description', 'original')
    expect(result.name).toBe('overriddenName')
    expect(result.description).toBe('some description')
  })

  it('should not override the name when @name has no value', () => {
    const result = parseFieldContent('@name', 'originalName')
    expect(result.name).toBe('originalName')
  })

  it('should parse value tags', () => {
    const result = parseFieldContent(
      '@type string\n@typeLink https://example.com/type\n@default 42\n@unit px\n@format YYYY-MM-DD\n@constraint 0 < x < 10',
      'field',
    )
    expect(result.type).toBe('string')
    expect(result.typelink).toBe('https://example.com/type')
    expect(result.default).toBe('42')
    expect(result.unit).toBe('px')
    expect(result.format).toBe('YYYY-MM-DD')
    expect(result.constraint).toBe('0 < x < 10')
  })

  it('should strip surrounding backticks from value tags', () => {
    const result = parseFieldContent(
      '@type `string`\n@typeLink `#type-ref`\n@default `0`\n@unit `px`\n@format `YYYY`\n@constraint `a < b`',
      'field',
    )
    expect(result.type).toBe('string')
    expect(result.typelink).toBe('#type-ref')
    expect(result.default).toBe('0')
    expect(result.unit).toBe('px')
    expect(result.format).toBe('YYYY')
    expect(result.constraint).toBe('a < b')
  })

  it('should not set value tags when value is empty', () => {
    const result = parseFieldContent('@type\n@typeLink\n@default\n@unit\n@format\n@constraint', 'field')
    expect(result.type).toBeUndefined()
    expect(result.typelink).toBeUndefined()
    expect(result.default).toBeUndefined()
    expect(result.unit).toBeUndefined()
    expect(result.format).toBeUndefined()
    expect(result.constraint).toBeUndefined()
  })

  it('should parse boolean flag tags', () => {
    const result = parseFieldContent('@required\n@deprecated\n@experimental', 'field')
    expect(result.required).toBe(true)
    expect(result.deprecated).toBe(true)
    expect(result.experimental).toBe(true)
  })

  it('should parse @deprecated and @experimental with version/date string', () => {
    const result = parseFieldContent('@deprecated v1.0.0\n@experimental 2026-09-01', 'field')
    expect(result.deprecated).toBe('v1.0.0')
    expect(result.experimental).toBe('2026-09-01')
  })

  it('should strip surrounding backticks from @deprecated and @experimental values', () => {
    const result = parseFieldContent('@deprecated `v2.0`\n@experimental `v3.0-beta`', 'field')
    expect(result.deprecated).toBe('v2.0')
    expect(result.experimental).toBe('v3.0-beta')
  })

  it('should parse @description tag', () => {
    const result = parseFieldContent('@description This is a description', 'field')
    expect(result.description).toBe('This is a description')
  })

  it('should append plain text after @description', () => {
    const result = parseFieldContent('@description explicit desc\ncontinued text', 'field')
    expect(result.description).toBe('explicit desc\ncontinued text')
  })

  it('should handle @description with empty value followed by text', () => {
    const result = parseFieldContent('@description\ntext after', 'field')
    expect(result.description).toBe('text after')
  })

  it('should parse @enum values across lines and keep quotes', () => {
    const result = parseFieldContent('@enum asc | desc | random\n@enum "light" | "dark" | "auto"', 'field')
    expect(result.enum).toEqual(['asc', 'desc', 'random', '"light"', '"dark"', '"auto"'])
  })

  it('should skip @enum with empty value', () => {
    const result = parseFieldContent('@enum\n@type string', 'field')
    expect(result.enum).toBeUndefined()
    expect(result.type).toBe('string')
  })

  it('should keep only the first @since and warn on duplicates', async () => {
    const { logger } = await import('../src/node/utils/logger.js')
    const spy = vi.spyOn(logger, 'warn')
    const result = parseFieldContent('@since v1.2.0\n@since 2.0.0', 'field', { filePathRelative: 'test.md' })
    expect(result.since).toBe('v1.2.0')
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  it('should ignore @since with empty value', () => {
    const result = parseFieldContent('@since\n@type string', 'field')
    expect(result.since).toBeUndefined()
  })

  it('should ignore @optional tag', () => {
    const result = parseFieldContent('@optional\n@type string', 'field')
    expect(result.required).toBeUndefined()
    expect(result.type).toBe('string')
    expect(result.description).toBe('')
  })

  it('should treat unknown @tag as description text', () => {
    const result = parseFieldContent('@unknown some value', 'field')
    expect(result.description).toBe('@unknown some value')
  })

  it('should treat unknown @tag without value as description text', () => {
    const result = parseFieldContent('@unknownTag', 'field')
    expect(result.description).toBe('@unknownTag')
  })

  it('should append unknown @tag to an existing description', () => {
    const result = parseFieldContent('first line\n@unknownTag extra', 'field')
    expect(result.description).toBe('first line\n@unknownTag extra')
  })

  it('should handle plain text description over multiple lines', () => {
    const result = parseFieldContent('line one\nline two', 'field')
    expect(result.description).toBe('line one\nline two')
  })

  it('should ignore empty lines without breaking description', () => {
    const result = parseFieldContent('first line\n\nsecond line', 'field')
    expect(result.description).toBe('first line\n\nsecond line')
  })

  it('should separate description paragraphs when a known tag appears between them', () => {
    const result = parseFieldContent('first paragraph\n@type string\nsecond paragraph', 'field')
    expect(result.type).toBe('string')
    expect(result.description).toBe('first paragraph\nsecond paragraph')
  })

  it('should handle mixed known tags, unknown tags and plain text', () => {
    const result = parseFieldContent(
      '@type boolean\n@required\nsome description here\n@unknownTag extra info\nmore text',
      'field',
    )
    expect(result.type).toBe('boolean')
    expect(result.required).toBe(true)
    expect(result.description).toBe('some description here\n@unknownTag extra info\nmore text')
  })

  it('should parse all supported tags at once', () => {
    const result = parseFieldContent(
      '@name fullName\n@type string\n@typeLink https://example.com\n@default foo\n@required\n@deprecated\n@experimental\n@description desc\n@enum a | b\n@since v1.0.0\n@unit ms\n@format text\n@constraint x > 0',
      'original',
    )
    expect(result.name).toBe('fullName')
    expect(result.type).toBe('string')
    expect(result.typelink).toBe('https://example.com')
    expect(result.default).toBe('foo')
    expect(result.required).toBe(true)
    expect(result.deprecated).toBe(true)
    expect(result.experimental).toBe(true)
    expect(result.description).toBe('desc')
    expect(result.enum).toEqual(['a', 'b'])
    expect(result.since).toBe('v1.0.0')
    expect(result.unit).toBe('ms')
    expect(result.format).toBe('text')
    expect(result.constraint).toBe('x > 0')
  })
})

describe('fieldPlugin', () => {
  const md = new MarkdownIt().use(fieldPlugin)

  it('::: field-group renders a wrapper div', () => {
    const code = `\
:::: field-group
::: field foo
@type string
:::
::::
`
    const html = md.render(code)
    expect(html).toContain('<div class="vp-field-group">')
    expect(html).toContain('name="foo"')
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
    expect(html).toContain('type="number"')
    expect(html).toContain('required')
    expect(html).toContain('default-value="0"')
    expect(html).toContain('The count value')
  })

  it('::: field with legacy attribute-style syntax', () => {
    const code = `\
::: field name="foo" type="string" required
description
:::
`
    const html = md.render(code, { filePathRelative: 'test.md' })
    expect(html).toContain('name="foo"')
    expect(html).toContain('type="string"')
    expect(html).toContain('required')
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

  it('::: field with only name attribute should not warn', async () => {
    const { logger } = await import('../src/node/utils/logger.js')
    const spy = vi.spyOn(logger, 'warn')
    const code = `\
::: field name="onlyName"
description
:::
`
    const html = md.render(code)
    expect(html).toContain('name="onlyName"')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('::: field without a name attribute', () => {
    const code = `\
::: field type="string"
description
:::
`
    const html = md.render(code, { filePathRelative: 'test.md' })
    expect(html).not.toContain('name=')
  })

  it('::: field renders all props', () => {
    const code = `\
::: field theme
@type ThemeConfig
@typeLink https://example.com/ThemeConfig
@required
@deprecated
@experimental
@default dark
@since v1.2.0
@unit ms
@format slug
@constraint non-empty
:::
`
    const html = md.render(code)
    expect(html).toContain('name="theme"')
    expect(html).toContain('type="ThemeConfig"')
    expect(html).toContain('type-link="https://example.com/ThemeConfig"')
    expect(html).toContain('required')
    expect(html).toContain('deprecated')
    expect(html).toContain('experimental')
    expect(html).toContain('default-value="dark"')
    expect(html).toContain('since="v1.2.0"')
    expect(html).toContain('unit="ms"')
    expect(html).toContain('format="slug"')
    expect(html).toContain('constraint="non-empty"')
  })

  it('::: field encodes special characters in props', () => {
    const code = `\
::: field specialType
@type string & number
@default hello & world
@since v1.0 & 2
@unit % & px
@constraint 0 < x < 10
:::
`
    const html = md.render(code)
    expect(html).toContain('type="string%20%26%20number"')
    expect(html).toContain('default-value="hello%20%26%20world"')
    expect(html).toContain('since="v1.0%20%26%202"')
    expect(html).toContain('unit="%25%20%26%20px"')
    expect(html).toContain('constraint="0%20%3C%20x%20%3C%2010"')
  })

  it('::: field renders @deprecated and @experimental version/date strings as attributes', () => {
    const code = `\
::: field theme
@deprecated v1.0.0
@experimental v2.0.0-beta
:::
`
    const html = md.render(code)
    expect(html).toContain('deprecated="v1.0.0"')
    expect(html).toContain('experimental="v2.0.0-beta"')
  })

  it('::: field keeps bare @deprecated and @experimental as boolean flags', () => {
    const code = `\
::: field theme
@deprecated
@experimental
:::
`
    const html = md.render(code)
    expect(html).toContain('deprecated')
    expect(html).toContain('experimental')
    expect(html).not.toContain('deprecated="')
    expect(html).not.toContain('experimental="')
  })

  it('::: field renders @enum as a template slot', () => {
    const code = `\
::: field mode
@type string
@default dark
@enum light | dark | auto
:::
`
    const html = md.render(code)
    expect(html).toContain('<template #enum>')
    expect(html).toContain('<span>light</span>')
    expect(html).toContain('<span>dark</span>')
    expect(html).toContain('<span>auto</span>')
  })

  it('::: field renders description as markdown', () => {
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

  it('::: field without description renders empty inner content', () => {
    const code = `\
::: field emptyField
@type string
@required
:::
`
    const html = md.render(code)
    expect(html).toContain('<VPField')
    expect(html).toContain('</VPField>')
    const match = html.match(/<VPField[^>]*>([\s\S]*?)<\/VPField>/)
    expect(match?.[1]?.trim()).toBe('')
  })

  it('::: field without type/default should omit those attributes', () => {
    const code = `\
::: field simpleField
simple description
:::
`
    const html = md.render(code)
    expect(html).toContain('name="simpleField"')
    expect(html).not.toContain('type=')
    expect(html).not.toContain('default-value=')
  })

  it('::: field generates unique slugs for duplicate names', () => {
    const code = `\
::: field theme
@type string
:::

::: field theme
@type string
:::

::: field theme
@type string
:::
`
    const html = md.render(code)
    expect(html).toContain('slug="field-theme"')
    expect(html).toContain('slug="field-theme-1"')
    expect(html).toContain('slug="field-theme-2"')
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

  it('::: field renders unknown @tag as description text', () => {
    const code = `\
::: field customField
@type string
@customTag some custom info
:::
`
    const html = md.render(code)
    expect(html).toContain('@customTag some custom info')
  })

  it('::: field renders a full snapshot', () => {
    const code = `\
::: field theme
@type ThemeConfig
@required
@default dark
@enum light | dark | auto
@since v1.2.0

主题配置说明
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
