import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { createEmbedRuleBlock } from '../src/node/embed/createEmbedRuleBlock.js'
import { logger } from '../src/node/utils/logger.js'

function createMarkdown(): MarkdownIt {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  })
}

describe('createEmbedRuleBlock > validation', () => {
  it('should warn and return when type is empty', () => {
    const md = createMarkdown()
    const spy = vi.spyOn(logger, 'warn')

    createEmbedRuleBlock(md, { type: '', meta: () => ({}) })

    expect(spy).toHaveBeenCalledWith('Embed rule block type is empty')
    // no renderer rule should be registered
    expect(md.renderer.rules['']).toBeUndefined()
    spy.mockRestore()
  })

  it('should warn and return when type already exists', () => {
    const md = createMarkdown()
    const spy = vi.spyOn(logger, 'warn')

    createEmbedRuleBlock(md, {
      type: 'foo',
      meta: () => ({}),
      content: () => 'foo-content',
    })
    // register the same type again
    createEmbedRuleBlock(md, { type: 'foo', meta: () => ({}) })

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Embed rule block type'))
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('already exists'))
    spy.mockRestore()
  })

  it('should warn and return when renderer rule name already exists', () => {
    const md = createMarkdown()
    md.renderer.rules.existing = () => 'existing'
    const spy = vi.spyOn(logger, 'warn')

    createEmbedRuleBlock(md, {
      type: 'test',
      name: 'existing',
      meta: () => ({}),
    })

    expect(spy).toHaveBeenCalledWith('Embed rule block test (existing) already exists')
    spy.mockRestore()
  })
})

describe('createEmbedRuleBlock > rendering', () => {
  it('should render via content function', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: (info, source) => ({ info, source }),
      content: meta => `<test info="${meta.info}" src="${meta.source}" />`,
    })

    expect(md.render('@[test](foo)')).toBe('<test info="" src="foo" />')
    expect(md.render('@[test info](foo)')).toBe('<test info="info" src="foo" />')
  })

  it('should return token.content when content function is not provided', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: () => ({}),
    })

    expect(md.render('@[test](foo)')).toBe('@[test](foo)')
  })

  it('should return token.content when content function returns nullish', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test-null',
      meta: () => ({}),
      content: (() => null) as any,
    })
    createEmbedRuleBlock(md, {
      type: 'test-undef',
      meta: () => ({}),
      content: (() => undefined) as any,
    })

    expect(md.render('@[test-null](foo)')).toBe('@[test-null](foo)')
    expect(md.render('@[test-undef](foo)')).toBe('@[test-undef](foo)')
  })
})

describe('createEmbedRuleBlock > meta function', () => {
  it('should call meta with trimmed info and source', () => {
    const md = createMarkdown()
    const metaFn = vi.fn((info: string, source: string) => ({ info, source }))

    createEmbedRuleBlock(md, {
      type: 'test',
      meta: metaFn,
      content: () => '',
    })

    md.render('@[test  info ]( src )')

    expect(metaFn).toHaveBeenCalledWith('info', 'src')
  })

  it('should call meta with empty info when no info is provided', () => {
    const md = createMarkdown()
    const metaFn = vi.fn((info: string, source: string) => ({ info, source }))

    createEmbedRuleBlock(md, {
      type: 'test',
      meta: metaFn,
      content: () => '',
    })

    md.render('@[test](src)')

    // info defaults to '' because the optional capture group did not participate
    expect(metaFn).toHaveBeenCalledWith('', 'src')
  })

  it('should call meta with empty source when source is empty', () => {
    const md = createMarkdown()
    const metaFn = vi.fn((info: string, source: string) => ({ info, source }))

    createEmbedRuleBlock(md, {
      type: 'test',
      meta: metaFn,
      content: () => '',
    })

    md.render('@[test info]()')

    expect(metaFn).toHaveBeenCalledWith('info', '')
  })

  it('should pass env to content function', () => {
    const md = createMarkdown()
    const contentFn = vi.fn((_meta: any, _env: MarkdownEnv) => '')

    createEmbedRuleBlock(md, {
      type: 'test',
      meta: () => ({}),
      content: contentFn,
    })

    const env: MarkdownEnv = { filePathRelative: 'test.md' }
    md.render('@[test](src)', env)

    expect(contentFn).toHaveBeenCalledWith({}, env)
  })
})

describe('createEmbedRuleBlock > syntax matching', () => {
  function setup() {
    const md = createMarkdown()
    const contentFn = vi.fn(() => 'matched')
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: () => ({}),
      content: contentFn,
    })
    return { md, contentFn }
  }

  it('should match basic syntax', () => {
    const { md, contentFn } = setup()

    md.render('@[test](src)')
    expect(contentFn).toHaveBeenCalled()
  })

  it('should match syntax with info', () => {
    const { md, contentFn } = setup()

    md.render('@[test info](src)')
    expect(contentFn).toHaveBeenCalled()
  })

  it('should match syntax with empty source', () => {
    const { md, contentFn } = setup()

    md.render('@[test]()')
    expect(contentFn).toHaveBeenCalled()
  })

  it('should not match when content is too short (MIN_LENGTH check)', () => {
    const { md, contentFn } = setup()

    // @[test] is 7 chars, MIN_LENGTH = 4 + 5 = 9
    const result = md.render('@[test]')
    expect(contentFn).not.toHaveBeenCalled()
    expect(result).toContain('@[test]')
  })

  it('should not match when start codes do not match', () => {
    const { md, contentFn } = setup()

    // space before type name breaks START_CODES
    md.render('@[ test](src)')
    expect(contentFn).not.toHaveBeenCalled()

    // wrong first char (not '@')
    md.render('![test](src)')
    expect(contentFn).not.toHaveBeenCalled()
  })

  it('should not match when type is a prefix of a longer word (regex check)', () => {
    const { md, contentFn } = setup()

    // START_CODES for 'test' passes, but regex fails because 'testx' != 'test'
    md.render('@[testx](src)')
    expect(contentFn).not.toHaveBeenCalled()
  })

  it('should not match when syntax is invalid', () => {
    const { md, contentFn } = setup()

    // missing (source) part
    md.render('@[test]xxx')
    expect(contentFn).not.toHaveBeenCalled()

    // missing closing paren
    md.render('@[test](src')
    expect(contentFn).not.toHaveBeenCalled()

    // extra content after closing paren
    md.render('@[test](src) extra')
    expect(contentFn).not.toHaveBeenCalled()
  })

  it('should not match regular text', () => {
    const { md, contentFn } = setup()

    md.render('regular text')
    expect(contentFn).not.toHaveBeenCalled()
  })
})

describe('createEmbedRuleBlock > name option', () => {
  it('should use type as name when name is not provided', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: () => ({}),
      content: () => 'matched',
    })

    expect(md.renderer.rules.test).toBeDefined()
    expect(md.render('@[test](src)')).toBe('matched')
  })

  it('should use custom name when name is provided', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      name: 'custom',
      meta: () => ({}),
      content: () => 'matched',
    })

    expect(md.renderer.rules.custom).toBeDefined()
    expect(md.renderer.rules.test).toBeUndefined()
    expect(md.render('@[test](src)')).toBe('matched')
  })
})

describe('createEmbedRuleBlock > special characters in type', () => {
  it('should escape regex special characters in type', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'pdf.file',
      meta: (info, source) => ({ info, source }),
      content: meta => `${meta.info}:${meta.source}`,
    })

    // dot should be treated as literal, not wildcard
    expect(md.render('@[pdf.file](src)')).toBe(':src')
    // 'pdfXfile' should not match because dot is escaped
    expect(md.render('@[pdfXfile](src)')).toContain('<a href="src">pdfXfile</a>')
  })

  it('should handle type with multiple special characters', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'a*b+c',
      meta: (info, source) => ({ info, source }),
      content: meta => `${meta.info}:${meta.source}`,
    })

    expect(md.render('@[a*b+c](src)')).toBe(':src')
  })
})

describe('createEmbedRuleBlock > context rendering (alt)', () => {
  it('should render inside blockquote', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: (info, source) => ({ info, source }),
      content: meta => `<test src="${meta.source}" />`,
    })

    const result = md.render('> @[test](src)')
    expect(result).toContain('<test src="src" />')
  })

  it('should render inside list', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: (info, source) => ({ info, source }),
      content: meta => `<test src="${meta.source}" />`,
    })

    const result = md.render('- @[test](src)')
    expect(result).toContain('<test src="src" />')
  })

  it('should interrupt paragraph', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: (info, source) => ({ info, source }),
      content: meta => `<test src="${meta.source}" />`,
    })

    const result = md.render('paragraph text\n@[test](src)')
    expect(result).toContain('<p>paragraph text</p>')
    expect(result).toContain('<test src="src" />')
  })
})

describe('createEmbedRuleBlock > multiple embeds', () => {
  it('should render multiple embeds on separate lines', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'test',
      meta: (info, source) => ({ info, source }),
      content: meta => `[${meta.source}]`,
    })

    expect(md.render('@[test](foo)\n@[test](bar)')).toBe('[foo][bar]')
  })

  it('should register multiple different types on same md instance', () => {
    const md = createMarkdown()
    createEmbedRuleBlock(md, {
      type: 'foo',
      meta: (info, source) => ({ info, source }),
      content: meta => `<foo src="${meta.source}" />`,
    })
    createEmbedRuleBlock(md, {
      type: 'bar',
      meta: (info, source) => ({ info, source }),
      content: meta => `<bar src="${meta.source}" />`,
    })

    expect(md.render('@[foo](a)')).toBe('<foo src="a" />')
    expect(md.render('@[bar](b)')).toBe('<bar src="b" />')
  })
})
