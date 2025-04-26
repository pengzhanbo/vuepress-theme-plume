import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { createContainerPlugin, createContainerSyntaxPlugin } from '../src/node/container/createContainer.js'

describe('createContainerPlugin', () => {
  it('should work with default options', () => {
    const md = new MarkdownIt()
    createContainerPlugin(md, 'test')

    expect(md.render(':::test\ncontent\n:::')).toContain('class="custom-container test"')
  })

  it('should work with custom render', () => {
    const md = new MarkdownIt()
    createContainerPlugin(md, 'test', {
      before: () => `<div class="test">`,
      after: () => `</div>`,
    })

    expect(md.render(':::test\ncontent\n:::')).toContain('class="test"')
  })
})

describe('createContainerSyntaxPlugin', () => {
  it('should work with default options', () => {
    const md = new MarkdownIt()
    createContainerSyntaxPlugin(md, 'test')
    const rendered = md.render(':::test\ncontent\n:::')
    expect(rendered).toContain('class="custom-container test"')
    expect(rendered).toContain('content')
  })

  it('should work with more than 3 markers', () => {
    const md = new MarkdownIt()
    createContainerSyntaxPlugin(md, 'test')
    expect(md.render('::::test\ncontent\n::::')).toContain('class="custom-container test"')
    expect(md.render(':::::test\ncontent\n:::::')).toContain('class="custom-container test"')
  })

  it('should work with custom render', () => {
    const md = new MarkdownIt()
    createContainerSyntaxPlugin(md, 'test', (tokens, index) => `<div class="test">${tokens[index].content} ${tokens[index].meta.title}</div>`)
    const rendered = md.render(':::test title="title"\ncontent\n:::')
    expect(rendered).toContain('class="test"')
    expect(rendered).toContain('content\n title')
  })

  it('should not work', () => {
    const md = new MarkdownIt()
    createContainerSyntaxPlugin(md, 'test')

    expect(md.render('::test\ncontent\n::')).not.toContain('class="custom-container test"')
    expect(md.render(':::text\ncontent\n:::')).not.toContain('class="custom-container text"')
    expect(md.render('：::test\ncontent\n::：')).not.toContain('class="custom-container test"')
  })
})
