import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { createContainerPlugin } from '../src/node/container/createContainer.js'

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
